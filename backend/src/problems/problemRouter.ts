import { Router } from "express";
import { executeCode } from "../code/codeController";
import { authenticateJWT } from "../middleware/auth/JWT/authMiddleware";

const router = Router();

router.post("/execute", authenticateJWT, executeCode);

export default router;
