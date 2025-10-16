import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';
import { UsuarioCompleto } from '../models/usuarios/response-get-usuario.model';
import { ApiResponse } from '../models/apiResponse.model';
import { Cobertura } from '../models/registro/cobertura.model';
import { CrearUsuarioRequest } from '../models/usuarios/crear-usuario-request.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4000/api';

  obtenerUsuarioCompleto(id: number): Observable<UsuarioCompleto | null> {
    return this.http.get<ApiResponse<UsuarioCompleto[]>>(`${this.apiUrl}/obtenerUsuario/${id}`).pipe(
      map(res => {
        if (res.codigo === 200) {
          return res.payload[0];
        }
        return null;
      })
    );
  }

  getAllUsuariosCompleto(): Observable<UsuarioCompleto[]> {
    return this.http.get<ApiResponse<UsuarioCompleto[]>>(`${this.apiUrl}/obtenerUsuarios`).pipe(
      map(res => {
        if (res.codigo === 200) {
          return res.payload;
        }
        return [];
      })
    );
  }

  obtenerCoberturas(): Observable<Cobertura[]> {
    return this.http.get<ApiResponse<Cobertura[]>>(`${this.apiUrl}/obtenerCoberturas`).pipe(
      map(res => res.codigo === 200 ? res.payload : [])
    );
  }

  crearUsuario(usuario: CrearUsuarioRequest): Observable<ApiResponse<{ id_usuario: number }>> {
    return this.http.post<ApiResponse<{ id_usuario: number }>>(`${this.apiUrl}/crearUsuario`, usuario);
  }

  actualizarUsuario(id: number, usuario: Partial<UsuarioCompleto>) {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/actualizarUsuario/${id}`, usuario);
  }
}
