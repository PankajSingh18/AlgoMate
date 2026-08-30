"use client";
import React from "react";

const Content = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">

        {/* Intro */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Two Pointers Technique
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-4">
              The <strong>Two Pointers</strong> technique uses two index variables that traverse a data structure — usually an array — simultaneously. By moving pointers strategically, we eliminate the need for a nested loop, reducing time complexity from <strong>O(N²)</strong> to <strong>O(N)</strong>.
            </p>
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              Two Pointers problems fall into two categories: <strong>opposite direction</strong> (pointers start at both ends and move toward each other) and <strong>same direction</strong> (a slow and a fast pointer both move forward, at different speeds).
            </p>
          </div>
        </section>

        {/* Opposite Direction */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            1. Opposite Direction Pointers
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-4">
              Place <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">left</code> at index <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">0</code> and <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">right</code> at index <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">n-1</code>. Move them toward each other based on a condition. Requires a <strong>sorted array</strong> in most cases.
            </p>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Common Pattern:</h4>
            <ul className="list-disc list-inside text-[#374151] dark:text-[#d1d5db] mb-4 space-y-1 marker:text-gray-500 dark:marker:text-gray-400">
              <li>Initialize <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">left = 0</code>, <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">right = n - 1</code>.</li>
              <li>Compute a value using both pointers (e.g., sum, area).</li>
              <li>If the value is too small, move <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">left</code> right to increase it.</li>
              <li>If the value is too large, move <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">right</code> left to decrease it.</li>
              <li>Stop when <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">left &gt;= right</code>.</li>
            </ul>
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              <strong>Problems:</strong> Pair Sum, Container With Most Water, Three Sum.
            </p>
          </div>
        </section>

        {/* Same Direction */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            2. Same Direction Pointers (Slow & Fast)
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-4">
              Both pointers start at the beginning and move forward, but at different rates. A <strong>slow pointer</strong> marks the boundary of the processed region; a <strong>fast pointer</strong> scans ahead.
            </p>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Common Pattern:</h4>
            <ul className="list-disc list-inside text-[#374151] dark:text-[#d1d5db] mb-4 space-y-1 marker:text-gray-500 dark:marker:text-gray-400">
              <li>Initialize <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">slow = 0</code>, <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">fast = 1</code>.</li>
              <li>Advance <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">fast</code> through the array.</li>
              <li>When a valid element is found, advance <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">slow</code> and write/record the value.</li>
              <li>Repeat until <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">fast</code> reaches the end.</li>
            </ul>
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              <strong>Problems:</strong> Remove Duplicates, Move Zeroes, Remove Element.
            </p>
          </div>
        </section>

        {/* Why O(N) */}
        <section className="p-6">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Why is it O(N)?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-4">
              Even though we have two pointers, each pointer only ever moves in one direction — never backward. In the worst case, each pointer traverses the entire array once.
            </p>
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                Total work = at most <strong>2N</strong> steps (left pointer moves at most N times, right pointer moves at most N times), which simplifies to <strong>O(N)</strong> — a significant improvement over the <strong>O(N²)</strong> brute-force approach.
              </p>
            </div>
          </div>
        </section>

      </article>
    </main>
  );
};

export default Content;