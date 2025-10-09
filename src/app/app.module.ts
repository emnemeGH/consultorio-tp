import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module'; // import del módulo centralizado de Material

import { HomeComponent } from './home/home.component';
import { LoginDialogComponent } from './home/login-dialog/login-dialog.component';
import { InicioMedicoComponent } from './components/medico/inicio-medico/inicio-medico.component';
import { InicioPacienteComponent } from './components/paciente/inicio-paciente/inicio-paciente.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginDialogComponent,
    InicioMedicoComponent,
    InicioPacienteComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
