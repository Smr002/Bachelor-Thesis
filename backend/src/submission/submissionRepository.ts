import { PrismaClient, Submission } from "@prisma/client";
import { SubmissionResult } from "../types/submission";
const prisma = new PrismaClient();

export const SubmissionRepository = {
  async create(data: {
    userId: number;
    problemId: number;
    code: string;
    results: SubmissionResult[];
    isCorrect: boolean;
  }): Promise<Submission> {
    return prisma.submission.create({
      data: {
        code: data.code,
        status: data.isCorrect ? "accepted" : "rejected",
        isCorrect: data.isCorrect,
        output: JSON.stringify(data.results),
        user: { connect: { id: data.userId } },
        problem: { connect: { id: data.problemId } },
      },
    });
  },

  async getById(id: number): Promise<Submission | null> {
    return prisma.submission.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        problem: { select: { id: true, title: true } },
      },
    });
  },

  async getByUserAndProblem(
    userId: number,
    problemId: number,
    limit: number = 20
  ): Promise<Submission[]> {
    return prisma.submission.findMany({
      where: {
        userId,
        problemId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  },

  async getByUser(userId: number, limit: number = 20): Promise<Submission[]> {
    return prisma.submission.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  },

  async countSubmissions(problemId: number): Promise<number> {
    return prisma.submission.count({
      where: { problemId },
    });
  },

  async getRecentSubmissions(
    days: number = 7,
    limit: number = 50
  ): Promise<Submission[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return prisma.submission.findMany({
      where: {
        createdAt: { gte: date },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        user: { select: { id: true, name: true } },
        problem: { select: { id: true, title: true } },
      },
    });
  },
};

export const submissionRepository = SubmissionRepository;
