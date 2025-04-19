import { quizRepository } from "./quizRepository";

export class QuizService {
  async createQuiz(title: string, createdById: number, questions: any[]) {
    return await quizRepository.create(title, createdById, questions);
  }

  async getAllQuizzes() {
    return await quizRepository.findAll();
  }

  async getQuizById(id: number) {
    return await quizRepository.findById(id);
  }

  async updateQuiz(id: number, data: any) {
    return await quizRepository.update(id, data);
  }

  async deleteQuiz(id: number) {
    await quizRepository.delete(id);
  }
  async submitQuiz(userId: number, quizId: number, submissions: any[]) {
    return await quizRepository.submit(userId, quizId, submissions);
  }
}

export const quizService = new QuizService();
