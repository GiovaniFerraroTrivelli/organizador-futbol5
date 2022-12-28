import {Injectable} from '@angular/core';
import {Action, AngularFirestore, DocumentChangeAction, DocumentReference, DocumentSnapshot} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';
import {Field} from '../interfaces/field';
import {Player} from '../interfaces/player';
import {Match} from '../interfaces/match';
import {MatchPlayer} from '../interfaces/match-player';
import {map} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})

export class DbService {

	constructor(
		private store: AngularFirestore
	) {
	}

	createMatch(match: Match): Promise<DocumentReference<Match>> {
		return this.store.collection<Match>('matches').add({
			...match,
			field: match.field ? this.store.doc<Field>(`fields/${match.field}`).ref : null
		});
	}

	getMatchById(documentId: string): Observable<Action<DocumentSnapshot<Match>>> {
		return this.store.collection<Match>('matches').doc(documentId).snapshotChanges();
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

	updatePlayers(matchId: string, players: MatchPlayer[]): Promise<void> {
		return this.store.collection<Match>('matches').doc(matchId).update({
			players: players.map(player => ({
				...player,
				uuid: typeof player.uuid === 'string' ? this.store.doc<Player>(`players/${player.uuid}`).ref : player.uuid
			}))
		});
	}

	deleteMatch(matchId: string): Promise<void> {
		return this.store.collection('matches').doc(matchId).delete();
	}

	getPlayers(): Observable<DocumentChangeAction<Player>[]> {
		return this.store.collection<Player>('players').snapshotChanges();
	}

	createPlayer(player: Player): Promise<DocumentReference<Player>> {
		return this.store.collection<Player>('players').add(player);
	}

	findPlayerByName(name: string): Observable<DocumentChangeAction<Player>[]> {
		return this.store.collection<Player>('players', ref => ref.where('name', '==', name)).snapshotChanges();
	}

	existsPlayerByName(name: string): Observable<boolean> {
		return this.findPlayerByName(name).pipe(map(players => players.length > 0));
	}

	countPlayerInMatches(playerId: string): Observable<number> {
		return this.store.collection<Match>('matches', ref => ref.where(`players.player.uuid`, '==', playerId)).get().pipe(
			map(matches => matches.docs.length)
		);
	}
}
