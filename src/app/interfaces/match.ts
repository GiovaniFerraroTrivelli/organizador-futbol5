import {Player} from './player';
import {DocumentReference} from '@angular/fire/compat/firestore';
import {Field} from './field';
import firebase from 'firebase/compat/app';

export interface Match {
	id?: string;
	date: firebase.firestore.Timestamp;
	players: Player[];
	name: string;
	owner: string;
	field?: DocumentReference<Field>;
}
