// medico.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importar HttpHeaders
import { Observable, forkJoin, map } from 'rxjs';
import { RangoHorario, AgendaPayload } from '../models/medico/rango-horario.model';
import { ApiResponse } from '../models/apiResponse.model';
import { Turno } from '../models/medico/turno.model';
import { AuthService } from 'src/app/services/auth.service'; // Importar AuthService
import { Medico } from '../models/medico/medico.model';
import { Agenda } from '../models/agenda/agenda.model';

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

  /**
   * 🕒 Obtiene los turnos del médico para una fecha específica
   */
  obtenerTurnosMedico(idMedico: number, fecha: string): Observable<ApiResponse<Turno[]>> {

    const token = this.authService.obtenerToken();

    // 1. Verificar si el token existe
    if (!token) {
      // Si no hay token, el request fallará en el backend.
      throw new Error("Token de autenticación no encontrado.");
    }

    // 2. Crear los headers con el token de autenticación
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    // 3. Crear el cuerpo de la petición
    const body = { id_medico: idMedico, fecha };

    // 4. Realizar la petición POST incluyendo los headers
    return this.http.post<ApiResponse<Turno[]>>(
      `${this.apiUrl}/obtenerTurnosMedico`,
      body,
      { headers: headers } // CLAVE: Pasar el objeto HttpHeaders
    );
  }

  /**
   * 💾 Crea o modifica una agenda completa
   */
  saveAgenda(payload: AgendaPayload): Observable<ApiResponse<unknown>[]> {
    const requests: Observable<ApiResponse<unknown>>[] = [];

    // NOTA: Aquí también DEBES enviar el token en cada petición POST/PUT
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
        // 🟢 PUT
        requests.push(
          this.http.put<ApiResponse<unknown>>(
            `${this.apiUrl}/modificarAgenda/${rango.id}`,
            registroAgenda,
            { headers } // Incluir headers
          )
        );
      } else {
        // 🟢 POST
        requests.push(
          this.http.post<ApiResponse<unknown>>(
            `${this.apiUrl}/crearAgenda`,
            registroAgenda,
            { headers } // Incluir headers
          )
        );
      }
    });

    // 🟢 forkJoin devuelve un array de las respuestas tipadas
    return forkJoin(requests);
  }

  getMedicosPorEspecialidad(idEspecialidad: number): Observable<Medico[]> {
    return this.http.get<ApiResponse<Medico[]>>(`${this.apiUrl}/obtenerMedicoPorEspecialidad/${idEspecialidad}`)
      .pipe(map(res => res.payload));
  }
}