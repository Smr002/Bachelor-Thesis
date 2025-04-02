import { problemRepository } from "../problems/problemRepository";
import { executeInDocker } from "../utils/dockerExecutor";
import { submissionRepository } from "../problems/submissionRepository";

// Helper function to normalize JSON strings
const normalizeJsonString = (str: string): string => {
  // Remove extra quotes if they exist
  const unquoted = str.replace(/^"|"$/g, "");
  try {
    const parsed = JSON.parse(unquoted);
    // Handle boolean values specifically
    if (typeof parsed === "boolean") {
      return parsed.toString();
    }
    return JSON.stringify(parsed);
  } catch {
    // If it's a string "true" or "false", clean it up
    const cleaned = unquoted.trim().toLowerCase();
    if (cleaned === "true" || cleaned === "false") {
      return cleaned;
    }
    return str.trim();
  }
};

export const codeService = {
  async execute(userId: number, problemId: number, code: string) {
    const problem = await problemRepository.findById(problemId);
    if (!problem) throw new Error("Problem not found");

    const results = [];

    for (const testCase of problem.Example) {
      try {
        // Clean up the input string - remove variable name if present
        const cleanInput = testCase.input.replace(
          /^[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/,
          ""
        );

        // Pass clean input to docker with the correct method name
        const rawOutput = await executeInDocker(code, cleanInput, "twoSum");

        // Remove any control characters (ASCII 0-31)
        const cleanOutput = rawOutput
          .toString()
          .replace(/[\x00-\x1F]+/g, "")
          .trim();

        let parsedResult: string | null = null;
        try {
          const parsed = JSON.parse(cleanOutput);
          if (typeof parsed.result === "boolean") {
            parsedResult = parsed.result.toString();
          } else if (parsed.result === "true" || parsed.result === "false") {
            parsedResult = parsed.result;
          } else if (parsed.result !== undefined) {
            parsedResult = JSON.stringify(parsed.result);
          }
        } catch (err) {
          // If cleanOutput is already a string like "true" or "false"
          if (cleanOutput === '"true"' || cleanOutput === '"false"') {
            parsedResult = cleanOutput.replace(/^"|"$/g, "");
          } else {
            parsedResult = null;
          }
        }

        const normalizedExpected = normalizeJsonString(testCase.output);
        const normalizedOutput = normalizeJsonString(
          parsedResult ?? cleanOutput
        );

        results.push({
          input: testCase.input,
          expected: testCase.output,
          output: parsedResult ?? cleanOutput,
          passed: normalizedExpected === normalizedOutput,
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
