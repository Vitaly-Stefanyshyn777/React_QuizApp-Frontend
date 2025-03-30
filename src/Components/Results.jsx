import { openDB } from "idb";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const Results = ({
  user,
  score,
  wrongAnswers,
  timeTaken,
  timestamp,
  onRestart,
  onGoHome,
}) => {
  const [attempts, setAttempts] = useState([]);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (!user?.email || !timestamp || hasSaved.current) return;

    const saveAndLoadAttempts = async () => {
      hasSaved.current = true;

      const db = await openDB("QuizDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("attempts")) {
            db.createObjectStore("attempts", { keyPath: "timestamp" });
          }
        },
      });

      const newAttempt = {
        user: user?.name,
        score,
        wrongAnswers,
        timeTaken,
        date: new Date(timestamp).toLocaleString(),
        timestamp,
      };

      const allAttempts = await db.getAll("attempts");

      const exists = allAttempts.find((item) => item.timestamp === timestamp);
      if (!exists && allAttempts.length < 3) {
        await db.add("attempts", newAttempt);
      }

      const updatedAttempts = await db.getAll("attempts");
      setAttempts(updatedAttempts);
    };

    saveAndLoadAttempts();
  }, [user, score, wrongAnswers, timeTaken, timestamp]);

  const removeAttempt = async (timestamp) => {
    const db = await openDB("QuizDB", 1);
    await db.delete("attempts", timestamp);
    const updatedAttempts = await db.getAll("attempts");
    setAttempts(updatedAttempts);
  };

  const clearHistory = async () => {
    const db = await openDB("QuizDB", 1);
    const tx = db.transaction("attempts", "readwrite");
    await tx.objectStore("attempts").clear();
    await tx.done;
    setAttempts([]);
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold">Quiz Completed!</h2>
      <h3 className="text-lg font-semibold mt-4">User: {user?.name}</h3>

      <p className="text-green-400 mt-4 text-lg">Correct Answers: {score}</p>
      <p className="text-red-400 text-lg">Incorrect Answers: {wrongAnswers}</p>
      <p className="text-yellow-400 text-lg">
        Total Time Taken: {timeTaken} seconds
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Attempt History</h3>
        <ul className="mt-2 text-left">
          {attempts.length > 0 ? (
            attempts.map((attempt) => (
              <li
                key={attempt.timestamp}
                className="border p-2 mb-2 rounded bg-gray-700 text-white"
              >
                <p>
                  <strong>Date:</strong> {attempt.date}
                </p>
                <p>
                  <strong>Score:</strong> {attempt.score} /{" "}
                  {attempt.score + (attempt.wrongAnswers || 0)}
                </p>
                <p>
                  <strong>Time Taken:</strong> {attempt.timeTaken} sec
                </p>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2"
                  onClick={() => removeAttempt(attempt.timestamp)}
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No attempt history found.</p>
          )}
        </ul>
        {attempts.length > 0 && (
          <button
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={clearHistory}
          >
            Clear All History
          </button>
        )}
      </div>

      {attempts.length < 3 ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
          onClick={onRestart}
        >
          Restart Quiz
        </button>
      ) : (
        <p className="text-red-500 mt-4 font-bold">
          Maximum of 3 attempts reached. No more retries allowed.
        </p>
      )}

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6 ml-4"
        onClick={onGoHome}
      >
        Go To Home
      </button>
    </div>
  );
};

Results.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  score: PropTypes.number.isRequired,
  wrongAnswers: PropTypes.number.isRequired,
  timeTaken: PropTypes.number.isRequired,
  timestamp: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired,
  onGoHome: PropTypes.func.isRequired,
};

export default Results;
