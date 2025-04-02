export interface TestCaseResult {
  input: string;
  expected: string;
  output?: string;
  passed?: boolean;
  error?: string;
}

export interface ExecutionResponse {
  results: TestCaseResult[];
  isCorrect: boolean;
}
