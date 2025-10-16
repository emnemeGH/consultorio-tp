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
import { RegistroComponent } from './components/registro/registro.component';
import { AdminUsuariosComponent } from './components/administrador/admin-usuarios/admin-usuarios.component';
import { AdminCoberturasComponent } from './components/administrador/admin-coberturas/admin-coberturas.component';
import { AdminEspecialidadesComponent } from './components/administrador/admin-especialidades/admin-especialidades.component';
import { CrearUsuarioComponent } from './components/administrador/admin-usuarios/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './components/administrador/admin-usuarios/editar-usuario/editar-usuario.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'paciente', component: InicioPacienteComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },
  { path: 'paciente/nuevo-turno', component: NuevoTurnoComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },
  { path: 'paciente/mis-turnos', component: MisTurnosComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },
  { path: 'paciente/mis-datos', component: MisDatosComponent, canActivate: [rolGuard], data: { roles: ['paciente'] } },

  { path: 'admin', component: InicioAdminComponent, canActivate: [rolGuard], data: { roles: ['administrador'] } },
  { path: 'admin/usuarios', component: AdminUsuariosComponent, canActivate: [rolGuard], data: { roles: ['administrador'] } },
  { path: 'admin/usuarios/crear', component: CrearUsuarioComponent, canActivate: [rolGuard], data: { roles: ['administrador'] } },
  { path: 'admin/usuarios/editar/:id', component: EditarUsuarioComponent, canActivate: [rolGuard], data: { roles: ['administrador'] } },
  { path: 'admin/coberturas', component: AdminCoberturasComponent, canActivate: [rolGuard], data: { roles: ['administrador'] } },
  { path: 'admin/especialidades', component: AdminEspecialidadesComponent, canActivate: [rolGuard], data: { roles: ['administrador'] } },

  { path: 'inicio-operador', component: InicioOperadorComponent, canActivate: [rolGuard], data: { roles: ['operador'] } },
  { path: 'inicio-medico', loadChildren: () => import('./components/medico/medico.module').then(m => m.MedicoModule) },
  { path: 'registro', component: RegistroComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
