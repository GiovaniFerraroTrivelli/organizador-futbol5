import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
	errorMessage: string;
	loginForm: FormGroup;

	constructor(
		private authService: AuthService,
		private router: Router,
		private formBuilder: FormBuilder
	) {
		this.errorMessage = null;
		this.loginForm = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, Validators.required],
		});
	}

	ngOnInit(): void {
		if (this.authService.getUser()) {
			this.router.navigate(['/']).then();
		}
	}

	get email(): AbstractControl<any, any> {
		return this.loginForm.get('email');
	}

	get password(): AbstractControl<any, any> {
		return this.loginForm.get('password');
	}

	logOut(): void {
		this.authService.logOut();
	}

	tryLogin(): void {
		this.authService.doLogin(this.loginForm.value).then(() => {
			this.errorMessage = null;
			this.router.navigate(['/']).then();
		}, err => {
			this.errorMessage = err.message;
		});
	}

	tryGoogleLogin(): void {
		this.authService.doGoogleLogin().then(() => {
			this.errorMessage = null;
			this.router.navigate(['/']).then();
		}, err => {
			this.errorMessage = err.message;
		});
	}
}
