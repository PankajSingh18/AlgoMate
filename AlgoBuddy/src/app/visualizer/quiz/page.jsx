"use client";

import Link from "next/link";

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
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#1c1d1f] p-8">
      <h1 className="text-5xl font-bold text-center mb-4">
        🎯 Quiz Mode
      </h1>

      <p className="text-center text-gray-500 mb-10">
        Choose an algorithm quiz to test your understanding.
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {quizzes.map((quiz) => (
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
        ))}
      </div>
    </div>
  );
}