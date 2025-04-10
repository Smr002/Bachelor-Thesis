import axios from "axios";
import { CreateUserDto, LoginDto, AuthResponse } from "@/types/user";
import { ExecutionResponse } from "./types/execution";
import { Submission, SubmissionResult } from "./types/submission";

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

export const findProblemById = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/problems/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch problem");
  }

  return response.json();
};

export interface RunResponse {
  success: boolean;
  message?: string;
  testResults?: {
    input: string;
    expected: string;
    output: string;
    passed: boolean;
  }[];
  error?: string;
}

export const runCode = async (
  problemId: string,
  code: string,
  token: string
): Promise<RunResponse> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/problems/execute`,
      { problemId, code },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      testResults: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to run code");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createSubmission = async (
  submissionData: {
    userId: number;
    problemId: number;
    code: string;
    results: SubmissionResult[];
    isCorrect: boolean;
  },
  token: string
): Promise<Submission> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/submission`,
      submissionData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create submission"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getSubmissionById = async (
  id: number,
  token: string
): Promise<Submission> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/submissions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch submission"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getSubmissionsByUserAndProblem = async (
  userId: number,
  problemId: number,
  limit: number = 20,
  token: string
): Promise<Submission[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/submissions/user/${userId}/problem/${problemId}?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch submissions"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getSubmissionsByUser = async (
  userId: number,
  limit: number = 25,
  token: string
): Promise<Submission[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/submission/user/${userId}?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch submissions"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const countSubmissionsForProblem = async (
  problemId: number,
  token: string
): Promise<number> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/submissions/count/${problemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.count;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to count submissions"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getRecentSubmissions = async (
  days: number = 7,
  limit: number = 50,
  token: string
): Promise<Submission[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/submissions/recent?days=${days}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch recent submissions"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
