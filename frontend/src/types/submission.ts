export interface SubmissionResult {
  input: string;
  expected: string;
  output: string;
  passed: boolean;
}

export interface Submission {
  id: number;
  userId: number;
  problemId: number;
  code: string;
  results: SubmissionResult[];
  isCorrect: boolean;
  createdAt: string;
}
