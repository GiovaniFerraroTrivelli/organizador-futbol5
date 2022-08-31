import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
	readonly LOADING_MIN_TIME = 2500;

	currentUserUid: string;
	loaded: boolean;
	elapsedTime: number;

	constructor(
		public afAuth: AngularFireAuth
	) {
		this.currentUserUid = null;
		this.loaded = false;
		this.elapsedTime = (new Date()).getTime();
	}

	ngOnInit(): void {
		this.afAuth.authState.subscribe(user => {
			this.currentUserUid = user?.uid || null;

			if (user) {
				window.localStorage.setItem('uid', this.currentUserUid);
			} else {
				window.localStorage.removeItem('uid');
			}

			const curTime = (new Date()).getTime();

			if (curTime - this.elapsedTime < this.LOADING_MIN_TIME) {
				setTimeout(() => {
					this.loaded = true;
				}, this.LOADING_MIN_TIME - (curTime - this.elapsedTime));
			} else {
				this.loaded = true;
			}
		});
	}
}
