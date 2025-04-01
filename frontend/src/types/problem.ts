export interface Problem {
  id?: number;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  starterCode: string;
  constraints: string[];
  completed?: boolean;
  createdById?: number;
  examples: {
    id?: number;
    input: string;
    output: string;
    explanation?: string;
  }[];
}

export interface ProblemRequest {
  title: string;
  difficulty: string;
  description: string;
  testCases: Array<{ input: string; expectedOutput: string }>;
  constraints: string[];
  starterCode: string;
}
