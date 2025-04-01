import axios from "axios";
import { CreateUserDto, LoginDto, AuthResponse } from "@/types/user";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

export async function getUsers(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
    throw new Error("Unexpected error");
  }
}

export const createProblem = async (problemData, token: string) => {
  try {
    const { id, ...data } = problemData;
    const response = await axios.post(`${API_BASE_URL}/problems`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create problem"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export async function findAllProblem(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/problems`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
    throw new Error("Unexpected error");
  }
}

export const getProblem = async (id: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/problems/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch problem"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteProblem = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/problems/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete problem"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateProblem = async (
  problemData: { id: number; [key: string]: any },
  token: string
): Promise<void> => {
  try {
    const { id, ...data } = problemData;
    await axios.put(`${API_BASE_URL}/problems/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update problem"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
