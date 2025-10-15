export interface TurnoPacienteCompleto {
    id_turno:        number;
    nota:            string;
    fecha:           Date;
    hora:            string;
    id_paciente:     number;
    id_cobertura:    number;
    nombre_medico:   string;
    apellido_medico: string;
    id_especialidad: number;
    especialidad:    string;
}