import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Cobertura } from 'src/app/models/registro/cobertura.model';
import { CrearUsuarioRequest } from 'src/app/models/usuarios/crear-usuario-request.model';
import { ApiResponse } from 'src/app/models/apiResponse.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  registroForm!: FormGroup;
  coberturas: Cobertura[] = [];

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      dni: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      password: ['', Validators.required],
      id_cobertura: [null, Validators.required]
    });

    this.cargarCoberturas();
  }

  public cargarCoberturas(): void {
    this.usuarioService.obtenerCoberturas().subscribe({
      next: (res) => this.coberturas = res,
      error: (err) => console.error('Error al obtener coberturas:', err)
    });
  }

  registrarPaciente(): void {
    if (this.registroForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const form = this.registroForm.value;

    const nuevoPaciente: CrearUsuarioRequest = {
      apellido: form.apellido,
      nombre: form.nombre,
      fecha_nacimiento: form.fecha_nacimiento,
      password: form.password,
      rol: 'paciente',
      email: form.email,
      telefono: form.telefono,
      dni: form.dni,
      id_cobertura: Number(form.id_cobertura)
    };

    this.usuarioService.crearUsuario(nuevoPaciente).subscribe({
      next: (res: ApiResponse<{ id_usuario: number }>) => {
        if (res.codigo === 200) {
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          this.router.navigate(['/']);
        } else {
          alert(res.mensaje);
        }
      }
    });
  }
}
