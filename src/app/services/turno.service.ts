import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Turno } from '../models/turno/turno.model';
import { map, Observable } from 'rxjs';
import { TurnoPacienteCompleto } from '../models/turno/turno-paciente-completo.model';
import { ApiResponse } from '../models/apiResponse.model';

interface AsignarTurnoResponse {
  codigo: number;
  message: string; //En el backend decia message en vez de mensaje, tuve que crear esto
  payload: null;
}

@Injectable({
  providedIn: 'root'
})

export class TurnoService {

  private http = inject(HttpClient);
  private url = 'http://localhost:4000/api'

  asignarTurno(data: Turno): Observable<AsignarTurnoResponse> {
    return this.http.post<AsignarTurnoResponse>(`${this.url}/asignarTurnoPaciente`, data);
  }

  getTurnosPaciente(idPaciente: number): Observable<TurnoPacienteCompleto[] | null> {
    const url = `${this.url}/obtenerTurnoPaciente/${idPaciente}`;
    return this.http.get<ApiResponse<TurnoPacienteCompleto[]>>(url).pipe(
      map(res => {
        if (res.codigo === 200) {
          return res.payload;
        }
        return null;
      })
    );
  }

  eliminarTurno(idTurno: number): Observable<ApiResponse<unknown>> {
  return this.http.delete<ApiResponse<unknown>>(`${this.url}/eliminarTurnoPaciente/${idTurno}`);
}

}
