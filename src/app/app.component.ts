import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ResponseUsuario } from './models/log-in/response-usuario.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'consultorio-tp';
  public _authService = inject(AuthService)
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  usuario: ResponseUsuario | null = null;
  private sub!: Subscription;

  ngOnInit() {
    this.sub = this._authService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
    });
  }

  logout() {
    this._authService.cerrarSesion();
    this._snackBar.open('Sesión Cerrada', 'OK', {
      duration: 3000
    });
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    // Desuscribirse a los observables es para mejorar el rendimiento de la pagina
    this.sub.unsubscribe();
  }
}
