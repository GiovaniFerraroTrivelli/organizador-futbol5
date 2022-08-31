import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {GoogleAuthProvider} from 'firebase/auth';
import firebase from 'firebase/compat/app';

@Injectable({
	providedIn: 'root'
})

export class AuthService {

	constructor(
		public afAuth: AngularFireAuth
	) {
	}

	getUser(): string {
		return window.localStorage.getItem('uid');
	}

	doRegister({email, password}): Promise<firebase.auth.UserCredential> {
		return new Promise<any>((resolve, reject) => {
			this.afAuth.createUserWithEmailAndPassword(email, password)
				.then(res => {
					resolve(res);
				}, err => reject(err));
		});
	}

	doLogin({email, password}): Promise<firebase.auth.UserCredential> {
		return this.afAuth.signInWithEmailAndPassword(email, password);
	}

	doGoogleLogin(): Promise<firebase.auth.UserCredential> {
		return new Promise<any>((resolve, reject) => {
			const provider = new GoogleAuthProvider();

			provider.addScope('profile');
			provider.addScope('email');

			this.afAuth.signInWithPopup(provider)
				.then(res => {
					resolve(res);
				});
		});
	}

	logOut(): void {
		this.afAuth.signOut().then(() => window.localStorage.removeItem('uid'));
	}
}
