export interface RangoHorario {
  id?: number;
  fecha?: string; // 'YYYY-MM-DD'
  horaEntrada: string;
  horaSalida: string;
}

export interface AgendaPayload {
  id_medico: number;
  id_especialidad: number;
  fecha: string; // 'YYYY-MM-DD'
  rangos: RangoHorario[];
}