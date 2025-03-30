import { Schema, model } from "mongoose";

const quizResultSchema = new Schema(
  {
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    timeSpent: { type: Number, required: true },
    answers: [
      {
        question: String,
        answer: String,
        correct: Boolean,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const QuizResultCollection = model("quiz_results", quizResultSchema);
