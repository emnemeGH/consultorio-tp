import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';
import { UsuarioCompleto } from '../models/usuarios/response-get-usuario.model';
import { ApiResponse } from '../models/apiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:4000/api/obtenerUsuario';

  obtenerUsuarioCompleto(id: number): Observable<UsuarioCompleto | null> {
    const token = this.authService.obtenerToken() || '';

    return this.http.get<ApiResponse<UsuarioCompleto[]>>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        if (res.codigo === 200) {
          return res.payload[0];
        }
        return null;
      })
    );
  }
}
