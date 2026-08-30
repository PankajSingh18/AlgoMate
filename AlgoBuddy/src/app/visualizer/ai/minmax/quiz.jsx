"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const MinMaxQuiz = () => {
  const questions = [
    {
      question: "What is the primary purpose of the Min Max algorithm?",
      options: [
        "To sort an array as fast as possible",
        "To find the shortest path in a graph",
        "To find the optimal move in a 2-player adversarial game",
        "To compress data"
      ],
      correctAnswer: 2,
      explanation: "Min Max is used primarily in artificial intelligence to determine the best possible move in games like chess, checkers, and tic-tac-toe by minimizing the possible loss for a worst case scenario."
    },
    {
      question: "In a Min Max game tree, what role does the root node represent?",
      options: [
        "The current state of the game",
        "The final outcome of the game",
        "The opponent's previous move",
        "A random state"
      ],
      correctAnswer: 0,
      explanation: "The root node in a Min Max game tree represents the current state of the game, from which the player is deciding their next move."
    },
    {
      question: "Which of the following traversal methods is used by the Min Max algorithm?",
      options: [
        "Breadth-First Search (BFS)",
        "Depth-First Search (DFS)",
        "Level-Order Traversal",
        "In-Order Traversal"
      ],
      correctAnswer: 1,
      explanation: "Min Max evaluates the tree by going as deep as possible first to reach the terminal nodes, making it a Depth-First Search algorithm."
    },
    {
        question: "How can the number of nodes evaluated by the Min Max algorithm be significantly reduced?",
        options: [
          "Using a faster processor",
          "Applying Alpha-Beta Pruning",
          "Using a Breadth-First Search instead",
          "Increasing the search depth"
        ],
        correctAnswer: 1,
        explanation: "Alpha-Beta Pruning is an optimization technique for the Min Max algorithm that decreases the number of nodes evaluated in the search tree without affecting the final result."
    },
    {
        question: "What is the result when the depth of the search in Min Max is increased?",
        options: [
          "The decision quality always decreases",
          "The decision quality usually improves, but computation time increases",
          "The computation time stays the same",
          "The algorithm becomes a random search"
        ],
        correctAnswer: 1,
        explanation: "Increasing search depth allows the algorithm to 'see further' into the game's future, typically leading to better decisions, but it significantly increases the number of nodes to evaluate (O(b^d))."
    }
  ];

  return <QuizEngine title="Min Max Algorithm Quiz Challenge" questions={questions} />;
};

export default MinMaxQuiz;
