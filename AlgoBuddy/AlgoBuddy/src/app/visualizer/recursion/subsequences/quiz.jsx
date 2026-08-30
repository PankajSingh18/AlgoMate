"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const SubsequencesQuiz = () => {
  const questions = [
    {
      question: "How many subsequences (subsets) are generated recursively for a set of size N?",
      options: [
        "N",
        "N²",
        "2^N",
        "N!"
      ],
      correctAnswer: 2,
      explanation: "Since each of the N elements can either be taken or skipped, there are 2 * 2 * ... * 2 (N times) = 2^N total subsets."
    },
    {
      question: "What does the term 'backtracking' refer to in subsequences recursion?",
      options: [
        "Moving to a different topic in DSA",
        "Undoing the last decision (e.g. popping the element we just added) to explore another choice",
        "Decreasing the loop index counter to 0",
        "Throwing a compilation error on stack overflow"
      ],
      correctAnswer: 1,
      explanation: "Backtracking means restoring the state (e.g., removing the taken element via current.pop()) before exploring the alternate 'skip' choice."
    },
    {
      question: "For array [1, 2, 3], which of the following is NOT a valid subsequence?",
      options: [
        "[1, 3]",
        "[2, 1]",
        "[2, 3]",
        "[]"
      ],
      correctAnswer: 1,
      explanation: "A subsequence must preserve the original order of elements. In [1, 2, 3], '2' comes after '1', so [2, 1] is invalid."
    },
    {
      question: "What is the time complexity of generating all subsets recursively?",
      options: [
        "O(N)",
        "O(N log N)",
        "O(2^N)",
        "O(N!)"
      ],
      correctAnswer: 2,
      explanation: "Generating all subsets explores a binary decision tree of size 2^N, yielding O(2^N) exponential time complexity."
    },
    {
      question: "What is the maximum number of active stack frames on the call stack when generating subsequences for an array of size N?",
      options: [
        "2",
        "N + 1",
        "2^N",
        "N!"
      ],
      correctAnswer: 1,
      explanation: "The depth of the recursion tree is N. Hence, at most N+1 stack frames are active on the call stack at any one time."
    },
    {
  question: "What is a subsequence?",
  options: [
    "A contiguous part of an array",
    "A sequence obtained by deleting zero or more elements without changing the order",
    "A sorted array",
    "A reversed array"
  ],
  correctAnswer: 1,
  explanation:
    "A subsequence preserves the original order but does not require elements to be contiguous."
},
{
  question: "How many subsequences can an array of size N have?",
  options: [
    "N",
    "2N",
    "2^N",
    "N!"
  ],
  correctAnswer: 2,
  explanation:
    "Each element has two choices: include or exclude, resulting in 2^N subsequences."
},
{
  question: "Which recursion decision is made for every element while generating subsequences?",
  options: [
    "Swap or not swap",
    "Include or exclude",
    "Sort or reverse",
    "Increment or decrement"
  ],
  correctAnswer: 1,
  explanation:
    "Every element is either included in the current subsequence or excluded."
},
{
  question: "What is the base case when generating all subsequences recursively?",
  options: [
    "When the array is sorted",
    "When the index reaches the array length",
    "When the array becomes empty",
    "When one element remains"
  ],
  correctAnswer: 1,
  explanation:
    "Once the index reaches the end of the array, the current subsequence is complete."
},
{
  question: "What is the time complexity of generating all subsequences?",
  options: [
    "O(N)",
    "O(N log N)",
    "O(2^N)",
    "O(N²)"
  ],
  correctAnswer: 2,
  explanation:
    "All possible subsequences are generated, resulting in O(2^N) recursive calls."
},
{
  question: "What is the auxiliary space complexity of recursion for generating subsequences?",
  options: [
    "O(1)",
    "O(log N)",
    "O(N)",
    "O(2^N)"
  ],
  correctAnswer: 2,
  explanation:
    "The recursion stack grows to a maximum depth of N."
},
{
  question: "Which data structure is commonly used to store the current subsequence during recursion?",
  options: [
    "Queue",
    "Stack",
    "Vector or ArrayList",
    "HashMap"
  ],
  correctAnswer: 2,
  explanation:
    "A dynamic list (such as a vector or ArrayList) stores the elements of the current subsequence."
},
{
  question: "What happens after returning from the recursive call where an element was included?",
  options: [
    "The program terminates",
    "The included element is removed (backtracking)",
    "The array is sorted",
    "The recursion stops"
  ],
  correctAnswer: 1,
  explanation:
    "Backtracking removes the last added element before exploring the exclude path."
},
{
  question: "Why is backtracking important in generating subsequences?",
  options: [
    "It reduces time complexity",
    "It restores the current state before exploring another choice",
    "It sorts the subsequences",
    "It removes duplicate elements automatically"
  ],
  correctAnswer: 1,
  explanation:
    "Backtracking restores the previous state so that other recursive branches can be explored correctly."
},
{
  question: "Which classic problems are solved using recursion on subsequences?",
  options: [
    "Subset Sum",
    "Combination Sum",
    "Print All Subsequences",
    "All of the above"
  ],
  correctAnswer: 3,
  explanation:
    "Recursion on subsequences is the foundation for problems like Subset Sum, Combination Sum, and generating all subsequences."
},
  ];

  return <QuizEngine title="Subsequences Quiz" questions={questions} />;
};

export default SubsequencesQuiz;
