import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { NgForm, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { DateValidator } from './date.validator';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.scss']
})

export class PartidosComponent implements OnInit {

	public title = "Listado de partidos";
	
	partidosProximos;
	partidosYaJugados;
	showCreateModal : boolean;
	canchas;
	createPartidoForm : FormGroup;
	isJuegaChecked: boolean;

	minDate = new Date();

	constructor(
		private db : DbService,
		private titleService: Title,
		private authService: AuthService,
		private router: Router
	) {
		this.partidosProximos = null;
		this.partidosYaJugados = null;
		this.showCreateModal = false;
		this.isJuegaChecked = false;

		this.createPartidoForm = new FormGroup({
			nombre: new FormControl(null, [ Validators.required, Validators.pattern('^.{1,32}$') ]),
			cancha: new FormControl(null, Validators.required),
			fecha: new FormControl(null, [ DateValidator, Validators.required ]),
			hora: new FormControl(null, Validators.required),
			juega: new FormControl(null),
			tag: new FormControl(null, Validators.pattern('^.{1,32}$')),
		});
	}

	get nombre() { return this.createPartidoForm.get('nombre'); }
	get cancha() { return this.createPartidoForm.get('cancha'); }
	get fecha() { return this.createPartidoForm.get('fecha'); }
	get hora() { return this.createPartidoForm.get('hora'); }
	get juega() { return this.createPartidoForm.get('juega'); }
	get tag() { return this.createPartidoForm.get('tag'); }

	ngOnInit() {
		this.titleService.setTitle(this.title);
		
		this.getPartidos();
	}

	createPartido() {
		/* this.db.createPartido(); */
		this.getCanchas();
		this.showCreateModal = true;
	}

	closeModal() {
		this.showCreateModal = false;
	}

	getPartidos() {
		let curTime = Math.round(new Date().getTime() / 1000);
		this.db.getPartidos().subscribe((partidosSnapshot) => {
			
			this.partidosYaJugados = [];
			this.partidosProximos = [];

			partidosSnapshot.forEach((partido: any) => {
				if (partido.payload.doc.data().lugar) {
					  partido.payload.doc.data().lugar.get()
						.then(res => {
							if(partido.payload.doc.data().fecha.seconds <= curTime) {
								this.partidosYaJugados.push({
									id: partido.payload.doc.id,
									data: partido.payload.doc.data(),
									lugar: res.data()
								});
							} else {
								this.partidosProximos.push({
									id: partido.payload.doc.id,
									data: partido.payload.doc.data(),
									lugar: res.data()
								});
							}
						})
						.catch(err => console.error(err));
				} else {
					if(partido.payload.doc.data().fecha.seconds <= curTime) {
						this.partidosYaJugados.push({
							id: partido.payload.doc.id,
							data: partido.payload.doc.data(),
							lugar: []
						});
					} else {
						this.partidosProximos.push({
							id: partido.payload.doc.id,
							data: partido.payload.doc.data(),
							lugar: []
						});
					}
				}
			})
		});
	}

	goToPartido(partidoId : string) {
		this.router.navigate(['/partido/' + partidoId]);
	}

	submitPartido(f) {
		this.db.createPartido(
			f.value.nombre,
			f.value.cancha,
			f.value.fecha,
			f.value.hora,
			f.value.juega,
			f.value.tag
		);

		this.closeModal();
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

	toggleAddMe() {
		this.isJuegaChecked = !this.isJuegaChecked;

		if(this.isJuegaChecked) {
			this.createPartidoForm.get('tag').setValidators([ Validators.required, Validators.pattern('^.{1,32}$') ]);
		} else {
			this.createPartidoForm.get('tag').setValidators(Validators.pattern('^.{1,32}$'));
		}

		this.createPartidoForm.get('tag').updateValueAndValidity();
	}
}
