import Docker from "dockerode";

const docker = new Docker();
const TIMEOUT = 10000;

export async function executeInDocker(
  code: string,
  input: string
): Promise<string> {
  const base64Code = Buffer.from(code).toString("base64");

  const container = await docker.createContainer({
    Image: "my-java-runner-image",
    Env: [`CODE=${base64Code}`, `INPUT=${input}`],
    HostConfig: {
      AutoRemove: true,
    },
  });

  const stream = await container.attach({
    stream: true,
    stdout: true,
    stderr: true,
  });

  await container.start();

  const timeout = setTimeout(async () => {
    try {
      await container.stop();
    } catch (_) {}
  }, TIMEOUT);

  let output = "";

  for await (const chunk of stream as AsyncIterable<Buffer>) {
    output += chunk.toString();
  }

  clearTimeout(timeout);

  return output.trim();
}
