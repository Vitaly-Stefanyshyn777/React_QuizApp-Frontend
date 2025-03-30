import { Router } from "express";
import contactsRouter from "./contacts.js"; // якщо є
import authRouter from "./auth.js";
import quizRouter from "./quiz.js";

const router = Router();

router.use("/contacts", contactsRouter);
router.use("/auth", authRouter);
router.use("/quiz-results", quizRouter);

export default router;
