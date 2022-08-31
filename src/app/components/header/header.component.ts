import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	isMenuOpen: boolean;

	constructor(
		private authService: AuthService,
		protected router: Router,
		protected titleService: Title,
	) {
	}

	ngOnInit(): void {
	}

	getCurrentUser(): string {
		return this.authService.getUser();
	}

	doLogOut(): void {
		return this.authService.logOut();
	}

	isUserLoggedIn(): boolean {
		return this.authService.getUser() != null;
	}
}
