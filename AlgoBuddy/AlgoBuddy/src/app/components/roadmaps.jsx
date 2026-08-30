"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  CheckCircle2,
  Circle,
  ArrowRight,
  Trophy,
  ChevronDown,
  ChevronRight,
  Clock,
  Info,
} from "lucide-react";
import Footer from "@/app/components/footer";

const ROADMAP_STAGES = [
  {
    stage: 1,
    title: "Foundations & Basics",
    description:
      "Understand the fundamentals of logic building, space/time complexity analysis, and recursion.",
    estimatedTime: "8-12 hours",
    topics: [
      {
        id: "lang-basics",
        label: "Programming language syntax & basics",
        difficulty: "Beginner",
        estimatedTime: "2-3 hours",
        overview:
          "Master core programming constructs including variables, loops, conditionals, functions, and basic I/O.",
        concepts: [
          "Variables & Data Types",
          "Control Flow",
          "Functions & Scope",
          "Basic Input/Output",
        ],
        objectives: [
          "Write clean, readable code",
          "Understand basic program flow",
          "Debug simple issues",
        ],
        resources: [
          {
            label: "MDN JavaScript Guide",
            href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
          },
          {
            label: "FreeCodeCamp JS Course",
            href: "https://www.freecodecamp.org/",
          },
        ],
        practiceLinks: [{ label: "Basic Challenges", href: "/problems/basic" }],
      },
      {
        id: "big-o-analysis",
        label: "Space & Time Complexity (Big O)",
        difficulty: "Beginner",
        estimatedTime: "3-4 hours",
        overview:
          "Learn how to analyze algorithm efficiency using Big O notation.",
        concepts: [
          "Time Complexity",
          "Space Complexity",
          "Best/Average/Worst Case",
          "Common Complexities",
        ],
        objectives: [
          "Identify complexity of code",
          "Compare algorithms",
          "Optimize basic solutions",
        ],
        resources: [
          { label: "Big O Cheatsheet", href: "/cheatsheets" },
          {
            label: "Visualizing Complexity",
            href: "https://www.bigocheatsheet.com/",
          },
        ],
        practiceLinks: [],
      },
      {
        id: "rec-math",
        label: "Basic Math and Simple Recursion",
        difficulty: "Beginner",
        estimatedTime: "3-5 hours",
        overview:
          "Build intuition for recursion and essential mathematical concepts for DSA.",
        concepts: [
          "Factorial",
          "Fibonacci",
          "Exponentiation",
          "Recursion basics",
          "Stack overflow",
        ],
        objectives: [
          "Implement recursive solutions",
          "Convert recursion to iteration",
          "Understand recursion depth",
        ],
        resources: [
          { label: "Recursion Visualizer", href: "/visualizer/recursion" },
        ],
        practiceLinks: [],
      },
    ],
  },
  {
    stage: 2,
    title: "Linear Data Structures & Hashing",
    description:
      "Master arrays, linked structures, stacks, queues, and efficient key-value storage with hashing.",
    estimatedTime: "12-18 hours",
    topics: [
      {
        id: "arrays",
        label: "Arrays & Dynamic Arrays (Strings)",
        difficulty: "Beginner",
        estimatedTime: "3-4 hours",
        overview:
          "Core linear data structure and its usage in problem solving.",
        concepts: [
          "1D & 2D Arrays",
          "Dynamic Resizing",
          "String Manipulation",
          "Prefix Sum",
        ],
        objectives: [
          "Perform common array operations efficiently",
          "Solve sliding window & two pointers problems",
        ],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "hashing",
        label: "Hashing & Hash Maps",
        difficulty: "Beginner",
        estimatedTime: "3-4 hours",
        overview: "Learn how to use hash tables for O(1) average-case lookups.",
        concepts: [
          "Hash Function",
          "Collision Resolution",
          "HashSet & HashMap",
          "Frequency Counting",
        ],
        objectives: [
          "Solve subarray/substring problems efficiently",
          "Use maps for two-sum style problems",
        ],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "linked-lists",
        label: "Singly, Doubly, and Circular Linked Lists",
        difficulty: "Intermediate",
        estimatedTime: "4-5 hours",
        overview:
          "Dynamic linear data structure with excellent insertion/deletion properties.",
        concepts: [
          "Node Structure",
          "Traversal",
          "Insertion & Deletion",
          "Reversal",
          "Cycle Detection",
        ],
        objectives: [
          "Implement linked list from scratch",
          "Solve common interview problems",
        ],
        resources: [
          { label: "Linked List Visualizer", href: "/visualizer/linkedlist" },
        ],
        practiceLinks: [],
      },
      {
        id: "stacks-queues",
        label: "Stacks (LIFO) and Queues (FIFO)",
        difficulty: "Beginner",
        estimatedTime: "2-3 hours",
        overview: "Abstract data types crucial for many algorithms.",
        concepts: [
          "Stack Operations",
          "Queue Operations",
          "Monotonic Stack",
          "Deque",
        ],
        objectives: [
          "Use stacks for parenthesis validation & backtracking",
          "Use queues for BFS",
        ],
        resources: [
          { label: "Stack Visualizer", href: "/visualizer/stack" },
          { label: "Queue Visualizer", href: "/visualizer/queue" },
        ],
        practiceLinks: [],
      },
    ],
  },
  {
    stage: 3,
    title: "Sorting, Searching & Techniques",
    description:
      "Learn efficient ways to organize data and powerful problem-solving techniques.",
    estimatedTime: "10-15 hours",
    topics: [
      {
        id: "searching",
        label: "Linear Search and Binary Search",
        difficulty: "Beginner",
        estimatedTime: "2-3 hours",
        overview:
          "Fundamental searching algorithms with different efficiency characteristics.",
        concepts: ["Linear Search", "Binary Search", "Lower/Upper Bound"],
        objectives: [
          "Implement binary search on sorted arrays",
          "Apply on rotated sorted arrays",
        ],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "simple-sort",
        label: "Bubble, Selection, Insertion Sort",
        difficulty: "Beginner",
        estimatedTime: "2 hours",
        overview: "Basic comparison-based sorting algorithms.",
        concepts: [
          "In-place sorting",
          "Stability",
          "Time complexity trade-offs",
        ],
        objectives: ["Understand when simple sorts are useful"],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "divide-conquer-sort",
        label: "Merge Sort and Quick Sort",
        difficulty: "Intermediate",
        estimatedTime: "3-4 hours",
        overview: "Efficient divide-and-conquer sorting algorithms.",
        concepts: ["Divide & Conquer", "Partitioning", "Merge Process"],
        objectives: ["Implement stable and unstable efficient sorts"],
        resources: [{ label: "Sorting Visualizer", href: "/visualizer/array" }],
        practiceLinks: [],
      },
      {
        id: "two-pointers",
        label: "Two Pointers Technique",
        difficulty: "Intermediate",
        estimatedTime: "3-4 hours",
        overview:
          "Elegant technique for solving array and string problems efficiently.",
        concepts: [
          "Opposite Direction",
          "Same Direction",
          "Fast & Slow Pointers",
        ],
        objectives: ["Solve problems like container with most water, 3Sum"],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "sliding-window",
        label: "Sliding Window",
        difficulty: "Intermediate",
        estimatedTime: "3-4 hours",
        overview: "Optimized technique for subarray/substring problems.",
        concepts: [
          "Fixed Window",
          "Variable Window",
          "Longest/Shortest subarray",
        ],
        objectives: ["Maximize/minimize subarray sums under constraints"],
        resources: [],
        practiceLinks: [],
      },
    ],
  },
  {
    stage: 4,
    title: "Non-Linear Data Structures",
    description: "Explore hierarchical and network-based data structures.",
    estimatedTime: "15-20 hours",
    topics: [
      {
        id: "trees-bst",
        label: "Binary Trees & Binary Search Trees",
        difficulty: "Intermediate",
        estimatedTime: "5-6 hours",
        overview:
          "Fundamental hierarchical data structure used in many advanced algorithms.",
        concepts: [
          "Tree Traversals (Pre/In/Post)",
          "BST Properties",
          "Balanced Trees",
        ],
        objectives: ["Implement tree traversals", "Validate BST", "Find LCA"],
        resources: [{ label: "Tree Visualizer", href: "/visualizer/tree" }],
        practiceLinks: [],
      },
      {
        id: "heaps",
        label: "Binary Heaps & Priority Queues",
        difficulty: "Intermediate",
        estimatedTime: "3-4 hours",
        overview: "Complete binary tree that satisfies heap property.",
        concepts: ["Min/Max Heap", "Heapify", "Priority Queue Operations"],
        objectives: [
          "Implement Kth largest/smallest elements",
          "Merge K sorted lists",
        ],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "graphs",
        label: "Graphs (BFS, DFS, Topological Sort, Shortest Paths)",
        difficulty: "Intermediate",
        estimatedTime: "6-8 hours",
        overview:
          "Study of connections between nodes. Core for many real-world problems.",
        concepts: [
          "Graph Representations",
          "BFS & DFS",
          "Topological Sort",
          "Dijkstra's Algorithm",
          "MST (Kruskal/Prim)",
        ],
        objectives: [
          "Solve connectivity and pathfinding problems",
          "Detect cycles",
        ],
        resources: [{ label: "Graph Visualizer", href: "/visualizer/graph" }],
        practiceLinks: [],
      },
      {
        id: "trie",
        label: "Trie (Prefix Tree)",
        difficulty: "Advanced",
        estimatedTime: "3-4 hours",
        overview: "Efficient tree for storing and searching strings.",
        concepts: ["Insert", "Search", "Prefix Search", "Autocomplete"],
        objectives: ["Implement word dictionary", "Solve word break problems"],
        resources: [],
        practiceLinks: [],
      },
    ],
  },
  {
    stage: 5,
    title: "Advanced Algorithmic Design",
    description:
      "Master optimization, search space exploration, and complex problem-solving paradigms.",
    estimatedTime: "18-25 hours",
    topics: [
      {
        id: "bit-manipulation",
        label: "Bit Manipulation",
        difficulty: "Intermediate",
        estimatedTime: "3-4 hours",
        overview: "Direct manipulation of bits for optimized solutions.",
        concepts: [
          "Bitwise Operators",
          "Bit Masks",
          "Counting Bits",
          "Power of Two",
        ],
        objectives: [
          "Solve single number, missing number problems efficiently",
        ],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "greedy",
        label: "Greedy Algorithms",
        difficulty: "Intermediate",
        estimatedTime: "4-5 hours",
        overview: "Making locally optimal choices at each stage.",
        concepts: [
          "Activity Selection",
          "Huffman Coding",
          "Job Scheduling",
          "Fractional Knapsack",
        ],
        objectives: [
          "Prove greedy choice property",
          "Solve interval scheduling problems",
        ],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "backtracking",
        label: "Backtracking",
        difficulty: "Advanced",
        estimatedTime: "4-6 hours",
        overview: "Systematic way to explore all possible solutions.",
        concepts: [
          "N-Queens",
          "Sudoku Solver",
          "Subset/Permutation Generation",
        ],
        objectives: ["Prune search space effectively"],
        resources: [
          {
            label: "Recursion & Backtracking Lab",
            href: "/visualizer/recursion",
          },
        ],
        practiceLinks: [],
      },
      {
        id: "dp",
        label: "Dynamic Programming",
        difficulty: "Advanced",
        estimatedTime: "7-10 hours",
        overview:
          "Solve complex problems by breaking them into overlapping subproblems.",
        concepts: [
          "Memoization vs Tabulation",
          "0/1 Knapsack",
          "LIS",
          "LCS",
          "Matrix Chain Multiplication",
        ],
        objectives: [
          "Identify DP states",
          "Build bottom-up and top-down solutions",
        ],
        resources: [],
        practiceLinks: [],
      },
      {
        id: "union-find",
        label: "Union Find (Disjoint Set Union)",
        difficulty: "Advanced",
        estimatedTime: "3-4 hours",
        overview: "Efficient data structure for tracking connected components.",
        concepts: ["Path Compression", "Union by Rank/Size", "Kruskal's MST"],
        objectives: [
          "Detect cycles in graphs",
          "Solve dynamic connectivity problems",
        ],
        resources: [],
        practiceLinks: [],
      },
    ],
  },
];

export default function Roadmaps() {
  const [completedTopics, setCompletedTopics] = useState({});
  const [expandedTopics, setExpandedTopics] = useState({});
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("algobuddy_roadmap_progress");
      if (stored) {
        setCompletedTopics(JSON.parse(stored));
      }
      const storedExpanded = localStorage.getItem("algobuddy_roadmap_expanded");
      if (storedExpanded) {
        setExpandedTopics(JSON.parse(storedExpanded));
      }
    } catch (e) {
      console.error("Error reading roadmap progress:", e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  const handleToggle = (id) => {
    const nextState = {
      ...completedTopics,
      [id]: !completedTopics[id],
    };
    setCompletedTopics(nextState);
    try {
      localStorage.setItem(
        "algobuddy_roadmap_progress",
        JSON.stringify(nextState),
      );
    } catch (e) {
      console.error("Error saving roadmap progress:", e);
    }
  };

  const toggleExpand = (id) => {
    const nextExpanded = {
      ...expandedTopics,
      [id]: !expandedTopics[id],
    };
    setExpandedTopics(nextExpanded);
    try {
      localStorage.setItem(
        "algobuddy_roadmap_expanded",
        JSON.stringify(nextExpanded),
      );
    } catch (e) {
      console.error("Error saving expanded state:", e);
    }
  };

  const allTopics = ROADMAP_STAGES.flatMap((s) => s.topics);
  const totalTopics = allTopics.length;
  const completedCount = allTopics.filter((t) => completedTopics[t.id]).length;
  const percentage =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Intermediate":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Advanced":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <main className="container-app section-app">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-sm font-bold tracking-wider uppercase mb-4">
              <Compass className="w-4 h-4 animate-spin-slow" />
              Learning Path
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-serif text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-6">
              DSA Learning{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] dark:from-[var(--color-primary-light)] dark:to-[var(--color-primary)]">
                Roadmap
              </span>
            </h1>
            <p className="text-xl text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] max-w-2xl mx-auto">
              Follow this comprehensive step-by-step curriculum to master data
              structures and algorithms for interviews and competitive
              programming.
            </p>
          </div>

          {/* Progress Tracker card */}
          {mounted && (
            <div className="card-surface p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-udemy-purple/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--udemy-text)] dark:text-white">
                    Your Progress
                  </h2>
                  <p className="text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
                    {completedCount} of {totalTopics} topics completed (
                    {percentage}%)
                  </p>
                </div>
              </div>
              <div className="w-full md:w-64 bg-[var(--color-neutral-200)] dark:bg-[var(--color-neutral-700)] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[var(--color-primary)] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Timeline Stages */}
          <div className="relative border-l-2 border-[var(--color-border)] ml-4 md:ml-6 pl-6 md:pl-10 space-y-12 py-4">
            {ROADMAP_STAGES.map((stage) => (
              <div key={stage.stage} className="relative group">
                {/* Timeline node icon indicator */}
                <span className="absolute -left-[39px] md:-left-[55px] top-1.5 flex h-6 w-6 md:h-8 md:w-8 items-center justify-center rounded-full bg-white dark:bg-[var(--udemy-dark-bg)] border-2 border-[var(--color-primary)] text-xs md:text-sm font-bold text-[var(--color-primary)] transition-all">
                  {stage.stage}
                </span>

                <div className="card-surface p-6 group-hover:border-[var(--color-primary)]/50 transition-colors duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-serif text-[var(--udemy-text)] dark:text-white">
                      {stage.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[var(--udemy-muted)]">
                      <Clock className="w-4 h-4" />
                      <span>{stage.estimatedTime}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] mb-6">
                    {stage.description}
                  </p>

                  {/* Checklist */}
                  <div className="space-y-3 mb-6 bg-[var(--udemy-surface)] dark:bg-[var(--udemy-dark-bg)] rounded-xl p-4 border border-[var(--color-border)]/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] mb-3 flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" /> CORE TOPICS
                    </h4>

                    {stage.topics.map((topic) => {
                      const isDone = completedTopics[topic.id];
                      const isExpanded = expandedTopics[topic.id];

                      return (
                        <div
                          key={topic.id}
                          className="border border-[var(--color-border)]/50 rounded-lg overflow-hidden"
                        >
                          {/* Topic Header */}
                          <div className="flex items-center justify-between p-4 bg-white dark:bg-[var(--udemy-dark-bg)]">
                            <button
                              onClick={() => handleToggle(topic.id)}
                              className="flex items-start gap-3 flex-1 text-left group/btn"
                            >
                              <span className="mt-0.5 text-[var(--color-primary)] hover:scale-110 transition-transform">
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 fill-[var(--color-primary)] text-white" />
                                ) : (
                                  <Circle className="w-5 h-5 text-[var(--color-border)] group-hover/btn:text-[var(--color-primary)]" />
                                )}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`text-sm transition-colors font-medium ${
                                      isDone
                                        ? "text-[var(--color-muted)] line-through"
                                        : "text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]"
                                    }`}
                                  >
                                    {topic.label}
                                  </span>
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${getDifficultyColor(topic.difficulty)}`}
                                  >
                                    {topic.difficulty}
                                  </span>
                                </div>
                                <div className="text-xs text-[var(--udemy-muted)] flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {topic.estimatedTime}
                                </div>
                              </div>
                            </button>

                            <button
                              onClick={() => toggleExpand(topic.id)}
                              className="text-[var(--color-muted)] hover:text-[var(--udemy-text)] p-1 transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Expanded Content */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 bg-[var(--udemy-surface)] dark:bg-[var(--udemy-dark-bg)] border-t border-[var(--color-border)]/50 text-sm">
                              <div className="prose dark:prose-invert max-w-none">
                                <p className="text-[var(--udemy-muted)] mb-4">
                                  {topic.overview}
                                </p>

                                {topic.concepts.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-[var(--udemy-text)] mb-2">
                                      Key Concepts
                                    </h5>
                                    <ul className="list-disc pl-5 space-y-1 text-[var(--udemy-muted)]">
                                      {topic.concepts.map((concept, idx) => (
                                        <li key={idx}>{concept}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {topic.objectives.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="font-semibold text-[var(--udemy-text)] mb-2">
                                      Learning Objectives
                                    </h5>
                                    <ul className="list-disc pl-5 space-y-1 text-[var(--udemy-muted)]">
                                      {topic.objectives.map((obj, idx) => (
                                        <li key={idx}>{obj}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {topic.resources &&
                                  topic.resources.length > 0 && (
                                    <div className="mb-4">
                                      <h5 className="font-semibold text-[var(--udemy-text)] mb-2">
                                        Recommended Resources
                                      </h5>
                                      <div className="flex flex-wrap gap-2">
                                        {topic.resources.map((res, idx) => (
                                          <a
                                            key={idx}
                                            href={res.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
                                          >
                                            {res.label} →
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {topic.practiceLinks &&
                                  topic.practiceLinks.length > 0 && (
                                    <div>
                                      <h5 className="font-semibold text-[var(--udemy-text)] mb-2">
                                        Practice
                                      </h5>
                                      <div className="flex flex-wrap gap-2">
                                        {topic.practiceLinks.map(
                                          (link, idx) => (
                                            <Link
                                              key={idx}
                                              href={link.href}
                                              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:gap-1.5 transition-all bg-udemy-purple/5 dark:bg-udemy-purple-light/5 px-3 py-1 rounded-md"
                                            >
                                              {link.label}
                                              <ArrowRight className="w-3 h-3" />
                                            </Link>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Stage Practice links */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                    <span className="text-xs font-semibold text-[var(--color-muted)]">
                      Practice on AlgoBuddy:
                    </span>
                    {(stage.topics[0]?.practiceLinks || []).length > 0 ? (
                      stage.topics
                        .flatMap((t) => t.practiceLinks)
                        .map((link, idx) => (
                          <Link
                            key={idx}
                            href={link.href}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:gap-1.5 transition-all bg-udemy-purple/5 dark:bg-udemy-purple-light/5 px-2.5 py-1 rounded-md"
                          >
                            {link.label}
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))
                    ) : (
                      <span className="text-xs text-[var(--udemy-muted)] italic">
                        More practice links coming soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back Home */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all font-semibold text-sm text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
