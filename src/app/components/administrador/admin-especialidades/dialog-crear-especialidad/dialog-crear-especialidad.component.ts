import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-dialog-crear-especialidad',
  templateUrl: './dialog-crear-especialidad.component.html',
  styleUrls: ['./dialog-crear-especialidad.component.css']
})
export class DialogCrearEspecialidadComponent {
  form: FormGroup;

  private fb = inject(FormBuilder);
  private _especialidadService = inject(EspecialidadService);
  private _snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DialogCrearEspecialidadComponent>);

  constructor() {
    this.form = this.fb.group({
      nombre: ['', Validators.required]
    });
  }

  crearEspecialidad() {
    if (this.form.invalid) return;

    const descripcion = this.form.value.nombre;

    this._especialidadService.crearEspecialidad(descripcion).subscribe({
      next: res => {
        this._snackBar.open(res.mensaje, 'Cerrar', { duration: 3000 });
        if (res.codigo === 200) this.dialogRef.close(true);
      },
      error: () => {
        this._snackBar.open('Error al crear la especialidad', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
