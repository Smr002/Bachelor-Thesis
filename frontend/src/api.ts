// src/api/api.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export async function createUser(user: CreateUserDto) {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, {
      name: user.name,
      email: user.email,
      passwordHash: user.password,
      role: user.role,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to create user");
    }
    throw new Error("Unexpected error");
  }
}

export async function loginUser(credentials: LoginDto): Promise<AuthResponse> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
    throw new Error("Unexpected error");
  }
}
