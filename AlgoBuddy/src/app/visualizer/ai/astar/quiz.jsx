"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const AStarQuiz = () => {
  const questions = [
    {
      question: "What does the f(n) score represent in A* Search?",
      options: [
        "The number of obstacles around the node",
        "The total priority, computed as g(n) + h(n)",
        "Only the heuristic estimate",
        "Only the path cost so far",
      ],
      correctAnswer: 1,
      explanation: "A* chooses nodes using f(n) = g(n) + h(n), combining the actual cost from the start with the heuristic estimate to the goal.",
    },
    {
      question: "Why is an admissible heuristic important for A*?",
      options: [
        "It guarantees the algorithm never uses a priority queue",
        "It ensures the heuristic is always zero",
        "It helps guarantee an optimal shortest path",
        "It allows diagonal movement automatically",
      ],
      correctAnswer: 2,
      explanation: "If the heuristic never overestimates the remaining cost, A* remains optimal and can still guide the search efficiently.",
    },
    {
      question: "What is stored in the closed set during A*?",
      options: [
        "Nodes that have already been expanded",
        "Nodes that are walls",
        "Only the goal node",
        "The shortest path only",
      ],
      correctAnswer: 0,
      explanation: "The closed set tracks nodes that have already been processed so the algorithm does not expand them again.",
    },
    {
      question: "Which heuristic is commonly used on a 4-directional grid?",
      options: [
        "Manhattan distance",
        "Random distance",
        "Binary distance",
        "No heuristic at all",
      ],
      correctAnswer: 0,
      explanation: "Manhattan distance fits 4-direction movement on a grid because it measures how many horizontal and vertical steps remain.",
    },
    {
      question: "How does A* compare to Dijkstra when the heuristic is strong?",
      options: [
        "It explores more nodes than Dijkstra",
        "It behaves exactly the same as Dijkstra",
        "It usually explores fewer nodes by guiding the search toward the goal",
        "It cannot find shortest paths",
      ],
      correctAnswer: 2,
      explanation: "A strong heuristic focuses the search, so A* often visits fewer nodes than an uninformed shortest-path search.",
    },
  ];

  return <QuizEngine title="A* Search Quiz Challenge" questions={questions} />;
};

export default AStarQuiz;
