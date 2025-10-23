import { Component, OnInit, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TurnoService } from 'src/app/services/turno.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Turno } from 'src/app/models/turno/turno.model';
import { RangoHorario } from 'src/app/models/medico/rango-horario.model';
import { MedicoService } from 'src/app/services/medico.service';
import { CrearPacienteDialogComponent } from '../crear-paciente-dialog/crear-paciente-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

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
  private medicoService = inject(MedicoService);
  private _authService = inject(AuthService)
  private dialog = inject(MatDialog);

  turnoForm!: FormGroup;
  pacientes: Paciente[] = [];
  coberturas: Cobertura[] = [];
  turnosExistentes: string[] = [];
  horasDisponibles: string[] = [];

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

    this.turnoForm.get('id_paciente')?.valueChanges.subscribe(idPaciente => {
      if (idPaciente) {
        this.actualizarCoberturaPaciente(idPaciente);
        this.turnoForm.get('id_cobertura')?.disable();
      } else {
        this.turnoForm.get('id_cobertura')?.setValue(null);
      }
    });


    this.medicoService.obtenerTurnosMedico(this.data.id_medico, this.data.fecha)
      .subscribe({
        next: (res: any) => {
          this.turnosExistentes = (res.payload || []).map((t: any) => t.hora.trim());
          this.generarHorasDisponibles();
        },
        error: (err) => console.error('Error cargando turnos existentes', err)
      });
  }

  actualizarCoberturaPaciente(idPaciente: number) {
    this.usuarioService.obtenerUsuarioCompleto(idPaciente).subscribe({
      next: (usuario) => {
        if (usuario && usuario.id_cobertura) {
          this.turnoForm.get('id_cobertura')?.setValue(usuario.id_cobertura);
        } else {
          this.turnoForm.get('id_cobertura')?.setValue(null);
        }
      },
      error: err => console.error('Error obteniendo cobertura del paciente', err)
    });
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

  generarHorasDisponibles(): void {
    const intervalo = 30; // minutos entre turnos
    const horas: string[] = [];

    for (const rango of this.data.rangos) {
      const inicio = this.convertirAHoras(rango.horaEntrada);
      const fin = this.convertirAHoras(rango.horaSalida);

      for (let i = inicio; i <= fin; i += intervalo) {
        const h = Math.floor(i / 60).toString().padStart(2, '0');
        const m = (i % 60).toString().padStart(2, '0');
        const hora = `${h}:${m}`;

        // Excluir horas que ya estén ocupadas
        if (!this.turnosExistentes.includes(hora)) {
          horas.push(hora);
        }
      }
    }

    this.horasDisponibles = horas.sort((a, b) => {
      const [ah, am] = a.split(':').map(Number);
      const [bh, bm] = b.split(':').map(Number);
      return ah * 60 + am - (bh * 60 + bm);
    });
  }

  private convertirAHoras(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  private diferenciaMinutos(h1: string, h2: string): number {
    const [h1h, h1m] = h1.split(':').map(Number);
    const [h2h, h2m] = h2.split(':').map(Number);
    return (h2h * 60 + h2m) - (h1h * 60 + h1m);
  }

  guardarTurno(): void {
    if (this.turnoForm.invalid || !this.agendaId) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const formValue = this.turnoForm.getRawValue();
    const horaSeleccionada = formValue.hora;

    const dentroDeRango = this.data.rangos.some(r => {
      return horaSeleccionada >= r.horaEntrada && horaSeleccionada <= r.horaSalida;
    });

    if (!dentroDeRango) {
      const rangosTexto = this.data.rangos
        .map(r => `${r.horaEntrada}-${r.horaSalida}`)
        .join(' / ');
      alert(`La hora seleccionada no pertenece a los rangos válidos (${rangosTexto}).`);
      return;
    }

    const horaOcupada = this.turnosExistentes.includes(horaSeleccionada);
    if (horaOcupada) {
      alert(`Ya existe un turno asignado a las ${horaSeleccionada}.`);
      return;
    }

    const turnoCercano = this.turnosExistentes.some(hora => {
      const diff = Math.abs(this.diferenciaMinutos(hora, horaSeleccionada));
      return diff < 30; // menos de 30 minutos de diferencia
    });
    if (turnoCercano) {
      alert('Debe dejar al menos 30 minutos entre turnos.');
      return;
    }

    const dataToSend: Turno = {
      nota: formValue.nota || '',
      id_agenda: this.agendaId!,
      fecha: new Date(this.data.fecha),
      hora: horaSeleccionada,
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

  abrirCrearPaciente(): void {
    const dialogRef = this.dialog.open(CrearPacienteDialogComponent, {
      width: '750px',
      height: '600px',
      data: { coberturas: this.coberturas }
    });

    dialogRef.afterClosed().subscribe((nuevoPaciente) => {
      if (nuevoPaciente) {
        // recargar pacientes
        this.cargarPacientes();
        alert(`Paciente ${nuevoPaciente.apellido}, ${nuevoPaciente.nombre} creado con éxito`);
      }
    });
  }
}
