import { z } from "zod";
import { Difficulty } from "@prisma/client";

export const ProblemSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.nativeEnum(Difficulty),
  exampleInput: z.string().optional(),
  exampleOutput: z.string().optional(),
  createdAt: z.date().optional(),
  createdById: z.number().optional(),
});

export type Problem = z.infer<typeof ProblemSchema>;

export class ProblemModel {
  private data: Problem;

  constructor(raw: Partial<Problem>) {
    this.data = ProblemSchema.parse({
      ...raw,
      createdAt: raw.createdAt || new Date(),
    });
  }

  toObject(): Problem {
    return this.data;
  }
}
