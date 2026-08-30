"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
  const questions = [
    {
      question: "What is the time complexity of finding the largest rectangle in a histogram using a Monotonic Stack?",
      options: [
        "O(1)",
        "O(N)",
        "O(N log N)",
        "O(N^2)"
      ],
      correctAnswer: 1,
      explanation: "Using a monotonic stack, each element is pushed and popped at most once. Therefore, the algorithm runs in linear time."
    },
    {
      question: "In the monotonic stack approach for the Largest Rectangle problem, what kind of order does the stack maintain?",
      options: [
        "Strictly decreasing order of heights",
        "Strictly increasing order of heights",
        "Non-decreasing order of heights (Monotonic Increasing Stack)",
        "Random order based on indices"
      ],
      correctAnswer: 2,
      explanation: "The stack stores indices in a way that the corresponding heights are always in an increasing (or non-decreasing) order from bottom to top."
    },
    {
      question: "When do we pop an element from the stack?",
      options: [
        "When the stack is full",
        "When the current bar's height is greater than the height of the bar at the top of the stack",
        "When the current bar's height is less than the height of the bar at the top of the stack",
        "We never pop elements, we only push"
      ],
      correctAnswer: 2,
      explanation: "When we encounter a smaller bar, it means we have found the right boundary (Next Smaller Element) for the rectangle of the bar at the top of the stack. So, we pop the top element to calculate its maximum possible area."
    },
    {
      question: "After popping an element to calculate area, what represents the left boundary (Previous Smaller Element) of its rectangle?",
      options: [
        "The next element to be pushed onto the stack",
        "The newly revealed element at the top of the stack after popping",
        "The very bottom element of the stack",
        "Index 0"
      ],
      correctAnswer: 1,
      explanation: "Because the stack is monotonic increasing, the element right below the popped element is the nearest bar to its left that is strictly smaller."
    },
    {
      question: "What is the space complexity of the Monotonic Stack approach?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N^2)"
      ],
      correctAnswer: 2,
      explanation: "In the worst case (e.g., when the histogram heights are continuously increasing), we might push all N indices onto the stack."
    }
  ];

  return <QuizEngine title="Monotonic Stack Quiz Challenge" questions={questions} />;
};

export default Quiz;
