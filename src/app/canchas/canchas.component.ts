import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-canchas',
  templateUrl: './canchas.component.html',
  styleUrls: ['./canchas.component.scss']
})
export class CanchasComponent implements OnInit {

	public title = "Listado de canchas";
	private canchas;

	constructor(
		private db : DbService,
		private titleService: Title
	) { }

	ngOnInit() {
		this.titleService.setTitle(this.title);
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
