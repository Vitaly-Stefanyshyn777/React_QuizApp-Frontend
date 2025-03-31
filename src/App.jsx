import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (quizResults.timestamp) {
      const existingUser = localStorage.getItem("userAccount");
      if (existingUser) {
        setUserData(JSON.parse(existingUser));
        setPhase("results");
      } else {
        setPhase("register");
      }
    }
  }, [quizResults.timestamp]);

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
      timeTaken: results.timeSpent,
    };

    setQuizResults(fullResults);

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
    } catch (error) {
      console.error("Помилка надсилання результатів:", error);
    }

    const existingUser = localStorage.getItem("userAccount");
    if (existingUser) {
      setUserData(JSON.parse(existingUser));
      setPhase("results");
    } else {
      setPhase("register");
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

      localStorage.setItem("userAccount", JSON.stringify(formData));
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

  const handleLogout = () => {
    localStorage.removeItem("userAccount");
    setUserData(null);
    setPhase("home");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
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

      {userData && (
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default App;
