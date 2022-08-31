import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './pages/home/home.component';
import {MatchesComponent} from './pages/matches/matches.component';
import {FieldsComponent} from './pages/fields/fields.component';
import {MatchComponent} from './pages/match/match.component';

import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';

const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'partidos', component: MatchesComponent},
	{path: 'partido/:id', component: MatchComponent},
	{path: 'canchas', component: FieldsComponent},
	{path: 'iniciar-sesion', component: LoginComponent},
	{path: 'registrarse', component: RegisterComponent},
	{path: '**', redirectTo: '/'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule {
}
