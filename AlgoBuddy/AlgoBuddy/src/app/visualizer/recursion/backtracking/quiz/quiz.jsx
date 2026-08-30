"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BacktrackingQuiz = () => {
  const questions = [
    {
      question: "What is the primary idea behind backtracking?",
      options: [
        "Sorting elements",
        "Exploring all possible solutions and undoing choices when needed",
        "Searching elements linearly",
        "Dividing arrays into halves",
      ],
      correctAnswer: 1,
      explanation:
        "Backtracking explores all possible choices and reverses decisions when a path does not lead to a valid solution.",
    },
    {
      question: "Which operation is essential after exploring one recursive path in backtracking?",
      options: [
        "Sorting",
        "Backtracking (undoing the last choice)",
        "Binary Search",
        "Hashing",
      ],
      correctAnswer: 1,
      explanation:
        "The last choice is undone so other possible paths can be explored.",
    },
    {
      question: "Which of the following is a classic application of backtracking?",
      options: [
        "N-Queens Problem",
        "Bubble Sort",
        "Linear Search",
        "Merge Sort",
      ],
      correctAnswer: 0,
      explanation:
        "The N-Queens problem is one of the most common applications of backtracking.",
    },
    {
      question: "What happens when a current solution violates a constraint?",
      options: [
        "The algorithm continues without changes",
        "The algorithm backtracks to the previous state",
        "The algorithm sorts the data",
        "The recursion stops immediately",
      ],
      correctAnswer: 1,
      explanation:
        "Backtracking abandons invalid paths and returns to the previous decision point.",
    },
    {
      question: "Which data structure is naturally used during recursive backtracking?",
      options: [
        "Queue",
        "Stack",
        "Heap",
        "Graph",
      ],
      correctAnswer: 1,
      explanation:
        "Recursive calls are managed using the call stack.",
    },
    {
      question: "Why is backtracking considered an exhaustive search technique?",
      options: [
        "It checks only one solution",
        "It explores every possible valid choice systematically",
        "It always uses dynamic programming",
        "It avoids recursion",
      ],
      correctAnswer: 1,
      explanation:
        "Backtracking systematically explores all possible solutions while pruning invalid ones.",
    },
    {
      question: "What is the purpose of pruning in backtracking?",
      options: [
        "To increase recursion depth",
        "To eliminate unnecessary search paths",
        "To sort the solution",
        "To reduce memory usage to O(1)",
      ],
      correctAnswer: 1,
      explanation:
        "Pruning avoids exploring branches that cannot produce a valid solution.",
    },
    {
      question: "Which statement best describes backtracking?",
      options: [
        "Choose → Explore → Undo",
        "Sort → Search → Return",
        "Divide → Merge → Repeat",
        "Push → Pop → Sort",
      ],
      correctAnswer: 0,
      explanation:
        "Backtracking follows the pattern: choose an option, explore recursively, then undo the choice.",
    },
    {
      question: "Which of the following problems is NOT commonly solved using backtracking?",
      options: [
        "Sudoku Solver",
        "Rat in a Maze",
        "Permutation Generation",
        "Bubble Sort",
      ],
      correctAnswer: 3,
      explanation:
        "Bubble Sort is an iterative sorting algorithm and does not use backtracking.",
    },
    {
      question: "What is the worst-case time complexity of many backtracking algorithms?",
      options: [
        "O(1)",
        "O(log N)",
        "Exponential",
        "O(N)",
      ],
      correctAnswer: 2,
      explanation:
        "Many backtracking problems require exploring an exponential number of possibilities in the worst case.",
    },
    {
      question: "What is the first step in a typical backtracking algorithm?",
      options: [
        "Choose a possible option",
        "Sort the input",
        "Print the answer",
        "Delete all choices",
      ],
      correctAnswer: 0,
      explanation:
        "Backtracking begins by making a choice before exploring recursively.",
    },
    {
      question: "Why do we remove the last choice after a recursive call?",
      options: [
        "To save memory",
        "To restore the previous state",
        "To stop recursion",
        "To sort the answer",
      ],
      correctAnswer: 1,
      explanation:
        "Removing the last choice restores the previous state so other possibilities can be explored.",
    },
    {
      question: "Which algorithmic technique is most closely related to backtracking?",
      options: [
        "Depth-First Search",
        "Breadth-First Search",
        "Binary Search",
        "Merge Sort",
      ],
      correctAnswer: 0,
      explanation:
        "Backtracking explores one path completely before returning, similar to DFS.",
    },
    {
      question: "Which problem commonly uses backtracking to generate all valid arrangements?",
      options: [
        "Permutations",
        "Binary Search",
        "Heap Sort",
        "Counting Sort",
      ],
      correctAnswer: 0,
      explanation:
        "Generating permutations is a classic backtracking problem.",
    },
    {
      question: "Why is a validity check performed before making recursive calls?",
      options: [
        "To prune invalid paths early",
        "To increase recursion depth",
        "To make recursion slower",
        "To reduce the number of variables",
      ],
      correctAnswer: 0,
      explanation:
        "Checking constraints early avoids unnecessary recursive exploration.",
    },
  ];

  return (
    <QuizEngine
      title="Backtracking Quiz Challenge"
      questions={questions}
    />
  );
};

export default BacktrackingQuiz;