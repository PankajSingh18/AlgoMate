"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const FibonacciQuiz = () => {
  const questions = [
    {
      question: "Why is the recursive implementation of Fibonacci called 'Tree Recursion'?",
      options: [
        "It stores values in a Binary Search Tree",
        "The function calls itself twice per step, creating a branching tree-like execution structure",
        "It only works on Tree data structures",
        "It returns a tree-like nested list of numbers"
      ],
      correctAnswer: 1,
      explanation: "Because the function makes multiple (specifically two) recursive calls inside the recursive step, the execution flow branches like a binary tree."
    },
    {
      question: "For fib(4), how many times is the sub-problem fib(2) executed/called?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 1,
      explanation: "Tracing the tree: fib(4) calls fib(3) and fib(2). fib(3) calls fib(2) and fib(1). Thus, fib(2) is called twice: once as a direct child of fib(4), and once as a child of fib(3)."
    },
    {
      question: "What is the primary drawback of the naive recursive Fibonacci algorithm?",
      options: [
        "It consumes too much disk storage",
        "It performs a massive amount of redundant/duplicate calculations for the same states",
        "It requires a graph layout library to run",
        "It has a space complexity of O(2^N)"
      ],
      correctAnswer: 1,
      explanation: "The lack of memoization or tracking calculated values causes the function to calculate the same sub-problems repeatedly, leading to poor performance."
    },
    {
      question: "Although the time complexity of naive fib(N) is exponential, what is its space complexity (stack depth)?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(2^N)"
      ],
      correctAnswer: 2,
      explanation: "The call stack only holds active frames on the current path from the root to a leaf node. Since the height of the recursion tree is N, the space complexity is linear, O(N)."
    },
    {
      question: "Which optimization technique stores previously computed values of fib(x) to prevent redundant calls?",
      options: [
        "Memoization (caching)",
        "De-escalation",
        "Array flattening",
        "LIFO frame clearing"
      ],
      correctAnswer: 0,
      explanation: "Memoization caches the results of function calls so that when the same inputs occur again, the cached value can be returned instantly, optimizing time complexity to O(N)."
    },
    {
  question: "What are the base cases of the Fibonacci recursive function?",
  options: [
    "n == 0 and n == 1",
    "n == 1 and n == 2",
    "n == 2 only",
    "n == 0 only"
  ],
  correctAnswer: 0,
  explanation:
    "The Fibonacci sequence starts with fib(0) = 0 and fib(1) = 1, which are the base cases."
},
{
  question: "Which recursive formula is used to compute Fibonacci numbers?",
  options: [
    "fib(n) = fib(n - 1)",
    "fib(n) = fib(n - 1) + fib(n - 2)",
    "fib(n) = n × fib(n - 1)",
    "fib(n) = fib(n / 2)"
  ],
  correctAnswer: 1,
  explanation:
    "Each Fibonacci number is the sum of the previous two Fibonacci numbers."
},
{
  question: "Why does the recursion tree grow rapidly for larger values of n?",
  options: [
    "Each function call creates two more recursive calls",
    "The compiler duplicates the function",
    "The stack stores duplicate values",
    "The array size doubles"
  ],
  correctAnswer: 0,
  explanation:
    "Every non-base call generates two recursive calls, causing exponential growth."
},
{
  question: "What is the approximate time complexity of the naive recursive Fibonacci algorithm?",
  options: [
    "O(log N)",
    "O(N)",
    "O(2^N)",
    "O(N²)"
  ],
  correctAnswer: 2,
  explanation:
    "The recursion tree grows exponentially because of repeated calculations."
},
{
  question: "Which value is returned by fib(6)?",
  options: [
    "5",
    "8",
    "13",
    "21"
  ],
  correctAnswer: 1,
  explanation:
    "The sequence is 0, 1, 1, 2, 3, 5, 8. Therefore fib(6) = 8."
},
{
  question: "Which traversal best represents recursive execution in Fibonacci?",
  options: [
    "Depth-First Search (DFS)",
    "Breadth-First Search (BFS)",
    "Binary Search",
    "Linear Search"
  ],
  correctAnswer: 0,
  explanation:
    "Recursive calls are executed depth-first using the call stack."
},
{
  question: "Why is memoization effective for Fibonacci recursion?",
  options: [
    "It reduces stack size to O(1)",
    "It avoids recalculating the same Fibonacci values",
    "It removes recursion completely",
    "It increases recursion depth"
  ],
  correctAnswer: 1,
  explanation:
    "Memoization stores previously computed Fibonacci values, eliminating duplicate work."
},
{
  question: "Which data structure is naturally used during recursive execution?",
  options: [
    "Queue",
    "Stack",
    "Heap",
    "Linked List"
  ],
  correctAnswer: 1,
  explanation:
    "Recursive function calls are managed using the call stack."
},
{
  question: "Which statement is TRUE about multiple recursive calls?",
  options: [
    "Only one recursive call is made",
    "The function calls itself multiple times before returning",
    "Recursion is replaced by loops",
    "The function never reaches a base case"
  ],
  correctAnswer: 1,
  explanation:
    "Multiple recursive calls occur when a function invokes itself more than once in a single execution."
},
{
  question: "Which algorithm is the classic example of multiple recursive calls?",
  options: [
    "Linear Search",
    "Bubble Sort",
    "Fibonacci Recursion",
    "Insertion Sort"
  ],
  correctAnswer: 2,
  explanation:
    "The Fibonacci recursive algorithm is one of the most common examples of multiple recursive calls."
},

  ];

  return <QuizEngine title="Fibonacci Recursion Quiz" questions={questions} />;
};

export default FibonacciQuiz;
