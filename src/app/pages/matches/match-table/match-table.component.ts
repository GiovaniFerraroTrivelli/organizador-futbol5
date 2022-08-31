import {Component, Input, OnInit} from '@angular/core';
import {Match} from '../../../interfaces/match';
import {Router} from '@angular/router';

@Component({
	selector: 'app-match-table',
	templateUrl: './match-table.component.html',
	styleUrls: ['./match-table.component.scss']
})
export class MatchTableComponent implements OnInit {
	@Input() matches: Match[];

	constructor(
		private router: Router
	) {
	}

	ngOnInit(): void {
	}

	goToMatch(matchId: string): void {
		this.router.navigate([`/partido/${matchId}`]).then();
	}
}
