import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {DbService} from '../../services/db.service';
import {Subscription} from 'rxjs';

@Component({
	selector: 'app-create-player',
	templateUrl: './create-player.component.html',
	styleUrls: ['./create-player.component.scss']
})
export class CreatePlayerComponent implements OnInit, OnDestroy {
	playerForm: FormGroup;
	@Output() closeModal = new EventEmitter();
	subscriptions: Subscription[];

	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private db: DbService,
	) {
		this.playerForm = this.formBuilder.group({
			name: [null, [Validators.required, Validators.pattern('^.{1,32}$')]],
			recurrent: [false],
		});

		this.subscriptions = [];
	}

	ngOnInit(): void {
	}

	close(): void {
		this.closeModal.emit();
	}

	submit(): void {
		this.playerForm.disable();

		this.subscriptions.push(this.db.existsPlayerByName(this.playerForm.value.name).subscribe((exists: boolean) => {
			if (exists) {
				this.playerForm.enable();
				this.playerForm.setErrors({exists: true});
			} else {
				this.db.createPlayer({
					...this.playerForm.value,
				}).then(() => this.close());
			}
		}));
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(s => s.unsubscribe());
	}
}
