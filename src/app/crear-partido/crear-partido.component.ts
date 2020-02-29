import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-crear-partido',
  templateUrl: './crear-partido.component.html',
  styleUrls: ['./crear-partido.component.scss']
})
export class CrearPartidoComponent implements OnInit {
	private canchas;

	constructor(
		private db : DbService
	) { }

	ngOnInit() {
		this.getCanchas();
	}

	getCanchas() {
		this.db.getCanchas().subscribe((canchasSnapshot) => {
			this.canchas = [];
			canchasSnapshot.forEach((cancha: any) => {
				this.canchas.push({
					id: cancha.payload.doc.id,
					data: cancha.payload.doc.data()
				});
			})
		});
	}
}
