import { QuizResultCollection } from "../models/quizResult.js";

export const saveQuizResult = async (payload) => {
  return await QuizResultCollection.create(payload);
};
