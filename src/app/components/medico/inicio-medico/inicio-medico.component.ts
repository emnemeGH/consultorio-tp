import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service'; // 🟢 Importar AuthService

@Component({
  selector: 'app-inicio-medico',
  templateUrl: './inicio-medico.component.html',
  styleUrls: ['./inicio-medico.component.css']
})
export class InicioMedicoComponent implements OnInit {

  // 🟢 Inicializar como vacío, se llena en ngOnInit
  nombreMedico: string = 'Usuario'; 
  
  // Definición de las opciones de navegación (rutas hijas)
  navLinks = [
    { label: 'Gestionar Agenda', path: 'agenda' },
    { label: 'Turnos Programados', path: 'turnos' }
  ];

  // 🟢 Inyectar Router y AuthService
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.cargarDatosMedico();
  }

  cargarDatosMedico(): void {
    // 🟢 Obtener los datos del usuario logueado desde el servicio
    const usuario = this.authService.obtenerUsuario();

    if (usuario) {
        // Formatear el nombre para mostrar: "Dr/a. Nombre Apellido"
        this.nombreMedico = `Dr/a. ${usuario.nombre} ${usuario.apellido}`;
    }
  }

  cerrarSesion(): void {
    // 1. Limpiar el token/ID del Local Storage.
    this.authService.cerrarSesion();
    
    // 2. Notificar y navegar a la página principal (no logueada).
    alert('Sesión cerrada correctamente.');
    this.router.navigate(['/']); // Navega a la ruta base de la app
  }
}