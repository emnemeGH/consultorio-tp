import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-turno-confirmado-dialog',
  templateUrl: './turno-confirmado-dialog.component.html',
  styleUrls: ['./turno-confirmado-dialog.component.css']
})
export class TurnoConfirmadoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<TurnoConfirmadoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nombreEspecialista: string; fecha: string; hora: string }
  ) {}

  cerrar() {
    this.dialogRef.close();
  }
}
