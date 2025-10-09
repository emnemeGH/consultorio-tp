import { Component, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ResponseUsuario } from './models/response-usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'consultorio-tp';
  public _authService = inject(AuthService)
  private router = inject(Router);

  usuario: ResponseUsuario | null = null;

  ngOnInit() {
    this.usuario = this._authService.obtenerUsuario();
    console.log(this.usuario)
  }

  logout() {
    this._authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}
