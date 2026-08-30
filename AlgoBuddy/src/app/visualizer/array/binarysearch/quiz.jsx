"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BinarySearchQuiz = () => {
  const questions = [
    {
      question: "What is the primary requirement for binary search to work?",
      options: [
        "The list must be unsorted",
        "The list must be sorted",
        "The list must contain only numbers",
        "The list must be small in size"
      ],
      correctAnswer: 1,
      explanation: "Binary search requires the list to be sorted beforehand because it relies on comparing the target value to the middle element to determine which half of the list to search next."
    },
    {
      question: "What is the time complexity of binary search in the worst case?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 1,
      explanation: "In the worst case (when the target is not present), binary search has a time complexity of O(log n) because it halves the search space with each comparison."
    },
    {
      question: "In the array [1, 3, 5, 7, 9, 11, 13], how many comparisons are needed to find the number 5?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 2,
      explanation: "First comparison: middle is 7 (too high). Second comparison: new middle is 3 (too low). Third comparison: finds 5."
    },
    {
      question: "What is the best-case scenario for binary search?",
      options: [
        "Target is at the beginning of the list",
        "Target is at the end of the list",
        "Target is the middle element",
        "Target is not in the list"
      ],
      correctAnswer: 2,
      explanation: "The best case occurs when the target is the middle element of the array, requiring only one comparison (O(1))."
    },
    {
      question: "What would binary search return if the target value is not in the list?",
      options: [
        "The first element",
        "The last element",
        "An error message",
        "A 'not found' indication"
      ],
      correctAnswer: 3,
      explanation: "When the target isn't found, binary search typically returns a special value (like -1 or 'not found') to indicate this."
    },
    {
  question: "Why is binary search faster than linear search for large sorted arrays?",
  options: [
    "It checks every element",
    "It divides the search space in half each step",
    "It uses recursion only",
    "It sorts the array during searching"
  ],
  correctAnswer: 1,
  explanation: "Binary search halves the remaining search space after every comparison, resulting in O(log n) time complexity."
},
{
  question: "Which data structure is most suitable for binary search?",
  options: [
    "Unsorted Array",
    "Sorted Array",
    "Queue",
    "Graph"
  ],
  correctAnswer: 1,
  explanation: "Binary search requires the data to be sorted so that half of the search space can be discarded after each comparison."
},
{
  question: "If a sorted array has 16 elements, what is the maximum number of comparisons needed in binary search?",
  options: [
    "4",
    "8",
    "16",
    "5"
  ],
  correctAnswer: 0,
  explanation: "Since log₂(16) = 4, binary search requires at most 4 comparisons in the ideal implementation."
},
{
  question: "What happens if binary search is applied to an unsorted array?",
  options: [
    "It always works correctly",
    "It may return incorrect results",
    "It sorts the array automatically",
    "It becomes O(1)"
  ],
  correctAnswer: 1,
  explanation: "Binary search assumes the array is sorted. On unsorted data, the search decisions become invalid."
},
{
  question: "Which algorithm generally performs better on large sorted datasets?",
  options: [
    "Linear Search",
    "Binary Search",
    "Bubble Sort",
    "Selection Sort"
  ],
  correctAnswer: 1,
  explanation: "Binary Search has O(log n) complexity, making it much faster than Linear Search on large sorted datasets."
}
  ];

  return <QuizEngine title="Binary Search Quiz Challenge" questions={questions} />;
};

export default BinarySearchQuiz;
