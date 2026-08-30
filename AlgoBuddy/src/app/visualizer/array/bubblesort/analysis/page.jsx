"use client";
import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

const runBubbleSort = (inputArr) => {
  const arr = [...inputArr];
  let comparisons = 0, swaps = 0, accesses = 0;
  const log = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      accesses += 2;
      comparisons++;
      log.push({ step: comparisons, action: `Compare arr[${j}]=${arr[j]} & arr[${j+1}]=${arr[j+1]}`, pass: i + 1 });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        accesses += 2;
        swapped = true;
        log.push({ step: comparisons, action: `Swap → arr[${j}]=${arr[j]}, arr[${j+1}]=${arr[j+1]}`, pass: i + 1 });
      }
    }
    if (!swapped) break;
  }
  return { comparisons, swaps, accesses, total: comparisons + swaps, log };
};

const generateArr = (size, pattern) => {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
  if (pattern === "sorted") return arr.sort((a, b) => a - b);
  if (pattern === "reverse") return arr.sort((a, b) => b - a);
  if (pattern === "nearly") {
    const s = arr.sort((a, b) => a - b);
    const swaps = Math.max(1, Math.floor(size * 0.1));
    for (let k = 0; k < swaps; k++) {
      const i = Math.floor(Math.random() * size);
      const j = Math.floor(Math.random() * size);
      [s[i], s[j]] = [s[j], s[i]];
    }
    return s;
  }
  return arr;
};

const PATTERNS = ["random", "sorted", "reverse", "nearly"];
const PATTERN_LABELS = {
  random: "🎲 Random (Avg)",
  sorted: "✅ Sorted (Best)",
  reverse: "❌ Reverse (Worst)",
  nearly: "〰️ Nearly Sorted",
};

export default function BubbleSortAnalysisDashboard() {
  const [arraySize, setArraySize] = useState(20);
  const [results, setResults] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [log, setLog] = useState([]);
  const [activePattern, setActivePattern] = useState("random");

  const runAnalysis = () => {
    const caseResults = {};
    PATTERNS.forEach((p) => {
      const arr = generateArr(arraySize, p);
      caseResults[p] = runBubbleSort(arr);
    });
    setResults(caseResults);
    setLog(caseResults["random"].log);
    setActivePattern("random");

    const sizes = [5, 10, 15, 20, 30, 40, 50];
    const data = sizes.map((s) => {
      const r = runBubbleSort(generateArr(s, "reverse"));
      const b = runBubbleSort(generateArr(s, "sorted"));
      return {
        size: s,
        worstCase: r.comparisons,
        bestCase: b.comparisons,
        theoretical_n2: Math.round(s * (s - 1) / 2),
        theoretical_n: s - 1,
      };
    });
    setGraphData(data);
  };

  const exportJSON = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bubble_sort_analysis.json";
    a.click();
  };

  const exportCSV = () => {
    if (!results) return;
    const rows = [["Pattern", "Comparisons", "Swaps", "Array Accesses", "Total Operations"]];
    PATTERNS.forEach((p) => {
      const r = results[p];
      rows.push([PATTERN_LABELS[p], r.comparisons, r.swaps, r.accesses, r.total]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bubble_sort_analysis.csv";
    a.click();
  };

  const worstComparisons = results?.reverse?.comparisons || 1;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-center mb-2 text-[#a435f0]">
        📊 Bubble Sort Analysis Dashboard
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
        Track operations, compare best/worst cases, and visualize performance
      </p>

      {/* Controls */}
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Array Size: <strong>{arraySize}</strong>
          </label>
          <input
            type="range" min={5} max={50} value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="block w-40 mt-1"
          />
        </div>
        <button
          onClick={runAnalysis}
          className="bg-[#a435f0] hover:bg-[#8f2cd6] text-white px-6 py-2 rounded font-medium transition-colors"
        >
          ▶ Run Analysis
        </button>
        <button
          onClick={exportJSON} disabled={!results}
          className="border border-[#a435f0] text-[#a435f0] hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded disabled:opacity-40 transition-colors"
        >
          ⬇ JSON
        </button>
        <button
          onClick={exportCSV} disabled={!results}
          className="border border-[#a435f0] text-[#a435f0] hover:bg-purple-50 dark:hover:bg-purple-900/20 px-4 py-2 rounded disabled:opacity-40 transition-colors"
        >
          ⬇ CSV
        </button>
      </div>

      {results && (
        <>
          {/* Case Comparison Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {PATTERNS.map((p) => {
              const r = results[p];
              const efficiency = Math.round((1 - r.comparisons / worstComparisons) * 100);
              return (
                <div
                  key={p}
                  onClick={() => { setActivePattern(p); setLog(results[p].log); }}
                  className={`cursor-pointer rounded-lg p-3 border-2 transition-all ${
                    activePattern === p
                      ? "border-[#a435f0] bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900"
                  }`}
                >
                  <div className="text-xs font-medium text-gray-500 mb-1">{PATTERN_LABELS[p]}</div>
                  <div className="text-lg font-bold text-[#a435f0]">{r.comparisons}</div>
                  <div className="text-xs text-gray-500">comparisons</div>
                  <div className="text-sm mt-1">🔁 {r.swaps} swaps</div>
                  <div className="text-sm">👁 {r.accesses} accesses</div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">Efficiency vs Worst</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#a435f0] h-2 rounded-full transition-all"
                        style={{ width: `${Math.max(efficiency, 0)}%` }}
                      />
                    </div>
                    <div className="text-xs text-right mt-1 font-medium">{Math.max(efficiency, 0)}%</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance Graph */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="font-semibold mb-4">📈 Operations vs Array Size</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="size" label={{ value: "Array Size", position: "insideBottom", offset: -2 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="worstCase" stroke="#ef4444" name="Worst Case" strokeWidth={2} />
                <Line type="monotone" dataKey="bestCase" stroke="#22c55e" name="Best Case" strokeWidth={2} />
                <Line type="monotone" dataKey="theoretical_n2" stroke="#f97316" name="O(n²)" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="theoretical_n" stroke="#6366f1" name="O(n)" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Operations Log */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold mb-3">📋 Operations Log — {PATTERN_LABELS[activePattern]}</h2>
            <div className="max-h-60 overflow-y-auto text-xs font-mono space-y-1">
              {log.map((entry, i) => (
                <div
                  key={i}
                  className={`p-1 rounded ${
                    entry.action.includes("Swap")
                      ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className="text-gray-400 mr-2">Pass {entry.pass} |</span>
                  {entry.action}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!results && (
        <div className="text-center py-16 text-gray-400">
          Click <strong>&quot;Run Analysis&quot;</strong> to start the dashboard
        </div>
      )}
    </div>
  );
}