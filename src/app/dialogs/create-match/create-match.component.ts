import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateValidator} from '../../pages/matches/date.validator';
import {AuthService} from '../../services/auth.service';
import {Field} from '../../interfaces/field';
import {DocumentChangeAction} from '@angular/fire/compat/firestore';
import {DbService} from '../../services/db.service';
import {Match} from '../../interfaces/match';
import firebase from 'firebase/compat/app';

const Timestamp = firebase.firestore.Timestamp;

@Component({
	selector: 'app-create-match',
	templateUrl: './create-match.component.html',
	styleUrls: ['./create-match.component.scss']
})
export class CreateMatchComponent implements OnInit {
	matchForm: FormGroup;
	fields: Field[];
	includeMe: boolean;
	minDate: Date;

	@Output() closeModal = new EventEmitter();

	constructor(
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private db: DbService,
	) {
		this.includeMe = false;
		this.minDate = new Date();

		this.matchForm = this.formBuilder.group({
			name: [null, [Validators.required, Validators.pattern('^.{1,32}$')]],
			field: [null, Validators.required],
			date: [null, [DateValidator, Validators.required]],
			time: [null, Validators.required],
			included: [null],
			nick: [null, Validators.pattern('^.{1,32}$')],
		});
	}

	ngOnInit(): void {
		this.loadFields();
	}

	get name(): AbstractControl<any, any> {
		return this.matchForm.get('name');
	}

	get field(): AbstractControl<any, any> {
		return this.matchForm.get('field');
	}

	get date(): AbstractControl<any, any> {
		return this.matchForm.get('date');
	}

	get time(): AbstractControl<any, any> {
		return this.matchForm.get('time');
	}

	get included(): AbstractControl<any, any> {
		return this.matchForm.get('included');
	}

	get nick(): AbstractControl<any, any> {
		return this.matchForm.get('nick');
	}

	close(): void {
		this.closeModal.emit();
	}

	toggleAddMe(): void {
		this.includeMe = !this.includeMe;

		if (this.includeMe) {
			this.matchForm.get('nick').setValidators([Validators.required, Validators.pattern('^.{1,32}$')]);
		} else {
			this.matchForm.get('nick').setValidators(Validators.pattern('^.{1,32}$'));
		}

		this.matchForm.get('nick').updateValueAndValidity();
	}

	loadFields(): void {
		this.matchForm.disable();
		this.fields = [];

		this.db.getFields().subscribe((snapshot: DocumentChangeAction<Field>[]) => {
			snapshot.forEach((document: DocumentChangeAction<Field>) => {
				this.fields.push({
					id: document.payload.doc.id,
					...document.payload.doc.data()
				});
			});

			this.matchForm.enable();
		});
	}

	submit(): void {
		this.matchForm.disable();
		const f = this.matchForm;

		const match: Match = {
			date: Timestamp.fromDate(new Date(`${f.get('date').value} ${f.get('time').value}`)),
			name: f.get('name').value,
			owner: this.authService.getUser(),
			players: f.get('included').value ? [{
				name: f.get('nick').value as string,
				uuid: this.authService.getUser(),
				date: Timestamp.now(),
			}] : []
		};

		this.db.createMatch(match, f.get('field').value).then(() => {
			this.close();
		});
	}
}
