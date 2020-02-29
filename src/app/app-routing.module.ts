import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioComponent } from './inicio/inicio.component';
import { PartidosComponent } from './partidos/partidos.component';
import { CanchasComponent } from './canchas/canchas.component';
import { PartidoComponent } from './partido/partido.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
	{ path: '', component: InicioComponent },
	{ path: 'partidos', component: PartidosComponent },
	{ path: 'partido/:id', component: PartidoComponent },
	{ path: 'canchas', component: CanchasComponent },
	{ path: 'iniciar-sesion', component: LoginComponent },
	{ path: 'registrarse', component: RegisterComponent },
	{ path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
