import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Cobertura } from 'src/app/models/registro/cobertura.model';
import { UsuarioCompleto } from 'src/app/models/usuarios/response-get-usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-mis-datos',
  templateUrl: './mis-datos.component.html',
  styleUrls: ['./mis-datos.component.css']
})
export class MisDatosComponent implements OnInit {
  actualizarForm: FormGroup | null = null;
  usuario: UsuarioCompleto | null = null;
  coberturas: Cobertura[] = [];

  private fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _usuarioService = inject(UsuarioService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    const usuarioLogueado = this._authService.obtenerUsuario();
    if (!usuarioLogueado?.id) return;

    this._usuarioService.obtenerUsuarioCompleto(usuarioLogueado.id).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuario = usuario;
          this.crearFormulario(usuario);
        }
      },
      error: (err) => console.error('Error al traer usuario', err)
    });

    this.cargarCoberturas();
  }

  crearFormulario(usuario: UsuarioCompleto) {
    console.log(usuario.fecha_nacimiento)
    const fecha_formateada = usuario.fecha_nacimiento.split('T')[0];

    this.actualizarForm = this.fb.group({
      nombre: [{ value: usuario.nombre, disabled: true }],
      apellido: [{ value: usuario.apellido, disabled: true }],
      dni: [{ value: usuario.dni, disabled: true }],
      fecha_nacimiento: [{ value: fecha_formateada, disabled: true }],
      email: [usuario.email, [Validators.required]],
      telefono: [usuario.telefono, Validators.required],
      password: [usuario.password, Validators.required],
      id_cobertura: [usuario.id_cobertura, Validators.required]
    });
  }

  guardarCambios() {
    if (this.actualizarForm?.invalid || !this.actualizarForm || !this.usuario) return;

    this._usuarioService.actualizarUsuario(this.usuario.id, this.actualizarForm.value).subscribe({
      next: (res) => {
        if (res.codigo === 200) {
          const snack = this._snackBar.open('Cambios guardados con éxito', 'Aceptar', {
            duration: 0,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          snack.onAction().subscribe(() => {
            this._snackBar.dismiss();
            this.router.navigate(['/paciente']);
          });
        } else {
          console.error('Error al actualizar usuario:', res.mensaje);
        }
      },
      error: (err) => {
        console.error('Error en la petición:', err);
      }
    });
  }

  cargarCoberturas() {
    this._usuarioService.obtenerCoberturas().subscribe({
      next: (res) => this.coberturas = res,
      error: (err) => console.error('Error al obtener coberturas:', err)
    });
  }

  cancelar() {
    this.router.navigate(['/paciente']);
  }
}
