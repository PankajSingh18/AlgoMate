"use client";

import QuizEngine from "@/app/components/ui/QuizEngine";

export default function HeapQuiz() {
  const questions = [
    {
      question: "In a Min Heap, where is the smallest element located?",
      options: ["Any leaf node", "Root node", "Last array index", "Middle level"],
      correctAnswer: 1,
      explanation: "Min Heap keeps the minimum value at index 0 (the root).",
    },
    {
      question: "After extracting root from a heap, what is the first correction step?",
      options: ["Run BFS", "Insert a random value", "Place last node at root", "Reverse array"],
      correctAnswer: 2,
      explanation: "Heap extraction replaces root with last node before heapify down.",
    },
    {
      question: "What is the time complexity of insert in a binary heap?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
      correctAnswer: 1,
      explanation: "Insert may travel up the tree height, which is log N.",
    },
  ];

  return <QuizEngine title="Heap Operations Quiz" questions={questions} />;
}
