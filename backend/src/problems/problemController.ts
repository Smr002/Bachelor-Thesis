import { Request, Response } from "express";
import { problemService } from "./problemService";

export class ProblemController {
  async getAll(req: Request, res: Response) {
    try {
      const problems = await problemService.getAllProblems();
      res.json(problems);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch problems." });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const problem = await problemService.getProblemById(id);
      if (!problem)
        return res.status(404).json({ error: "Problem not found." });
      res.json(problem);
    } catch (err) {
      res.status(400).json({ error: "Invalid ID." });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const newProblem = await problemService.createProblem(req.body);
      res.status(201).json(newProblem);
    } catch (err) {
      console.log(err);
      res.status(400).json({ error: "Failed to create problem." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updatedProblem = await problemService.updateProblem(id, req.body);
      res.json(updatedProblem);
    } catch (err) {
      res.status(400).json({ error: "Failed to update problem." });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deletedProblem = await problemService.deleteProblem(id);
      res.json(deletedProblem);
    } catch (err) {
      res.status(400).json({ error: "Failed to delete problem." });
    }
  }
}

export const problemController = new ProblemController();
