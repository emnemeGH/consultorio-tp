import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MedicoService } from 'src/app/services/medico.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ApiResponse } from 'src/app/models/apiResponse.model';
import { Agenda } from 'src/app/models/agenda/agenda.model';
import { Turno } from 'src/app/models/medico/turno.model';
import { UsuarioCompleto } from 'src/app/models/usuarios/response-get-usuario.model';
import { Especialidad } from 'src/app/models/especialidad/especialidad.model';
import { VerTurnosDialogComponent } from '../ver-turnos-dialog/ver-turnos-dialog.component';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { EditarAgendaComponent } from '../editar-agenda/editar-agenda.component';

interface AgendaMedico {
  medico: string;
  especialidad: string;
  horario: string;
  id_medico: number;
  fecha: string;
}

@Component({
  selector: 'app-inicio-operador',
  templateUrl: './inicio-operador.component.html',
  styleUrls: ['./inicio-operador.component.css'],
})
export class InicioOperadorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private medicoService = inject(MedicoService);
  private dialog = inject(MatDialog);
  private usuarioService = inject(UsuarioService);

  filtroFechaForm!: FormGroup;
  dataSource = new MatTableDataSource<AgendaMedico>([]);
  displayedColumns = ['medico', 'especialidad', 'horario', 'acciones'];

  ngOnInit(): void {
    const hoy = new Date();
    this.filtroFechaForm = this.fb.group({
      fecha: [hoy],
    });
    this.cargarAgendasDelDia();
  }

  cambiarFecha(): void {
    this.cargarAgendasDelDia();
  }

cargarAgendasDelDia(): void {
  const fechaSeleccionada: Date = this.filtroFechaForm.value.fecha;
  const fechaFormateada = new Date(fechaSeleccionada).toISOString().split('T')[0];

  // tabla vacia antes de cargar
  this.dataSource.data = [];

  this.usuarioService.getAllUsuariosCompleto().subscribe({
    next: (usuarios: UsuarioCompleto[]) => {
      const medicos = usuarios.filter((u) => u.rol === 'medico');

      if (medicos.length === 0) {
        this.dataSource.data = [];
        return;
      }

      const requests = medicos.map((medico) =>
        this.medicoService.getAgendaCompleta(medico.id).pipe(
          switchMap((resAgenda: ApiResponse<Agenda[]>) => {
            const agendas = resAgenda.payload.filter(
              (a) =>
                a.fecha &&
                new Date(a.fecha).toISOString().split('T')[0] === fechaFormateada
            );

            if (agendas.length === 0) return of([]);

            return this.medicoService.getEspecialidadesMedico(medico.id).pipe(
              map((resEsp: ApiResponse<Especialidad[]>) => {
                const especialidadMedico =
                  resEsp.payload.length > 0
                    ? resEsp.payload.map((e) => e.descripcion).join(', ')
                    : '—';

                return agendas.map((agenda) => ({
                  medico: `${medico.apellido}, ${medico.nombre}`,
                  especialidad: especialidadMedico,
                  horario: `${agenda.hora_entrada} - ${agenda.hora_salida}`,
                  id_medico: medico.id,
                  fecha: fechaFormateada,
                }));
              })
            );
          })
        )
      );

      forkJoin(requests).subscribe({
        next: (resultados) => {
          const agendasDelDia = resultados.flat();

          // Actualiza la tabla
          this.dataSource.data = agendasDelDia;
        },
        error: (err) => {
          console.error('Error al obtener agendas', err);
          this.dataSource.data = [];
        },
      });
    },
    error: (err) => {
      console.error('Error al obtener médicos', err);
      this.dataSource.data = [];
    },
  });
}


  verTurnos(medico: AgendaMedico): void {
    const { id_medico, fecha } = medico;

    this.medicoService.obtenerTurnosMedico(id_medico, fecha).subscribe({
      next: (res: ApiResponse<Turno[]>) => {
        this.dialog.open(VerTurnosDialogComponent, {
          width: '800px',
          data: {
            medico: medico.medico,
            fecha: fecha,
            turnos: res.payload || [],
          },
        });
      },
      error: (err) => console.error('Error al cargar turnos del médico:', err),
    });
  }

  editarAgenda(medico: AgendaMedico): void {
  this.dialog.open(EditarAgendaComponent, {
    width: '900px',
    maxHeight: '90vh',
    panelClass: 'editar-agenda-dialog-panel',
    autoFocus: false,
    data: {
      id_medico: medico.id_medico,
      nombre_medico: medico.medico,
      fecha: medico.fecha
    }
  }).afterClosed().subscribe((actualizado) => {
    if (actualizado) this.cargarAgendasDelDia();
  });
}


}
