import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicoRoutingModule } from './medico-routing.module';

import { MaterialModule } from 'src/app/shared/material.module';

import { TurnosProgramadosComponent } from './turnos-programados/turnos-programados.component';
import { GestionAgendaComponent } from './gestion-agenda/gestion-agenda.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { InicioMedicoComponent } from './inicio-medico/inicio-medico.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [
        TurnosProgramadosComponent,
        GestionAgendaComponent,
        InicioMedicoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MedicoRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatToolbarModule,
        MatTabsModule,
        MatIconModule
    ]
})
export class MedicoModule { }
