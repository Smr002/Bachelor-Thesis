import { ProblemRepository } from "./problemRepository";
import { Difficulty, Problem } from "@prisma/client";

export class ProblemService {
  constructor(private readonly repo = new ProblemRepository()) {}

  async getAllProblems(): Promise<Problem[]> {
    try {
      return await this.repo.findAll();
    } catch (error) {
      console.error("Error fetching all problems:", error);
      throw new Error("Failed to fetch all problems");
    }
  }

  async getProblemById(id: number) {
    try {
      return await this.repo.findById(id);
    } catch (error) {
      console.error(`Error fetching problem with ID ${id}:`, error);
      throw new Error(`Failed to fetch problem with ID ${id}`);
    }
  }

  async createProblem(data: {
    title: string;
    description: string;
    difficulty: Difficulty;
    starterCode: string;
    constraints: string[];
    createdById: number;
    examples: {
      input: string;
      output: string;
      explanation?: string;
    }[];
  }): Promise<Problem> {
    try {
      if (!data.createdById) {
        throw new Error("User ID is required to create a problem");
      }

      return await this.repo.create(data);
    } catch (error) {
      console.error("Error creating a new problem:", error);
      throw new Error("Failed to create a new problem");
    }
  }

  async updateProblem(
    id: number,
    data: {
      title: string;
      description: string;
      difficulty: Difficulty;
      starterCode: string;
      constraints: string[];
      createdById: number;
      examples: {
        input: string;
        output: string;
        explanation?: string;
      }[];
    }
  ): Promise<Problem> {
    try {
      return await this.repo.update(id, data);
    } catch (error) {
      console.error(`Error updating problem with ID ${id}:`, error);
      throw new Error(`Failed to update problem with ID ${id}`);
    }
  }

  async deleteProblem(id: number): Promise<Problem> {
    try {
      return await this.repo.delete(id);
    } catch (error) {
      console.error(`Error deleting problem with ID ${id}:`, error);
      throw new Error(`Failed to delete problem with ID ${id}`);
    }
  }
}

export const problemService = new ProblemService();
