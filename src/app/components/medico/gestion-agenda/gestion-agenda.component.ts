import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MedicoService } from '../../../services/medico.service'; // Asumiendo que el servicio está en ../../services/
import { RangoHorario } from '../../../models/medico/rango-horario.model'; // Asumiendo esta ruta
import { AuthService } from 'src/app/services/auth.service'; // 🟢 Importar AuthService

@Component({
  selector: 'app-gestion-agenda',
  templateUrl: './gestion-agenda.component.html',
  styleUrls: ['./gestion-agenda.component.css']
})
export class GestionAgendaComponent implements OnInit {
  agendaForm: FormGroup;
  selectedDate: Date = new Date(); 
  
  // 🟢 Inicializamos como null, se cargarán en ngOnInit
  idMedico: number | null = null; 
  idEspecialidad: number | null = null; 

  // 🟢 Inyectar AuthService
  private fb = inject(FormBuilder);
  private medicoService = inject(MedicoService);
  private authService = inject(AuthService); // 🟢 Inyección de AuthService

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
      
      // ⚠️ Tarea pendiente: Debes obtener la especialidad del médico.
      // Por ahora, usamos el valor mock (1) o el primero si tu AuthService lo devuelve.
      // Si el backend devuelve id_cobertura, podrías usarlo, pero la agenda necesita ESPECIALIDAD.
      // Si tu backend no devuelve la especialidad en el login, tendrás que hacer otra llamada
      // al backend para obtenerla o usar la lógica de tu MedicoService si ya la tiene.
      // Por simplicidad, asumiremos que por ahora el médico solo tiene la idEspecialidad = 1.
      this.idEspecialidad = 1; // 👈 Mantener 1 temporalmente o usar dato real

      // Solo cargamos la agenda si tenemos el ID del médico
      if (this.idMedico) {
        this.loadHorarios(this.selectedDate);
      }
    } else {
        console.error("No se encontró ID de médico logueado.");
        this.agregarNuevoHorario();
    }
  }

  // ... (El resto del código permanece igual) ...

  // Getter para acceder al FormArray
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
      // Permite eliminar siempre que haya más de un rango
    if (this.horarios.length > 1) { 
      this.horarios.removeAt(index);
    } else {
      alert('Debe haber al menos un rango horario.');
    }
  }

  loadHorarios(date: Date): void {
    this.selectedDate = date;
    
    // Si no tenemos ID, no podemos cargar
    if (!this.idMedico) return; 
    
    // 1. Limpia los rangos existentes
    while (this.horarios.length !== 0) {
      this.horarios.removeAt(0);
    }
    
    // 2. Llama al servicio (usa el ID dinámico)
    this.medicoService.getAgendaCompleta(this.idMedico).subscribe((res: any) => {
        if (res.codigo === 200 && res.payload) {
            const formattedDate = this.formatDate(date);
            
            // 3. Filtramos la respuesta por la fecha seleccionada
            const rangosFiltrados = res.payload
                .filter((item: any) => item.fecha === formattedDate)
                .map((item: any) => ({
                    id: item.id,
                    horaEntrada: item.hora_entrada,
                    horaSalida: item.hora_salida,
                } as RangoHorario));

            if (rangosFiltrados.length === 0) {
                this.agregarNuevoHorario();
            } else {
                rangosFiltrados.forEach((rango: RangoHorario) => {
                    this.horarios.push(this.createRangoHorario(rango));
                });
            }
        } else {
            this.agregarNuevoHorario();
        }
    });
  }
  
  onDateChange(event: any): void {
    const dateValue = new Date(event.target.value); 
    if (dateValue) {
      this.loadHorarios(dateValue);
    }
  }

  guardarAgenda(): void {
    if (this.agendaForm.invalid) {
      alert('Por favor, completa todos los campos de horario.');
      return;
    }
    
    // 🟢 Aseguramos que tenemos los IDs necesarios antes de guardar
    if (!this.idMedico || !this.idEspecialidad) {
        alert('Faltan datos del médico para guardar la agenda.');
        return;
    }
    
    const dataToSave = {
      id_medico: this.idMedico, // 🟢 Enviar ID dinámico al servicio
      id_especialidad: this.idEspecialidad, // 🟢 Enviar ID dinámico al servicio
      fecha: this.formatDate(this.selectedDate),
      rangos: this.horarios.value 
    };

    this.medicoService.saveAgenda(dataToSave).subscribe({
      next: () => {
        alert('Agenda guardada y actualizada con éxito.');
        this.loadHorarios(this.selectedDate);
      },
      error: (err) => {
        console.error('Error al guardar la agenda:', err);
        alert('Hubo un error al guardar la agenda. Revisa la consola.');
      }
    });
  }
  
  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day; // 🟢 Corregido: 'month' por 'day'
    return [year, month, day].join('-'); 
  }
}