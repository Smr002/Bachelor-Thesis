import { Request, Response } from "express";
import { submissionService } from "./submissionService";

export class SubmissionController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { problemId, code, results, isCorrect } = req.body;
      if (!problemId || !code || !results || isCorrect === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const submission = await submissionService.createSubmission({
        userId,
        problemId,
        code,
        results,
        isCorrect,
      });
      res.status(201).json(submission);
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(500).json({ error: "Failed to create submission" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }

      const submission = await submissionService.getSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error(
        `Error fetching submission with ID ${req.params.id}:`,
        error
      );
      res.status(500).json({ error: "Failed to fetch submission" });
    }
  }

  async getByUserAndProblem(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const problemId = Number(req.params.problemId);
      const limit = req.query.limit ? Number(req.query.limit) : 20;

      if (isNaN(userId) || isNaN(problemId) || isNaN(limit)) {
        return res.status(400).json({ error: "Invalid parameters" });
      }

      const submissions =
        await submissionService.getSubmissionsByUserAndProblem(
          userId,
          problemId,
          limit
        );
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  }

  async countSubmissionsForProblem(req: Request, res: Response) {
    try {
      const problemId = Number(req.params.problemId);
      if (isNaN(problemId)) {
        return res.status(400).json({ error: "Invalid problem ID" });
      }

      const count = await submissionService.countSubmissionsForProblem(
        problemId
      );
      res.json({ count });
    } catch (error) {
      console.error("Error counting submissions:", error);
      res.status(500).json({ error: "Failed to count submissions" });
    }
  }

  async getRecentSubmissions(req: Request, res: Response) {
    try {
      const days = req.query.days ? Number(req.query.days) : 7;
      const limit = req.query.limit ? Number(req.query.limit) : 50;

      if (isNaN(days) || isNaN(limit)) {
        return res.status(400).json({ error: "Invalid parameters" });
      }

      const submissions = await submissionService.getRecentSubmissions(
        days,
        limit
      );
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching recent submissions:", error);
      res.status(500).json({ error: "Failed to fetch recent submissions" });
    }
  }
}

export const submissionController = new SubmissionController();
