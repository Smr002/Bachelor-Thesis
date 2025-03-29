import { Request, Response, NextFunction } from "express";

export const validateExecution = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { problemId, code } = req.body;

  if (!problemId || !code) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (code.length > 10000) {
    return res.status(413).json({ error: "Code too long" });
  }

  next();
};
