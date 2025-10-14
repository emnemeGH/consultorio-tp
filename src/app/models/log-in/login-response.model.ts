import { ResponseUsuario } from "./response-usuario.model";

export interface LoginResponse {
    codigo: number;
    mensaje: string;
    payload?: ResponseUsuario[];
    jwt?: string;
}