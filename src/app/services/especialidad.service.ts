import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad/especialidad.model';
import { ApiResponse } from '../models/apiResponse.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private apiUrl = "http://localhost:4000/api"
  private http = inject(HttpClient);

  getEspecialidades(): Observable<Especialidad[]> {
    return this.http.get<ApiResponse<Especialidad[]>>(`${this.apiUrl}/obtenerEspecialidades`).pipe(
      map(res => res.payload)
    );
  }

  crearEspecialidad(descripcion: string): Observable<ApiResponse<[]>> {
    return this.http.post<ApiResponse<[]>>(`${this.apiUrl}/crearEspecialidad`, { descripcion } );
  }

  modificarEspecialidad(especialidad: Especialidad): Observable<ApiResponse<[]>> {
    return this.http.put<ApiResponse<[]>>(`${this.apiUrl}/modificarEspecialidad`, especialidad);
  }

  eliminarEspecialidad(id: number): Observable<ApiResponse<[]>> {
    return this.http.delete<ApiResponse<[]>>(`${this.apiUrl}/eliminarEspecialidad/${id}`);
  }
}
