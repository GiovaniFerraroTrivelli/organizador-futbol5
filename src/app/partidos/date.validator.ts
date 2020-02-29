import { FormControl } from '@angular/forms';

export function DateValidator(c: FormControl) {
	const today = new Date();
	const future = new Date(c.value);

  	return today.getTime() < future.getTime() ? null : {
    	validateDate: {
      		valid: false
    	}
  	};
}
