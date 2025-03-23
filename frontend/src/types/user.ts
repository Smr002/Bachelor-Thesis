export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: "student" | "professor";
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
