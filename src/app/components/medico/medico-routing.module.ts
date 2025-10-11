import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioMedicoComponent } from './inicio-medico/inicio-medico.component';
import { TurnosProgramadosComponent } from './turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './gestion-agenda/gestion-agenda.component';

const routes: Routes = [
  {
    // Esta es la ruta base (Ej: /medico)
    path: '',
    component: InicioMedicoComponent,
    children: [
      // 1. Redirección: Al entrar en /medico, va directamente a la gestión de agenda
      { path: '', redirectTo: 'agenda', pathMatch: 'full' },
      
      // 2. Turnos: Carga el componente de turnos dentro del router-outlet
      { path: 'turnos', component: TurnosProgramadosComponent },
      
      // 3. Agenda: Carga el componente de agenda dentro del router-outlet
      { path: 'agenda', component: GestionAgendaComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicoRoutingModule { }