import {Component, OnInit} from '@angular/core';
import {DbService} from '../../services/db.service';
import {Title} from '@angular/platform-browser';
import {DocumentChangeAction} from '@angular/fire/compat/firestore';
import {Player} from '../../interfaces/player';
import {Match} from '../../interfaces/match';
import {MatchPlayer} from '../../interfaces/match-player';

interface MatchPlayerDto {
	uuid: string;
	winner: boolean;
}

@Component({
	selector: 'app-players',
	templateUrl: './players.component.html',
	styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
	players: Player[];
	modalOpen: boolean;
	stats: {};

	constructor(
		private db: DbService,
		private titleService: Title
	) {
		this.players = [];
		this.modalOpen = false;
	}

	ngOnInit(): void {
		this.titleService.setTitle('Listado de jugadores');
		this.loadPlayers();
	}

	loadPlayers(): void {
		let players: MatchPlayerDto[] = [];

		this.db.getMatches().subscribe((sm: DocumentChangeAction<Match>[]) => {
			players = [].concat(...sm.map((d: DocumentChangeAction<Match>) => {
				return d.payload.doc.data().players.map((p: MatchPlayer) => ({uuid: p.uuid.id, winner: p.winner}));
			}));

			this.stats = players.filter(p => p.winner !== null).reduce((acc, curr: MatchPlayerDto) => {
				const player = acc[curr.uuid];

				acc[curr.uuid] = {
					played: (player?.played || 0) + 1,
					won: (player?.won || 0) + curr.winner,
					lost: (player?.lost || 0) + !curr.winner,
				};

				return acc;
			}, {});

			this.db.getPlayers().subscribe((sp: DocumentChangeAction<Player>[]) => {
				this.players = sp.map(d => ({
					uuid: d.payload.doc.id,
					...d.payload.doc.data()
				})).sort((a, b) => {
					return (this.stats[b.uuid]?.won || 0) - (this.stats[a.uuid]?.won || -1);
				});
			});
		});
	}
}
