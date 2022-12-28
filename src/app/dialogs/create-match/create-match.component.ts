import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Field} from '../../interfaces/field';
import {DocumentChangeAction} from '@angular/fire/compat/firestore';
import {DbService} from '../../services/db.service';
import firebase from 'firebase/compat/app';
import {Subscription} from 'rxjs';

const Timestamp = firebase.firestore.Timestamp;

@Component({
	selector: 'app-create-match',
	templateUrl: './create-match.component.html',
	styleUrls: ['./create-match.component.scss']
})
export class CreateMatchComponent implements OnInit, OnDestroy {
	matchForm: FormGroup;
	fields: Field[];

	private subscriptions: Subscription[];

	@Output() closeModal = new EventEmitter();

	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private db: DbService,
	) {
		this.matchForm = this.formBuilder.group({
			name: [null, [Validators.required, Validators.pattern('^.{1,32}$')]],
			field: [null, Validators.required],
			date: [null, Validators.required],
			time: [null, Validators.required],
		});

		this.subscriptions = [];
	}

	ngOnInit(): void {
		this.loadFields();
	}

	close(): void {
		this.closeModal.emit();
	}

	loadFields(): void {
		this.matchForm.disable();
		this.fields = [];

		this.subscriptions.push(this.db.getFields().subscribe((snapshot: DocumentChangeAction<Field>[]) => {
			snapshot.forEach((document: DocumentChangeAction<Field>) => {
				this.fields.push({
					id: document.payload.doc.id,
					...document.payload.doc.data()
				});
			});

			this.matchForm.enable();
		}));
	}

	submit(): void {
		this.matchForm.disable();

		this.db.createMatch({
			name: this.matchForm.get('name').value,
			field: this.matchForm.get('field').value,
			date: Timestamp.fromDate(new Date(`${this.matchForm.get('date').value} ${this.matchForm.get('time').value}`)),
			players: []
		}).then(() => this.close());
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach(subscription => subscription.unsubscribe());
	}
}
