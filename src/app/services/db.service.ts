import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class DbService {

	constructor(
		private db: AngularFirestore,
		private authService: AuthService
	) { }

	createPartido(nombre : string, cancha : string, fecha : string, hora : string, juega : boolean, tag? : string) {
		let jugadores = [];

		if(juega) {
			jugadores.push({
				nombre: tag,
				uuid: this.authService.getUser(),
				fecha: firebase.firestore.Timestamp.fromDate(new Date()),
			});
		}

		return this.db.collection('partidos').add({
			nombre: nombre,
			lugar: this.db.doc('lugares/' + cancha).ref,
			fecha: firebase.firestore.Timestamp.fromDate(new Date(fecha + ' ' + hora)),
			jugadores: jugadores,
			owner: this.authService.getUser()
		});
	}

	getPartidoById(documentId: string) {
		return this.db.collection('partidos').doc(documentId).snapshotChanges();
	}

	getCanchas() {
		return this.db.collection('lugares').snapshotChanges();
	}

	getPartidos() {
		return this.db.collection('partidos').snapshotChanges();
	}

	updatePartido(documentId: string, data: any) {
    	return this.db.collection('partidos').doc(documentId).set(data);
    }

    updateJugadores(documentId: string, jugadores: any) {
    	return this.db.collection('partidos').doc(documentId).update({
    		jugadores: jugadores
    	});
    }

    deletePartido(documentId: string) {
    	this.db.collection('partidos').doc(documentId).delete().then(function() {
			console.log("Document successfully deleted!");
		}).catch(function(error) {
			console.error("Error removing document: ", error);
		});
    }

    getFirebaseCurDate() {
    	return firebase.firestore.Timestamp.fromDate(new Date());
    }
}
