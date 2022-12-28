import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'percentage'
})
export class PercentagePipe implements PipeTransform {
	transform(value: number, total: number): any {
		if (!total) {
			return `0.00%`;
		}

		return (value / total * 100).toFixed(2) + '%';
	}
}
