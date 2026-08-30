"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const HanoiQuiz = () => {
  const questions = [
    {
      question: "What is the recurrence relation for the number of moves required to solve the Tower of Hanoi with N disks?",
      options: [
        "T(N) = T(N - 1) + 1",
        "T(N) = 2T(N - 1) + 1",
        "T(N) = 2T(N - 1) + N",
        "T(N) = T(N - 1) + T(N - 2) + 1"
      ],
      correctAnswer: 1,
      explanation: "To solve N disks, we must recursively move N-1 disks to the auxiliary peg (T(N-1)), move the largest disk to the destination (1 move), and move the N-1 disks from auxiliary to destination (T(N-1)). Thus, T(N) = 2T(N-1) + 1."
    },
    {
      question: "What is the minimum number of moves required to solve a Tower of Hanoi puzzle with 4 disks?",
      options: [
        "7 moves",
        "10 moves",
        "15 moves",
        "31 moves"
      ],
      correctAnswer: 2,
      explanation: "Using the formula T(N) = 2^N - 1, for N = 4 we get 2^4 - 1 = 16 - 1 = 15 moves."
    },
    {
      question: "If we have 3 disks on Peg A (Source) and want to move them to Peg C (Destination) using Peg B (Auxiliary), what is the first step in the recursion?",
      options: [
        "Move disk 1 from A to B",
        "Move disk 1 from A to C",
        "Move disk 2 from A to B",
        "Move disk 3 from A to C"
      ],
      correctAnswer: 1,
      explanation: "To move 3 disks from A to C, we must first recursively move the top 2 disks (disks 1 and 2) from A to B. To move 2 disks from A to B using C, we recursively move the top 1 disk (disk 1) from A to C. So the first physical move is disk 1 from A to C."
    },
    {
      question: "What is the auxiliary space complexity of the recursive Tower of Hanoi algorithm?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(2^N)"
      ],
      correctAnswer: 2,
      explanation: "The space complexity is determined by the maximum height of the recursion tree on the call stack. Since we recurse down to 1 disk in a linear branch, the maximum number of simultaneous stack frames is N. Thus, the space complexity is O(N)."
    },
    {
      question: "Which of the following is NOT a rule of the Tower of Hanoi puzzle?",
      options: [
        "Only one disk can be moved at a time.",
        "A disk can only be placed on a larger disk or an empty peg.",
        "A disk can only be moved from the top of its stack.",
        "Disks must be moved directly from source to destination without using the auxiliary peg."
      ],
      correctAnswer: 3,
      explanation: "Disks are allowed (and must be) moved using the auxiliary peg. The auxiliary peg is essential to act as temporary storage to solve the puzzle."
    }
  ];

  return <QuizEngine title="Tower of Hanoi Recursion Quiz" questions={questions} />;
};

export default HanoiQuiz;
