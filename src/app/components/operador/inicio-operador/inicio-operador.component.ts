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
  // === Inyecciones ===
  private fb = inject(FormBuilder);
  private medicoService = inject(MedicoService);
  private dialog = inject(MatDialog);
  private usuarioService = inject(UsuarioService);

  // === Propiedades ===
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

    this.usuarioService.getAllUsuariosCompleto().subscribe({
      next: (usuarios: UsuarioCompleto[]) => {
        const medicos = usuarios.filter((u) => u.rol === 'medico');
        const agendasDelDia: AgendaMedico[] = [];

        medicos.forEach((medico) => {
          this.medicoService.getAgendaCompleta(medico.id).subscribe({
            next: (resAgenda: ApiResponse<Agenda[]>) => {
              const agendas = resAgenda.payload.filter(
                (a) =>
                  a.fecha &&
                  new Date(a.fecha).toISOString().split('T')[0] === fechaFormateada
              );

              if (agendas.length > 0) {
                this.medicoService.getEspecialidadesMedico(medico.id).subscribe({
                  next: (resEsp: ApiResponse<Especialidad[]>) => {
                    const especialidadMedico =
                      resEsp.payload.length > 0
                        ? resEsp.payload.map((e) => e.descripcion).join(', ')
                        : '—';

                    agendas.forEach((agenda) => {
                      agendasDelDia.push({
                        medico: `${medico.apellido}, ${medico.nombre}`,
                        especialidad: especialidadMedico,
                        horario: `${agenda.hora_entrada} - ${agenda.hora_salida}`,
                        id_medico: medico.id,
                        fecha: fechaFormateada,
                      });
                    });

                    this.dataSource.data = agendasDelDia;
                  },
                  error: (err) => console.error('Error al obtener especialidades', err),
                });
              }
            },
            error: (err) => console.error('Error al obtener agenda', err),
          });
        });
      },
      error: (err) => console.error('Error al obtener médicos', err),
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
    alert(`Editar agenda del Dr. ${medico.medico}`);
  }
}
