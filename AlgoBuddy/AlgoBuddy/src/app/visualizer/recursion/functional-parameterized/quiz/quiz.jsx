"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const FunctionalParameterizedQuiz = () => {
  const questions = [
    {
      question: "What is the base case for calculating the sum of the first N numbers recursively?",
      options: [
        "n == 1",
        "n <= 0",
        "n == 2",
        "n == -1",
      ],
      correctAnswer: 1,
      explanation:
        "The recursion stops when n <= 0, returning 0.",
    },
    {
      question: "Which statement represents the recursive step in the Sum of N algorithm?",
      options: [
        "return 0;",
        "return n + sum(n - 1);",
        "return sum(n);",
        "return n;",
      ],
      correctAnswer: 1,
      explanation:
        "The recursive call reduces the problem size by calling sum(n - 1).",
    },
    {
      question: "What is the base case in the recursive factorial function?",
      options: [
        "n == 0",
        "n == 2",
        "n == 5",
        "n == 10",
      ],
      correctAnswer: 0,
      explanation:
        "Factorial of 0 is defined as 1, making it the stopping condition.",
    },
    {
      question: "Which expression correctly calculates factorial recursively?",
      options: [
        "n + factorial(n - 1)",
        "factorial(n)",
        "n * factorial(n - 1)",
        "factorial(n + 1)",
      ],
      correctAnswer: 2,
      explanation:
        "Each recursive call multiplies the current value with factorial(n - 1).",
    },
    {
      question: "What does factorial(5) return?",
      options: [
        "20",
        "60",
        "120",
        "24",
      ],
      correctAnswer: 2,
      explanation:
        "5 × 4 × 3 × 2 × 1 = 120.",
    },
    {
      question: "When reversing an array recursively, which elements are swapped first?",
      options: [
        "Middle elements",
        "Adjacent elements",
        "First and last elements",
        "Random elements",
      ],
      correctAnswer: 2,
      explanation:
        "The recursion swaps the first and last elements before moving inward.",
    },
    {
      question: "When should recursion stop while reversing an array?",
      options: [
        "When left index becomes greater than or equal to right index",
        "After one swap",
        "When left index is 0",
        "Never",
      ],
      correctAnswer: 0,
      explanation:
        "The recursion ends when the pointers meet or cross.",
    },
    {
      question: "How many recursive calls are approximately required to reverse an array of size N?",
      options: [
        "N",
        "N / 2",
        "log N",
        "1",
      ],
      correctAnswer: 1,
      explanation:
        "Each recursive call swaps two elements, so only about N/2 calls are needed.",
    },
    {
      question: "While checking whether a string is a palindrome recursively, what is compared?",
      options: [
        "Adjacent characters",
        "First and last characters",
        "Only middle characters",
        "ASCII values only",
      ],
      correctAnswer: 1,
      explanation:
        "Characters from both ends are compared and the pointers move inward.",
    },
    {
      question: "When does the recursive palindrome algorithm stop?",
      options: [
        "When left >= right",
        "When string length is even",
        "After two comparisons",
        "Never",
      ],
      correctAnswer: 0,
      explanation:
        "If the pointers meet or cross, every previous comparison matched.",
    },
    {
      question: "What happens if two compared characters do not match?",
      options: [
        "Continue recursion",
        "Return true",
        "Return false immediately",
        "Swap characters",
      ],
      correctAnswer: 2,
      explanation:
        "A mismatch proves the string is not a palindrome.",
    },
    {
      question: "Functional recursion mainly returns:",
      options: [
        "A value",
        "Nothing",
        "Only arrays",
        "Only strings",
      ],
      correctAnswer: 0,
      explanation:
        "Functional recursion solves the problem by returning a value from each recursive call.",
    },
    {
      question: "Parameterized recursion mainly works by:",
      options: [
        "Passing accumulated values as parameters",
        "Using loops only",
        "Sorting arrays",
        "Searching elements",
      ],
      correctAnswer: 0,
      explanation:
        "Parameterized recursion carries the answer through function parameters.",
    },
    {
      question: "What is the time complexity of recursive factorial?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)",
      ],
      correctAnswer: 2,
      explanation:
        "Each recursive call processes one value until reaching the base case.",
    },
    {
      question: "Which of the following is true for functional and parameterized recursion?",
      options: [
        "Both require a base case",
        "Neither uses recursion",
        "Only parameterized recursion needs a base case",
        "Only functional recursion needs a base case",
      ],
      correctAnswer: 0,
      explanation:
        "Every recursive solution must include a base case to terminate recursion safely.",
    }
  ];

  return (
    <QuizEngine
      title="Functional & Parameterized Recursion Quiz Challenge"
      questions={questions}
    />
  );
};

export default FunctionalParameterizedQuiz;