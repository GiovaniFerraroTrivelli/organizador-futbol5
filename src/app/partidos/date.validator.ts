import { FormControl } from '@angular/forms';

export function DateValidator(c: FormControl) {
	const today = new Date();
	const selected = new Date(c.value);
	
	let maxDate = new Date();
	maxDate.setMonth(maxDate.getMonth() + 2);

  	return today.getTime() < selected.getTime() && selected.getTime() < maxDate.getTime() ? null : {
    	validateDate: {
      		valid: false
    	}
  	};
}
