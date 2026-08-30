"use client";

import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const RecursionTreesQuiz = () => {
  const questions = [
    {
  question: "What is a recursion tree?",
  options: [
    "A Binary Search Tree",
    "A visual representation of recursive function calls",
    "A linked list",
    "A graph traversal algorithm"
  ],
  correctAnswer: 1,
  explanation:
    "A recursion tree illustrates how recursive calls are generated and how they relate to each other."
},
{
  question: "What does each node in a recursion tree represent?",
  options: [
    "A variable",
    "A recursive function call",
    "An array element",
    "A loop iteration"
  ],
  correctAnswer: 1,
  explanation:
    "Each node corresponds to one invocation of the recursive function."
},
{
  question: "The root of a recursion tree represents:",
  options: [
    "The last recursive call",
    "The initial function call",
    "The base case",
    "The final answer"
  ],
  correctAnswer: 1,
  explanation:
    "The root node is the original function call made by the program."
},
{
  question: "Why are recursion trees useful?",
  options: [
    "To visualize recursive execution",
    "To sort arrays",
    "To search graphs",
    "To reduce recursion depth"
  ],
  correctAnswer: 0,
  explanation:
    "Recursion trees help understand recursive calls, repeated work, and time complexity."
},
{
  question: "Which recursive algorithm commonly forms a binary recursion tree?",
  options: [
    "Factorial",
    "Linear Search",
    "Fibonacci",
    "Bubble Sort"
  ],
  correctAnswer: 2,
  explanation:
    "Each Fibonacci call generates two recursive calls, forming a binary recursion tree."
},
{
  question: "The leaves of a recursion tree usually represent:",
  options: [
    "Recursive calls",
    "Base cases",
    "Sorting operations",
    "Loops"
  ],
  correctAnswer: 1,
  explanation:
    "Leaf nodes occur when recursion reaches the base condition."
},
{
  question: "What can recursion trees help estimate?",
  options: [
    "Time complexity",
    "Memory address",
    "CPU frequency",
    "Network speed"
  ],
  correctAnswer: 0,
  explanation:
    "By counting work at each level, recursion trees help estimate overall time complexity."
},
{
  question: "What happens to recursion tree nodes after returning from recursion?",
  options: [
    "They remain forever",
    "They are removed as the call stack unwinds",
    "They become arrays",
    "They are sorted"
  ],
  correctAnswer: 1,
  explanation:
    "As recursive calls return, their stack frames are removed."
},
{
  question: "Which traversal best matches recursive execution?",
  options: [
    "Breadth-First Search",
    "Depth-First Search",
    "Level Order",
    "Binary Search"
  ],
  correctAnswer: 1,
  explanation:
    "Recursive calls naturally follow Depth-First Search."
},
{
  question: "A recursion tree with repeated subproblems often suggests using:",
  options: [
    "Memoization",
    "Bubble Sort",
    "Binary Search",
    "Hash Table only"
  ],
  correctAnswer: 0,
  explanation:
    "Memoization stores previously computed results to avoid repeated recursive work."
},
{
  question: "In a recursion tree, what does the height of the tree usually represent?",
  options: [
    "The number of loops in the program",
    "The maximum recursion depth",
    "The number of variables",
    "The number of array elements"
  ],
  correctAnswer: 1,
  explanation:
    "The height of a recursion tree corresponds to the maximum depth of recursive calls before reaching the base case."
},
{
  question: "Why do some recursion trees grow exponentially?",
  options: [
    "Because each recursive call creates multiple new recursive calls",
    "Because arrays are sorted recursively",
    "Because recursion uses loops",
    "Because the compiler duplicates the code"
  ],
  correctAnswer: 0,
  explanation:
    "When each recursive call generates multiple child calls (such as in Fibonacci), the number of nodes grows exponentially."
},
{
  question: "Which part of a recursion tree helps identify repeated subproblems?",
  options: [
    "The root node",
    "The leaf nodes",
    "Repeated branches containing identical function calls",
    "The tree height"
  ],
  correctAnswer: 2,
  explanation:
    "Repeated branches indicate the same subproblems are being solved multiple times, suggesting optimization through memoization."
},
{
  question: "What happens to the recursion tree after all recursive calls complete?",
  options: [
    "It remains in memory permanently",
    "The call stack unwinds and all recursive frames are removed",
    "It becomes a binary tree",
    "It is converted into an array"
  ],
  correctAnswer: 1,
  explanation:
    "As each recursive call returns, its stack frame is removed until the recursion completely finishes."
},
{
  question: "Which optimization technique eliminates repeated computations visible in a recursion tree?",
  options: [
    "Memoization",
    "Selection Sort",
    "Binary Search",
    "Breadth-First Search"
  ],
  correctAnswer: 0,
  explanation:
    "Memoization stores previously computed results, preventing repeated evaluation of identical recursive calls."
}
  ];

  return (
    <QuizEngine
      title="Recursion Trees Quiz Challenge"
      questions={questions}
    />
  );
};

export default RecursionTreesQuiz;