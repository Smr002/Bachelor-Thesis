export interface SubmissionResult {
  input: string;
  expected?: string;
  output?: string;
  passed?: boolean;
  error?: string;
  executionTime?: number;
}

export type SubmissionWithDetails = {
  id: number;
  createdAt: Date;
  status: string;
  isCorrect: boolean;
  language: string;
  output: string;
  user?: {
    id: number;
    name: string;
  };
  problem?: {
    id: number;
    title: string;
  };
};
