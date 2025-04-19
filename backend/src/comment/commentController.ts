import { Request, Response } from "express";
import { commentService } from "./commentService";

export class CommentController {
  async create(req: Request, res: Response) {
    const { content, problemId, userId } = req.body;

    if (!content || !problemId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const comment = await commentService.createComment(
      content,
      userId,
      problemId
    );
    res.status(201).json(comment);
  }

  async getByProblem(req: Request, res: Response) {
    const problemId = parseInt(req.params.problemId);

    if (isNaN(problemId)) {
      return res.status(400).json({ error: "Invalid problem ID" });
    }

    const comments = await commentService.getCommentsByProblem(problemId);
    res.json(comments);
  }

  async like(req: Request, res: Response) {
    const commentId = parseInt(req.params.commentId);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const updated = await commentService.likeComment(commentId);
    res.status(200).json(updated);
  }

  async dislike(req: Request, res: Response) {
    const commentId = parseInt(req.params.commentId);
    if (isNaN(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    try {
      const updated = await commentService.unlikeComment(commentId);
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to like comment" });
    }
  }
}

export const controller = new CommentController();
