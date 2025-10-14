import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { Turno } from 'src/app/models/medico/turno.model';

@Component({
  selector: 'app-turnos-programados',
  templateUrl: './turnos-programados.component.html',
  styleUrls: ['./turnos-programados.component.css']
})
export class TurnosProgramadosComponent implements OnInit {

  displayedColumns: string[] = ['hora', 'paciente', 'edad', 'cobertura', 'nota'];
  turnos: any[] = [];
  fechaSeleccionada: string = new Date().toISOString().split('T')[0];
  idMedico: number | null = null;

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const usuarioLogueado = this.authService.obtenerUsuario();

    if (usuarioLogueado && usuarioLogueado.rol === 'medico') {
      this.idMedico = usuarioLogueado.id;
      this.cargarTurnos();
    } else {
      console.error('El usuario no es un médico logueado o no se encontró el ID.');
      this.turnos = [];
    }
  }

  cargarTurnos(): void {
    const token = this.authService.obtenerToken();

    if (!this.idMedico || !token) {
      console.error('Falta ID de médico o Token de autenticación.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const fecha = new Date(this.fechaSeleccionada);
    const fechaFormateada = fecha.toISOString().split('T')[0];
    const body = { id_medico: this.idMedico, fecha: fechaFormateada };

    this.http
      .post<ApiResponse<Turno[]>>('http://localhost:4000/api/obtenerTurnosMedico', body, { headers })
      .subscribe({
        next: (res) => {
          if (res.codigo === 200 && res.payload.length > 0) {
            this.turnos = res.payload
              .map((t) => ({
                hora: t.hora,
                paciente: t.nombre_paciente,
                edad: this.calcularEdad(t.fecha_nacimiento),
                cobertura: t.cobertura,
                nota: t.nota
              }))
              .sort((a, b) => a.hora.localeCompare(b.hora)); // Ordenar por hora ascendente
          } else {
            this.turnos = [];
          }
        },
        error: (err) => console.error('Error al cargar turnos', err),
      });
  }

  calcularEdad(fechaNacimiento: string | null): number | string {
    if (!fechaNacimiento) return 'N/A';
    const nacimiento = new Date(fechaNacimiento);
    if (isNaN(nacimiento.getTime())) return 'Inválida';

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

    return edad;
  }
}
