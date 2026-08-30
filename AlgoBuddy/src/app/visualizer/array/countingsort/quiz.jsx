"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const CountingSortQuiz = () => {
  const questions = [
    {
      question: "What is the basic idea behind Counting Sort?",
      options: [
        "Compare adjacent elements repeatedly",
        "Count the occurrences of each value",
        "Divide the array into smaller arrays",
        "Build a binary heap",
      ],
      correctAnswer: 1,
      explanation:
        "Counting Sort works by counting how many times each value appears and then reconstructing the sorted array.",
    },
    {
      question: "Counting Sort is most efficient when:",
      options: [
        "The input values are within a small range",
        "The array is already sorted",
        "The array contains floating-point numbers",
        "The array has no duplicate values",
      ],
      correctAnswer: 0,
      explanation:
        "Counting Sort performs best when the range of input values is relatively small.",
    },
    {
      question: "What is the average time complexity of Counting Sort?",
      options: [
        "O(n²)",
        "O(n log n)",
        "O(n + k)",
        "O(log n)",
      ],
      correctAnswer: 2,
      explanation:
        "Counting Sort has a time complexity of O(n + k), where n is the number of elements and k is the range of input values.",
    },
    {
      question: "What does 'k' represent in the complexity O(n + k)?",
      options: [
        "Number of comparisons",
        "Range of input values",
        "Number of recursive calls",
        "Output array size",
      ],
      correctAnswer: 1,
      explanation:
        "k represents the range of possible input values.",
    },
    {
      question: "Counting Sort belongs to which category?",
      options: [
        "Comparison-based sorting",
        "Non-comparison sorting",
        "Divide and Conquer",
        "Recursive sorting",
      ],
      correctAnswer: 1,
      explanation:
        "Counting Sort is a non-comparison sorting algorithm.",
    },
    {
      question: "Which auxiliary data structure is used in Counting Sort?",
      options: [
        "Stack",
        "Queue",
        "Count Array",
        "Binary Heap",
      ],
      correctAnswer: 2,
      explanation:
        "A Count Array stores the frequency of each value in the input.",
    },
    {
      question: "Why is Counting Sort considered stable?",
      options: [
        "Because it uses recursion",
        "Because equal elements preserve their relative order",
        "Because it performs comparisons",
        "Because it sorts in-place",
      ],
      correctAnswer: 1,
      explanation:
        "A stable sorting algorithm keeps equal elements in the same relative order as the input.",
    },
    {
      question: "What is the auxiliary space complexity of Counting Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n + k)",
        "O(n²)",
      ],
      correctAnswer: 2,
      explanation:
        "Extra memory is needed for the count array and output array.",
    },
    {
      question: "What is the first step of Counting Sort?",
      options: [
        "Choose a pivot",
        "Build the count array",
        "Swap adjacent elements",
        "Reverse the array",
      ],
      correctAnswer: 1,
      explanation:
        "The algorithm first counts the frequency of each element.",
    },
    {
      question: "Why are prefix sums calculated in Counting Sort?",
      options: [
        "To remove duplicates",
        "To determine the final position of each element",
        "To reduce memory usage",
        "To compare elements faster",
      ],
      correctAnswer: 1,
      explanation:
        "Prefix sums determine the correct index of each value in the sorted output.",
    },
    {
      question: "Counting Sort becomes inefficient when:",
      options: [
        "The array is already sorted",
        "The range of values is very large",
        "The array contains duplicate values",
        "The array is small",
      ],
      correctAnswer: 1,
      explanation:
        "A large value range requires a large count array, increasing memory usage.",
    },
    {
      question: "Counting Sort is mainly designed for:",
      options: [
        "Strings",
        "Floating-point numbers",
        "Integers within a bounded range",
        "Graphs",
      ],
      correctAnswer: 2,
      explanation:
        "Counting Sort is designed primarily for integers within a limited range.",
    },
    {
      question: "Can standard Counting Sort directly handle negative integers?",
      options: [
        "Yes",
        "No",
        "Only if the array is sorted",
        "Only if duplicates are removed",
      ],
      correctAnswer: 1,
      explanation:
        "Standard Counting Sort assumes non-negative integers. Negative values require shifting the range.",
    },
    {
      question: "Which algorithm commonly uses Counting Sort as a subroutine?",
      options: [
        "Heap Sort",
        "Quick Sort",
        "Radix Sort",
        "Merge Sort",
      ],
      correctAnswer: 2,
      explanation:
        "Radix Sort relies on Counting Sort because it is stable.",
    },
    {
      question: "Which statement about Counting Sort is correct?",
      options: [
        "It compares every pair of elements",
        "It sorts elements by counting their occurrences",
        "It always runs in O(n²)",
        "It only works for sorted arrays",
      ],
      correctAnswer: 1,
      explanation:
        "Counting Sort sorts values based on their frequencies instead of comparing elements.",
    },
  ];

  return (
    <QuizEngine
      title="Counting Sort Quiz Challenge"
      questions={questions}
    />
  );
};

export default CountingSortQuiz;