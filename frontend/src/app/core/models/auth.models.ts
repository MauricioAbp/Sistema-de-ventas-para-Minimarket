export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  idUsuario: number;
  nombre: string;
  apellido: string;
  username: string;
  rol: 'ADMIN' | 'CAJERO';
  token: string;
}
