"use client";
import React from "react";
import Image from "next/image";

const Content = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8">
        
        {/* Intro Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Sliding Window Technique
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-4">
              The <strong>Sliding Window</strong> technique is an optimization pattern used primarily for arrays and strings. It aims to reduce the use of nested loops and replace them with a single loop, thereby reducing the time complexity from <strong>O(N²)</strong> to <strong>O(N)</strong>.
            </p>
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              Think of a window as a contiguous subset of elements within the array or string. Depending on the problem, this window can either be of a <strong>fixed size</strong> (e.g., &quot;find the maximum sum of exactly K elements&quot;) or a <strong>variable size</strong> (e.g., &quot;find the smallest subarray whose sum is greater than or equal to S&quot;).
            </p>
          </div>
        </section>

        {/* Fixed-Size Window Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            1. Fixed-Size Window
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-4">
              In a fixed-size window problem, the size of the window <strong>K</strong> is given. The window slides over the data structure one element at a time. As the window moves forward by one position, the element that falls out of the left boundary is removed from our running state (e.g., a running sum), and the new element that enters the right boundary is added.
            </p>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Common Pattern:</h4>
            <ul className="list-disc list-inside text-[#374151] dark:text-[#d1d5db] mb-4 space-y-1 marker:text-gray-500 dark:marker:text-gray-400">
              <li>Initialize the window by processing the first <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">K</code> elements.</li>
              <li>Slide the window by moving the <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">left</code> and <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">right</code> pointers one step forward.</li>
              <li>Update the result (e.g., check if the new sum is the maximum).</li>
              <li>Repeat until the <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">right</code> pointer reaches the end of the array.</li>
            </ul>
          </div>
        </section>

        {/* Variable-Size Window Section */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            2. Variable-Size Window
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-4">
              In a variable-size window problem, the window size can grow or shrink dynamically based on certain conditions. Typically, we expand the window by moving the <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">right</code> pointer until a condition is met or violated. Then, we shrink the window from the <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">left</code> until the condition is satisfied again.
            </p>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Common Pattern:</h4>
            <ul className="list-disc list-inside text-[#374151] dark:text-[#d1d5db] mb-4 space-y-1 marker:text-gray-500 dark:marker:text-gray-400">
              <li>Start with both <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">left</code> and <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">right</code> pointers at 0.</li>
              <li>Expand the window by advancing <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">right</code> and updating the running state.</li>
              <li>If the condition is violated (e.g., duplicate character found, sum exceeds limit), shrink the window by advancing <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">left</code> until the condition is valid again.</li>
              <li>Keep track of the optimal result (e.g., longest substring length, smallest subarray length).</li>
            </ul>
          </div>
        </section>

        {/* Time Complexity Section */}
        <section className="p-6">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Why is it O(N)?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed mb-4">
              Although variable-size sliding window problems often feature a <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">while</code> loop inside a <code className="bg-[#f3f4f6] dark:bg-[#222] px-1 rounded">for</code> loop, the overall time complexity is still <strong>O(N)</strong>.
            </p>
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                This is because both the <code className="bg-[#e9d5ff] dark:bg-[#3b1a6e] px-1 rounded">left</code> and <code className="bg-[#e9d5ff] dark:bg-[#3b1a6e] px-1 rounded">right</code> pointers only ever move forward. In the worst case, each element is visited at most twice: once when it enters the window (by the right pointer) and once when it leaves (by the left pointer). Therefore, the work done is proportional to 2N, which simplifies to O(N).
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
