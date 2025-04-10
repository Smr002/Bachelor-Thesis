import { Submission } from "@prisma/client";
import { SubmissionResult } from "../types/submission";
import { submissionRepository } from "./submissionRepository";

export class SubmissionService {
  async createSubmission(data: {
    userId: number;
    problemId: number;
    code: string;
    results: SubmissionResult[];
    isCorrect: boolean;
  }): Promise<Submission> {
    try {
      return await submissionRepository.create(data);
    } catch (error) {
      console.error("Error creating submission:", error);
      throw new Error("Failed to create submission");
    }
  }

  async getSubmissionById(id: number): Promise<Submission | null> {
    try {
      return await submissionRepository.getById(id);
    } catch (error) {
      console.error(`Error fetching submission with ID ${id}:`, error);
      throw new Error(`Failed to fetch submission with ID ${id}`);
    }
  }

  async getSubmissionsByUserAndProblem(
    userId: number,
    problemId: number,
    limit: number = 20
  ): Promise<Submission[]> {
    try {
      return await submissionRepository.getByUserAndProblem(
        userId,
        problemId,
        limit
      );
    } catch (error) {
      console.error(
        `Error fetching submissions for user ${userId} and problem ${problemId}:`,
        error
      );
      throw new Error("Failed to fetch submissions");
    }
  }

  async getSubmissionsByUser(
    userId: number,
    limit: number = 20
  ): Promise<Submission[]> {
    try {
      return await submissionRepository.getByUser(userId, limit);
    } catch (error) {
      console.error(`Error fetching submissions for user ${userId} :`, error);
      throw new Error("Failed to fetch submissions");
    }
  }

  async countSubmissionsForProblem(problemId: number): Promise<number> {
    try {
      return await submissionRepository.countSubmissions(problemId);
    } catch (error) {
      console.error(
        `Error counting submissions for problem ${problemId}:`,
        error
      );
      throw new Error("Failed to count submissions");
    }
  }

  async getRecentSubmissions(
    days: number = 7,
    limit: number = 50
  ): Promise<Submission[]> {
    try {
      return await submissionRepository.getRecentSubmissions(days, limit);
    } catch (error) {
      console.error("Error fetching recent submissions:", error);
      throw new Error("Failed to fetch recent submissions");
    }
  }

  async getLeaderboard(
    limit: number = 10
  ): Promise<{ userId: number; username: string; problemsSolved: number }[]> {
    try {
      return await submissionRepository.getLeaderboard(limit);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      throw new Error("Failed to fetch leaderboard");
    }
  }
}

export const submissionService = new SubmissionService();
