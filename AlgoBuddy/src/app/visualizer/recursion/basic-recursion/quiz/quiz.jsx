"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BasicRecursionQuiz = () => {
    const questions = [
  {
    question: "What is recursion?",
    options: [
      "A function calling itself",
      "A loop inside another loop",
      "A sorting algorithm",
      "A searching technique",
    ],
    correctAnswer: 0,
    explanation:
      "Recursion is a programming technique where a function calls itself to solve a problem.",
  },
  {
    question: "Why is a base case necessary in recursion?",
    options: [
      "To increase recursion depth",
      "To stop recursive calls",
      "To improve sorting speed",
      "To reduce memory usage",
    ],
    correctAnswer: 1,
    explanation:
      "The base case prevents infinite recursion by providing a stopping condition.",
  },
  {
    question: "What happens if a recursive function has no base case?",
    options: [
      "Nothing happens",
      "It automatically stops",
      "It causes Stack Overflow",
      "It becomes iterative",
    ],
    correctAnswer: 2,
    explanation:
      "Without a base case, recursive calls continue until the call stack overflows.",
  },
  {
    question: "Which memory area stores recursive function calls?",
    options: [
      "Heap",
      "Stack",
      "Cache",
      "ROM",
    ],
    correctAnswer: 1,
    explanation:
      "Every recursive call creates a new stack frame in the call stack.",
  },
  {
    question: "Which data structure is used internally during recursion?",
    options: [
      "Queue",
      "Stack",
      "Linked List",
      "Graph",
    ],
    correctAnswer: 1,
    explanation:
      "Recursion is implemented using the function call stack.",
  },
  {
    question: "For printing numbers from 1 to N recursively, when should the print statement execute?",
    options: [
      "Before the recursive call",
      "After the recursive call",
      "Inside a loop",
      "Never",
    ],
    correctAnswer: 1,
    explanation:
      "Printing after the recursive call produces output from 1 to N.",
  },
  {
    question: "For printing numbers from N to 1 recursively, when should the print statement execute?",
    options: [
      "Before the recursive call",
      "After the recursive call",
      "After returning",
      "Never",
    ],
    correctAnswer: 0,
    explanation:
      "Printing before the recursive call gives N down to 1.",
  },
  {
    question: "What is Head Recursion?",
    options: [
      "Recursive call comes first",
      "Recursive call comes last",
      "No recursive call",
      "Multiple recursive calls",
    ],
    correctAnswer: 0,
    explanation:
      "In head recursion, the recursive call is executed before any processing.",
  },
  {
    question: "What is Tail Recursion?",
    options: [
      "Recursive call is the last operation",
      "Recursive call is first",
      "No base case",
      "Two recursive calls",
    ],
    correctAnswer: 0,
    explanation:
      "In tail recursion, the recursive call is the final operation.",
  },
  {
    question: "What is the time complexity of printing numbers from 1 to N recursively?",
    options: [
      "O(1)",
      "O(log N)",
      "O(N)",
      "O(N²)",
    ],
    correctAnswer: 2,
    explanation:
      "Each recursive call processes one number, so the complexity is O(N).",
  },
  {
    question: "What is the space complexity of recursion for printing N numbers?",
    options: [
      "O(1)",
      "O(log N)",
      "O(N)",
      "O(N²)",
    ],
    correctAnswer: 2,
    explanation:
      "The recursion stack stores N function calls.",
  },
  {
    question: "Which of the following problems commonly uses recursion?",
    options: [
      "Binary Search",
      "Tree Traversal",
      "Tower of Hanoi",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "All these problems are naturally solved using recursion.",
  },
  {
    question: "What is a recursive call?",
    options: [
      "Calling another function",
      "Calling the same function from itself",
      "Calling a loop",
      "Calling a class",
    ],
    correctAnswer: 1,
    explanation:
      "A recursive call occurs when a function invokes itself.",
  },
  {
    question: "Which statement about recursion is correct?",
    options: [
      "Every recursive function must reach a base case",
      "Recursion never uses memory",
      "Recursion is always faster than iteration",
      "Recursion cannot call itself",
    ],
    correctAnswer: 0,
    explanation:
      "A base case is required to terminate recursion safely.",
  },
  {
    question: "Which statement best describes recursion?",
    options: [
      "Breaking a problem into smaller subproblems",
      "Sorting without comparisons",
      "Searching only in arrays",
      "Using multiple loops",
    ],
    correctAnswer: 0,
    explanation:
      "Recursion solves a problem by repeatedly solving smaller instances of the same problem.",
  },
];
return (
    <QuizEngine
      title="Basic Recursion Quiz Challenge"
      questions={questions}
    />
  );
};

export default BasicRecursionQuiz;