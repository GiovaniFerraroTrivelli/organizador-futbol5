import {Injectable} from '@angular/core';
import {
	Action,
	AngularFirestore,
	AngularFirestoreDocument,
	DocumentChangeAction,
	DocumentReference,
	DocumentSnapshot
} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';
import {Field} from '../interfaces/field';
import {Match} from '../interfaces/match';
import {Player} from '../interfaces/player';

@Injectable({
	providedIn: 'root'
})

export class DbService {

	constructor(
		private store: AngularFirestore
	) {
	}

	createMatch(match: Match, field?: string): Promise<DocumentReference<Match>> {
		match.field = field ? this.store.doc<Field>(`fields/${field}`).ref : null;
		return this.store.collection<Match>('matches').add(match);
	}

	getMatchById(documentId: string): AngularFirestoreDocument<Match> {
		return this.store.collection<Match>('matches').doc(documentId);
	}

	getFields(): Observable<DocumentChangeAction<Field>[]> {
		return this.store.collection<Field>('fields').snapshotChanges();
	}

	getMatches(): Observable<DocumentChangeAction<Match>[]> {
		return this.store.collection<Match>('matches').snapshotChanges();
	}

	updateMatch(documentId: string, data: any): Promise<void> {
		return this.store.collection('matches').doc(documentId).set(data);
	}

	updatePlayers(matchId: string, players: Player[]): Promise<void> {
		return this.store.collection<Match>('matches').doc(matchId).update({players});
	}

	deleteMatch(matchId: string): Promise<void> {
		return this.store.collection('matches').doc(matchId).delete();
	}
}
