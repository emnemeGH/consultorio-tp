export interface ApiResponse<T> {
  codigo: number;
  mensaje: string;
  payload: T;
}
