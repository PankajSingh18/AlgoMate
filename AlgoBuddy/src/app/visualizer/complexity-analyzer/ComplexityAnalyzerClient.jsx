"use client";

import { useMemo, useState } from "react";

import ComplexityGraph from "./components/ComplexityGraph";
import ComplexityCard from "./components/ComplexityCard";
import AlgorithmComparator from "./components/AlgorithmComparator";
import CodeEstimator from "./components/CodeEstimator";
import {
  generateComplexityData,
} from "./utils/complexityFunctions";

import {
  complexityInfo,
  algorithmComparisons,
} from "./utils/complexityData";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const COMPLEXITIES = [
  "O(1)",
  "O(log n)",
  "O(n)",
  "O(n log n)",
  "O(n²)",
  "O(n³)",
  "O(2ⁿ)",
];

export default function ComplexityAnalyzerClient() {
  const [inputSize, setInputSize] = useState(50);

  const [selectedComplexities, setSelectedComplexities] = useState([
    "O(n)",
    "O(n log n)",
    "O(n²)",
  ]);

  const graphData = useMemo(() => {
    return generateComplexityData(inputSize);
  }, [inputSize]);

  const toggleComplexity = (complexity) => {
    setSelectedComplexities((prev) => {
      if (prev.includes(complexity)) {
        return prev.filter((item) => item !== complexity);
      }

      return [...prev, complexity];
    });
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link
          href="/visualizer"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Visualizer
        </Link>
      </div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white">
          Interactive Complexity Analyzer
        </h1>

        <p className="text-neutral-600 dark:text-neutral-400 mt-3 font-medium max-w-3xl">
          Visualize how algorithm complexity scales with increasing input size
          and compare growth behavior interactively.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm mb-8">

        <div className="flex flex-col gap-6">

          {/* Input Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                Input Size (n)
              </label>

              <span className="text-sm font-black text-[#a435f0]">
                {inputSize}
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="100"
              value={inputSize}
              onChange={(e) => setInputSize(Number(e.target.value))}
              className="w-full accent-[#a435f0] cursor-pointer"
            />
          </div>

          {/* Complexity Toggles */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
              Complexity Curves
            </h3>

            <div className="flex flex-wrap gap-3">
              {COMPLEXITIES.map((complexity) => {
                const active =
                  selectedComplexities.includes(complexity);

                return (
                  <button
                    key={complexity}
                    onClick={() => toggleComplexity(complexity)}
                    className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                      active
                        ? "bg-[#a435f0] text-white border-[#a435f0]"
                        : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700"
                    }`}
                  >
                    {complexity}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Graph */}
      <ComplexityGraph
        data={graphData}
        selectedComplexities={selectedComplexities}
      />

      {/* AI Complexity Estimator */}
      <CodeEstimator />

      {/* Educational Cards */}
      <div className="mt-8">
        
        <div className="mb-5">
          <h2 className="text-2xl font-black text-neutral-900 dark:text-white">
            Complexity Insights
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-medium">
            Understand how different complexity classes behave in practice.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {complexityInfo.map((item) => (
            <ComplexityCard
              key={item.complexity}
              complexity={item.complexity}
              title={item.title}
              description={item.description}
              examples={item.examples}
            />
          ))}
        </div>

      </div>
            {/* Algorithm Comparison Table */}
      <div className="mt-8">
        <AlgorithmComparator
          algorithms={algorithmComparisons}
        />
      </div>

    </main>
  );
}