import {Component, OnInit} from '@angular/core';
import {DbService} from '../../services/db.service';
import {Title} from '@angular/platform-browser';
import {DocumentChangeAction} from '@angular/fire/compat/firestore';
import {Player} from '../../interfaces/player';

@Component({
	selector: 'app-players',
	templateUrl: './players.component.html',
	styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit {
	players: Player[];
	modalOpen: boolean;

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
		this.db.getPlayers().subscribe((snapshot: DocumentChangeAction<Player>[]) => {
			this.players = snapshot.map(d => ({
				uuid: d.payload.doc.id,
				...d.payload.doc.data()
			}));

			this.players.forEach(player => {
				this.db.countPlayerInMatches(player.uuid).subscribe((count: number) => {
					console.log(`Cantidad de partidos de ${player.name}: ${count}`);
				});
			});
		});
	}
}
