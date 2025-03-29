import { problemRepository } from "../problems/problemRepository";
import { executeInDocker } from "../utils/dockerExecutor";
import { submissionRepository } from "../problems/submissionRepository";

export const codeService = {
  async execute(userId: number, problemId: number, code: string) {
    const problem = await problemRepository.getById(problemId);
    if (!problem) throw new Error("Problem not found");

    const results = [];

    for (const testCase of problem.TestCase) {
      try {
        const rawOutput = await executeInDocker(code, testCase.input);

        // Remove any control characters (ASCII 0-31)
        const cleanOutput = rawOutput
          .toString()
          .replace(/[\x00-\x1F]+/g, "")
          .trim();

        let parsedResult: string | null = null;
        try {
          const parsed = JSON.parse(cleanOutput);
          parsedResult =
            typeof parsed.result === "string" ? parsed.result : null;
        } catch (err) {
          parsedResult = null;
        }

        console.log(cleanOutput);

        results.push({
          input: testCase.input,
          expected: testCase.expected,
          output: parsedResult ?? cleanOutput,
          passed:
            (parsedResult ?? cleanOutput).trim() === testCase.expected.trim(),
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          error: (error as Error).message ?? "Execution error",
        });
      }
    }

    await submissionRepository.create({
      userId,
      problemId,
      code,
      results: results,
      isCorrect: results.every((r) => r.passed),
    });

    return results;
  },
};
