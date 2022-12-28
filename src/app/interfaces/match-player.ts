import {DocumentReference} from '@angular/fire/compat/firestore';
import {Player} from './player';

export interface MatchPlayer {
	uuid: DocumentReference<Player>;
	player?: Player;
	winner: boolean;
}
