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
    const results = await codeService.execute(userId, problemId, code);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Error 500" });
  }
};
