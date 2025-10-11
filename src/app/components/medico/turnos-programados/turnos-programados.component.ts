import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service'; // 🟢 Importar AuthService

@Component({
  selector: 'app-turnos-programados',
  templateUrl: './turnos-programados.component.html',
  styleUrls: ['./turnos-programados.component.css']
})
export class TurnosProgramadosComponent implements OnInit {
  displayedColumns: string[] = ['hora', 'paciente', 'edad', 'nota', 'cobertura'];
  turnos: any[] = [];
  fechaSeleccionada: string = new Date().toISOString().split('T')[0];
  
  // 🟢 Lo obtenemos del usuario logueado
  idMedico: number | null = null; 

  // Inyectamos el AuthService y HttpClient
  private http = inject(HttpClient);
  private authService = inject(AuthService); // 🟢 Inyectar AuthService

  ngOnInit(): void {
    // 🟢 Obtener el ID del médico al iniciar el componente
    const usuarioLogueado = this.authService.obtenerUsuario();
    
    if (usuarioLogueado && usuarioLogueado.rol === 'medico') {
      this.idMedico = usuarioLogueado.id;
      this.cargarTurnos();
    } else {
      console.error("El usuario no es un médico logueado o no se encontró el ID.");
      this.turnos = [];
    }
  }

  // ... (calcularEdad permanece igual) ...

  cargarTurnos(): void {
    // 🟢 CLAVE: Necesitas enviar el token en el header (AuthService lo tiene)
    const token = this.authService.obtenerToken();

    if (!this.idMedico || !token) {
        console.error("Falta ID de médico o Token de autenticación.");
        return;
    }
    
    // 🟢 Crear los headers de autorización
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    const body = { id_medico: this.idMedico, fecha: this.fechaSeleccionada };
    
    this.http.post<any>('http://localhost:4000/api/obtenerTurnosMedico', body, { headers: headers }) // 🟢 Pasar los headers aquí
      .subscribe({
        next: res => {
          if (res.codigo === 200) {
            // ... (mapeo de datos permanece igual) ...
            this.turnos = res.payload.map((t: any) => ({
              hora: t.hora,
              paciente: t.nombre_paciente,
              edad: this.calcularEdad(t.fecha_nacimiento),
              nota: t.nota,
              cobertura: t.cobertura
            }));
          } else {
            this.turnos = [];
          }
        },
        error: err => console.error('Error al cargar turnos', err)
      });
  }
  
  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
    return edad;
  }
}
