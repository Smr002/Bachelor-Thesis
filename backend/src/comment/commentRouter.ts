import { Router } from "express";
import { controller } from "./commentController";
import { authenticateJWT } from "../middleware/auth/JWT/authMiddleware";

const router = Router();

router.use(authenticateJWT);

router.post("/", async (req, res) => {
  try {
    await controller.create(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to create comment." });
  }
});

router.get("/problem/:problemId", async (req, res) => {
  try {
    await controller.getByProblem(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch comments for problem." });
  }
});

router.post("/like/:commentId", async (req, res) => {
  try {
    await controller.like(req, res);
  } catch (err) {
    res
      .status(403)
      .json({ error: "Unauthorized or failed to delete comment." });
  }
});

router.get("/dislike/:commentId", async (req, res) => {
  try {
    await controller.dislike(req, res);
  } catch (err) {
    res
      .status(403)
      .json({ error: "Unauthorized or failed to delete comment." });
  }
});

export default router;
