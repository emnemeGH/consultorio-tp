import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs'; // ✅ forkJoin ya importado
// Ajuste de las rutas de importación de modelos
import { RangoHorario, AgendaPayload } from '../models/medico/rango-horario.model'; 
// Si la carpeta de modelos está en la raíz, el path debe ser:
// import { RangoHorario, AgendaPayload } from '../models/medico/rango-horario.model'; 

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = 'http://localhost:4000/api'; 
  private idMedico: number = 2; // Temporal
  private especialidadId: number = 1; // Temporal

  constructor(private http: HttpClient) { }

  getAgendaCompleta(idMedico: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/obtenerAgenda/${idMedico}`);
    }
    
    // 🟢 FUNCIÓN DE LECTURA DE TURNOS (Añadiéndola por si se te había pasado)
    /**
     * Obtiene la lista de turnos para un médico y una fecha específica.
     * Llama al endpoint POST /obtenerTurnosMedico
     */
    obtenerTurnosMedico(idMedico: number, fecha: string): Observable<any> {
      const body = { id_medico: idMedico, fecha: fecha };
      return this.http.post<any>(`${this.apiUrl}/obtenerTurnosMedico`, body);
    }

  // --- LÓGICA DE AGENDA (Guardar) ---
  saveAgenda(payload: AgendaPayload): Observable<any[]> {
    const requests: Observable<any>[] = [];
    const fechaAgenda = payload.fecha;

    payload.rangos.forEach(rango => {
      const registroAgenda = {
        id_medico: this.idMedico,
        id_especialidad: this.especialidadId, 
        fecha: fechaAgenda,
        // 🚨 IMPORTANTE: Usar 'hora_entrada' y 'hora_salida' que espera el backend
        // Aunque el modelo tiene horaEntrada/horaSalida, el backend espera el formato snake_case:
        hora_entrada: rango.horaEntrada, // 👈 Ajuste aquí
        hora_salida: rango.horaSalida,   // 👈 Ajuste aquí
      };

      if (rango.id) {
        requests.push(
          this.http.put(`${this.apiUrl}/modificarAgenda/${rango.id}`, registroAgenda)
        );
      } else {
        requests.push(
          this.http.post(`${this.apiUrl}/crearAgenda`, registroAgenda)
        );
      }
    });

    return forkJoin(requests);
  }
}