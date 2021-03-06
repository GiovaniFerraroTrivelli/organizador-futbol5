import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	constructor(
		public afAuth: AngularFireAuth
	) {
	}

	getUser() {
		return window.localStorage.getItem("uid");
	}

	doRegister(value) {
		return new Promise<any>((resolve, reject) => {
			firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
		 		.then(res => {
		   			resolve(res);
		 		}, err => reject(err))
   		})
	 }

	doLogin(value) {
		return firebase.auth().signInWithEmailAndPassword(value.email, value.password)
	}

	doGoogleLogin() {
		return new Promise<any>((resolve, reject) => {
			let provider = new firebase.auth.GoogleAuthProvider();
			
			provider.addScope('profile');
			provider.addScope('email');
		
			this.afAuth.auth.signInWithPopup(provider)
				.then(res => {
		  			resolve(res);
				})
		})
	}

	logOut() {
		this.afAuth.auth.signOut();
		window.localStorage.removeItem("uid");
	}
}
