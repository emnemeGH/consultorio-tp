export interface Turno {
  id: number;
  hora: string;
  nota: string;
  
  // paciente
  nombrePaciente: string; 
  apellidoPaciente: string;
  edadPaciente: number; 
}