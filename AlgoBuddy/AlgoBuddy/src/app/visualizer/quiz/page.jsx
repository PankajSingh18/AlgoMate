"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, X } from "lucide-react";

export default function QuizPage() {
  const quizzes = [
    {
      title: "Linear Search Quiz",
      description:
        "Test your understanding of Linear Search with multiple-choice questions.",
      href: "/visualizer/array/linearsearch/quiz",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Binary Search Quiz",
      description:
        "Test your understanding of Binary Search with multiple-choice questions.",
      href: "/visualizer/array/binarysearch/quiz",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Bubble Sort Quiz",
      description:
        "Test your understanding of Bubble Sort with multiple-choice questions.",
      href: "/visualizer/array/bubblesort/quiz",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Selection Sort Quiz",
      description:
        "Test your understanding of Selection Sort with multiple-choice questions.",
      href: "/visualizer/array/selectionsort/quiz",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Insertion Sort Quiz",
      description:
        "Test your understanding of Insertion Sort with multiple-choice questions.",
      href: "/visualizer/array/insertionsort/quiz",
      color: "bg-pink-600 hover:bg-pink-700",
    },
    {
      title: "Merge Sort Quiz",
      description:
        "Test your understanding of Merge Sort with multiple-choice questions.",
      href: "/visualizer/array/mergesort/quiz",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
    {
      title: "Quick Sort Quiz",
      description:
        "Test your understanding of Quick Sort with multiple-choice questions.",
      href: "/visualizer/array/quicksort/quiz",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      title: "Heap Sort Quiz",
      description:
        "Test your understanding of Heap Sort with multiple-choice questions.",
      href: "/visualizer/array/heapsort/quiz",
      color: "bg-yellow-600 hover:bg-yellow-700",
    },
    {
        title: "Radix Sort Quiz",
        description:
        "Test your understanding of Radix Sort with multiple-choice questions.",
        href: "/visualizer/array/radixsort/quiz",
        color: "bg-cyan-600 hover:bg-cyan-700",
    },
    {
        title: "Counting Sort Quiz",
        description:
        "Test your understanding of Counting Sort with multiple-choice questions.",
        href: "/visualizer/array/countingsort/quiz",
        color: "bg-emerald-600 hover:bg-emerald-700",
    },
    {
      title: "Basic Recursion Quiz",
      description:
        "Test your understanding of Basic Recursion with multiple-choice questions.",
      href: "/visualizer/recursion/basic-recursion/quiz",
      color: "bg-teal-600 hover:bg-teal-700",
    },
    {
      title: "Functional & Parameterized Recursion Quiz",
      description:
        "Test your understanding of Functional & Parameterized Recursion with multiple-choice questions.",
      href: "/visualizer/recursion/functional-parameterized/quiz",
      color: "bg-violet-600 hover:bg-violet-700",
    },
    {
      title: "Multiple Recursive Calls Quiz",
      description:
        "Test your understanding of Multiple Recursive Calls with multiple-choice questions.",
      href: "/visualizer/recursion/multiple-calls/quiz",
      color: "bg-sky-600 hover:bg-sky-700",
    },
    {
      title: "Recursion on Subsequences Quiz",
      description:
        "Test your understanding of Recursion on Subsequences with multiple-choice questions.",
      href: "/visualizer/recursion/subsequences/quiz",
      color: "bg-rose-600 hover:bg-rose-700",
    },
    {
      title: "Backtracking Quiz",
      description:
        "Test your understanding of Backtracking with multiple-choice questions.",
      href: "/visualizer/recursion/backtracking/quiz",
      color: "bg-amber-600 hover:bg-amber-700",
    },
    {
      title: "Recursion Trees Quiz",
      description:
        "Test your understanding of Recursion Trees with multiple-choice questions.",
      href: "/visualizer/recursion/trees/quiz",
      color: "bg-violet-600 hover:bg-violet-700",
    },
    {
      title: "Call Stack Visualization Quiz",
      description:
        "Test your understanding of Call Stack Visualization with multiple-choice questions.",
      href: "/visualizer/recursion/stack/quiz",
      color: "bg-slate-600 hover:bg-slate-700",
    },
    {
      title: "Recursive Binary Search Quiz",
      description:
        "Test your understanding of Recursive Binary Search with multiple-choice questions.",
      href: "/visualizer/recursion/binary-search/quiz",
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      title: "Tower of Hanoi Recursion Quiz",
      description:
        "Test your understanding of the Tower of Hanoi recursion algorithm with multiple-choice questions.",
      href: "/visualizer/recursion/tower-of-hanoi/quiz",
      color: "bg-violet-600 hover:bg-violet-700",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-8">
      <h1 className="text-5xl font-bold text-center mb-4">
        🎯 Quiz Mode
      </h1>

      <p className="text-center text-gray-500 mb-6">
  Choose an algorithm quiz to test your understanding.
</p>

<div className="relative max-w-2xl mx-auto mb-10">
  <Search
    size={20}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
  />

  <input
    type="text"
    placeholder="Search quizzes..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-12 pr-12 py-3 border rounded-xl shadow-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500
               dark:bg-[#2b2b2b] dark:border-gray-700"
  />

  {searchQuery && (
    <button
      type="button"
      onClick={() => setSearchQuery("")}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <X size={18} />
    </button>
  )}
</div>

      <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
  {filteredQuizzes.length > 0 ? (
    filteredQuizzes.map((quiz) => (
      <div
        key={quiz.title}
        className="border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
      >
        <h2 className="text-3xl font-semibold mb-4">
          📘 {quiz.title}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {quiz.description}
        </p>

        <Link href={quiz.href}>
          <button
            className={`text-white px-6 py-3 rounded-lg font-semibold ${quiz.color}`}
          >
            Start Quiz
          </button>
        </Link>
      </div>
    ))
  ) : (
    <div className="col-span-full text-center py-12">
      <p className="text-xl text-gray-500 dark:text-gray-400">
        No quizzes found.
      </p>
    </div>
  )}
</div>
    </div>
  );
}