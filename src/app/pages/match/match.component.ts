import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DbService} from '../../services/db.service';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {AuthService} from '../../services/auth.service';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Action, DocumentSnapshot} from '@angular/fire/compat/firestore';
import {Match} from '../../interfaces/match';
import {Field} from '../../interfaces/field';
import {environment} from '../../../environments/environment';
import {Player} from '../../interfaces/player';
import firebase from 'firebase/compat/app';

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
			name: [null, [Validators.required, Validators.pattern('^.{1,32}$')]]
		});
	}

	get name(): AbstractControl<any, any> {
		return this.playerForm.get('name');
	}

	ngOnInit(): void {
		this.titleService.setTitle('Cargando partido...');

		this.routeSub = this.route.params.subscribe(params => {
			this.loadMatchById(params.id);
		});
	}

	ngOnDestroy(): void {
		this.routeSub.unsubscribe();
	}

	loadMatchById(matchId: string): void {
		const docRef = this.db.getMatchById(matchId);

		docRef.get().subscribe({
			next: (doc) => {
				if (doc.exists) {
					docRef.snapshotChanges().subscribe((match: Action<DocumentSnapshot<Match>>) => {
						this.match = {id: matchId, ...match.payload.data()};

						if (!this.field) {
							this.match.field.get()
								.then(res => {
									this.field = {...res.data()};
									const embed = 'https://www.google.com/maps/embed/v1/place?q=' + encodeURIComponent(this.field.address) + '%2C%20santa%20fe%2C%20santa%20fe&key=' + environment.mapsApiKey;
									this.field.embed = this.sanitizer.bypassSecurityTrustResourceUrl(embed);
								}).catch(err => console.error(err));
						}

						this.sharerURL = `https://wa.me/?text=${encodeURIComponent(`Partido: ${this.match.name} - Jugadores: ${this.match.players?.length || 0} / 10 - https://f5.gft.ar/partido/${this.match.id}`)}`;

						this.titleService.setTitle(match ? `Información de partido: ${this.match.name}` : 'Partido no encontrado');
						this.loaded = true;
					});
				} else {
					this.titleService.setTitle('Partido no encontrado');

					this.loaded = true;
					this.notFound = true;
				}
			}
		});

	}

	updatePlayers(documentId: string, players: Player[]): Promise<void> {
		return this.db.updatePlayers(documentId, players);
	}

	addPlayer(): void {
		const values = {...this.playerForm.value};
		values.name = values.name.trim();

		if (!values.name) {
			return;
		}

		this.nameTaken = (!!this.match.players.filter(player => player.name === values.name).length);

		if (this.nameTaken) {
			return;
		}

		this.match.players.push({
			name: values.name,
			uuid: this.getCurrentUserId(),
			date: Timestamp.now()
		});

		this.playerForm.disable();
		this.updatePlayers(this.match.id, this.match.players).then(() => {
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

	canAddPlayer(): boolean {
		return this.match.date > Timestamp.now();
	}

	deletePlayer(playerId: number): void {
		const players = [...this.match.players];

		players.splice(playerId, 1);
		this.updatePlayers(this.match.id, players).then();
	}

	toggleIfApplies(row, jugador): void {
		if (this.getCurrentUserId() === jugador.uuid || this.getCurrentUserId() === this.match.owner) {
			this.selectedRow = (this.selectedRow === row) ? -1 : row;
		}
	}
}
