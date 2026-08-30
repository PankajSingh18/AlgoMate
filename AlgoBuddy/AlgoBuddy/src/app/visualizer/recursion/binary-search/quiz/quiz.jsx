"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const RecursiveBinarySearchQuiz = () => {
  const questions = [
    {
      question: "What is the prerequisite for Recursive Binary Search?",
      options: [
        "The array must be sorted",
        "The array must be reversed",
        "The array must contain only positive numbers",
        "The array must be unsorted",
      ],
      correctAnswer: 0,
      explanation:
        "Binary Search requires the array to be sorted before searching.",
    },
    {
      question: "What is the base case when the target is found?",
      options: [
        "low > high",
        "arr[mid] === target",
        "mid === 0",
        "high === low",
      ],
      correctAnswer: 1,
      explanation:
        "The recursion stops immediately when the middle element equals the target.",
    },
    {
      question: "If the target is smaller than the middle element, where does the recursive search continue?",
      options: [
        "Left half",
        "Right half",
        "Entire array",
        "It stops",
      ],
      correctAnswer: 0,
      explanation:
        "The algorithm recursively searches the left half of the array.",
    },
    {
      question: "What is the worst-case time complexity of Recursive Binary Search?",
      options: [
        "O(N)",
        "O(log N)",
        "O(N²)",
        "O(1)",
      ],
      correctAnswer: 1,
      explanation:
        "Each recursive call halves the search space, giving O(log N).",
    },
    {
      question: "What happens when low becomes greater than high?",
      options: [
        "The element is found",
        "The search continues",
        "The element is not present",
        "The array is sorted",
      ],
      correctAnswer: 2,
      explanation:
        "When low > high, there are no elements left to search.",
    },
    {
      question: "Which recursive call is made when the target is greater than the middle element?",
      options: [
        "binarySearch(low, mid - 1)",
        "binarySearch(mid + 1, high)",
        "binarySearch(low, high)",
        "binarySearch(mid, high)",
      ],
      correctAnswer: 1,
      explanation:
        "The search continues in the right half.",
    },
    {
      question: "What is the space complexity of Recursive Binary Search?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)",
      ],
      correctAnswer: 1,
      explanation:
        "The recursion depth is logarithmic, so stack space is O(log N).",
    },
    {
      question: "Which technique does Recursive Binary Search use?",
      options: [
        "Greedy",
        "Divide and Conquer",
        "Dynamic Programming",
        "Backtracking",
      ],
      correctAnswer: 1,
      explanation:
        "Binary Search repeatedly divides the search space into halves.",
    },
    {
      question: "How many recursive calls are made in each recursive step?",
      options: [
        "One",
        "Two",
        "Three",
        "Four",
      ],
      correctAnswer: 0,
      explanation:
        "Only one recursive call is made depending on the comparison result.",
    },
    {
      question: "Why is Recursive Binary Search faster than Linear Search?",
      options: [
        "It checks every element",
        "It halves the search space every step",
        "It uses two arrays",
        "It sorts automatically",
      ],
      correctAnswer: 1,
      explanation:
        "Binary Search eliminates half of the remaining elements after each comparison.",
    },
    {
  question: "What is the purpose of calculating the middle index in Recursive Binary Search?",
  options: [
    "To divide the search space into two halves",
    "To sort the array",
    "To find the largest element",
    "To reverse the array"
  ],
  correctAnswer: 0,
  explanation:
    "The middle index divides the array into two halves so that one half can be discarded after each comparison."
},
{
  question: "What value is typically returned if the target element is not found?",
  options: [
    "-1",
    "0",
    "1",
    "The last index"
  ],
  correctAnswer: 0,
  explanation:
    "Most Recursive Binary Search implementations return -1 to indicate that the target element does not exist in the array."
},
{
  question: "Which statement correctly updates the search range when searching the left half?",
  options: [
    "high = mid - 1",
    "low = mid + 1",
    "low = mid",
    "high = mid + 1"
  ],
  correctAnswer: 0,
  explanation:
    "When the target is smaller than the middle element, the search continues in the left half by updating high to mid - 1."
},
{
  question: "Approximately how many comparisons are needed to search an array of 32 elements in the worst case?",
  options: [
    "5",
    "16",
    "32",
    "64"
  ],
  correctAnswer: 0,
  explanation:
    "Since log₂(32) = 5, Binary Search requires at most about 5 comparisons."
},
{
  question: "Why is Recursive Binary Search considered efficient for large datasets?",
  options: [
    "Because it reduces the search space by half after each comparison",
    "Because it checks every element one by one",
    "Because it always finds the element in one comparison",
    "Because it sorts the array during the search"
  ],
  correctAnswer: 0,
  explanation:
    "By eliminating half of the remaining elements after every comparison, Recursive Binary Search achieves O(log N) time complexity."
}
  ];

  return (
    <QuizEngine
      title="Recursive Binary Search Quiz"
      questions={questions}
    />
  );
};

export default RecursiveBinarySearchQuiz;