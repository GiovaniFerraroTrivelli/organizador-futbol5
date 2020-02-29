import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

	public title = "Inicio";

	constructor(
		private titleService: Title
	) { }

	ngOnInit() {
		this.titleService.setTitle(this.title);
	}
}
