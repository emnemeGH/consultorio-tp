import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioMedicoComponent } from './inicio-medico/inicio-medico.component';
import { TurnosProgramadosComponent } from './turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './gestion-agenda/gestion-agenda.component';

const routes: Routes = [
  {
    path: '',
    component: InicioMedicoComponent,
    children: [
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
      
      { path: 'turnos', component: TurnosProgramadosComponent },
      
      { path: 'agenda', component: GestionAgendaComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoRoutingModule { }