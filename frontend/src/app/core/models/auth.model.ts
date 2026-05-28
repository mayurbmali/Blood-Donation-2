export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  id: number;
  token: string;
  name: string;
  role: 'ADMIN' | 'DONOR';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'DONOR';
  createdAt: string;
}
