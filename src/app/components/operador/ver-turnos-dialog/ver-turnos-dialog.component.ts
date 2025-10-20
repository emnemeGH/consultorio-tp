import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TurnoPacienteCompleto } from 'src/app/models/turno/turno-paciente-completo.model';

interface DialogData {
  medico: string;
  fecha: string;
  turnos: TurnoPacienteCompleto[];
}

@Component({
  selector: 'app-ver-turnos-dialog',
  templateUrl: './ver-turnos-dialog.component.html',
  styleUrls: ['./ver-turnos-dialog.component.css']
})
export class VerTurnosDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialogRef: MatDialogRef<VerTurnosDialogComponent>
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
