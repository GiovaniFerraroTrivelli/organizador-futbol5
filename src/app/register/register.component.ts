import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
	public errorMessage : string;
	private registerForm : FormGroup;

	constructor(
		private authService : AuthService,
		private router: Router
	) {
		this.registerForm = new FormGroup({
			email: new FormControl(null, [ Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$') ]),
			password: new FormControl(null, Validators.required),
		});
	}

	get email() { return this.registerForm.get('email'); }
	get password() { return this.registerForm.get('password'); }

    ngOnInit() {
    	if(this.authService.getUser())
			this.router.navigate(['/']);
    }

	tryRegister(f: NgForm) {
		this.authService.doRegister(f.value).then(res => {
			this.errorMessage = null;
			this.router.navigate(['/']);
	  	}, err => {
			this.errorMessage = err.message;
	  	});
	}

	tryGoogleRegister()
	{
		this.authService.doGoogleLogin().then(res => {
			this.errorMessage = null;
			this.router.navigate(['/']);
	  	}, err => {
			this.errorMessage = err.message;
	  	});
	}
}
