import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as process from "process";

// Load environment variables
dotenv.config();

const app = express();

// Middleware

app.use(cors({
  origin: ["https://knowledge-knockout-ivory.vercel.app/"],
  methods: ['GET', 'POST'],
  credentials: True
}));

app.use(express.json());

// Sample quiz data
const questions = [
  {
    id: 1,
    question: "Which of the following is not a Java primitive data type?",
    options: ["int", "float", "string", "boolean"],
    correctAnswer: "string",
  },
  {
    id: 2,
    question: "What is the output of: System.out.println(5 + '2');",
    options: ["52", "7", "55", "Error"],
    correctAnswer: "55",
  },
  {
    id: 3,
    question: "Which keyword is used to inherit a class in Java?",
    options: ["extends", "implements", "super", "this"],
    correctAnswer: "extends",
  },
  {
    id: 4,
    question: "What is the size of int data type in Java?",
    options: ["2 bytes", "4 bytes", "8 bytes", "Depends on system"],
    correctAnswer: "4 bytes",
  },
  {
    id: 5,
    question: "Which of these is not a valid Java identifier?",
    options: ["_myVar", "123var", "myVar", "$myVar"],
    correctAnswer: "123var",
  },
  {
    id: 6,
    question: "What is the default value of boolean in Java?",
    options: ["true", "false", "null", "0"],
    correctAnswer: "false",
  },
  {
    id: 7,
    question: "Which method is called when an object is created?",
    options: ["main()", "constructor", "init()", "create()"],
    correctAnswer: "constructor",
  },
  {
    id: 8,
    question:
      "What is the output of: String s = null; System.out.println(s.length());",
    options: ["0", "null", "NullPointerException", "Error"],
    correctAnswer: "NullPointerException",
  },
  {
    id: 9,
    question: "Which of these is not a valid access modifier in Java?",
    options: ["public", "private", "protected", "internal"],
    correctAnswer: "internal",
  },
  {
    id: 10,
    question: "What is the correct way to create an array in Java?",
    options: [
      "int[] arr = new int[5];",
      "int arr[] = new int[5];",
      "int arr = new int[5];",
      "Both A and B",
    ],
    correctAnswer: "Both A and B",
  },
];

// Routes
app.get("/api/questions", (req, res) => {
  res.json(questions);
});

app.get("/api/questions/:id", (req, res) => {
  const question = questions.find((q) => q.id === parseInt(req.params.id));
  if (!question) return res.status(404).json({ message: "Question not found" });
  res.json(question);
});

app.post("/api/submit", (req, res) => {
  const { answers } = req.body;
  let score = 0;
  const results = questions.map((q) => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (isCorrect) score++;
    return {
      questionId: q.id,
      correct: isCorrect,
      userAnswer: answers[q.id],
      correctAnswer: q.correctAnswer,
    };
  });

  res.json({
    score,
    totalQuestions: questions.length,
    results,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  .on("error", (error) => {
    console.error("Error starting server:", error);
  });
