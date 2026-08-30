"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Table, Zap, HelpCircle, Code, ListFilter } from "lucide-react";
import Footer from "@/app/components/footer";

const DS_COMPLEXITY = [
  { name: "Array", avgAccess: "O(1)", avgSearch: "O(n)", avgInsert: "O(n)", avgDelete: "O(n)", worstAccess: "O(1)", worstSearch: "O(n)", worstInsert: "O(n)", worstDelete: "O(n)", space: "O(n)" },
  { name: "Stack", avgAccess: "O(n)", avgSearch: "O(n)", avgInsert: "O(1)", avgDelete: "O(1)", worstAccess: "O(n)", worstSearch: "O(n)", worstInsert: "O(1)", worstDelete: "O(1)", space: "O(n)" },
  { name: "Queue", avgAccess: "O(n)", avgSearch: "O(n)", avgInsert: "O(1)", avgDelete: "O(1)", worstAccess: "O(n)", worstSearch: "O(n)", worstInsert: "O(1)", worstDelete: "O(1)", space: "O(n)" },
  { name: "Singly Linked List", avgAccess: "O(n)", avgSearch: "O(n)", avgInsert: "O(1)", avgDelete: "O(1)", worstAccess: "O(n)", worstSearch: "O(n)", worstInsert: "O(1)", worstDelete: "O(1)", space: "O(n)" },
  { name: "Doubly Linked List", avgAccess: "O(n)", avgSearch: "O(n)", avgInsert: "O(1)", avgDelete: "O(1)", worstAccess: "O(n)", worstSearch: "O(n)", worstInsert: "O(1)", worstDelete: "O(1)", space: "O(n)" },
  { name: "Binary Search Tree", avgAccess: "O(log n)", avgSearch: "O(log n)", avgInsert: "O(log n)", avgDelete: "O(log n)", worstAccess: "O(n)", worstSearch: "O(n)", worstInsert: "O(n)", worstDelete: "O(n)", space: "O(n)" },
  { name: "AVL Tree", avgAccess: "O(log n)", avgSearch: "O(log n)", avgInsert: "O(log n)", avgDelete: "O(log n)", worstAccess: "O(log n)", worstSearch: "O(log n)", worstInsert: "O(log n)", worstDelete: "O(log n)", space: "O(n)" },
  { name: "Hash Table", avgAccess: "N/A", avgSearch: "O(1)", avgInsert: "O(1)", avgDelete: "O(1)", worstAccess: "N/A", worstSearch: "O(n)", worstInsert: "O(n)", worstDelete: "O(n)", space: "O(n)" },
];

const ALGO_COMPLEXITY = [
  { name: "Bubble Sort", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes" },
  { name: "Selection Sort", best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "No" },
  { name: "Insertion Sort", best: "O(n)", avg: "O(n²)", worst: "O(n²)", space: "O(1)", stable: "Yes" },
  { name: "Merge Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: "Yes" },
  { name: "Quick Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: "No" },
  { name: "Heap Sort", best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: "No" },
];

const PATTERNS = [
  {
    title: "Two Pointers",
    description: "Initialize two pointers at separate indices (e.g., start and end) and move them towards each other or at different speeds.",
    useCase: "Searching pairs in sorted arrays, reversing arrays, finding cycle detection.",
    template: `function twoSumSorted(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    else if (sum < target) left++;
    else right--;
  }
  return [];
}`,
  },
  {
    title: "Sliding Window",
    description: "Maintain a dynamic or fixed subarray range (window) that expands or shrinks based on constraints while traversing.",
    useCase: "Longest substring without repeating characters, maximum sum subarray of size K.",
    template: `function maxSubarraySum(arr, k) {
  let maxSum = 0, windowSum = 0;
  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i];
    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[i - (k - 1)];
    }
  }
  return maxSum;
}`,
  },
  {
    title: "Fast & Slow Pointers (Tortoise & Hare)",
    description: "Use two pointers moving at different speeds (usually slow moves 1 step, fast moves 2 steps) to detect cycles or structure properties.",
    useCase: "Linked List cycle detection, finding middle of linked list.",
    template: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
  },
];

function getBadgeColor(val) {
  if (val === "O(1)" || val === "O(log n)" || val === "Yes") {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/40";
  }
  if (val === "O(n)" || val === "O(log n)" || val === "O(log n)") {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/40";
  }
  if (val === "O(n log n)") {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40";
  }
  if (val === "O(n²)" || val === "No") {
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800/40";
  }
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800/40";
}

export default function Cheatsheets() {
  const [activeTab, setActiveTab] = useState("ds");
  const [expandedPattern, setExpandedPattern] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <main className="container-app section-app">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-sm font-bold tracking-wider uppercase mb-4">
              <Zap className="w-4 h-4 animate-pulse" />
              Quick Reference
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-serif text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-6">
              DSA Complexity{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] dark:from-[var(--color-primary-light)] dark:to-[var(--color-primary)]">
                Cheatsheets
              </span>
            </h1>
            <p className="text-xl text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] max-w-2xl mx-auto">
              Compare time and space complexities at a glance. Identify the right data structure or algorithm for any problem.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-xl bg-[var(--color-neutral-100)] dark:bg-[var(--udemy-dark-surface)] p-1.5 border border-[var(--color-border)]">
              <button
                onClick={() => setActiveTab("ds")}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "ds"
                    ? "bg-white dark:bg-[var(--color-neutral-800)] text-[var(--color-primary)] dark:text-[var(--color-primary-light)] shadow-sm"
                    : "text-[var(--udemy-muted)] hover:text-[var(--udemy-text)] dark:hover:text-white"
                }`}
              >
                Data Structures
              </button>
              <button
                onClick={() => setActiveTab("algo")}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "algo"
                    ? "bg-white dark:bg-[var(--color-neutral-800)] text-[var(--color-primary)] dark:text-[var(--color-primary-light)] shadow-sm"
                    : "text-[var(--udemy-muted)] hover:text-[var(--udemy-text)] dark:hover:text-white"
                }`}
              >
                Algorithms (Sorting)
              </button>
            </div>
          </div>

          {/* Tables Section */}
          <div className="card-surface overflow-hidden mb-16">
            <div className="overflow-x-auto w-full">
              {activeTab === "ds" ? (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[var(--color-neutral-50)] dark:bg-[var(--udemy-dark-surface)] border-b border-[var(--color-border)]">
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white">Data Structure</th>
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white text-center" colSpan={4}>Average Case</th>
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white text-center" colSpan={4}>Worst Case</th>
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white text-center">Space</th>
                    </tr>
                    <tr className="bg-[var(--color-neutral-100)]/50 dark:bg-[var(--udemy-dark-surface)]/50 border-b border-[var(--color-border)] text-xs text-[var(--color-muted)]">
                      <th className="p-3 font-semibold">Name</th>
                      <th className="p-3 font-semibold text-center border-l border-[var(--color-border)]/50">Access</th>
                      <th className="p-3 font-semibold text-center">Search</th>
                      <th className="p-3 font-semibold text-center">Insert</th>
                      <th className="p-3 font-semibold text-center">Delete</th>
                      <th className="p-3 font-semibold text-center border-l border-[var(--color-border)]/50">Access</th>
                      <th className="p-3 font-semibold text-center">Search</th>
                      <th className="p-3 font-semibold text-center">Insert</th>
                      <th className="p-3 font-semibold text-center">Delete</th>
                      <th className="p-3 font-semibold text-center border-l border-[var(--color-border)]/50">Worst</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {DS_COMPLEXITY.map((ds) => (
                      <tr key={ds.name} className="hover:bg-[var(--color-neutral-100)] dark:hover:bg-[var(--udemy-dark-surface)]/60 transition-colors">
                        <td className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white">{ds.name}</td>
                        {/* Avg */}
                        <td className="p-3 text-center border-l border-[var(--color-border)]/30"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(ds.avgAccess)}`}>{ds.avgAccess}</span></td>
                        <td className="p-3 text-center"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(ds.avgSearch)}`}>{ds.avgSearch}</span></td>
                        <td className="p-3 text-center"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(ds.avgInsert)}`}>{ds.avgInsert}</span></td>
                        <td className="p-3 text-center"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(ds.avgDelete)}`}>{ds.avgDelete}</span></td>
                        {/* Worst */}
                        <td className="p-3 text-center border-l border-[var(--color-border)]/30"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(ds.worstAccess)}`}>{ds.worstAccess}</span></td>
                        <td className="p-3 text-center"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(ds.worstSearch)}`}>{ds.worstSearch}</span></td>
                        <td className="p-3 text-center"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(ds.worstInsert)}`}>{ds.worstInsert}</span></td>
                        <td className="p-3 text-center"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(ds.worstDelete)}`}>{ds.worstDelete}</span></td>
                        {/* Space */}
                        <td className="p-3 text-center border-l border-[var(--color-border)]/30"><span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold border ${getBadgeColor(ds.space)}`}>{ds.space}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[var(--color-neutral-50)] dark:bg-[var(--udemy-dark-surface)] border-b border-[var(--color-border)]">
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white">Algorithm Name</th>
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white text-center">Best Case</th>
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white text-center">Average Case</th>
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white text-center">Worst Case</th>
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white text-center">Worst Space</th>
                      <th className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white text-center">Stable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {ALGO_COMPLEXITY.map((algo) => (
                      <tr key={algo.name} className="hover:bg-[var(--color-neutral-100)] dark:hover:bg-[var(--udemy-dark-surface)]/60 transition-colors">
                        <td className="p-4 font-bold text-sm text-[var(--udemy-text)] dark:text-white">{algo.name}</td>
                        <td className="p-4 text-center"><span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(algo.best)}`}>{algo.best}</span></td>
                        <td className="p-4 text-center"><span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(algo.avg)}`}>{algo.avg}</span></td>
                        <td className="p-4 text-center"><span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(algo.worst)}`}>{algo.worst}</span></td>
                        <td className="p-4 text-center"><span className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-medium border ${getBadgeColor(algo.space)}`}>{algo.space}</span></td>
                        <td className="p-4 text-center"><span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColor(algo.stable)}`}>{algo.stable}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Patterns Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold font-serif text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-8 flex items-center gap-3">
              <Code className="w-6 h-6 text-[var(--color-primary)]" />
              Essential DSA Patterns
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {PATTERNS.map((pattern, index) => (
                <div key={pattern.title} className="card-surface p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[var(--udemy-text)] dark:text-white font-serif">{pattern.title}</h3>
                    <button
                      onClick={() => setExpandedPattern(expandedPattern === index ? null : index)}
                      className="text-xs font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline"
                    >
                      {expandedPattern === index ? "Hide Code Template" : "View Code Template"}
                    </button>
                  </div>
                  <p className="text-sm text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-3">{pattern.description}</p>
                  <p className="text-xs text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] mb-4">
                    <strong className="text-[var(--color-primary)]">Common Use Cases:</strong> {pattern.useCase}
                  </p>

                  {expandedPattern === index && (
                    <div className="mt-4 rounded-lg bg-[var(--color-neutral-900)] p-4 overflow-x-auto border border-black hljs-force-dark">
                      <pre className="text-xs font-mono leading-relaxed text-left text-[#abb2bf]">
                        <code>{pattern.template}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Back Home */}
          <div className="text-center">
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
