import { commentRepo } from "./commentRepository";

export class CommentService {
  async createComment(content: string, userId: number, problemId: number) {
    return commentRepo.create({ content, userId, problemId });
  }

  async getCommentsByProblem(problemId: number) {
    return commentRepo.findByProblemId(problemId);
  }

  async likeComment(commentId: number) {
    return commentRepo.incrementLike(commentId);
  }

  async unlikeComment(commentId: number) {
    return commentRepo.decrementLike(commentId);
  }
}

export const commentService = new CommentService();
