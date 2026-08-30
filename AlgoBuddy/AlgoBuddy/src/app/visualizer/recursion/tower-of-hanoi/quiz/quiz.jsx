"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const TowerOfHanoiQuiz = () => {
  const questions = [
    {
      question: "What is the objective of the Tower of Hanoi problem?",
      options: [
        "Sort the disks",
        "Move all disks from source to destination following the rules",
        "Find the largest disk",
        "Reverse the stack"
      ],
      correctAnswer: 1,
      explanation: "The goal is to move all disks from the source rod to the destination rod while following the puzzle's rules."
    },
    {
      question: "How many rods are used in the Tower of Hanoi puzzle?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 1,
      explanation: "The classic Tower of Hanoi puzzle consists of three rods."
    },
    {
      question: "How many disks can be moved at one time?",
      options: [
        "Only one",
        "Two",
        "Three",
        "Any number"
      ],
      correctAnswer: 0,
      explanation: "Only one disk may be moved during each step."
    },
    {
      question: "Can a larger disk be placed on top of a smaller disk?",
      options: [
        "Yes",
        "No",
        "Only once",
        "Only for the last move"
      ],
      correctAnswer: 1,
      explanation: "A larger disk can never be placed on top of a smaller disk."
    },
    {
      question: "What is the base case in the recursive solution?",
      options: [
        "n == 0 or n == 1",
        "n == 5",
        "n == 10",
        "No base case"
      ],
      correctAnswer: 0,
      explanation: "When only one disk remains, it is moved directly."
    },
    {
      question: "Which algorithmic technique is used in Tower of Hanoi?",
      options: [
        "Greedy",
        "Divide and Conquer",
        "Dynamic Programming",
        "Hashing"
      ],
      correctAnswer: 1,
      explanation: "Tower of Hanoi is solved using Divide and Conquer recursion."
    },
    {
      question: "What is the minimum number of moves required for 3 disks?",
      options: [
        "5",
        "6",
        "7",
        "8"
      ],
      correctAnswer: 2,
      explanation: "2³ − 1 = 7 moves."
    },
    {
      question: "What is the formula for the minimum number of moves?",
      options: [
        "2ⁿ − 1",
        "n²",
        "n!",
        "2n"
      ],
      correctAnswer: 0,
      explanation: "The minimum number of moves required is 2ⁿ − 1."
    },
    {
      question: "What is the time complexity of Tower of Hanoi?",
      options: [
        "O(log n)",
        "O(n)",
        "O(2ⁿ)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "The recursive solution requires 2ⁿ − 1 moves."
    },
    {
      question: "What is the space complexity of Tower of Hanoi recursion?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "The recursion stack grows to a depth of n."
    },
    {
      question: "Which rod is used as temporary storage?",
      options: [
        "Source",
        "Destination",
        "Auxiliary",
        "None"
      ],
      correctAnswer: 2,
      explanation: "The auxiliary rod temporarily holds disks during recursion."
    },
    {
      question: "How many recursive calls are made for each non-base case?",
      options: [
        "One",
        "Two",
        "Three",
        "Four"
      ],
      correctAnswer: 1,
      explanation: "Each recursive step makes two recursive calls."
    },
    {
      question: "How many moves are required for 4 disks?",
      options: [
        "15",
        "16",
        "17",
        "18"
      ],
      correctAnswer: 0,
      explanation: "2⁴ − 1 = 15 moves."
    },
    {
      question: "What happens between the two recursive calls?",
      options: [
        "Move the largest disk",
        "Sort the disks",
        "Reverse the rods",
        "Stop recursion"
      ],
      correctAnswer: 0,
      explanation: "The largest remaining disk is moved between the two recursive calls."
    },
    {
      question: "Why is Tower of Hanoi considered a classic recursion problem?",
      options: [
        "It demonstrates recursive decomposition into smaller subproblems.",
        "It avoids recursion.",
        "It uses loops only.",
        "It requires sorting."
      ],
      correctAnswer: 0,
      explanation: "The puzzle naturally breaks into smaller recursive problems."
    }
  ];

  return (
    <QuizEngine
      title="Tower of Hanoi Recursion Quiz"
      questions={questions}
    />
  );
};

export default TowerOfHanoiQuiz;