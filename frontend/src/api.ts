import axios from "axios";
import { CreateUserDto, LoginDto, AuthResponse } from "@/types/user";
import { ExecutionResponse } from "./types/execution";
import { Submission, SubmissionResult } from "./types/submission";
import { CreateCommentDto, Comment } from "./types/comment";

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
    const response = await axios.get(`${API_BASE_URL}/submission/${id}`, {
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

export const getLeaderboard = async (
  limit: number = 10,
  token: string
): Promise<{ userId: number; username: string; problemsSolved: number }[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/submission/leaderboard/${limit}`,
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
        error.response?.data?.message || "Failed to fetch leaderboard"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createComment = async (
  comment: { content: string; problemId: number; userId: number },
  token: string
): Promise<Comment> => {
  return axios
    .post(`${API_BASE_URL}/comment`, comment, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const getCommentsByProblem = async (
  problemId: number,
  token: string
): Promise<Comment[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/comment/problem/${problemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch comments"
      );
    }
    throw new Error("Unexpected error while fetching comments");
  }
};

export const likeComment = async (commentId: number, token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/comment/like/${commentId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const dislikeComment = async (commentId: number, token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/comment/dislike/${commentId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const createQuiz = async (
  quizData: {
    title: string;
    createdById: number;
    questions: {
      questionText: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctOption: string;
      explanation?: string;
    }[];
  },
  token: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quiz`, quizData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to create quiz");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const getAllQuizzes = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quiz`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch quizzes"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
export const getQuizById = async (id: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quiz/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch quiz");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const updateQuiz = async (
  id: number,
  quizData: {
    title: string;
    createdById: number;
    questions: {
      questionText: string;
      optionA: string;
      optionB: string;
      optionC: string;
      optionD: string;
      correctOption: string;
      explanation?: string;
    }[];
  },
  token: string
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/quiz/${id}`, quizData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to update quiz");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const deleteQuiz = async (id: number, token: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/quiz/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to delete quiz");
    }
    throw new Error("An unexpected error occurred");
  }
};
export const submitQuiz = async (
  userId: number,
  quizId: number,
  submissions: {
    questionId: number;
    selectedOption: string;
    correctOption: string;
  }[],
  token: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/quiz/submit`,
      { userId, quizId, submissions },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to submit quiz");
    }
    throw new Error("An unexpected error occurred");
  }
};
