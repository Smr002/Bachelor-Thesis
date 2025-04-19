import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CommentRepository {
  async create(commentData: {
    content: string;
    userId: number;
    problemId: number;
  }) {
    return prisma.comment.create({
      data: commentData,
    });
  }

  async findByProblemId(problemId: number) {
    return prisma.comment.findMany({
      where: { problemId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async incrementLike(commentId: number) {
    return prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  }


  async decrementLike(commentId: number) {
    return prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: {
          decrement: 1,
        },
      },
    });
  }
}

export const commentRepo = new CommentRepository();
