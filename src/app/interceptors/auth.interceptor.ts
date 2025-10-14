import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private _authService = inject(AuthService)
  private router = inject(Router)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this._authService.obtenerToken();

    let reqClone = req;
    if (token) {
      reqClone = req.clone({ setHeaders: { Authorization: `${token}` } });
    }

    return next.handle(reqClone).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this._authService.cerrarSesion();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
