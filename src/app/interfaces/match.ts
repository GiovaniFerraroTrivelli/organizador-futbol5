import firebase from 'firebase/compat/app';
import {DocumentReference} from '@angular/fire/compat/firestore';
import {Field} from './field';
import {MatchPlayer} from './match-player';

export interface Match {
	id?: string;
	date: firebase.firestore.Timestamp;
	players: MatchPlayer[];
	name: string;
	field?: DocumentReference<Field>;
}
