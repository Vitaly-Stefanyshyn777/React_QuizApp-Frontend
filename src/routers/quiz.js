import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { submitQuizResultController } from "../controllers/quiz.js";

const router = Router();

router.post("/", ctrlWrapper(submitQuizResultController));

export default router;
