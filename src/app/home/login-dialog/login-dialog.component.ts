import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest } from 'src/app/models/login-request.model';
import { LoginResponse } from 'src/app/models/login-response.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {

  formularioLogin = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  private dialogRef = inject(MatDialogRef<LoginDialogComponent>)
  private _authService = inject(AuthService)
  private _snackBar = inject(MatSnackBar);


  aceptar() {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    // Esto es para que estemos seguros de que se completo usuario y contraseña
    if (!this.usuario?.value?.trim() || !this.password?.value?.trim()) {
      console.log("El usuario o contraseña no se completó")
      return;
    }

    const data: LoginRequest = {
      usuario: this.usuario.value,
      password: this.password.value
    };

    this._authService.login(data).subscribe({
      next: (response: LoginResponse) => {
        if (response.codigo === 200 && response.jwt) {

          const usuario = response.payload?.[0];

          // Verifico que haya devuelto un usuario y que no sea null
          if (usuario) {
            this._authService.guardarSesion(response.jwt, usuario);

            this._snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          } else {
            console.error('La respuesta del backend no contiene la información del usuario');
            alert('Ocurrió un error al procesar la información del usuario');
          }

          this.dialogRef.close(true);
        } else {
          this._snackBar.open('Usuario o contraseña incorrectos', 'Cerrar', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        alert('Ocurrió un error al iniciar sesión');
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  get usuario() {
    return this.formularioLogin.get('usuario');
  }

  get password() {
    return this.formularioLogin.get('password');
  }
}
