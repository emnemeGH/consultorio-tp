import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Especialidad } from 'src/app/models/especialidad/especialidad.model';
import { EspecialidadService } from 'src/app/services/especialidad.service';

@Component({
  selector: 'app-dialog-editar-especialidad',
  templateUrl: './dialog-editar-especialidad.component.html',
  styleUrls: ['./dialog-editar-especialidad.component.css']
})
export class DialogEditarEspecialidadComponent {
  form: FormGroup;
  especialidad: Especialidad;
  especialidadOriginal: string = "";

  private fb = inject(FormBuilder);
  private _especialidadService = inject(EspecialidadService);
  private _snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<DialogEditarEspecialidadComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Especialidad) {
    this.especialidad = data;
    this.form = this.fb.group({
      nombre: [this.especialidad.descripcion, Validators.required]
    });

    this.especialidadOriginal = this.especialidad.descripcion
  }

  guardarCambios() {
    if (this.form.invalid) return;

    this.especialidad.descripcion = this.form.value.nombre;

    this._especialidadService.modificarEspecialidad(this.especialidad).subscribe({
      next: res => {
        this._snackBar.open(res.mensaje, 'Cerrar', { duration: 3000 });
        if (res.codigo === 200) this.dialogRef.close(true);
      },
      error: () => {
        this._snackBar.open('Error al modificar la especialidad', 'Cerrar', { duration: 3000 });
      }
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
