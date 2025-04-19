import { Router } from "express";
import { quizController } from "./quizController";
import { authenticateJWT } from "../middleware/auth/JWT/authMiddleware";

const router = Router();

router.use(authenticateJWT);

router.post("/", async (req, res) => {
  try {
    await quizController.createQuiz(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to create quiz." });
  }
});

router.get("/", async (req, res) => {
  try {
    await quizController.getAllQuizzes(req, res);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quizzes." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await quizController.getQuizById(req, res);
  } catch (err) {
    res.status(400).json({ error: "Invalid quiz ID." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await quizController.updateQuiz(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to update quiz." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await quizController.deleteQuiz(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete quiz." });
  }
});
router.post("/submit", async (req, res) => {
  try {
    await quizController.submitQuiz(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to submit quiz." });
  }
});

export default router;
