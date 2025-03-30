import PropTypes from "prop-types";
import { useState } from "react";

const SignUp = ({ onStartQuiz }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("userAccount"));

    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    if (
      !storedUser ||
      storedUser.email !== email ||
      storedUser.password !== password
    ) {
      setError("Invalid credentials.");
      return;
    }

    alert("Login Successful! Starting Test...");
    onStartQuiz();
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="mb-4 text-left">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white"
        />
      </div>
      <button
        onClick={handleLogin}
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
};

SignUp.propTypes = {
  onStartQuiz: PropTypes.func.isRequired,
};

export default SignUp;
