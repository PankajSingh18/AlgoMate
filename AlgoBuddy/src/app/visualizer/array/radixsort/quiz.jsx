"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const RadixSortQuiz = () => {
  const questions = [
    {
      question: "What is the main idea behind Radix Sort?",
      options: [
        "Compare adjacent elements",
        "Sort numbers digit by digit",
        "Divide the array into halves",
        "Build a binary heap",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort processes numbers one digit at a time, usually from least significant digit to most significant digit.",
    },
    {
      question: "Radix Sort is primarily used for:",
      options: [
        "Floating-point numbers",
        "Strings only",
        "Integers with fixed-length digits",
        "Graphs",
      ],
      correctAnswer: 2,
      explanation:
        "Radix Sort works best for integers or fixed-length keys.",
    },
    {
      question: "Which sorting algorithm is commonly used internally in Radix Sort?",
      options: [
        "Bubble Sort",
        "Selection Sort",
        "Counting Sort",
        "Quick Sort",
      ],
      correctAnswer: 2,
      explanation:
        "Counting Sort is commonly used as the stable sorting algorithm for each digit.",
    },
    {
      question: "Why must the internal sorting algorithm be stable?",
      options: [
        "To reduce memory usage",
        "To preserve the order of equal digits",
        "To increase comparisons",
        "To remove duplicates",
      ],
      correctAnswer: 1,
      explanation:
        "A stable sort preserves the relative order of equal elements, which is essential for Radix Sort.",
    },
    {
      question: "What is the average time complexity of Radix Sort?",
      options: [
        "O(n²)",
        "O(n log n)",
        "O(d × (n + k))",
        "O(log n)",
      ],
      correctAnswer: 2,
      explanation:
        "The complexity depends on the number of digits (d) and the digit range (k).",
    },
    {
      question: "In LSD Radix Sort, processing begins from:",
      options: [
        "Most significant digit",
        "Middle digit",
        "Least significant digit",
        "Random digit",
      ],
      correctAnswer: 2,
      explanation:
        "LSD Radix Sort starts from the least significant digit.",
    },
    {
      question: "What does MSD stand for in Radix Sort?",
      options: [
        "Minimum Significant Digit",
        "Most Significant Digit",
        "Main Sorted Digit",
        "Maximum Sorted Digit",
      ],
      correctAnswer: 1,
      explanation:
        "MSD means Most Significant Digit.",
    },
    {
      question: "Radix Sort is classified as:",
      options: [
        "Comparison-based sorting",
        "Non-comparison sorting",
        "Recursive sorting",
        "Tree-based sorting",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort does not compare elements directly.",
    },
    {
      question: "Which of the following is an advantage of Radix Sort?",
      options: [
        "Always uses O(1) memory",
        "Very efficient for fixed-length integers",
        "Works only for sorted arrays",
        "Requires no auxiliary space",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort performs very well for integers with a limited number of digits.",
    },
    {
      question: "Which statement about Radix Sort is true?",
      options: [
        "It always performs comparisons",
        "It is a stable sorting algorithm",
        "It only works for linked lists",
        "It has O(n²) complexity",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort is stable when its internal sorting algorithm is stable.",
    },
    {
      question: "What does 'd' represent in Radix Sort complexity?",
      options: [
        "Number of digits",
        "Depth of recursion",
        "Number of comparisons",
        "Array size",
      ],
      correctAnswer: 0,
      explanation:
        "d represents the maximum number of digits.",
    },
    {
      question: "What does 'k' represent in O(d × (n + k))?",
      options: [
        "Number of recursive calls",
        "Range of each digit",
        "Heap size",
        "Pivot position",
      ],
      correctAnswer: 1,
      explanation:
        "k is the number of possible digit values (usually 10).",
    },
    {
      question: "Which base is most commonly used in decimal Radix Sort?",
      options: [
        "2",
        "8",
        "10",
        "16",
      ],
      correctAnswer: 2,
      explanation:
        "Decimal Radix Sort uses base 10.",
    },
    {
      question: "Radix Sort performs best when:",
      options: [
        "Numbers have similar digit lengths",
        "The array is reverse sorted",
        "The array contains floating-point values",
        "The input is recursive",
      ],
      correctAnswer: 0,
      explanation:
        "Radix Sort is efficient when the number of digits is limited.",
    },
    {
      question: "Which statement about Radix Sort is correct?",
      options: [
        "It compares every pair of elements",
        "It sorts numbers digit by digit using a stable sort",
        "It always uses recursion",
        "It only works for negative numbers",
      ],
      correctAnswer: 1,
      explanation:
        "Radix Sort processes one digit at a time using a stable sorting algorithm.",
    },
  ];

  return (
    <QuizEngine
      title="Radix Sort Quiz Challenge"
      questions={questions}
    />
  );
};

export default RadixSortQuiz;