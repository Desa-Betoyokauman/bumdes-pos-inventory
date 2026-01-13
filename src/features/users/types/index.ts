export interface User {
  id: number;
  username: string;
  name: string;
  role: "admin" | "cashier";
  created_at: string;
  updated_at?: string;
}

export interface UserFormData {
  username: string;
  password: string;
  name: string;
  role: "admin" | "cashier";
}

export interface UpdateUserFormData {
  username?: string;
  name?: string;
  role?: "admin" | "cashier";
}

export interface ChangePasswordFormData {
  password: string;
}
