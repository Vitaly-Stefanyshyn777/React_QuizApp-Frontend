import PropTypes from "prop-types";

const Home = ({ onStartQuiz }) => {
  return (
    <div className="text-center p-6">
      <h2 className="text-2xl font-semibold text-white">Test Instructions</h2>
      <ul className="text-left mt-4 space-y-2 text-white">
        <li>1. For multiple-choice questions, select the best answer.</li>
        <li>
          2. For integer-type questions, write your numerical answer clearly.
        </li>
        <li>3. No calculators unless specified.</li>
        <li>4. You have 30 minutes to complete the test.</li>
      </ul>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
        onClick={onStartQuiz}
      >
        Start Test
      </button>
    </div>
  );
};

Home.propTypes = {
  onStartQuiz: PropTypes.func.isRequired,
};

export default Home;
