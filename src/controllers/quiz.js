import { saveQuizResult } from "../services/quiz.js";

// export const submitQuizResultController = async (req, res) => {
//   const { name, email, quiz } = req.body;

//   const result = await saveQuizResult({
//     name,
//     email,
//     score: quiz.score,
//     total: quiz.total,
//     timeSpent: quiz.timeSpent,
//     answers: quiz.answers,
//   });

//   res.status(201).json({
//     status: 201,
//     message: "Quiz result saved successfully!",
//     data: result,
//   });
// };

// controllers/quiz.js
export const submitQuizResultController = async (req, res) => {
  const { score, total, timeSpent, answers } = req.body;

  const result = await saveQuizResult({
    score,
    total,
    timeSpent,
    answers,
  });

  res.status(201).json({
    status: 201,
    message: "Quiz result saved successfully!",
    data: result,
  });
};
