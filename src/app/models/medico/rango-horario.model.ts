export interface RangoHorario {
  id?: number;
  horaEntrada: string;
  horaSalida: string;
}

// Payload de envío (lo que el frontend arma para guardar)
export interface AgendaPayload {
  fecha: string; // 'YYYY-MM-DD'
  rangos: RangoHorario[];
}