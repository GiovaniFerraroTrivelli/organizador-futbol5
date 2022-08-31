import {SafeResourceUrl} from '@angular/platform-browser';

export interface Field {
	id: string;
	name: string;
	address: string;
	embed?: SafeResourceUrl;
}
