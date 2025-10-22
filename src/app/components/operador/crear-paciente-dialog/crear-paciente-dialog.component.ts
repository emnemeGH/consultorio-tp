import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cobertura } from 'src/app/models/registro/cobertura.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-crear-paciente-dialog',
  templateUrl: './crear-paciente-dialog.component.html',
  styleUrls: ['./crear-paciente-dialog.component.css']
})
export class CrearPacienteDialogComponent {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);

  pacienteForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CrearPacienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { coberturas: Cobertura[] } // se las pasamos desde el dialog padre
  ) {
    this.pacienteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', [Validators.required]],
      email: ['', [Validators.email]],
      telefono: [''],
      fecha_nacimiento: ['', Validators.required],
      id_cobertura: [null, Validators.required],
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  guardarPaciente(): void {
    if (this.pacienteForm.invalid) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    const pacienteData = {
      ...this.pacienteForm.value,
      rol: 'paciente'
    };

    this.usuarioService.crearUsuario(pacienteData).subscribe({
      next: (res: any) => {
        if (res.codigo === 200) {
          alert('Paciente creado correctamente.');
          this.dialogRef.close(pacienteData); // devolvemos el paciente al padre
        } else {
          alert(`Error al crear paciente: ${res.mensaje || 'Error desconocido'}`);
        }
      },
      error: (err) => {
        console.error('Error al crear paciente:', err);
        alert('No se pudo crear el paciente.');
      }
    });
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
