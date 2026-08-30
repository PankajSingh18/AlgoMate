"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const DsuQuiz = () => {
  const questions = [
    {
      question: "What is the worst-case time complexity of a single Find operation in a DSU containing N elements without any optimizations?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      correctAnswer: 2,
      explanation: "Without Path Compression or Union by Rank, Union operations can link nodes into a single straight line, turning the disjoint set tree into a degenerate linked list where a Find requires O(N) operations."
    },
    {
      question: "Which optimization ensures that a tree's height is kept as small as possible by always attaching the shallower tree under the root of the deeper tree?",
      options: [
        "Path Compression",
        "Union by Rank / Size",
        "Lazy Propagation",
        "Amortized Balancing"
      ],
      correctAnswer: 1,
      explanation: "Union by Rank (or Size) always hooks the root of the tree with smaller rank/size to the root of the tree with larger rank/size. This guarantees that the height of any tree never exceeds O(log N)."
    },
    {
      question: "What is the primary role of the 'Path Compression' optimization during a Find operation?",
      options: [
        "It balances the tree during the Union step.",
        "It updates parent pointers of all visited nodes along the traversal path to point directly to the root.",
        "It removes all elements from the set that are not roots.",
        "It performs a binary lookup on parent ranks."
      ],
      correctAnswer: 1,
      explanation: "Path Compression is a recursive technique during the Find operation that flattens the tree. It modifies the parent pointer of every node visited on the way to the root to point directly to the root, optimizing future lookups to O(1)."
    },
    {
      question: "When both Union by Rank and Path Compression are implemented, what is the amortized time complexity per operation in a sequence of M operations on N elements?",
      options: [
        "O(log N)",
        "O(log* N) (Iterated logarithm)",
        "O(α(N)) (Inverse Ackermann function)",
        "O(1)"
      ],
      correctAnswer: 2,
      explanation: "When both optimizations are combined, the amortized time complexity per operation is O(α(N)), where α is the Inverse Ackermann function. This function grows extremely slowly and is practically <= 4 for all realistic values of N, making it effectively near-constant."
    },
    {
      question: "How is the Union-Find data structure initialized in terms of parent pointer configurations?",
      options: [
        "All elements have parent set to 0",
        "All elements have parent pointing to their own index (parent[i] = i)",
        "All elements point to a single global root node",
        "Parent values are initialized to random numbers"
      ],
      correctAnswer: 1,
      explanation: "During MakeSet initialization, every element is put in its own set. Since it is the only element, it is its own root. Thus, every element's parent pointer points to itself (parent[i] = i)."
    }
  ];

  return <QuizEngine title="Disjoint Set Union (DSU) Quiz" questions={questions} />;
};

export default DsuQuiz;
