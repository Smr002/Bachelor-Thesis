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

  async getLeaderboard(
    limit: number = 10
  ): Promise<{ userId: number; username: string; problemsSolved: number }[]> {
    const leaderboardData = await prisma.submission.groupBy({
      by: ["userId"],
      where: {
        isCorrect: true,
      },
      _count: {
        problemId: true,
      },
    });

    const leaderboardWithDetails = await Promise.all(
      leaderboardData.map(async (entry) => {
        const uniqueProblems = await prisma.submission.findMany({
          where: {
            userId: entry.userId,
            isCorrect: true,
          },
          distinct: ["problemId"],
          select: {
            problemId: true,
          },
        });

        const earliestSubmission = await prisma.submission.findFirst({
          where: {
            userId: entry.userId,
            isCorrect: true,
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            createdAt: true,
          },
        });

        return {
          userId: entry.userId,
          problemsSolved: uniqueProblems.length,
          earliestSubmission: earliestSubmission?.createdAt || new Date(),
        };
      })
    );

    const sortedLeaderboard = leaderboardWithDetails
      .sort((a, b) => {
        if (b.problemsSolved !== a.problemsSolved) {
          return b.problemsSolved - a.problemsSolved;
        }
        return a.earliestSubmission.getTime() - b.earliestSubmission.getTime();
      })
      .slice(0, limit);

    const leaderboardWithUsers = await Promise.all(
      sortedLeaderboard.map(async (entry) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: { name: true },
        });
        return {
          userId: entry.userId,
          username: user?.name || `User ${entry.userId}`,
          problemsSolved: entry.problemsSolved,
        };
      })
    );

    return leaderboardWithUsers;
  },
};

export const submissionRepository = SubmissionRepository;
