import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Cobertura } from 'src/app/models/registro/cobertura.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-admin-coberturas',
  templateUrl: './admin-coberturas.component.html',
  styleUrls: ['./admin-coberturas.component.css']
})
export class AdminCoberturasComponent implements OnInit {
  coberturas: Cobertura[] = [];
  coberturaForm: FormGroup;
  editando: boolean = false;
  coberturaEditando: Cobertura | null = null;
  coberturaOriginal: string = ""

  private fb = inject(FormBuilder);
  private _usuarioService = inject(UsuarioService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);

  constructor() {
    this.coberturaForm = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCoberturas();
  }

  cargarCoberturas() {
    this._usuarioService.obtenerCoberturas().subscribe({
      next: (res) => this.coberturas = res,
      error: (err) => console.error('Error al cargar coberturas', err)
    });
  }

  guardarCobertura() {
    if (this.coberturaForm.invalid) return;

    const nombre = this.coberturaForm.value.nombre;

    if (this.editando && this.coberturaEditando) {
      this._usuarioService.modificarCobertura({ id: this.coberturaEditando.id, nombre }).subscribe({
        next: (res) => {
          if (res.codigo === 200) {
            this._snackBar.open('Cobertura modificada', 'Aceptar', { duration: 3000 });
            this.reiniciarForm();
            this.cargarCoberturas();
            this.coberturaForm.get('nombre')?.clearValidators();
            this.coberturaForm.get('nombre')?.updateValueAndValidity();
          } else {
            this._snackBar.open(res.mensaje, 'Aceptar', { duration: 3000 });
          }
        }
      });
    } else {
      this._usuarioService.crearCobertura(nombre).subscribe({
        next: (res) => {
          if (res.codigo === 200) {
            this._snackBar.open('Cobertura creada', 'Aceptar', { duration: 3000 });
            this.reiniciarForm();
            this.cargarCoberturas();
          } else {
            this._snackBar.open(res.mensaje, 'Aceptar', { duration: 3000 });
          }
        }
      });
    }
  }

  editarCobertura(cobertura: Cobertura) {
    this.editando = true;
    this.coberturaEditando = cobertura;
    this.coberturaForm.setValue({ nombre: cobertura.nombre });
    this.coberturaOriginal = this.coberturaEditando.nombre
  }

  eliminarCobertura(cobertura: Cobertura) {
    this._usuarioService.eliminarCobertura(cobertura.id).subscribe({
      next: (res) => {
        if (res.codigo === 200) {
          this._snackBar.open('Cobertura eliminada', 'Aceptar', { duration: 3000 });
          this.cargarCoberturas();
        } else {
          this._snackBar.open(res.mensaje, 'Aceptar', { duration: 3000 });
        }
      }
    });
  }

  reiniciarForm() {
    this.coberturaForm.reset();
    this.editando = false;
    this.coberturaEditando = null;
  }

  cancelar() {
    this.router.navigate(['/admin']);
  }
}
