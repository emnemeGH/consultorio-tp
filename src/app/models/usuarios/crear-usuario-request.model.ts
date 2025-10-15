export interface CrearUsuarioRequest {
  apellido: string;
  nombre: string;
  fecha_nacimiento: string;
  password: string;
  rol: 'paciente';
  email: string;
  telefono: string;
  dni: string;
  id_cobertura: number;
}