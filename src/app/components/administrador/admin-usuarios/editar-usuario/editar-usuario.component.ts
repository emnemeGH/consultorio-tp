import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Cobertura } from 'src/app/models/registro/cobertura.model';
import { UsuarioCompleto } from 'src/app/models/usuarios/response-get-usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  actualizarForm: FormGroup | null = null;
  usuario: UsuarioCompleto | null = null;
  coberturas: Cobertura[] = [];

  private fb = inject(FormBuilder);
  private _usuarioService = inject(UsuarioService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this._usuarioService.obtenerUsuarioCompleto(id).subscribe({
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
    const fecha_formateada = usuario.fecha_nacimiento.split('T')[0];

    this.actualizarForm = this.fb.group({
      nombre: [usuario.nombre, Validators.required],
      apellido: [usuario.apellido, Validators.required],
      dni: [usuario.dni, Validators.required],
      fecha_nacimiento: [fecha_formateada, Validators.required],
      email: [usuario.email, [Validators.required]],
      telefono: [usuario.telefono, Validators.required],
      password: [usuario.password, Validators.required],
      rol: [usuario.rol.toLowerCase(), Validators.required],
      id_cobertura: [usuario.id_cobertura, Validators.required]
    });
  }

  guardarCambios() {
    if (this.actualizarForm?.invalid || !this.actualizarForm || !this.usuario) return;

    this._usuarioService.actualizarUsuario(this.usuario.id, this.actualizarForm.value).subscribe({
      next: (res) => {
        if (res.codigo === 200) {
          this._snackBar.open('Usuario actualizado con éxito', 'Aceptar', {
            duration: 0,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });

          this.router.navigate(['/admin/usuarios']);
          
        } else {
          console.error('Error al actualizar usuario:', res.mensaje);
        }
      },
      error: (err) => console.error('Error en la petición:', err)
    });
  }

  cargarCoberturas() {
    this._usuarioService.obtenerCoberturas().subscribe({
      next: (res) => this.coberturas = res,
      error: (err) => console.error('Error al obtener coberturas:', err)
    });
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
}
