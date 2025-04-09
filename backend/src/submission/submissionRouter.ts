import { Router } from "express";
import { submissionController } from "./submissionController";
import { authenticateJWT } from "../middleware/auth/JWT/authMiddleware";

const router = Router();

router.use(authenticateJWT);

router.post("/", async (req, res) => {
  try {
    await submissionController.create(req, res);
  } catch (err) {
    res.status(500).json({ error: "Failed to create submission." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await submissionController.getById(req, res);
  } catch (err) {
    res.status(400).json({ error: "Invalid submission ID." });
  }
});

router.get("/user/:userId/problem/:problemId", async (req, res) => {
  try {
    await submissionController.getByUserAndProblem(req, res);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submissions." });
  }
});

router.get("/count/:problemId", async (req, res) => {
  try {
    await submissionController.countSubmissionsForProblem(req, res);
  } catch (err) {
    res.status(500).json({ error: "Failed to count submissions." });
  }
});

router.get("/recent", async (req, res) => {
  try {
    await submissionController.getRecentSubmissions(req, res);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recent submissions." });
  }
});

export default router;
