import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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

  aceptar() {
    this.dialogRef.close();
  }

  cancelar() {
    this.dialogRef.close();
  }

// get es la palabra clave de TypeScript para definir un accesor (getter) en una clase.
// No es un tipo ni una función normal: define una propiedad calculada (se calcula cada vez que la accedés)
// que se accede sin paréntesis, como si fuera un campo público.
  get usuario() {
    return this.formularioLogin.get('usuario');
  }

  get password() {
    return this.formularioLogin.get('password');
  }
}
