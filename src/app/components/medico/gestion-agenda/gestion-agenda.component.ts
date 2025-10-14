import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms'; // Importamos AbstractControl
import { MedicoService } from '../../../services/medico.service';
import { AgendaPayload, RangoHorario } from '../../../models/medico/rango-horario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-gestion-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['./gestion-agenda.component.css']
})
export class GestionAgendaComponent implements OnInit {
  agendaForm: FormGroup;
  selectedDate: Date = new Date();
  rangosGuardados: RangoHorario[] = [];
  mostrarFormulario: boolean = false;

  idMedico: number | null = null;
  idEspecialidad: number | null = null;

  private fb = inject(FormBuilder);
  private medicoService = inject(MedicoService);
  private authService = inject(AuthService);

  constructor() {
    this.agendaForm = this.fb.group({
      horarios: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.cargarDatosMedico();
  }

  cargarDatosMedico(): void {
    const usuarioLogueado = this.authService.obtenerUsuario();
    if (usuarioLogueado && usuarioLogueado.rol === 'medico') {
      this.idMedico = usuarioLogueado.id;
      this.idEspecialidad = 1; // temporal
      this.loadHorarios(this.selectedDate);
    } else {
      console.error("No se encontró ID de médico logueado.");
    }
  }

  get horarios(): FormArray {
    return this.agendaForm.get('horarios') as FormArray;
  }

  private createRangoHorario(rango?: RangoHorario): FormGroup {
    return this.fb.group({
      id: [rango?.id || null],
      horaEntrada: [rango?.horaEntrada || '', Validators.required],
      horaSalida: [rango?.horaSalida || '', Validators.required]
    });
  }

  agregarNuevoHorario(): void {
    this.horarios.push(this.createRangoHorario());
  }

  removerHorario(index: number): void {
    this.horarios.removeAt(index);
  }

  loadHorarios(date: Date): void {
    this.selectedDate = date;
    if (!this.idMedico) return;

    this.horarios.clear();
    this.rangosGuardados = [];

    // Cargar IDs eliminados del almacenamiento local
    const eliminados = JSON.parse(localStorage.getItem('rangosEliminados') || '[]');

    this.medicoService.getAgendaCompleta(this.idMedico).subscribe((res) => {
      if (res.codigo === 200 && res.payload) {
        const formattedDate = this.formatDate(date);

        const rangosFiltrados: RangoHorario[] = res.payload
          .filter((item: any) => item.fecha?.split('T')[0] === formattedDate)
          .map((item: any) => ({
            id: item.id,
            horaEntrada: (item.horaEntrada || item.hora_entrada || '').trim(),
            horaSalida: (item.horaSalida || item.hora_salida || '').trim(),
            fecha: item.fecha
          }))
          // Filtrar los eliminados
          .filter((r) => !eliminados.includes(r.id));

        console.log("📅 Fecha seleccionada:", formattedDate);
        console.log("🕒 Rangos filtrados:", rangosFiltrados);

        this.rangosGuardados = rangosFiltrados;
      }
    });
  }

  eliminarRango(id: number): void {
    if (confirm('¿Eliminar este horario permanentemente?')) {
      this.rangosGuardados = this.rangosGuardados.filter(r => r.id !== id);
      const eliminados = JSON.parse(localStorage.getItem('rangosEliminados') || '[]');
      eliminados.push(id);
      localStorage.setItem('rangosEliminados', JSON.stringify(eliminados));

      console.log(`🗑️ Horario ID ${id} eliminado permanentemente`);
    }
  }


  guardarAgenda(): void {
    if (this.agendaForm.invalid) {
      alert('Por favor, completa todos los campos de horario.');
      return;
    }

    if (!this.idMedico || !this.idEspecialidad) {
      alert('Faltan datos del médico.');
      return;
    }

    const dataToSave: AgendaPayload = {
      id_medico: this.idMedico,
      id_especialidad: this.idEspecialidad,
      fecha: this.formatDate(this.selectedDate),
      rangos: this.horarios.value
    };

    this.medicoService.saveAgenda(dataToSave).subscribe({
      next: () => {
        alert('Agenda guardada con éxito.');
        this.mostrarFormulario = false;
        this.loadHorarios(this.selectedDate);
      },
      error: (err) => {
        console.error('Error al guardar agenda:', err);
      }
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (this.mostrarFormulario) {
      this.horarios.clear();
      this.agregarNuevoHorario();
    }
  }

  public formatDate(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  limpiarControl(control: AbstractControl | null): void {
    if (control) {
      control.setValue(null);
    }
  }

  // FUNCIÓN PARA CONVERSIÓN DE 24H a 12H (AM/PM)
  public formatHora(hora: string): string {
    if (!hora) return '';

    const parts = hora.split(':');
    const h = parseInt(parts[0], 10);
    const m = parts.length > 1 ? parseInt(parts[1], 10) : 0;

    if (isNaN(h) || isNaN(m)) {
      return hora;
    }

    // Determinar el sufijo (AM/PM)
    const suffix = h >= 12 ? 'PM' : 'AM';

    let hour12 = h;

    if (h === 0) {
      hour12 = 12;
    } else if (h > 12) {
      hour12 = h - 12;
    }
    return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
  }
}