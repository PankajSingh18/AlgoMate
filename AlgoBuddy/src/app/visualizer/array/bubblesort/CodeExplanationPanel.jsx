"use client";
import { useState } from "react";

const BUBBLE_SORT_STEPS = {
  init: {
    explanation: "Bubble Sort shuru ho raha hai. Array ko sort karna start karenge.",
    variables: {},
  },
  phase_start: (p) => ({
    explanation: `Pass ${p.pass} of ${p.totalPasses} — Aaj hum array ko ek baar pura traverse karenge.`,
    variables: { pass: p.pass },
  }),
  comparing: (p) => ({
    explanation: `Index ${p.j} aur ${p.jNext} ko compare kar rahe hain. Kya arr[${p.j}] > arr[${p.jNext}]?`,
    variables: { i: p.j, j: p.jNext, "arr[i]": p.arr[p.j], "arr[j]": p.arr[p.jNext], comparisons: p.comparisons },
  }),
  swap_needed: (p) => ({
    explanation: `arr[${p.j}] (${p.arr[p.j]}) bada hai arr[${p.jNext}] (${p.arr[p.jNext]}) se — Swap hoga!`,
    variables: { swapping: `${p.arr[p.j]} ↔ ${p.arr[p.jNext]}`, swaps: p.swaps },
  }),
  swapped: (p) => ({
    explanation: `Swap ho gaya! ${p.arr[p.j]} aur ${p.arr[p.jNext]} ki positions badal gayi.`,
    variables: { swaps: p.swaps, array: `[${p.arr.join(", ")}]` },
  }),
  no_swap: (p) => ({
    explanation: `arr[${p.j}] (${p.arr[p.j]}) already chhota hai — Koi swap nahi.`,
    variables: { comparisons: p.comparisons },
  }),
  sorted_element: (p) => ({
    explanation: `Index ${p.index} ka element sort ho gaya aur apni sahi jagah aa gaya! ✅`,
    variables: { sorted_index: p.index, value: p.arr[p.index] },
  }),
  early_completion: {
    explanation: "Koi swap nahi hua is pass mein — Array already sorted hai! Early exit. 🎉",
    variables: {},
  },
  completed: (p) => ({
    explanation: `Sort complete! Total ${p.comparisons} comparisons aur ${p.swaps} swaps lage. 🎊`,
    variables: { final_array: `[${p.arr.join(", ")}]`, comparisons: p.comparisons, swaps: p.swaps },
  }),
};

function getStepInfo(frame) {
  if (!frame) return { explanation: "Visualization shuru karo explanation dekhne ke liye.", variables: {} };
  const handler = BUBBLE_SORT_STEPS[frame.type];
  if (!handler) return { explanation: `Step: ${frame.type}`, variables: {} };
  if (typeof handler === "function") return handler(frame.payload || {});
  return handler;
}

export default function CodeExplanationPanel({ currentFrame }) {
  const [isOpen, setIsOpen] = useState(true);
  const { explanation, variables } = getStepInfo(currentFrame);

  return (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900 dark:border-gray-700">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
            Code Explanation
          </span>
        </div>
        <span className="text-gray-500 text-xs">{isOpen ? "▲ Hide" : "▼ Show"}</span>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Explanation */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              💡 What's happening?
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-200">{explanation}</p>
          </div>

          {/* Variable Tracker */}
          {Object.keys(variables).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                📊 Variable State
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(variables).map(([key, val]) => (
                  <div
                    key={key}
                    className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 flex justify-between items-center"
                  >
                    <span className="text-xs font-mono text-purple-600 dark:text-purple-400">
                      {key}
                    </span>
                    <span className="text-xs font-mono text-gray-800 dark:text-gray-200 font-bold">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}