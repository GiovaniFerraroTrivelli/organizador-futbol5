import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DbService} from '../../services/db.service';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DocumentChangeAction} from '@angular/fire/compat/firestore';
import {Field} from '../../interfaces/field';
import {environment} from '../../../environments/environment';
import firebase from 'firebase/compat/app';
import {Player} from '../../interfaces/player';
import {Match} from '../../interfaces/match';
import {MatchPlayer} from '../../interfaces/match-player';

const Timestamp = firebase.firestore.Timestamp;

@Component({
	selector: 'app-match',
	templateUrl: './match.component.html',
	styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit, OnDestroy {
	private routeSub: Subscription;

	match: Match;
	field: Field;
	loaded: boolean;
	playerForm: FormGroup;
	notFound: boolean;
	messageDelete: string;
	sharerURL: string;
	nameTaken: boolean;
	selectedRow: number;
	deleteConfirm: boolean;
	players: Player[];

	constructor(
		private route: ActivatedRoute,
		private db: DbService,
		private titleService: Title,
		private authService: AuthService,
		private sanitizer: DomSanitizer,
		private formBuilder: FormBuilder,
		private router: Router
	) {
		this.loaded = false;
		this.match = null;
		this.notFound = false;
		this.deleteConfirm = false;
		this.messageDelete = 'Borrar partido';
		this.sharerURL = null;
		this.nameTaken = false;
		this.selectedRow = -1;
		this.field = null;

		this.playerForm = this.formBuilder.group({
			uuid: [null, Validators.required]
		});
	}

	ngOnInit(): void {
		this.titleService.setTitle('Cargando partido...');

		this.routeSub = this.route.params.subscribe(params => {
			this.loadMatchById(params.id);
			this.loadPlayers();
		});
	}

	ngOnDestroy(): void {
		this.routeSub.unsubscribe();
	}

	loadMatchById(matchId: string): void {
		this.db.getMatchById(matchId).subscribe((match) => {
			console.log('Recarga emitida desde acá');

			if (match.payload.exists) {
				this.match = {id: matchId, ...match.payload.data()};

				if (!this.field) {
					this.match.field.get()
						.then(res => {
							this.field = {...res.data()};
							const embed = 'https://www.google.com/maps/embed/v1/place?q=' + encodeURIComponent(this.field.address) + '%2C%20santa%20fe%2C%20santa%20fe&key=' + environment.mapsApiKey;
							this.field.embed = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
						}).catch(err => console.error(err));
				}

				console.log('Recargando match');

				this.match.players.forEach((player, i) => {
					console.log('Chequeando dato de jugador', player.uuid);
					if (!player.player) {
						player.uuid.get().then(res => this.match.players[i].player = res.data());
					}
				});

				this.sharerURL = `https://wa.me/?text=${encodeURIComponent(`Partido: ${this.match.name} - Jugadores: ${this.match.players?.length || 0} / 10 - https://f5.gft.ar/partido/${this.match.id}`)}`;

				this.titleService.setTitle(match ? `Información de partido: ${this.match.name}` : 'Partido no encontrado');
				this.loaded = true;
			} else {
				this.titleService.setTitle('Partido no encontrado');

				this.loaded = true;
				this.notFound = true;
			}
		});
	}

	updatePlayers(documentId: string, players: MatchPlayer[]): Promise<void> {
		return this.db.updatePlayers(documentId, players);
	}

	addPlayer(): void {
		const value = this.playerForm.get('uuid').value;

		this.playerForm.disable();

		if (!value) {
			return;
		}

		if (this.existsPlayerInMatch(value)) {
			this.playerForm.setErrors({exists: true});
			console.log('Existe ya!');
			this.playerForm.enable();
			this.playerForm.reset();

			return;
		}

		const players = [
			...this.match.players.map(p => ({uuid: p.uuid, winner: p.winner})),
			{uuid: value, winner: null}
		];

		this.updatePlayers(this.match.id, players).then(() => {
			this.playerForm.enable();
			this.playerForm.reset();
		});
	}

	getCurrentUserId(): string {
		return this.authService.getUser();
	}

	deleteMatch(): void {
		if (this.deleteConfirm) {
			this.db.deleteMatch(this.match.id).then(() => {
				this.router.navigate(['/partidos']).then();
			});
		} else {
			this.messageDelete = '¿Confirmás el borrado?';
			this.deleteConfirm = true;
		}
	}

	deletePlayer(playerId: number): void {
		const players = [...this.match.players];

		players.splice(playerId, 1);
		this.updatePlayers(this.match.id, players).then();
	}

	toggleIfApplies(row, jugador): void {
		this.selectedRow = (this.selectedRow === row) ? -1 : row;
	}

	setWinner(player: MatchPlayer, winner: boolean): void {
		const players = this.match.players.map(p => ({ uuid: p.uuid, winner: p.winner }));
		const index = players.findIndex(p => p.uuid.id === player.uuid.id);
		players[index].winner = winner;

		this.updatePlayers(this.match.id, players).then();
	}

	private loadPlayers(): void {
		this.players = [];

		this.db.getPlayers().subscribe((snapshot: DocumentChangeAction<Player>[]) => {
			this.players = snapshot.map(d => ({
				uuid: d.payload.doc.id,
				...d.payload.doc.data()
			}));
		});
	}

	private existsPlayerInMatch(uuid: string): boolean {
		return !!this.match.players.find(player => player.uuid.id === uuid);
	}
}
