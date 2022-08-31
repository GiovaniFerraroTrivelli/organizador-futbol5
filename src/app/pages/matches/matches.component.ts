import {Component, OnInit} from '@angular/core';
import {DbService} from '../../services/db.service';
import {Title} from '@angular/platform-browser';
import {Match} from '../../interfaces/match';
import {DocumentChangeAction} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

const Timestamp = firebase.firestore.Timestamp;

@Component({
	selector: 'app-matches',
	templateUrl: './matches.component.html',
	styleUrls: ['./matches.component.scss']
})

export class MatchesComponent implements OnInit {
	matches: {
		past: Match[];
		upcoming: Match[];
	};

	modalOpen: boolean;
	showCreateModal: boolean;

	constructor(
		private db: DbService,
		private titleService: Title,
	) {
		this.modalOpen = false;
		this.showCreateModal = false;
		this.matches = {upcoming: null, past: null};
	}

	ngOnInit(): void {
		this.titleService.setTitle('Lista de partidos');
		this.loadMatches();
	}

	loadMatches(): void {
		this.db.getMatches().subscribe((snapshot: DocumentChangeAction<Match>[]) => {

			this.clearMatches();

			snapshot.forEach((document: DocumentChangeAction<Match>) => {
				const match: Match = {id: document.payload.doc.id, ...document.payload.doc.data()};

				if (match.date > Timestamp.now()) {
					this.matches.upcoming.push(match);
				} else {
					this.matches.past.push(match);
				}
			});
		});
	}

	clearMatches(): void {
		this.matches = {
			past: [],
			upcoming: []
		};
	}
}
