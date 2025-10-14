import { ResponseUsuario } from "../log-in/response-usuario.model";

export interface UsuarioCompleto extends ResponseUsuario{
    fecha_nacimiento: Date;
    password:         string;
    email:            string;
    telefono:         string;
    dni:              string;
    id_cobertura:     number;
    nombre_cobertura: string;
}