"use client";
import React from "react";

const Content = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">

        {/* What is Tower of Hanoi */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            What is the Tower of Hanoi?
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              The Tower of Hanoi is a classical mathematical puzzle consisting of three pegs and $N$ disks of different sizes.
              The objective of the puzzle is to move the entire stack of disks from the Source Peg to the Destination Peg
              using an Auxiliary Peg, obeying three simple rules:
            </p>
            <ol className="mt-3 space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li>Only one disk can be moved at a time.</li>
              <li>Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty peg.</li>
              <li>No larger disk may be placed on top of a smaller disk.</li>
            </ol>
            <p className="mt-4 leading-relaxed">
              The puzzle is resolved using a Divide and Conquer recursive strategy:
            </p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              <li><strong>Base Case ($N=1$):</strong> Directly move the single disk from Source to Destination.</li>
              <li><strong>Recursive Case ($N &gt; 1$):</strong>
                <ol className="list-decimal pl-5 mt-1 space-y-1">
                  <li>Move the top $N-1$ disks from Source to Auxiliary using Destination.</li>
                  <li>Move the remaining largest disk from Source to Destination.</li>
                  <li>Move the $N-1$ disks from Auxiliary to Destination using Source.</li>
                </ol>
              </li>
            </ul>
          </div>
        </section>

        {/* The Recurrence Relation */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            The Recurrence Relation
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <p className="leading-relaxed">
              To find the number of moves $T(N)$ required to solve the puzzle for $N$ disks, we can express the operations as a mathematical recurrence relation:
            </p>
            <p className="mt-2 font-mono bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg border border-gray-150 dark:border-zinc-800 text-center text-lg">
              T(N) = 2T(N - 1) + 1, &nbsp; with base case &nbsp; T(1) = 1
            </p>
            <p className="mt-4 leading-relaxed">
              Let's solve this recurrence relation using substitution:
            </p>
            <ul className="mt-2 space-y-1.5 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400 font-mono text-sm bg-gray-50 dark:bg-zinc-900/50 p-3 rounded-lg">
              <li>T(N) = 2T(N-1) + 1</li>
              <li>T(N) = 2[2T(N-2) + 1] + 1 = 2²T(N-2) + 2 + 1</li>
              <li>T(N) = 2³T(N-3) + 2² + 2¹ + 2⁰</li>
              <li>...</li>
              <li>T(N) = 2^(N-1)T(1) + 2^(N-2) + ... + 2¹ + 2⁰</li>
              <li>T(N) = 2^(N-1) + 2^(N-2) + ... + 2¹ + 2⁰</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              This is a geometric progression with a sum of:
            </p>
            <p className="mt-2 font-mono bg-teal-50/40 dark:bg-teal-950/10 p-3 rounded-lg border border-teal-100 dark:border-teal-950/20 text-center text-lg font-bold text-teal-800 dark:text-teal-200">
              T(N) = 2^N - 1
            </p>
            <p className="mt-3 leading-relaxed">
              For example, if we have $N = 3$ disks, the total number of moves will be $2^3 - 1 = 7$ moves. Adding just one more disk doubles the size of the recursion tree, requiring $2^4 - 1 = 15$ moves!
            </p>
          </div>
        </section>

        {/* Complexity Analysis */}
        <section className="p-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#0d9488] mr-3 rounded-full"></span>
            Complexity Analysis
          </h1>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] space-y-4">
            <div>
              <span className="font-mono font-bold bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded border border-rose-100 dark:border-rose-950/30 text-rose-800 dark:text-rose-300 text-sm">
                Time Complexity: O(2^N)
              </span>
              <p className="mt-1 leading-relaxed">
                Since solving the puzzle for $N$ disks requires resolving two sub-problems of size $N-1$ and executing 1 constant time disk move, the recursion tree doubles in width at every level. The total operations equal $2^N - 1$, which grows exponentially.
              </p>
            </div>
            <div>
              <span className="font-mono font-bold bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded border border-amber-100 dark:border-amber-950/30 text-amber-800 dark:text-amber-300 text-sm">
                Space Complexity: O(N)
              </span>
              <p className="mt-1 leading-relaxed">
                The call stack size is determined by the height of the recursion tree. Since we recurse down to $N-1$ before executing moves, the maximum number of frames on the call stack at any point during execution is $N$. Therefore, the auxiliary space complexity is linear, $O(N)$.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
