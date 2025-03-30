import { useState } from "react";
import Home from "./Components/Home";
import Quiz from "./Components/Quiz";
import Results from "./Components/Results";
import SignUp from "./Components/SignUp";
import RegistrationForm from "./Components/Login";

const App = () => {
  const [phase, setPhase] = useState("home");
  const [userData, setUserData] = useState(null);
  const [quizResults, setQuizResults] = useState({
    answers: [],
    score: 0,
    total: 0,
    timeTaken: 0,
    timestamp: null,
  });

  const handleStartQuiz = () => {
    setPhase("quiz");
  };

  const handleQuizComplete = async (results) => {
    const timestamp = Date.now();
    const wrongAnswers = results.total - results.score;

    const fullResults = {
      ...results,
      wrongAnswers,
      timestamp,
    };

    setQuizResults(fullResults);
    setPhase("register");

    try {
      const response = await fetch(
        "https://react-quizapp-backend.onrender.com/quiz-results",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fullResults),
        }
      );

      if (!response.ok)
        throw new Error("Не вдалося надіслати результати тесту");

      console.log("Результати тесту успішно надіслані");
    } catch (error) {
      console.error("Помилка надсилання результатів:", error);
    }
  };

  const handleSubmitRegistration = async (formData) => {
    try {
      const payload = {
        ...formData,
        quiz: quizResults,
      };

      const response = await fetch(
        "https://react-quizapp-backend.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Submission failed");

      setUserData(formData);
      setPhase("results");
    } catch (error) {
      console.error("Помилка відправки:", error);
      alert("Помилка відправки даних!");
    }
  };

  const handleRestart = () => {
    setPhase("quiz");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {phase === "home" && <Home onStartQuiz={handleStartQuiz} />}

      {phase === "quiz" && (
        <Quiz
          onComplete={handleQuizComplete}
          onCancel={() => setPhase("home")}
        />
      )}

      {phase === "register" && (
        <RegistrationForm
          onSubmit={handleSubmitRegistration}
          onBack={() => setPhase("quiz")}
        />
      )}

      {phase === "results" && (
        <Results
          user={userData}
          score={quizResults.score}
          totalQuestions={quizResults.total}
          wrongAnswers={quizResults.wrongAnswers}
          timeTaken={quizResults.timeTaken}
          timestamp={quizResults.timestamp}
          onRestart={handleRestart}
          onGoHome={() => setPhase("home")}
        />
      )}

      {phase === "login" && <SignUp onStartQuiz={handleStartQuiz} />}
    </div>
  );
};

export default App;
