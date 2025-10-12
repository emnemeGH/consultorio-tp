import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { rolGuard } from './guards/rol.guard';
import { InicioPacienteComponent } from './components/paciente/inicio-paciente/inicio-paciente.component';
import { InicioAdminComponent } from './components/administrador/inicio-admin/inicio-admin.component';
import { InicioOperadorComponent } from './components/operador/inicio-operador/inicio-operador.component';
import { InicioMedicoComponent } from './components/medico/inicio-medico/inicio-medico.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'inicio-paciente', component: InicioPacienteComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },
  { path: 'inicio-admin', component: InicioAdminComponent, canActivate: [rolGuard], data: { roles: ['administrador'] } },
  { path: 'inicio-operador', component: InicioOperadorComponent, canActivate: [rolGuard], data: { roles: ['operador'] } },
  { path: 'inicio-medico', loadChildren: () => import('./components/medico/medico.module').then(m => m.MedicoModule), canActivate: [rolGuard], data: { roles: ['medico'] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
