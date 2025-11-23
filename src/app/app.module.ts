import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './shared/material.module'; // import del módulo centralizado de Material

import { HomeComponent } from './home/home.component';
import { LoginDialogComponent } from './home/login-dialog/login-dialog.component';
import { InicioPacienteComponent } from './components/paciente/inicio-paciente/inicio-paciente.component';
import { InicioAdminComponent } from './components/administrador/inicio-admin/inicio-admin.component';
import { InicioOperadorComponent } from './components/operador/inicio-operador/inicio-operador.component';
import { MisTurnosComponent } from './components/paciente/mis-turnos/mis-turnos.component';
import { NuevoTurnoComponent } from './components/paciente/nuevo-turno/nuevo-turno.component';
import { MisDatosComponent } from './components/paciente/mis-datos/mis-datos.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RegistroComponent } from './components/registro/registro.component';
import { TurnoConfirmadoDialogComponent } from './components/paciente/nuevo-turno/turno-confirmado-dialog/turno-confirmado-dialog.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AdminUsuariosComponent } from './components/administrador/admin-usuarios/admin-usuarios.component';
import { AdminCoberturasComponent } from './components/administrador/admin-coberturas/admin-coberturas.component';
import { AdminEspecialidadesComponent } from './components/administrador/admin-especialidades/admin-especialidades.component';
import { CrearUsuarioComponent } from './components/administrador/admin-usuarios/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './components/administrador/admin-usuarios/editar-usuario/editar-usuario.component';
import { DialogEditarEspecialidadComponent } from './components/administrador/admin-especialidades/dialog-editar-especialidad/dialog-editar-especialidad.component';
import { DialogCrearEspecialidadComponent } from './components/administrador/admin-especialidades/dialog-crear-especialidad/dialog-crear-especialidad.component';
import { VerTurnosDialogComponent } from './components/operador/ver-turnos-dialog/ver-turnos-dialog.component';
import { EditarAgendaComponent } from './components/operador/editar-agenda/editar-agenda.component';
import { CrearTurnoDialogComponent } from './components/operador/crear-turno-dialog/crear-turno-dialog.component';
import { CrearPacienteDialogComponent } from './components/operador/crear-paciente-dialog/crear-paciente-dialog.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './mocks/in-memory-data.service';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginDialogComponent,
    InicioPacienteComponent,
    InicioAdminComponent,
    InicioOperadorComponent,
    MisTurnosComponent,
    NuevoTurnoComponent,
    MisDatosComponent,
    RegistroComponent,
    TurnoConfirmadoDialogComponent,
    AdminUsuariosComponent,
    AdminCoberturasComponent,
    AdminEspecialidadesComponent,
    CrearUsuarioComponent,
    EditarUsuarioComponent,
    DialogEditarEspecialidadComponent,
    DialogCrearEspecialidadComponent,
    AdminEspecialidadesComponent,
    VerTurnosDialogComponent,
    EditarAgendaComponent,
    CrearTurnoDialogComponent,
    CrearPacienteDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      delay: 100,
      passThruUnknownUrl: true
    })
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
