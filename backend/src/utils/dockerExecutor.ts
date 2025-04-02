import { exec } from "child_process";
import { promisify } from "util";

export const executeInDocker = async (
  code: string,
  input: string,
  methodName: string = "nums"
): Promise<string> => {
  const execAsync = promisify(exec);

  // Convert code to base64
  const codeBase64 = Buffer.from(code).toString("base64");

  // Ensure input is properly formatted
  const cleanInput = input.trim();

  // Create Docker command with environment variables
  const dockerCommand = `docker run --rm \
    -e CODE="${codeBase64}" \
    -e METHOD="${methodName}" \
    -e INPUT='${cleanInput}' \
    my-java-runner-image`;

  try {
    console.log("Executing Docker command with input:", cleanInput);

    const { stdout, stderr } = await execAsync(dockerCommand);

    if (stderr) {
      console.error("Docker stderr:", stderr);
      return stderr;
    }
    return stdout;
  } catch (error) {
    console.error("Docker execution error:", error);
    if (error instanceof Error) {
      const execError = error as any;
      if (execError.stderr) {
        return execError.stderr;
      }
    }
    throw error;
  }
};
