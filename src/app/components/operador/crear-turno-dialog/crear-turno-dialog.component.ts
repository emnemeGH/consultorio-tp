import { Component, OnInit, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Turno } from 'src/app/models/turno/turno.model';
import { RangoHorario } from 'src/app/models/medico/rango-horario.model';

// Interfaces de Soporte
interface Cobertura { id: number; nombre: string; }
interface Paciente { id: number; nombre_completo: string; dni: string; }

@Component({
  selector: 'app-crear-turno-dialog',
  templateUrl: './crear-turno-dialog.component.html',
  styleUrls: ['./crear-turno-dialog.component.css']
})
export class CrearTurnoDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private turnoService = inject(TurnoService);
  private usuarioService = inject(UsuarioService);

  turnoForm!: FormGroup;
  pacientes: Paciente[] = [];
  coberturas: Cobertura[] = [];

  private agendaId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<CrearTurnoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_medico: number; fecha: string; nombre_medico: string; rangos: RangoHorario[] }
  ) { }

  ngOnInit(): void {
    const primerRango = this.data.rangos && this.data.rangos.length > 0 ? this.data.rangos[0] : null;

    if (primerRango && primerRango.id) {
      this.agendaId = primerRango.id;
    } else {
      alert('Error: No se encontró un ID de Agenda válido para esta fecha.');
      this.dialogRef.close();
      return;
    }

    this.turnoForm = this.fb.group({
      id_paciente: [null, Validators.required],
      id_cobertura: [null, Validators.required],
      id_agenda: [this.agendaId, Validators.required],
      hora: ['', Validators.required],
      nota: ['']
    });

    this.turnoForm.get('id_agenda')?.disable();

    this.cargarPacientes();
    this.cargarCoberturas();
  }

  cargarPacientes(): void {
    this.usuarioService.getAllUsuariosCompleto().subscribe({
      next: (usuarios) => {
        const pacientesFiltrados = usuarios.filter(u => u.rol === 'paciente');
        this.pacientes = pacientesFiltrados.map(u => ({
          id: u.id,
          nombre_completo: `${u.apellido}, ${u.nombre} (${u.dni})`,
          dni: u.dni
        }));
      },
      error: err => console.error('Error cargando pacientes', err)
    });
  }

  cargarCoberturas(): void {
    this.usuarioService.obtenerCoberturas().subscribe({
      next: (coberturas) => (this.coberturas = coberturas),
      error: err => console.error('Error cargando coberturas', err)
    });
  }

  guardarTurno(): void {
    if (this.turnoForm.invalid || !this.agendaId) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    // getRawValue() para incluir campos deshabilitados (como id_agenda)
    const formValue = this.turnoForm.getRawValue();

    const fechaDate: Date = new Date(this.data.fecha);

    const dataToSend: Turno = {
      nota: formValue.nota || '',
      id_agenda: this.agendaId!,
      fecha: fechaDate, // Tipo Date
      hora: formValue.hora,
      id_paciente: formValue.id_paciente,
      id_cobertura: formValue.id_cobertura
    };

    this.turnoService.asignarTurno(dataToSend).subscribe({
      next: (res) => {
        if (res.codigo === 200) {
          alert('Turno asignado correctamente.');
          this.dialogRef.close(true);
        } else {
          alert(`Error al asignar turno: ${res.message || 'Error desconocido'}`);
        }
      },
      error: (err) => {
        console.error('Error en API al asignar turno:', err);
        alert('Ocurrió un error al intentar asignar el turno.');
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}