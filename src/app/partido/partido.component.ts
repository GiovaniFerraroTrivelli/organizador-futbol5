import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DbService } from '../services/db.service';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { NgForm, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-partido',
	templateUrl: './partido.component.html',
	styleUrls: ['./partido.component.scss']
})
export class PartidoComponent implements OnInit {

	public title = "Cargando partido...";
	private routeSub: Subscription;
	
	partido;
	loaded : boolean;
	addPlayer : FormGroup;
	notFound : boolean;
	messageDelete: string;
	sharerLink: string;
	lugar;
	alreadyWithThatName: boolean;
	selectedRow : number;

	private deleteCount : number;

	constructor(
		private route: ActivatedRoute,
		private db: DbService,
		private titleService: Title,
		private authService: AuthService,
		private sanitizer: DomSanitizer
	) {
		this.loaded = false;
		this.partido = null;
		this.lugar = null;
		this.notFound = false;
		this.deleteCount = 0;
		this.messageDelete = "Borrar partido";
		this.sharerLink = "";
		this.alreadyWithThatName = false;
		this.selectedRow = -1;

		this.addPlayer = new FormGroup({
			nuevoJugador: new FormControl(null, [ Validators.required, Validators.pattern('^.{1,32}$') ])
		});
	}

	get nuevoJugador() { return this.addPlayer.get('nuevoJugador'); }

	ngOnInit() {
		this.titleService.setTitle(this.title);

		this.routeSub = this.route.params.subscribe(params => {
			this.getPartidoById(params['id']);
		});
	}

	getPartidoById(documentId : string) {
		this.db.getPartidoById(documentId).subscribe((partido) => {
			this.partido = partido.payload.data();

			if(this.partido != undefined) {
				this.partido.id = documentId;

				if (this.partido.lugar && this.lugar == null) {
					  this.partido.lugar.get()
						.then(res => {
							this.lugar = res.data();
							this.lugar.embed = "https://www.google.com/maps/embed/v1/place?q=" + encodeURIComponent(this.lugar.direccion) + "%2C%20santa%20fe%2C%20santa%20fe&key=" + environment.mapsApiKey;
							this.lugar.embed = this.sanitizer.bypassSecurityTrustResourceUrl(this.lugar.embed);
						}).catch(err => console.error(err));
				}

				this.sharerLink = "https://wa.me/?text=" + encodeURIComponent("Partido: " + this.partido.nombre + " - Jugadores: " + this.partido.jugadores.length + " / 10 - https://f5.shiobi.me/partido/" + this.partido.id);
				this.titleService.setTitle("Información de partido: \"" + this.partido.nombre + "\"");
			} else {
				this.titleService.setTitle("Partido no encontrado");
				this.notFound = true;
			}

			this.loaded = true;
		});
	}

	updatePartido(documentId: string) {
		let data = {
			nombre: this.partido.nombre,
			lugar: this.partido.cancha,
			fecha: this.partido.fecha,
			jugadores: this.partido.jugadores,
			owner: this.partido.owner
		}
		
		this.db.updatePartido(documentId, data).then(() => {
			console.log('¡Jugador agregado!');
		}, (error) => {
			console.log(error);
		});
	}

	updateJugadores(documentId : string) {
		this.db.updateJugadores(documentId, this.partido.jugadores).then(() => {
			console.log('¡Jugadores modificados!');
		}, (error) => {
			console.log(error);
		});
	}

	addJugador(f) {
		f.value.nuevoJugador = f.value.nuevoJugador.trim();

		if(!f.value.nuevoJugador.length)
			return;

		if(this.partido.jugadores.filter(jugador => jugador.nombre === f.value.nuevoJugador).length) {
			this.alreadyWithThatName = true;
			return;
		}

		this.alreadyWithThatName = false;

		this.partido.jugadores.push({
			nombre: f.value.nuevoJugador,
			uuid: this.getCurrentUserId(),
			fecha: this.db.getFirebaseCurDate()
		});

		this.updateJugadores(this.partido.id);
		this.addPlayer.reset();
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	getCurrentUserId() {
		return this.authService.getUser();
	}

	deletePartido() {
		switch(++this.deleteCount)
		{
			case 1: this.messageDelete = "¿Estás segure?"; break;
			case 2: this.messageDelete = "Mirá que no hay vuelta atrás"; break;
			case 3: this.messageDelete = "F"; break;
			case 4: this.db.deletePartido(this.partido.id); break;
		}
	}

	canAddPlayer() {
		return (this.partido.fecha.seconds * 1000 > (new Date()).getTime());
	}

	deletePlayer(playerId : number) {
		this.partido.jugadores.splice(playerId, 1);
		this.updateJugadores(this.partido.id);
	}

	toggleIfApplies(row, jugador) {
		if(this.getCurrentUserId() == jugador.uuid || this.getCurrentUserId() == this.partido.owner) {
			this.selectedRow = (this.selectedRow == row) ? -1 : row;
		}
	}
}
