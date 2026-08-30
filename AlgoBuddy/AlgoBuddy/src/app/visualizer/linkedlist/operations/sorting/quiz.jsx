"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
const questions = [
  {
    question: "Which sorting algorithm is most commonly used for linked lists?",
    options: [
      "Bubble Sort",
      "Selection Sort",
      "Merge Sort",
      "Insertion Sort"
    ],
    correctAnswer: 2,
    explanation: "Merge Sort is preferred for linked lists because it does not require random access and works efficiently with node pointers."
  },
  {
    question: "What is the time complexity of Merge Sort on a linked list?",
    options: [
      "O(n²)",
      "O(n log n)",
      "O(log n)",
      "O(n)"
    ],
    correctAnswer: 1,
    explanation: "Merge Sort divides the list recursively and merges sorted halves, resulting in O(n log n) time complexity."
  },
  {
    question: "Why is Merge Sort preferred over Quick Sort for linked lists?",
    options: [
      "It uses less memory",
      "It is easier to implement",
      "It does not require random access",
      "It is always faster"
    ],
    correctAnswer: 2,
    explanation: "Linked lists do not support efficient random access, making Merge Sort a better choice."
  },
  {
    question: "What is the first step in Merge Sort for a linked list?",
    options: [
      "Swap adjacent nodes",
      "Find the middle node",
      "Delete duplicate nodes",
      "Reverse the list"
    ],
    correctAnswer: 1,
    explanation: "Merge Sort starts by finding the middle node and splitting the list into two halves."
  },
  {
    question: "What happens after splitting the linked list into two halves?",
    options: [
      "The halves are reversed",
      "The halves are recursively sorted",
      "The list is deleted",
      "The nodes are shuffled"
    ],
    correctAnswer: 1,
    explanation: "Each half is recursively sorted before being merged back together."
  },
  {
    question: "What is the purpose of the merge step in Merge Sort?",
    options: [
      "To remove duplicates",
      "To combine two sorted lists into one sorted list",
      "To reverse the list",
      "To find the largest element"
    ],
    correctAnswer: 1,
    explanation: "The merge step combines two sorted sublists while maintaining sorted order."
  },
  {
    question: "What is the space complexity of Merge Sort on a linked list due to recursion?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "The recursive call stack requires O(log n) extra space."
  },
  {
    question: "Which pointer technique is commonly used to find the middle of a linked list?",
    options: [
      "Head and Tail",
      "Previous and Current",
      "Slow and Fast",
      "Left and Right"
    ],
    correctAnswer: 2,
    explanation: "The slow and fast pointer technique efficiently finds the middle node."
  },
  {
    question: "What should be true about the two lists before performing the merge operation?",
    options: [
      "Both lists must be reversed",
      "Both lists must be sorted",
      "Both lists must have equal length",
      "Both lists must be circular"
    ],
    correctAnswer: 1,
    explanation: "Merge Sort merges two already sorted lists into a larger sorted list."
  },
  {
    question: "What will be the result after completing the sorting process?",
    options: [
      "Nodes arranged in sorted order",
      "Nodes arranged in reverse order",
      "A circular linked list",
      "An empty linked list"
    ],
    correctAnswer: 0,
    explanation: "The final output is a linked list whose nodes are arranged in ascending (or specified) sorted order."
  }
];

  return <QuizEngine title="Sorting Quiz Challenge" questions={questions} />;
};

export default Quiz;
