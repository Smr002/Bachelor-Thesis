import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class QuizRepository {
  async create(title: string, createdById: number, questions: any[]) {
    return await prisma.quiz.create({
      data: {
        title,
        createdById,
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation,
            code: q.code,
          })),
        },
      },
      include: {
        questions: {
          where: { deleted: false },
        },
      },
    });
  }

  async findAll() {
    return await prisma.quiz.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        questions: {
          where: { deleted: false },
        },
        createdBy: true,
      },
    });
  }

  async findById(id: number) {
    return await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          where: { deleted: false },
        },
      },
    });
  }

  async update(
    id: number,
    data: {
      title: string;
      description: string;
      createdById?: number;
      questions: {
        id: number;
        questionText: string;
        optionA: string;
        optionB: string;
        optionC: string;
        optionD: string;
        correctOption: string;
        explanation?: string;
        code?: string;
      }[];
    }
  ) {
    // Update quiz metadata
    await prisma.quiz.update({
      where: { id },
      data: {
        title: data.title,
        createdBy: data.createdById
          ? { connect: { id: data.createdById } }
          : undefined,
      },
    });

    // Soft delete questions removed from update payload
    const existingQuestions = await prisma.quizQuestion.findMany({
      where: { quizId: id, deleted: false },
      select: { id: true },
    });

    const existingIds = existingQuestions.map((q) => q.id);
    const updatedIds = data.questions.map((q) => q.id);
    const idsToSoftDelete = existingIds.filter(
      (id) => !updatedIds.includes(id)
    );

    if (idsToSoftDelete.length > 0) {
      await prisma.quizQuestion.updateMany({
        where: { id: { in: idsToSoftDelete } },
        data: { deleted: true },
      });
    }

    // Update remaining questions
    await Promise.all(
      data.questions.map((q) =>
        prisma.quizQuestion.update({
          where: { id: q.id },
          data: {
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            code: q.code,
            explanation: q.explanation || "",
            deleted: false, // In case it was soft deleted before and now reused
          },
        })
      )
    );

    return await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          where: { deleted: false },
        },
        createdBy: true,
      },
    });
  }

  async delete(id: number) {
    await prisma.quiz.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async submit(userId: number, quizId: number, submissions: any[]) {
    return await prisma.quizSubmission.createMany({
      data: submissions.map((submission: any) => ({
        userId,
        quizId,
        questionId: submission.questionId,
        selectedOption: submission.selectedOption,
        isCorrect: submission.selectedOption === submission.correctOption,
        answeredAt: new Date(),
      })),
    });
  }
}

export const quizRepository = new QuizRepository();
