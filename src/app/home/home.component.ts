import { Component, inject } from '@angular/core';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { ResponseUsuario } from '../models/response-usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private dialog = inject(MatDialog)
  public _authService = inject(AuthService)
  private router = inject(Router);

  usuario: ResponseUsuario | null = null;

  ngOnInit() {
    this.usuario = this._authService.obtenerUsuario();
    console.log(this.usuario)
  }
  
  abrirLogin() {
    this.dialog.open(LoginDialogComponent, {
      width: '400px'
    });
  }

  logout() {
    this._authService.cerrarSesion();
    this.router.navigate(['/']); 
  }
}
