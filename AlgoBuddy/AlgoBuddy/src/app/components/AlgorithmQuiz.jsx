"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const questions = [
  {
    question:
      "You need to search an element in a large sorted array. Which algorithm should you choose?",
    options: [
      "Linear Search",
      "Binary Search",
      "Bubble Sort",
      "DFS",
    ],
    answer: "Binary Search",
    explanation:
      "Binary Search works on sorted arrays and has O(log n) time complexity.",
  },

  {
    question:
      "You need to find the shortest path in a weighted graph with positive edges.",
    options: [
      "Bubble Sort",
      "Dijkstra Algorithm",
      "Stack",
      "Binary Search",
    ],
    answer: "Dijkstra Algorithm",
    explanation:
      "Dijkstra Algorithm efficiently finds the shortest path in weighted graphs.",
  },

  {
    question:
      "You need to process tasks in the exact order they arrive. Which data structure is best?",
    options: [
      "Stack",
      "Queue",
      "Tree",
      "Heap",
    ],
    answer: "Queue",
    explanation:
      "Queue follows FIFO (First In First Out), making it ideal for task scheduling.",
  },

  {
    question:
      "You need to undo the most recent operation in an application. Which data structure is used?",
    options: [
      "Queue",
      "Stack",
      "Array",
      "Graph",
    ],
    answer: "Stack",
    explanation:
      "Stack follows LIFO (Last In First Out), which is perfect for undo operations.",
  },

  {
    question:
      "Which sorting algorithm has an average time complexity of O(n log n)?",
    options: [
      "Bubble Sort",
      "Merge Sort",
      "Selection Sort",
      "Linear Search",
    ],
    answer: "Merge Sort",
    explanation:
      "Merge Sort uses divide and conquer and runs in O(n log n) average and worst cases.",
  },
];


export default function AlgorithmQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  // Guard: if questions array is empty or the current index is out of range,
  // show a friendly fallback instead of crashing on question.question etc.
  if (!question || !Array.isArray(question.options) || question.options.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="max-w-md text-center p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg">
          <p className="text-4xl mb-4">🔧</p>
          <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
            Quiz Unavailable
          </h2>
          <p className="text-sm text-slate-500 dark:text-neutral-400">
            No quiz questions are available right now. Please check back later or
            explore the visualizer while we fix this.
          </p>
        </div>
      </div>
    );
  }


  const handleAnswer = (option) => {
    if (selected) return;

    setSelected(option);

    if (option === question.answer) {
      setScore((prev) => prev + 1);
    }
  };


  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };


  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };


  if (finished) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">
          Quiz Completed 🎉
        </h1>

        <p className="text-lg mb-6">
          Your Score: 
          <span className="font-bold text-blue-500">
            {" "}
            {score}/{questions.length}
          </span>
        </p>

        <button
          onClick={restartQuiz}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          Restart Quiz
        </button>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-purple-50 dark:from-neutral-900 dark:to-neutral-950">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8"
      >

        <div className="flex justify-between mb-5">
          <span className="font-semibold">
            Question {current + 1}/{questions.length}
          </span>

          <span className="text-purple-600 font-bold">
            Score: {score}
          </span>
        </div>


        <h2 className="text-2xl font-bold mb-6">
          {question.question}
        </h2>


        <div className="space-y-3">

          {question.options.map((option) => {

            let style =
              "w-full text-left p-4 rounded-xl border transition";

            if (selected) {

              if (option === question.answer) {
                style +=
                  " bg-green-100 border-green-500";
              }

              else if (option === selected) {
                style +=
                  " bg-red-100 border-red-500";
              }

            }

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={style}
              >
                {option}
              </button>
            );

          })}

        </div>


        {selected && (

          <div className="mt-6">

            <div className="p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
              <h3 className="font-bold mb-2">
                Explanation
              </h3>

              <p>
                {question.explanation}
              </p>
            </div>


            <button
              onClick={nextQuestion}
              className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              {
                current === questions.length - 1
                  ? "Finish Quiz"
                  : "Next Question"
              }
            </button>

          </div>

        )}

      </motion.div>

    </div>
  );
}