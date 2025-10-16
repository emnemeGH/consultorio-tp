import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Cobertura } from 'src/app/models/registro/cobertura.model';
import { CrearUsuarioRequest } from 'src/app/models/usuarios/crear-usuario-request.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {
  crearForm: FormGroup | null = null;
  roles: string[] = ['Operador', 'Medico', 'Administrador'];
  coberturas: Cobertura[] = [];

  private fb = inject(FormBuilder);
  private _usuarioService = inject(UsuarioService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit(): void {
    this.crearForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      password: ['', Validators.required],
      rol: ['', Validators.required],
      id_cobertura: ['', Validators.required]
    });

    this.cargarCoberturas();

  }

  cargarCoberturas() {
    this._usuarioService.obtenerCoberturas().subscribe({
      next: (res) => this.coberturas = res,
      error: (err) => console.error('Error al obtener coberturas:', err)
    });
  }

  crearUsuario() {
    if (!this.crearForm || this.crearForm.invalid) return;

    const usuario: CrearUsuarioRequest = this.crearForm.value

    const fechaSeleccionada: Date = this.crearForm.get('fecha_nacimiento')?.value;
    if (fechaSeleccionada) {
      usuario.fecha_nacimiento = fechaSeleccionada.toISOString().split('T')[0];
    }

    this._usuarioService.crearUsuario(usuario).subscribe({
      next: (res) => {
        if (res.codigo === 200) {
          this._snackBar.open('Usuario creado con éxito', 'Aceptar', {
            duration: 0,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          
          this.router.navigate(['/admin/usuarios']);
        } else {
          console.error('Error al crear usuario:', res.mensaje);
        }
      },
      error: (err) => console.error('Error en la petición:', err)
    });
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }
}
