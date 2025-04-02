import { PrismaClient, Problem, Difficulty, Example } from "@prisma/client";

const prisma = new PrismaClient();

export class ProblemRepository {
  async findAll(): Promise<(Problem & { Example: Example[] })[]> {
    return prisma.problem.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        Example: true,
      },
    });
  }

  async findById(
    id: number
  ): Promise<(Problem & { Example: Example[] }) | null> {
    return prisma.problem.findFirst({
      where: {
        id: Number(id),
        isDeleted: false,
      },
      include: {
        Example: true,
      },
    });
  }

  async create(problemData: {
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
    return await prisma.problem.create({
      data: {
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        starterCode: problemData.starterCode,
        constraints: problemData.constraints,
        createdBy: {
          connect: { id: problemData.createdById },
        },
        Example: {
          create: problemData.examples.map((e) => ({
            input: e.input,
            output: e.output,
            explanation: e.explanation || "",
          })),
        },
      },
      include: {
        Example: true,
      },
    });
  }

  async update(
    id: number,
    data: {
      title: string;
      description: string;
      difficulty: Difficulty;
      starterCode: string;
      constraints: string[];
      createdById?: number; // Made optional
      examples: {
        input: string;
        output: string;
        explanation?: string;
      }[];
    }
  ): Promise<Problem> {
    return prisma.problem.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        starterCode: data.starterCode,
        constraints: data.constraints,
        createdBy: data.createdById
          ? {
              connect: { id: data.createdById },
            }
          : undefined, // Only connect if createdById is provided
        Example: {
          deleteMany: {}, // delete old examples
          create: data.examples.map((e) => ({
            input: e.input,
            output: e.output,
            explanation: e.explanation || "",
          })),
        },
      },
      include: {
        Example: true,
        createdBy: true,
      },
    });
  }

  async delete(id: number): Promise<Problem> {
    return prisma.problem.update({
      where: { id },
      data: {
        isDeleted: true, // Soft delete by setting isDeleted to true
      },
    });
  }

  async permanentDelete(id: number): Promise<Problem> {
    return prisma.problem.delete({
      where: { id },
    });
  }
}

export const problemRepository = new ProblemRepository();
