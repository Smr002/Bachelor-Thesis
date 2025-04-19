export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  problemId: number;
  user?: {
    id: number;
    name: string;
  };
}

export interface CreateCommentDto {
  content: string;
  problemId: number;
}
