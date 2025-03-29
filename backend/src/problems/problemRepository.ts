import { PrismaClient, Problem, Difficulty, TestCase } from "@prisma/client";

const prisma = new PrismaClient();

export const problemRepository = {
  async getById(
    id: number
  ): Promise<(Problem & { TestCase: TestCase[] }) | null> {
    return prisma.problem.findUnique({
      where: { id },
      include: { TestCase: true },
    });
  },

  async create(problemData: {
    title: string;
    description: string;
    difficulty: Difficulty;
    createdById: number;
  }): Promise<Problem> {
    return prisma.problem.create({ data: problemData });
  },
};
