"use client";

import ComplexityGraph from "@/app/components/ui/graph";
import { Lightbulb, ArrowDownToLine, ArrowUpToLine, Eye, Layers } from "lucide-react";

export default function HeapContent() {
  return (
    <main className="max-w-4xl mx-auto mt-8 mb-8">
      <article className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden shadow-lg shadow-purple-500/5">
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            What is a Heap?
          </h2>
          <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
            A heap is a complete binary tree stored in an array. In a Min Heap, every parent is smaller than its children.
            In a Max Heap, every parent is larger than its children. This visualizer helps you track heap operations step by step
            through both tree and array views.
          </p>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] bg-purple-50/30 dark:bg-purple-900/5">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            Core Operations
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-purple-200 dark:border-purple-900 p-4 bg-white dark:bg-[#161025]">
              <p className="font-semibold text-purple-800 dark:text-purple-300 inline-flex items-center gap-2"><ArrowDownToLine className="w-4 h-4" /> Insert</p>
              <p className="text-sm mt-1 text-[#6b7280] dark:text-[#cbd5e1]">Insert at the last position, then Heapify Up with parent-child comparisons and swaps.</p>
            </div>
            <div className="rounded-xl border border-purple-200 dark:border-purple-900 p-4 bg-white dark:bg-[#161025]">
              <p className="font-semibold text-purple-800 dark:text-purple-300 inline-flex items-center gap-2"><ArrowUpToLine className="w-4 h-4" /> Extract Root</p>
              <p className="text-sm mt-1 text-[#6b7280] dark:text-[#cbd5e1]">Remove root, place last node at root, then Heapify Down to restore order.</p>
            </div>
            <div className="rounded-xl border border-purple-200 dark:border-purple-900 p-4 bg-white dark:bg-[#161025]">
              <p className="font-semibold text-purple-800 dark:text-purple-300 inline-flex items-center gap-2"><Eye className="w-4 h-4" /> Peek</p>
              <p className="text-sm mt-1 text-[#6b7280] dark:text-[#cbd5e1]">Read the root instantly: min for Min Heap, max for Max Heap.</p>
            </div>
            <div className="rounded-xl border border-purple-200 dark:border-purple-900 p-4 bg-white dark:bg-[#161025]">
              <p className="font-semibold text-purple-800 dark:text-purple-300 inline-flex items-center gap-2"><Layers className="w-4 h-4" /> Heapify</p>
              <p className="text-sm mt-1 text-[#6b7280] dark:text-[#cbd5e1]">Rebuild heap property manually by checking internal nodes from bottom to top.</p>
            </div>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-purple-500 mr-3 rounded-full"></span>
            Time Complexity
          </h2>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="px-3 py-1 rounded-lg text-sm bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">Insert: O(log N)</span>
            <span className="px-3 py-1 rounded-lg text-sm bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">Extract Root: O(log N)</span>
            <span className="px-3 py-1 rounded-lg text-sm bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">Peek: O(1)</span>
            <span className="px-3 py-1 rounded-lg text-sm bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">Heapify (full): O(N)</span>
          </div>
          <div className="mt-4 bg-gray-50 dark:bg-neutral-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-inner">
            <ComplexityGraph
              bestCase={(n) => Math.log2(n)}
              averageCase={(n) => Math.log2(n)}
              worstCase={(n) => Math.log2(n)}
              maxN={64}
              title="Insert/Extract Complexity: O(log N)"
            />
          </div>
        </section>

        <section className="p-6 bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/20 dark:to-neutral-950">
          <div className="flex items-start gap-4">
            <div className="mt-1 bg-purple-100 dark:bg-purple-900/50 p-2.5 rounded-xl shadow-sm text-purple-600 dark:text-purple-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">Learning Focus</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-purple-800 dark:text-purple-200/80">
                <li>How array indices map directly to parent-child tree links.</li>
                <li>Why local swaps are enough to restore global heap property.</li>
                <li>How Min Heap and Max Heap differ only in comparison direction.</li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
