import { NgModule } from '@angular/core';
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
    TurnoConfirmadoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
