export interface Problem {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  constraints: string[];
  completed: boolean;
  starterCode: string;
}

export interface ProblemRequest {
  title: string;
  difficulty: string;
  description: string;
  testCases: Array<{ input: string; expectedOutput: string }>;
  constraints: string[];
  starterCode: string;
}
