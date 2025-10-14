import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginRequest } from '../models/log-in/login-request.model';
import { LoginResponse } from '../models/log-in/login-response.model';
import { ResponseUsuario } from '../models/log-in/response-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:4000/api/login';

  private http = inject(HttpClient)

  private usuarioSubject = new BehaviorSubject<ResponseUsuario | null>(this.obtenerUsuario());
  public usuario$ = this.usuarioSubject.asObservable();

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, data);
  }

  // localStorage solo guarda strings, si no lo ponemos devolveria [object Object]
  guardarSesion(token: string, usuario: ResponseUsuario): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioSubject.next(usuario);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerUsuario(): ResponseUsuario | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  estaLogueado(): boolean {
    return this.obtenerToken() !== null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }
}
