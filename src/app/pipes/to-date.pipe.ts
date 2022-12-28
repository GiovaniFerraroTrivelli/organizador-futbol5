import {Pipe, PipeTransform} from '@angular/core';
import firebase from 'firebase/compat';

@Pipe({
	name: 'toDate'
})
export class ToDatePipe implements PipeTransform {
	transform(value: firebase.firestore.Timestamp): any {
		return value.toDate();
	}
}
