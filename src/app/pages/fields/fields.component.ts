import {Component, OnInit} from '@angular/core';
import {DbService} from '../../services/db.service';
import {Title} from '@angular/platform-browser';
import {Field} from '../../interfaces/field';
import {DocumentChangeAction} from '@angular/fire/compat/firestore';

@Component({
	selector: 'app-field',
	templateUrl: './fields.component.html',
	styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {
	fields: Field[];

	constructor(
		private db: DbService,
		private titleService: Title
	) {
		this.fields = [];
	}

	ngOnInit(): void {
		this.titleService.setTitle('Listado de canchas');
		this.loadFields();
	}

	loadFields(): void {
		this.db.getFields().subscribe((snapshot: DocumentChangeAction<Field>[]) => {
			snapshot.forEach((document: DocumentChangeAction<Field>) => {
				this.fields.push({
					id: document.payload.doc.id,
					...document.payload.doc.data()
				});
			});
		});
	}
}
