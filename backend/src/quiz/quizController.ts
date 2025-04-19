import { Request, Response } from "express";
import { quizService } from "./quizService";

export class QuizController {
  async createQuiz(req: Request, res: Response) {
    const { title, createdById, questions } = req.body;
    const quiz = await quizService.createQuiz(title, createdById, questions);
    res.json(quiz);
  }

  async getAllQuizzes(req: Request, res: Response) {
    const quizzes = await quizService.getAllQuizzes();
    res.json(quizzes);
  }

  async getQuizById(req: Request, res: Response) {
    const quiz = await quizService.getQuizById(parseInt(req.params.id));
    res.json(quiz);
  }

  async updateQuiz(req: Request, res: Response) {
    const updatedQuiz = await quizService.updateQuiz(
      parseInt(req.params.id),
      req.body
    );
    res.json(updatedQuiz);
  }

  async deleteQuiz(req: Request, res: Response) {
    await quizService.deleteQuiz(parseInt(req.params.id));
    res.status(204).send();
  }
  async submitQuiz(req: Request, res: Response) {
    const { userId, quizId, submissions } = req.body;
    const result = await quizService.submitQuiz(userId, quizId, submissions);
    res.json(result);
  }
}

export const quizController = new QuizController();
