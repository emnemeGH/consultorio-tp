import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { Especialidad } from 'src/app/models/especialidad/especialidad.model';
import { Router } from '@angular/router';
import { DialogCrearEspecialidadComponent } from './dialog-crear-especialidad/dialog-crear-especialidad.component';
import { DialogEditarEspecialidadComponent } from './dialog-editar-especialidad/dialog-editar-especialidad.component';

@Component({
  selector: 'app-admin-especialidades',
  templateUrl: './admin-especialidades.component.html',
  styleUrls: ['./admin-especialidades.component.css']
})
export class AdminEspecialidadesComponent implements OnInit {
  especialidades: Especialidad[] = [];

  private _especialidadService = inject(EspecialidadService);
  private _snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this._especialidadService.getEspecialidades().subscribe({
      next: (res) => (this.especialidades = res),
      error: (err) => console.error('Error al cargar especialidades', err)
    });
  }

  abrirDialogCrear() {
    const dialogRef = this.dialog.open(DialogCrearEspecialidadComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarEspecialidades();
    });
  }

  abrirDialogEditar(especialidad: Especialidad) {
    const dialogRef = this.dialog.open(DialogEditarEspecialidadComponent, {
      width: '400px',
      data: especialidad
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.cargarEspecialidades();
    });
  }

  eliminarEspecialidad(especialidad: Especialidad) {
    this._especialidadService.eliminarEspecialidad(especialidad.id).subscribe({
      next: (res) => {
        this._snackBar.open(res.mensaje, 'Aceptar', { duration: 3000 });
        if (res.codigo === 200) this.cargarEspecialidades();
      }
    });
  }

  volver() {
    this.router.navigate(['/admin']);
  }
}
