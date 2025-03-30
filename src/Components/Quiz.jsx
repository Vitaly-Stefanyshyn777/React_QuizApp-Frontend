import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Quiz = ({ onComplete, onCancel }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");

  Quiz.propTypes = {
    onComplete: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  const quizQuestions = [
    {
      question: "Which planet is closest to the Sun?",
      options: ["A. Venus", "B. Mercury", "C. Earth"],
      correct: "B. Mercury",
    },
    {
      question: "Which data structure organizes items in FIFO manner?",
      options: ["A. Stack", "B. Queue", "C. Tree"],
      correct: "B. Queue",
    },
    {
      question:
        "Which of the following is primarily used for structuring web pages?",
      options: ["A. Python", "B. Java", "C. HTML"],
      correct: "C. HTML",
    },
    {
      question: "What is the chemical symbol for Gold?",
      options: ["A. Go", "B. Au", "C. Ag"],
      correct: "B. Au",
    },
    {
      question:
        "Which process is not typically involved in refining petroleum?",
      options: ["A. Fractional distillation", "B. Cracking", "C. Filtration"],
      correct: "C. Filtration",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (answer) => {
    const isCorrect = answer === quizQuestions[currentQuestion].correct;

    setAnswers([
      ...answers,
      {
        question: quizQuestions[currentQuestion].question,
        answer,
        correct: isCorrect,
      },
    ]);

    setFeedback(isCorrect ? "Correct! ✅" : "Wrong ❌");
    setSelectedAnswer(answer);

    if (isCorrect) setScore(score + 1);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setFeedback("");
    } else {
      onComplete({
        score,
        total: quizQuestions.length,
        answers,
        timeSpent: 1800 - timeLeft,
      });
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 max-w-2xl w-full">
        <button
          onClick={onCancel}
          className="mb-4 text-blue-500 hover:text-blue-700"
        >
          ← Cancel Test
        </button>

        <div className="mb-4 h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-500 rounded transition-all"
            style={{
              width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
            }}
          ></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">
              Question {currentQuestion + 1}/{quizQuestions.length}
            </span>
            <span className="text-blue-600">
              Time: {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>

          <h2 className="text-xl font-bold mb-6">
            {quizQuestions[currentQuestion].question}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`p-3 rounded-lg transition-all ${
                  selectedAnswer
                    ? option === quizQuestions[currentQuestion].correct
                      ? "bg-green-200"
                      : "bg-red-200"
                    : "bg-gray-100 hover:bg-blue-100"
                } ${selectedAnswer === option ? "ring-2 ring-blue-500" : ""}`}
                disabled={!!selectedAnswer}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="mt-4 p-3 rounded-lg bg-gray-50">
              <p className="font-bold">{feedback}</p>
              {selectedAnswer !== quizQuestions[currentQuestion].correct && (
                <p className="mt-2">
                  Correct answer: {quizQuestions[currentQuestion].correct}
                </p>
              )}
            </div>
          )}

          <button
            onClick={handleNext}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            disabled={!selectedAnswer}
          >
            {currentQuestion < quizQuestions.length - 1
              ? "Next Question"
              : "Finish Test"}
          </button>
        </div>
      </div>

      <div className="w-full md:w-[650px] flex justify-center items-center mt-10">
        <img
          src="/image.png"
          alt="Quiz Illustration"
          className="rounded-xl shadow-xl w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};

Quiz.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Quiz;
