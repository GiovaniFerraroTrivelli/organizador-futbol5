import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	private isMenuOpen : boolean;

	constructor(
		private authService : AuthService,
		private router: Router,
		private titleService: Title
	) { }

	ngOnInit() {
	}

	getCurrentUser() {
		return this.authService.getUser();
	}

	doLogOut() {
		return this.authService.logOut();
	}

	isUserLoggedIn() {
		return this.authService.getUser() != null;
	}

	isCurrentRouter(router : string) {
		return this.router.isActive(router, true);
	}
}
