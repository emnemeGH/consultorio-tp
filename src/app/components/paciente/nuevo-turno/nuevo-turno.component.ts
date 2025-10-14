import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit {
  turnoForm: FormGroup;

  especialidades = ['Cardiología', 'Dermatología', 'Pediatría', 'Clínica Médica'];
  profesionales = ['Dr. Pérez', 'Dra. Gómez', 'Dr. Fernández', 'Dra. Torres'];

  private _authService = inject(AuthService)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private _usuarioService = inject(UsuarioService)

  constructor() {

    this.turnoForm = this.fb.group({
      especialidad: ['', Validators.required],
      profesional: [{ value: '', disabled: true }, Validators.required],
      cobertura: [{ value: '', disabled: true }],
      fecha: [{ value: '', disabled: true }, Validators.required],
      hora: [{ value: '', disabled: true }, Validators.required],
      notas: [{ value: '', disabled: true }, Validators.required],
    });

  }

  ngOnInit(): void {
    const usuario = this._authService.obtenerUsuario();
    if (usuario) {
      this._usuarioService.obtenerUsuarioCompleto(usuario.id).subscribe(u => {
        if (u) {
          this.cobertura?.setValue(u.nombre_cobertura);
        }
      });
    }

    this.desactivarCamposSiguientes()
  }

  aceptar() {
    if (this.turnoForm.valid) {
      console.log('Datos del turno:', this.turnoForm.value);
      // Más adelante: abrir el popup de confirmación
    }
  }

  cancelar() {
    this.router.navigate(['/paciente']);
  }

  desactivarCamposSiguientes() {
    const campos = [this.especialidad, this.profesional, this.fecha, this.hora, this.notas];

    campos.forEach((campo, index) => {
      if (!campo) return;

      // valueChanges es un observable que emite un valor cada vez que el usuario cambia el campo.
      // val → el nuevo valor que ingresó el usuario.
      // Esto nos permite reaccionar automáticamente cuando el usuario selecciona o borra un valor.
      campo.valueChanges.subscribe(val => {
        if (val) {
          // habilita el siguiente campo si existe
          const siguiente = campos[index + 1];
          siguiente?.enable();
        } else {
          // si se borra, deshabilita todos los campos siguientes
          for (let i = index + 1; i < campos.length; i++) {
            campos[i]?.disable();
          }
        }
      });
    });
  }

  get especialidad() { return this.turnoForm.get('especialidad'); }
  get profesional() { return this.turnoForm.get('profesional'); }
  get cobertura() { return this.turnoForm.get('cobertura'); }
  get fecha() { return this.turnoForm.get('fecha'); }
  get hora() { return this.turnoForm.get('hora'); }
  get notas() { return this.turnoForm.get('notas'); }
}
