"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const HeapSortQuiz = () => {
  const questions = [
    {
      question: "What data structure is Heap Sort based on?",
      options: [
        "Queue",
        "Heap",
        "Stack",
        "Linked List"
      ],
      correctAnswer: 1,
      explanation:
        "Heap Sort is based on the Heap data structure, usually implemented as a Binary Max Heap."
    },
    {
      question: "What is the worst-case time complexity of Heap Sort?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort has a worst-case time complexity of O(n log n)."
    },
    {
      question: "Which type of heap is used for sorting an array in ascending order?",
      options: [
        "Min Heap",
        "Max Heap",
        "AVL Tree",
        "Binary Search Tree"
      ],
      correctAnswer: 1,
      explanation:
        "A Max Heap is used so the largest element is repeatedly placed at the end."
    },
    {
      question: "What is the auxiliary space complexity of Heap Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation:
        "Heap Sort is an in-place sorting algorithm and uses constant extra space."
    },
    {
      question: "Is Heap Sort a stable sorting algorithm?",
      options: [
        "Yes",
        "No",
        "Only for integers",
        "Depends on the input"
      ],
      correctAnswer: 1,
      explanation:
        "Heap Sort is not stable because equal elements may not preserve their relative order."
    },
    {
      question: "What is the first step of Heap Sort?",
      options: [
        "Choose a pivot",
        "Build a Max Heap",
        "Merge subarrays",
        "Reverse the array"
      ],
      correctAnswer: 1,
      explanation:
        "The algorithm first converts the input array into a Max Heap."
    },
    {
      question: "After building the Max Heap, what happens next?",
      options: [
        "Delete the smallest element",
        "Swap the root with the last element",
        "Split the array",
        "Insert a new value"
      ],
      correctAnswer: 1,
      explanation:
        "The largest element at the root is swapped with the last element, then heapify is performed."
    },
    {
      question: "Heap Sort uses which tree structure?",
      options: [
        "AVL Tree",
        "Binary Heap",
        "Trie",
        "Red-Black Tree"
      ],
      correctAnswer: 1,
      explanation:
        "Heap Sort uses a Binary Heap, which is a complete binary tree."
    },
    {
      question: "In a Max Heap, the parent node is:",
      options: [
        "Smaller than its children",
        "Greater than or equal to its children",
        "Equal to its children",
        "Always a leaf node"
      ],
      correctAnswer: 1,
      explanation:
        "Every parent node in a Max Heap is greater than or equal to its children."
    },
    {
      question: "Heap Sort belongs to which category?",
      options: [
        "Comparison-based sorting",
        "Non-comparison sorting",
        "Hashing algorithm",
        "Searching algorithm"
      ],
      correctAnswer: 0,
      explanation:
        "Heap Sort is a comparison-based sorting algorithm."
    },
    {
      question: "What is the best-case time complexity of Heap Sort?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort performs O(n log n) in the best, average, and worst cases."
    },
    {
      question: "Which operation is repeatedly used in Heap Sort?",
      options: [
        "Merge",
        "Partition",
        "Heapify",
        "Insertion"
      ],
      correctAnswer: 2,
      explanation:
        "Heapify restores the heap property after every swap."
    },
    {
      question: "Heap Sort guarantees which time complexity?",
      options: [
        "O(n)",
        "O(log n)",
        "O(n log n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort always guarantees O(n log n) performance."
    },
    {
      question: "Heap Sort is mainly preferred because it:",
      options: [
        "Is stable",
        "Needs no comparisons",
        "Provides guaranteed O(n log n) performance",
        "Uses recursion only"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort has guaranteed O(n log n) time complexity regardless of input."
    },
    {
      question: "Which statement about Heap Sort is correct?",
      options: [
        "It is stable",
        "It requires O(n) extra memory",
        "It is an in-place comparison sorting algorithm",
        "It works only for integers"
      ],
      correctAnswer: 2,
      explanation:
        "Heap Sort is an in-place comparison sorting algorithm."
    }
  ];

  return (
    <QuizEngine
      title="Heap Sort Quiz Challenge"
      questions={questions}
    />
  );
};

export default HeapSortQuiz;