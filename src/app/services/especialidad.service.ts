import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Especialidad } from '../models/especialidad/especialidad.model';
import { ApiResponse } from '../models/apiResponse.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private apiUrl = "http://localhost:4000/api//obtenerEspecialidades"
  private http = inject(HttpClient);

  getEspecialidades(): Observable<Especialidad[]> {
  return this.http.get<ApiResponse<Especialidad[]>>(this.apiUrl).pipe(
    map(res => res.payload)
  );
}
}
