import { Component, EventEmitter, Input, OnInit, Output, inject, Optional, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MedicoService } from 'src/app/services/medico.service';
import { TurnoService } from 'src/app/services/turno.service';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { Turno } from 'src/app/models/medico/turno.model';
import { Agenda } from 'src/app/models/agenda/agenda.model';
import { RangoHorario } from 'src/app/models/medico/rango-horario.model';
import { AuthService } from 'src/app/services/auth.service';
import { CrearTurnoDialogComponent } from '../crear-turno-dialog/crear-turno-dialog.component';

@Component({
  selector: 'app-editar-agenda',
  templateUrl: './editar-agenda.component.html',
  styleUrls: ['./editar-agenda.component.css']
})
export class EditarAgendaComponent implements OnInit {
  @Input() data!: { id_medico: number; nombre_medico: string; fecha: string; id_especialidad?: number };
  @Output() cerrar = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private medicoService = inject(MedicoService);
  private turnoService = inject(TurnoService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  agendaForm: FormGroup;
  rangosGuardados: RangoHorario[] = [];
  turnos: Turno[] = [];

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any,
    @Optional() private dialogRef: MatDialogRef<EditarAgendaComponent>
  ) {
    this.agendaForm = this.fb.group({
      horarios: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.data = this.dialogData;
    }

    if (!this.data) {
      console.error('No se recibieron datos para EditarAgendaComponent');
      return;
    }

    this.cargarAgendaDelDia();
    this.cargarTurnosDelDia();
  }

  get horarios(): FormArray {
    return this.agendaForm.get('horarios') as FormArray;
  }

  private crearHorario(rango?: RangoHorario): FormGroup {
    return this.fb.group({
      id: [rango?.id || null],
      horaEntrada: [rango?.horaEntrada || '', Validators.required],
      horaSalida: [rango?.horaSalida || '', Validators.required],
    });
  }

  cargarAgendaDelDia(): void {
    this.horarios.clear();
    this.medicoService.getAgendaCompleta(this.data.id_medico).subscribe({
      next: (res: ApiResponse<Agenda[]>) => {
        if (res.codigo === 200 && Array.isArray(res.payload)) {
          const formattedDate = this.data.fecha;
          const rangos: RangoHorario[] = res.payload
            .filter(a => {
              const fechaStr = a.fecha instanceof Date
                ? a.fecha.toISOString().split('T')[0]
                : new Date(a.fecha).toISOString().split('T')[0];
              return fechaStr === formattedDate;
            })
            .map(a => ({
              id: a.id,
              horaEntrada: (a.hora_entrada || '').trim(),
              horaSalida: (a.hora_salida || '').trim(),
              fecha: formattedDate
            }));
          this.rangosGuardados = rangos;
          rangos.forEach(r => this.horarios.push(this.crearHorario(r)));
        }
      },
      error: err => console.error('Error cargando agenda', err)
    });
  }

  agregarHorario(): void {
    this.horarios.push(this.crearHorario());
  }

  eliminarHorario(index: number): void {
    if (confirm('¿Eliminar este rango horario?')) this.horarios.removeAt(index);
  }

  guardarAgenda(): void {
    if (this.agendaForm.invalid) {
      alert('Por favor completá todos los campos.');
      return;
    }

    const data = {
      id_medico: this.data.id_medico,
      id_especialidad: this.data.id_especialidad || 1,
      fecha: this.data.fecha,
      rangos: this.horarios.value
    };

    this.medicoService.saveAgenda(data).subscribe({
      next: () => {
        alert('Agenda actualizada correctamente.');
        if (this.dialogRef) this.dialogRef.close(true);
      },
      error: err => console.error('Error guardando agenda', err)
    });
  }

  limpiarControl(control: AbstractControl | null): void {
    if (control) control.setValue(null);
  }

  cargarTurnosDelDia(): void {
    this.medicoService.obtenerTurnosMedico(this.data.id_medico, this.data.fecha).subscribe({
      next: (res: ApiResponse<Turno[]>) => (this.turnos = res.payload || []),
      error: err => console.error('Error cargando turnos', err)
    });
  }

  eliminarTurno(id_turno: number): void {
    if (confirm('¿Seguro que deseas eliminar este turno?')) {
      this.turnoService.eliminarTurno(id_turno).subscribe({
        next: () => {
          this.turnos = this.turnos.filter(t => t.id_turno !== id_turno);
          alert('Turno eliminado correctamente.');
        },
        error: err => console.error('Error eliminando turno', err)
      });
    }
  }

  cerrarPanel(): void {
    if (this.dialogRef) {
      this.dialogRef.close(true);
    } else {
      this.cerrar.emit();
    }
  }

  abrirCrearTurno(): void {
        const dialogRef = this.dialog.open(CrearTurnoDialogComponent, {
            width: '800px',
        data: {
            id_medico: this.data.id_medico,
            nombre_medico: this.data.nombre_medico,
            fecha: this.data.fecha,
            rangos: this.rangosGuardados
        }
    });

    // Manejar el resultado del diálogo
    dialogRef.afterClosed().subscribe(result => {
        // El diálogo devuelve 'true' si el turno se creó con éxito
        if (result === true) {
            // Refrescar la lista de turnos para ver el nuevo turno
            this.cargarTurnosDelDia(); 
        }
    });
}
}
