import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
	errorMessage: string;
	registerForm: FormGroup;

	constructor(
		private authService: AuthService,
		private router: Router,
		private formBuilder: FormBuilder
	) {
		this.registerForm = this.formBuilder.group({
			email: [null, [Validators.required, Validators.email]],
			password: [null, Validators.required],
		});
	}

	get email(): AbstractControl<any, any> {
		return this.registerForm.get('email');
	}

	get password(): AbstractControl<any, any> {
		return this.registerForm.get('password');
	}

	ngOnInit(): void {
		if (this.authService.getUser()) {
			this.router.navigate(['/']).then();
		}
	}

	tryRegister(): void {
		this.authService.doRegister(this.registerForm.value).then(() => {
			this.errorMessage = null;
			this.router.navigate(['/']).then();
		}, err => {
			this.errorMessage = err.message;
		});
	}

	tryGoogleRegister(): void {
		this.authService.doGoogleLogin().then(() => {
			this.errorMessage = null;
			this.router.navigate(['/']).then();
		}, err => {
			this.errorMessage = err.message;
		});
	}
}
