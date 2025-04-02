import { Request, Response } from "express";
import { codeService } from "../code/codeService";

export const executeCode = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { problemId, code } = req.body;
  const userId = req.user?.id;

  if (!problemId || !code || !userId) {
    res.status(400).json({ error: "userId, problemId, and code are required" });
    return;
  }

  try {
    // Convert problemId to number before passing to service
    const results = await codeService.execute(userId, Number(problemId), code);
    res.json(results);
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
