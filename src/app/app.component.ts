import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	title = 'organizador-futbol5';

	public currentUser: string;
	private loaded: boolean;
	private elapsedTime: number;

	constructor(
		public afAuth: AngularFireAuth
	) {
		this.loaded = false;
		this.elapsedTime = (new Date()).getTime();
	}

	ngOnInit() {
		this.currentUser = null;

		this.afAuth.authState.subscribe(user => {
			if (user) {
				console.log("¡Sesión iniciada correctamente!");
				this.currentUser = user.uid;
				window.localStorage.setItem("uid", this.currentUser);
			} else {
				console.log("¡Sesión no iniciada!");
				this.currentUser = null;
				window.localStorage.removeItem("uid");
			}

			let curTime = (new Date()).getTime();

			if(curTime - this.elapsedTime < 2500)
			{			
				setTimeout(()=> {
      				this.loaded = true;
    			}, 2500 - (curTime - this.elapsedTime));
			}
			else
				this.loaded = true;
		});
	}
}
