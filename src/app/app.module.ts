import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {FlexLayoutModule} from '@angular/flex-layout';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home/home.component';
import {MatchesComponent} from './pages/matches/matches.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {FieldsComponent} from './pages/fields/fields.component';
import {MatchComponent} from './pages/match/match.component';
import {MatchTableComponent} from './pages/matches/match-table/match-table.component';
import {CreateMatchComponent} from './dialogs/create-match/create-match.component';

import {registerLocaleData} from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import {environment} from '../environments/environment';
import {PlayersComponent} from './pages/players/players.component';
import {CreatePlayerComponent} from './dialogs/create-player/create-player.component';
import {ToDatePipe} from './pipes/to-date.pipe';
import {PercentagePipe} from './pipes/percentage.pipe';

registerLocaleData(localeEsAr, 'es-AR');

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		MatchesComponent,
		HeaderComponent,
		FooterComponent,
		LoginComponent,
		RegisterComponent,
		FieldsComponent,
		MatchComponent,
		MatchTableComponent,
		CreateMatchComponent,
		PlayersComponent,
		CreatePlayerComponent,
		ToDatePipe,
		PercentagePipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		FlexLayoutModule
	],
	providers: [
		{provide: LOCALE_ID, useValue: 'es-AR'},
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
