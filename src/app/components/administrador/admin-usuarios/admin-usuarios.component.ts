import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioCompleto } from 'src/app/models/usuarios/response-get-usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {

  usuarios: UsuarioCompleto[] = [];
  usuariosFiltrados: UsuarioCompleto[] = [];

  filtroNombre: string = '';
  filtroApellido: string = '';
  filtroRol: string = '';

  private _usuarioService = inject(UsuarioService)
  private router = inject(Router)

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this._usuarioService.getAllUsuariosCompleto().subscribe(res => {
      this.usuarios = res;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    // String.includes("") siempre devuelve true si la cadena que se busca está vacía.
    // Asi, si no ponemos nada en los filtros trae todo
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) &&
      u.apellido.toLowerCase().includes(this.filtroApellido.toLowerCase()) &&
      u.rol.toLowerCase().includes(this.filtroRol.toLowerCase())
    );
  }

  crearUsuario() {
    this.router.navigate(['/admin/usuarios/crear']);
  }

  editarUsuario(id: number) {
    this.router.navigate([`/admin/usuarios/editar/${id}`]);
  }

  volver() {
    this.router.navigate(['/admin']);
  }
}
