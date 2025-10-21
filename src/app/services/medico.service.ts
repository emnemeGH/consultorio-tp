// medico.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { RangoHorario, AgendaPayload } from '../models/medico/rango-horario.model';
import { ApiResponse } from '../models/apiResponse.model';
import { Turno } from '../models/medico/turno.model';
import { AuthService } from 'src/app/services/auth.service';
import { Medico } from '../models/medico/medico.model';
import { Agenda } from '../models/agenda/agenda.model';
import { Especialidad } from '../models/especialidad/especialidad.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private apiUrl = 'http://localhost:4000/api';

  private http = inject(HttpClient);
  private authService = inject(AuthService); 

  getAgendaCompleta(idMedico: number): Observable<ApiResponse<Agenda[]>> {
    return this.http.get<ApiResponse<Agenda[]>>(`${this.apiUrl}/obtenerAgenda/${idMedico}`);
  }

  obtenerTurnosMedico(idMedico: number, fecha: string): Observable<ApiResponse<Turno[]>> {

    const token = this.authService.obtenerToken();

    if (!token) {
      throw new Error("Token de autenticación no encontrado.");
    }

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    const body = { id_medico: idMedico, fecha };

    return this.http.post<ApiResponse<Turno[]>>(
      `${this.apiUrl}/obtenerTurnosMedico`,
      body,
      { headers: headers }
    );
  }

  saveAgenda(payload: AgendaPayload): Observable<ApiResponse<unknown>[]> {
    const requests: Observable<ApiResponse<unknown>>[] = [];

    const token = this.authService.obtenerToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token || ''}`);

    payload.rangos.forEach((rango: RangoHorario) => {
      const registroAgenda = {
        id_medico: payload.id_medico,
        id_especialidad: payload.id_especialidad,
        fecha: payload.fecha,
        hora_entrada: rango.horaEntrada,
        hora_salida: rango.horaSalida,
      };

      if (rango.id) {
        requests.push(
          this.http.put<ApiResponse<unknown>>(
            `${this.apiUrl}/modificarAgenda/${rango.id}`,
            registroAgenda,
            { headers }
          )
        );
      } else {
        requests.push(
          this.http.post<ApiResponse<unknown>>(
            `${this.apiUrl}/crearAgenda`,
            registroAgenda,
            { headers }
          )
        );
      }
    });

    // forkJoin devuelve un array de las respuestas tipadas
    return forkJoin(requests);
  }

  getMedicosPorEspecialidad(idEspecialidad: number): Observable<Medico[]> {
    return this.http.get<ApiResponse<Medico[]>>(`${this.apiUrl}/obtenerMedicoPorEspecialidad/${idEspecialidad}`)
      .pipe(map(res => res.payload));
  }

  getEspecialidadesMedico(idMedico: number): Observable<ApiResponse<Especialidad[]>> {
  return this.http.get<ApiResponse<Especialidad[]>>(
    `${this.apiUrl}/obtenerEspecialidadesMedico/${idMedico}`
  );
}

}