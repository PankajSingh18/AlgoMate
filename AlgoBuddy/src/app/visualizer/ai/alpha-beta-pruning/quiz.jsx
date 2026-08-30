"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const AlphaBetaQuiz = () => {
  const questions = [
    {
      question: "What is the primary purpose of Alpha-Beta Pruning?",
      options: [
        "To find a better solution than Minimax",
        "To reduce the number of nodes evaluated by Minimax",
        "To make Minimax work for multiplayer games",
        "To increase the memory capacity of the search tree",
      ],
      correctAnswer: 1,
      explanation: "Alpha-Beta pruning is an optimization for Minimax that 'prunes' branches that cannot possibly affect the final decision, reducing the total nodes evaluated.",
    },
    {
      question: "At a Maximizing node, which value is updated?",
      options: ["Alpha", "Beta", "Both Alpha and Beta", "Neither"],
      correctAnswer: 0,
      explanation: "A Maximizing node updates the Alpha value, which represents the best (highest) value found so far for the maximizing player.",
    },
    {
      question: "What is the pruning condition in Alpha-Beta Pruning?",
      options: [
        "Alpha < Beta",
        "Alpha == Beta",
        "Alpha >= Beta",
        "Alpha + Beta = 0",
      ],
      correctAnswer: 2,
      explanation: "Pruning occurs when the Alpha value becomes greater than or equal to the Beta value, meaning the current path is worse than previously explored options.",
    },
    {
      question: "In the best-case scenario (with perfect move ordering), what is the time complexity of Alpha-Beta Pruning?",
      options: ["O(b^d)", "O(b^(d/2))", "O(d^b)", "O(b*d)"],
      correctAnswer: 1,
      explanation: "In the best case, Alpha-Beta pruning effectively doubles the search depth, reducing the complexity to O(b^(d/2)).",
    },
    {
      question: "What are the typical initial values for Alpha and Beta?",
      options: [
        "Alpha = 0, Beta = 0",
        "Alpha = +∞, Beta = -∞",
        "Alpha = -∞, Beta = +∞",
        "Alpha = 1, Beta = -1",
      ],
      correctAnswer: 2,
      explanation: "Alpha starts at the lowest possible value (-∞) and Beta starts at the highest possible value (+∞).",
    },
  ];

  return <QuizEngine title="Alpha-Beta Pruning Quiz Challenge" questions={questions} />;
};

export default AlphaBetaQuiz;
