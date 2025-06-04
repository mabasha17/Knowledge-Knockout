import React, { useState, useEffect } from "react";

const API_URL = "http://localhost:5000/api";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  const fetchQuestions = async () => {
    try {
      console.log("Fetching questions from:", `${API_URL}/questions`);
      const response = await fetch(`${API_URL}/questions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Received questions:", data);
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error.message);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQuestion + 1]: option,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: selectedOptions }),
      });
      const data = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Quiz Results</h1>
          <div className="text-center mb-8">
            <p className="text-2xl font-semibold">
              Score: {results.score} / {results.totalQuestions}
            </p>
            <p className="text-xl text-gray-600">
              Percentage:{" "}
              {((results.score / results.totalQuestions) * 100).toFixed(1)}%
            </p>
          </div>
          <div className="space-y-6">
            {results.results.map((result) => (
              <div
                key={result.questionId}
                className={`p-4 rounded-lg border ${
                  result.correct ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <p className="font-semibold mb-2">
                  Question {result.questionId}
                </p>
                <p className="text-sm">
                  Your Answer: {result.userAnswer || "Not answered"}
                </p>
                {!result.correct && (
                  <p className="text-sm text-green-600">
                    Correct Answer: {result.correctAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Quiz
          </h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchQuestions}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Loading questions...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <main className="w-3/4 flex flex-col p-8 gap-6">
        <header className="flex justify-between items-center bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h1 className="text-3xl font-extrabold tracking-tight">Java Quiz</h1>
          <div className="text-lg font-semibold bg-gray-100 border border-gray-300 rounded-lg px-5 py-2">
            ⏰ {formatTime(timeLeft)}
          </div>
        </header>

        <section className="flex-grow overflow-y-auto bg-white rounded-lg shadow-md border border-gray-200 p-8 space-y-6">
          <h2 className="text-xl font-semibold">
            Q{currentQ.id}: {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left rounded-lg border px-5 py-3 font-medium transition
                  ${
                    selectedOptions[currentQ.id] === option
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "border-gray-300 hover:bg-yellow-50 hover:border-yellow-400"
                  }
                  focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              >
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="flex justify-between items-center bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 font-semibold rounded-lg border border-gray-300 hover:bg-yellow-50 hover:border-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentQuestion((prev) =>
                Math.min(questions.length - 1, prev + 1)
              )
            }
            disabled={currentQuestion === questions.length - 1}
            className="px-6 py-3 font-semibold rounded-lg border border-gray-300 hover:bg-yellow-50 hover:border-yellow-400 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
          >
            Next
          </button>
        </section>
      </main>

      <aside className="w-1/4 border-l border-gray-200 bg-white p-8 shadow-inner overflow-y-auto">
        <h2 className="text-2xl font-bold mb-8">Questions</h2>
        <div className="grid grid-cols-3 gap-4">
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(q.id - 1)}
              className={`p-3 rounded-lg border text-center transition
                ${
                  selectedOptions[q.id]
                    ? "bg-green-100 border-green-500 text-green-800"
                    : "border-gray-300 hover:bg-yellow-50"
                }
                ${
                  currentQuestion === q.id - 1 ? "ring-2 ring-yellow-400" : ""
                }`}
            >
              {q.id}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-8 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Submit Quiz
        </button>
      </aside>
    </div>
  );
}
