"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const MCTSQuiz = () => {
  const questions = [
    {
      question: "What does the Exploration Constant (C) in the UCT formula primarily control?",
      options: [
        "The speed of the simulations",
        "The balance between visiting high-win-rate nodes and less-visited nodes",
        "The maximum depth of the search tree",
        "The number of playouts performed per second"
      ],
      correctAnswer: 1,
      explanation: "The exploration constant C balances 'exploitation' (choosing known high-win nodes) and 'exploration' (choosing nodes with fewer visits to potentially find better paths)."
    },
    {
      question: "In which MCTS stage are randomized playouts executed to estimate a node's value?",
      options: [
        "Selection",
        "Expansion",
        "Simulation (Playout)",
        "Backpropagation"
      ],
      correctAnswer: 2,
      explanation: "The Simulation phase involves running one or more randomized playouts from the selected/expanded node to a terminal state to get an outcome."
    },
    {
      question: "How does 'Backpropagation' work in MCTS?",
      options: [
        "It deletes losing branches from the tree",
        "It propagates the simulation result up from the leaf to the root, updating node statistics",
        "It restarts the search from the beginning if a simulation fails",
        "It calculates the derivative of the win rate"
      ],
      correctAnswer: 1,
      explanation: "Backpropagation takes the result of the simulation and updates the visit count and win score of every node in the search path back to the root."
    },
    {
      question: "Why is MCTS often preferred over Minimax in games like Go?",
      options: [
        "Because MCTS uses less memory",
        "Because Go has a massive branching factor and it's hard to write an accurate evaluation function",
        "Because MCTS is deterministic",
        "Because Minimax only works for small trees"
      ],
      correctAnswer: 1,
      explanation: "In games like Go, the branching factor is so large that Minimax cannot search deep enough, and board evaluations are extremely complex. MCTS uses statistical sampling to bypass these limits."
    },
    {
      question: "What happens to a node's UCT score as its visit count increases (assuming parent visits stay constant)?",
      options: [
        "The exploration term decreases",
        "The exploitation term decreases",
        "The score stays the same",
        "The score becomes Infinity"
      ],
      correctAnswer: 0,
      explanation: "As visits (n) for a child node increase, the exploration term sqrt(ln(N)/n) decreases, making it less attractive to explore compared to other less-visited nodes."
    }
  ];

  return <QuizEngine title="MCTS Search Quiz Challenge" questions={questions} />;
};

export default MCTSQuiz;


