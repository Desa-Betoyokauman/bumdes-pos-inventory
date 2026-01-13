export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'kasir';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface User {
  id: number;
  username: string;
  name: string;
  role: 'admin' | 'kasir';
  created_at: string;
  updated_at: string;
}