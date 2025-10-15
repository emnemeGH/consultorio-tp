import { Component, inject, OnInit } from '@angular/core';
import { TurnoPacienteCompleto } from 'src/app/models/turno/turno-paciente-completo.model';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-mis-turnos',
  templateUrl: './mis-turnos.component.html',
  styleUrls: ['./mis-turnos.component.css']
})
export class MisTurnosComponent implements OnInit {

  turnos: TurnoPacienteCompleto[] = [];

  private _authService = inject(AuthService)
  private _turnoService = inject(TurnoService)

  ngOnInit() {
    this.obtenerTurnos()
  }

  obtenerTurnos() {
    const usuario = this._authService.obtenerUsuario();

    if (!usuario?.id) {
      console.warn('No hay usuario logueado.');
      return;
    }

    const idPaciente = usuario.id;

    this._turnoService.getTurnosPaciente(idPaciente).subscribe({
      next: (turnos) => {
        if (turnos) {
          if (turnos) {
            this.turnos = turnos.sort((a, b) => {
              const fechaA = new Date(`${a.fecha}T${a.hora}`);
              const fechaB = new Date(`${b.fecha}T${b.hora}`);
              return fechaA.getTime() - fechaB.getTime();
            });
          }
        } else {
          console.log('No se encontraron turnos para este paciente.');
        }
      },
      error: (err) => {
        console.error('Error al obtener los turnos:', err);
      }
    });
  }
}
