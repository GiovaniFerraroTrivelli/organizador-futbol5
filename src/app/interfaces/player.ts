import firebase from 'firebase/compat/app';

export interface Player {
	uuid: string;
	name: string;
	date: firebase.firestore.Timestamp;
}
