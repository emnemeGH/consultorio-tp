import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { rolGuard } from './guards/rol.guard';
import { InicioPacienteComponent } from './components/paciente/inicio-paciente/inicio-paciente.component';
import { InicioAdminComponent } from './components/administrador/inicio-admin/inicio-admin.component';
import { InicioOperadorComponent } from './components/operador/inicio-operador/inicio-operador.component';
import { InicioMedicoComponent } from './components/medico/inicio-medico/inicio-medico.component';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';
import { MisDatosComponent } from './components/paciente/mis-datos/mis-datos.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'paciente', component: InicioPacienteComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },
  { path: 'paciente/nuevo-turno', component: NuevoTurnoComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },
  { path: 'paciente/mis-turnos', component: MisTurnosComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },
  { path: 'paciente/mis-datos', component: MisDatosComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },

  { path: 'inicio-admin', component: InicioAdminComponent, canActivate: [rolGuard], data: { roles: ['administrador'] } },
  { path: 'inicio-operador', component: InicioOperadorComponent, canActivate: [rolGuard], data: { roles: ['operador'] } },
  { path: 'inicio-medico', loadChildren: () => import('./components/medico/medico.module').then(m => m.MedicoModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
