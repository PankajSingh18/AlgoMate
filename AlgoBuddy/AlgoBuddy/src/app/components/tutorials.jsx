"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import Footer from "@/app/components/footer";

const TUTORIALS_DATA = [
  {
    id: "big-o",
    title: "Introduction to Time & Space Complexity",
    description: "Learn how to analyze algorithms using Big O notation. Understand the difference between O(1), O(log n), O(n), and O(n²).",
    category: "Core Concepts",
    difficulty: "Beginner",
    readTime: "8 min read",
    link: "/cheatsheets",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "linked-list",
    title: "Understanding Linked Lists Inside Out",
    description: "Deep dive into Singly, Doubly, and Circular Linked Lists. Master pointer manipulation, node traversal, and common interview questions.",
    category: "Data Structures",
    difficulty: "Beginner",
    readTime: "12 min read",
    link: "/visualizer/linkedlist",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "stack-queue",
    title: "Stacks and Queues: Visual Guide",
    description: "Explore LIFO and FIFO structures. Learn about push, pop, enqueue, dequeue operations and real-world application examples.",
    category: "Data Structures",
    difficulty: "Beginner",
    readTime: "10 min read",
    link: "/visualizer/stack",
    badgeColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    id: "binary-tree",
    title: "Demystifying Binary Trees & BST",
    description: "Master tree terminologies, Binary Search Tree insertion, deletion, and tree traversals (Inorder, Preorder, Postorder).",
    category: "Data Structures",
    difficulty: "Intermediate",
    readTime: "15 min read",
    link: "/visualizer/tree",
    badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    id: "sorting-algos",
    title: "Visualizing Sorting Algorithms",
    description: "Compare Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort. See how they partition and sort data in real-time.",
    category: "Algorithms",
    difficulty: "Intermediate",
    readTime: "18 min read",
    link: "/visualizer/array",
    badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    id: "graph-traversal",
    title: "Graph Theory: BFS and DFS Traversals",
    description: "Learn graph representations (Adjacency Matrix/List) and how Breadth-First Search (BFS) and Depth-First Search (DFS) explore vertices.",
    category: "Algorithms",
    difficulty: "Advanced",
    readTime: "20 min read",
    link: "/visualizer/graph",
    badgeColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    id: "recursion",
    title: "Mastering Recursion and Call Stacks",
    description: "Understand base cases, recurrence relations, call stack behavior, and how to convert recursive functions to iterative ones.",
    category: "Core Concepts",
    difficulty: "Intermediate",
    readTime: "12 min read",
    link: "/visualizer/recursion",
    badgeColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    id: "complexity-analyzer",
    title: "Analyzing Algorithm Code in Real-time",
    description: "Use our built-in Complexity Analyzer to write code and immediately evaluate its mathematical bounds.",
    category: "Algorithms",
    difficulty: "Advanced",
    readTime: "10 min read",
    link: "/visualizer/complexity-analyzer",
    badgeColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
];

const CATEGORIES = ["All", "Core Concepts", "Data Structures", "Algorithms"];

export default function Tutorials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTutorials = useMemo(() => {
    return TUTORIALS_DATA.filter((tutorial) => {
      const matchesSearch =
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || tutorial.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <main className="container-app section-app">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 relative">
            <span className="inline-flex items-center gap-2 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-sm font-bold tracking-wider uppercase mb-4">
              <Sparkles className="w-4 h-4 animate-pulse" />
              AlgoBuddy Academy
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-serif text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-6">
              Interactive{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] dark:from-[var(--color-primary-light)] dark:to-[var(--color-primary)]">
                DSA Tutorials
              </span>
            </h1>
            <p className="text-xl text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] max-w-2xl mx-auto">
              Master the concepts theoretically, then instantly jump into our visualizers to see them in action.
            </p>
          </div>

          {/* Controls Panel */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 p-4 card-surface">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-transparent rounded-[var(--radius-md)] border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all border ${
                    activeCategory === category
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "bg-transparent text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] border-[var(--color-border)] hover:bg-[var(--color-neutral-100)] dark:hover:bg-[var(--udemy-dark-surface)]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTutorials.map((item) => (
                <div
                  key={item.id}
                  className="card-surface p-6 flex flex-col justify-between group hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-[var(--motion-normal)]"
                >
                  <div>
                    {/* Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] tracking-wide uppercase">
                        {item.category}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.badgeColor}`}>
                        {item.difficulty}
                      </span>
                    </div>

                    {/* Content */}
                    <h2 className="text-xl font-bold font-serif text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-3 group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-light)] transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] text-sm leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                      <Clock className="w-3.5 h-3.5" />
                      {item.readTime}
                    </span>
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:gap-2 transition-all"
                    >
                      Start Learning
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card-surface p-8">
              <BookOpen className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-2">
                No tutorials found
              </h3>
              <p className="text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] max-w-sm mx-auto text-sm">
                Try searching for another keyword or change your category filter options.
              </p>
            </div>
          )}

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
