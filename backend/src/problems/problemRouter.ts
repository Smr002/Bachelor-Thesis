import { Router } from "express";
import { executeCode } from "../code/codeController";
import { problemController } from "../problems/problemController";
import { authenticateJWT } from "../middleware/auth/JWT/authMiddleware";

const router = Router();

router.use(authenticateJWT);

router.post("/execute", async (req, res) => {
  try {
    await executeCode(req, res);
  } catch (err) {
    res.status(500).json({ error: "Failed to execute code." });
  }
});

router.get("/", async (req, res) => {
  try {
    await problemController.getAll(req, res);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch problems." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    await problemController.getById(req, res);
  } catch (err) {
    res.status(400).json({ error: "Invalid problem ID." });
  }
});

router.post("/", async (req, res) => {
  try {
    await problemController.create(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to create problem." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await problemController.update(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to update problem." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await problemController.delete(req, res);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete problem." });
  }
});

export default router;
