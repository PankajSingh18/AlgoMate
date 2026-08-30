"use client";

import React, { useState } from "react";

const initialHistory = [
  {
    algorithm: "Bubble Sort vs Merge Sort",
    inputSize: "1000 Elements",
    executionTime: "12ms vs 2ms",
    complexity: "O(n²) vs O(n log n)",
    note: "Merge Sort performs better for larger datasets.",
  },
  {
    algorithm: "Linear Search vs Binary Search",
    inputSize: "500 Elements",
    executionTime: "8ms vs 1ms",
    complexity: "O(n) vs O(log n)",
    note: "Binary Search is faster on sorted arrays.",
  },
];

export default function AlgorithmComparisonHistory() {
  const [history, setHistory] = useState(initialHistory);

  const deleteHistory = (index) => {
    setHistory(history.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Algorithm Comparison History
      </h2>

      {history.length === 0 ? (
        <p className="text-gray-400">
          No comparison history available.
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800 p-4 rounded-lg border border-slate-700"
            >
              <h3 className="font-semibold text-lg">
                {item.algorithm}
              </h3>

              <p>Input Size: {item.inputSize}</p>
              <p>Execution Time: {item.executionTime}</p>
              <p>Complexity: {item.complexity}</p>
              <p className="text-gray-300">
                Note: {item.note}
              </p>

              <button
                onClick={() => deleteHistory(index)}
                className="mt-3 px-3 py-1 bg-red-600 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}