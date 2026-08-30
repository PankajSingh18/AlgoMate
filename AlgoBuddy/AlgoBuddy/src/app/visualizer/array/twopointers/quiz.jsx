"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const twoPointersQuestions = [
  {
    question: "What is the primary advantage of the Two Pointers technique over a brute-force nested loop?",
    options: [
      "It works on unsorted arrays without any preprocessing.",
      "It reduces time complexity from O(N²) to O(N).",
      "It reduces space complexity from O(N) to O(log N).",
      "It eliminates the need for any comparisons."
    ],
    correctAnswer: 1,
    explanation: "By moving two pointers strategically instead of checking all pairs, Two Pointers reduces time complexity from O(N²) to O(N)."
  },
  {
    question: "For the Pair Sum problem using Two Pointers, what is a prerequisite for the input array?",
    options: [
      "The array must contain only positive integers.",
      "The array must have an even number of elements.",
      "The array must be sorted.",
      "The array must not contain duplicates."
    ],
    correctAnswer: 2,
    explanation: "The opposite-direction Two Pointers approach for Pair Sum relies on the sorted order to decide whether to move the left pointer right (increase sum) or the right pointer left (decrease sum)."
  },
  {
    question: "In the Remove Duplicates problem using slow/fast pointers, what does the slow pointer represent?",
    options: [
      "The current element being compared.",
      "The boundary of the unique elements processed so far.",
      "The last duplicate found.",
      "The middle of the array."
    ],
    correctAnswer: 1,
    explanation: "The slow pointer marks the end of the valid (unique) region. It only advances when the fast pointer finds a new unique element."
  },
  {
    question: "In the Container With Most Water problem, if arr[left] < arr[right], which pointer should you move and why?",
    options: [
      "Move right left — to find a taller right boundary.",
      "Move left right — the left height is the bottleneck; moving it may find a taller boundary.",
      "Move both pointers inward simultaneously.",
      "Keep both pointers fixed and compute for all inner pairs."
    ],
    correctAnswer: 1,
    explanation: "The area is limited by the shorter height. Moving the taller pointer inward can only decrease width without increasing height, so we move the shorter (left) pointer to potentially find a taller one."
  },
  {
    question: "Why is the Two Pointers technique O(N) even though each step involves two pointer comparisons?",
    options: [
      "Because one pointer never moves.",
      "Because each pointer only moves forward and each element is visited at most once per pointer.",
      "Because the compiler merges the two loops.",
      "Because we break early when a match is found."
    ],
    correctAnswer: 1,
    explanation: "Each pointer traverses the array at most once in a single direction. Total steps = at most 2N, which simplifies to O(N)."
  }
];

const Quiz = () => {
  return <QuizEngine title="Two Pointers Technique Quiz" questions={twoPointersQuestions} />;
};

export default Quiz;