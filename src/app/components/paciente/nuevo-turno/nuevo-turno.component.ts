import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Agenda } from 'src/app/models/agenda/agenda.model';
import { Especialidad } from 'src/app/models/especialidad/especialidad.model';
import { Medico } from 'src/app/models/medico/medico.model';
import { AuthService } from 'src/app/services/auth.service';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { MedicoService } from 'src/app/services/medico.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush //Por rendimiento, me estaba andando mal
})
export class NuevoTurnoComponent implements OnInit {
  turnoForm: FormGroup;

  especialidades: Especialidad[] = [];
  profesionales: Medico[] = [];
  id_cobertura: Number = 0

  agendaCompletaMedico: Agenda[] = []; 
  agendaDiaSeleccionado: Agenda[] = [];      
  horasDisponibles: string[] = [];

  private _authService = inject(AuthService)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private _usuarioService = inject(UsuarioService)
  private _especialidadService = inject(EspecialidadService);
  private _medicoService = inject(MedicoService)

  constructor() {

    this.turnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      profesional: [{ value: '', disabled: true }, Validators.required],
      cobertura: [{ value: '', disabled: true }],
      fecha: [{ value: '', disabled: true }, Validators.required],
      hora: [{ value: '', disabled: true }, Validators.required],
      notas: [{ value: '', disabled: true }, Validators.required],
    });

  }

  ngOnInit(): void {
    this.obtenerCobertura()

    this.desactivarCamposSiguientes()

    this.obtenerEspecialidades()

    this.especialidad?.valueChanges.subscribe((idEspecialidad: number) => {
      if (idEspecialidad) {
        this.obtenerMedicos(idEspecialidad);
      } else {
        this.profesionales = [];
      }
    });

    // Nos suscribimos a los cambios en profesional y al getagenda completa del profesional
    // todos los registros de agenda con el id del medico se guardan en agendaCompletaMedico 
    this.profesional?.valueChanges.subscribe((idMedico: number) => {
      if (idMedico) {
        this._medicoService.getAgendaCompleta(idMedico).subscribe(resp => {
          this.agendaCompletaMedico = resp.payload;
        });
      } else {
        this.agendaCompletaMedico = []
      }
    });

    this.fecha?.valueChanges.subscribe(fechaSeleccionada => {
      this.filtrarAgendaPorFecha(fechaSeleccionada);
    });
  }

  aceptar() {
    if (this.turnoForm.valid) {
      console.log('Datos del turno:', this.turnoForm.value);
      // Más adelante: abrir el popup de confirmación
    }

    if (!this.horasDisponibles.includes(this.turnoForm.value.hora)) {
      alert('La hora seleccionada no está dentro de la agenda del médico.');
      return;
    }
  }

  cancelar() {
    this.router.navigate(['/paciente']);
  }

  desactivarCamposSiguientes() {
    const campos = [this.especialidad, this.profesional, this.fecha, this.hora, this.notas];

    campos.forEach((campo, index) => {
      if (!campo) return;

      // valueChanges es un observable que emite un valor cada vez que el usuario cambia el campo.
      // val → el nuevo valor que ingresó el usuario.
      // Esto nos permite reaccionar automáticamente cuando el usuario selecciona o borra un valor.
      campo.valueChanges.subscribe(val => {
        if (val) {
          // habilita el siguiente campo si existe
          const siguiente = campos[index + 1];
          siguiente?.enable();
        } else {
          // si se borra, deshabilita todos los campos siguientes
          for (let i = index + 1; i < campos.length; i++) {
            campos[i]?.disable();
          }
        }
      });
    });
  }

  obtenerCobertura() {
    const usuario = this._authService.obtenerUsuario();
    if (usuario) {
      this._usuarioService.obtenerUsuarioCompleto(usuario.id).subscribe(u => {
        if (u) {
          this.cobertura?.setValue(u.nombre_cobertura);
          this.id_cobertura = u.id_cobertura
        }
      });
    }
  }

  obtenerEspecialidades() {
    this._especialidadService.getEspecialidades().subscribe({
      next: (especialidades: Especialidad[]) => {
        this.especialidades = especialidades;
      },
      error: (err) => {
        console.error('Error HTTP al obtener especialidades:', err);
      }
    });
  }

  obtenerMedicos(idEspecialidad: number): void {
    this._medicoService.getMedicosPorEspecialidad(idEspecialidad).subscribe({
      next: (medicos) => {
        this.profesionales = medicos;
      },
      error: (err) => console.error('Error obteniendo médicos:', err)
    });
  }

  filtrarAgendaPorFecha(fechaSeleccionada: Date) {
    if (!fechaSeleccionada) return;

    const fechaStr = fechaSeleccionada.toISOString().split('T')[0];

    // Guardamos los horarios que hay en la agenda completa que coiniciden con el dia selccionado
    this.agendaDiaSeleccionado = this.agendaCompletaMedico.filter(agenda => {
      const agendaFechaStr = new Date(agenda.fecha).toISOString().split('T')[0];
      return agendaFechaStr === fechaStr;
    });

    this.generarHorasDisponibles();
  }

  generarHorasDisponibles() {
    this.horasDisponibles = [];

    this.agendaDiaSeleccionado.forEach(agenda => {
      // Si la horaInicio es 11:30
      // Creamos 4 variables, cada una contiene un numero nomas, por ej horaInicio es 11
      // minutoInicio es 30 gracias a split y con map los hacemos number
      let [horaInicio, minutoInicio] = agenda.hora_entrada.split(':').map(Number);
      const [horaFin, minutoFin] = agenda.hora_salida.split(':').map(Number);

      while (horaInicio < horaFin || (horaInicio === horaFin && minutoInicio < minutoFin)) {
        this.horasDisponibles.push(
          horaInicio.toString().padStart(2, '0') + ':' + minutoInicio.toString().padStart(2, '0')
        );
        minutoInicio += 30;
        if (minutoInicio >= 60) {
          horaInicio++;
          minutoInicio = 0;
        }
      }
    });
  }

  get especialidad() { return this.turnoForm.get('especialidad'); }
  get profesional() { return this.turnoForm.get('profesional'); }
  get cobertura() { return this.turnoForm.get('cobertura'); }
  get fecha() { return this.turnoForm.get('fecha'); }
  get hora() { return this.turnoForm.get('hora'); }
  get notas() { return this.turnoForm.get('notas'); }
}
