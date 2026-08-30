"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const slidingWindowQuestions = [
  {
    question: "What is the primary advantage of the Sliding Window technique over a brute-force nested loop approach?",
    options: [
      "It requires less auxiliary space (O(1) vs O(N)).",
      "It reduces time complexity from O(N²) to O(N).",
      "It can be applied to unsorted arrays to find an exact element.",
      "It automatically sorts the array."
    ],
    correctAnswer: 1,
    explanation: "By avoiding repeated calculations of overlapping subarrays or substrings, Sliding Window reduces the overall time complexity to O(N)."
  },
  {
    question: "In a Variable-Size Sliding Window problem, when do you typically shrink the window from the left?",
    options: [
      "After every single iteration of the loop.",
      "When the right pointer reaches the end of the array.",
      "When the current window violates the problem's condition (e.g., sum exceeds target, duplicate found).",
      "When the left pointer catches up to the right pointer."
    ],
    correctAnswer: 2,
    explanation: "You expand the window until the condition is violated, then shrink it from the left until it becomes valid again."
  },
  {
    question: "Why is the time complexity of the Sliding Window technique O(N) even if there is a 'while' loop inside the 'for' loop?",
    options: [
      "Because the 'while' loop only executes O(log N) times.",
      "Because the left and right pointers only move forward, visiting each element at most twice.",
      "Because the compiler automatically optimizes nested loops.",
      "Because we break out of the loops early."
    ],
    correctAnswer: 1,
    explanation: "Each element is added to the window at most once (by the right pointer) and removed at most once (by the left pointer), resulting in O(N) total operations."
  },
  {
    question: "Which of the following problems is best solved using a Fixed-Size Sliding Window?",
    options: [
      "Longest Substring Without Repeating Characters",
      "Smallest Subarray with a sum greater than X",
      "Maximum Sum Subarray of Size K",
      "Minimum Window Substring"
    ],
    correctAnswer: 2,
    explanation: "Since the window size 'K' is fixed and given, it's a classic fixed-size sliding window problem. The others require dynamically adjusting the window size."
  },
  {
    question: "When applying a Sliding Window to a string to find the longest substring with K unique characters, what auxiliary data structure is most helpful to track characters inside the window?",
    options: [
      "A Stack",
      "A Queue",
      "A HashMap or Frequency Array",
      "A Priority Queue (Heap)"
    ],
    correctAnswer: 2,
    explanation: "A HashMap or Frequency Array is used to keep track of the count of each character currently in the window, allowing you to easily check if there are exactly K unique characters."
  }
];

const Quiz = () => {
  return <QuizEngine title="Sliding Window Technique Quiz" questions={slidingWindowQuestions} />;
};

export default Quiz;
