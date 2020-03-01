import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
	errorMessage : string;
	loginForm : FormGroup;

	constructor(
		private authService : AuthService,
		private router: Router
	) {
		this.errorMessage = null;
		this.loginForm = new FormGroup({
			email: new FormControl(null, [ Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$') ]),
			password: new FormControl(null, Validators.required),
		});
	}

	get email() { return this.loginForm.get('email'); }
	get password() { return this.loginForm.get('password'); }

	ngOnInit() {
		if(this.authService.getUser())
			this.router.navigate(['/']);
	}

	logOut() {
		this.authService.logOut();
	}

	tryLogin(f) {
		this.authService.doLogin(f.value).then(res => {
			this.errorMessage = null;
			this.router.navigate(['/']);
	  	}, err => {
			this.errorMessage = err.message;
	  	});
	}

	tryGoogleLogin()
	{
		this.authService.doGoogleLogin().then(res => {
			this.errorMessage = null;
			this.router.navigate(['/']);
	  	}, err => {
			this.errorMessage = err.message;
	  	});
	}
}
