"use client";
import React from "react";

const Content = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em" }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is A* Search?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              A* Search is a best-first pathfinding algorithm that finds the shortest route from a start node to a goal node while using a heuristic to guide exploration. It is widely used on grids, maps, and navigation systems because it combines the cost so far with an estimate of the remaining distance.
            </p>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em" }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            The Core Formula
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-6 leading-relaxed">
              A* chooses the next node with the smallest total score:
            </p>
            <div className="bg-[#f9fafb] dark:bg-[#1a1a1a] p-8 rounded-2xl border border-[#f3f4f6] dark:border-[#222] text-center mb-6 shadow-inner">
              <span className="text-xl md:text-2xl font-mono text-[#a435f0]">
                f(n) = g(n) + h(n)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
                <h4 className="font-bold text-[#a435f0] mb-2 uppercase text-xs tracking-wider">g(n)</h4>
                <p>Actual cost from the start node to the current node.</p>
              </div>
              <div className="p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
                <h4 className="font-bold text-[#a435f0] mb-2 uppercase text-xs tracking-wider">h(n)</h4>
                <p>Heuristic estimate from the current node to the goal.</p>
              </div>
              <div className="p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
                <h4 className="font-bold text-[#a435f0] mb-2 uppercase text-xs tracking-wider">f(n)</h4>
                <p>The total priority used to decide which node to explore next.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em" }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Why A* Works Well
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">1</div>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">Admissible heuristics</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400">If the heuristic never overestimates the remaining cost, A* is guaranteed to find an optimal path.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">2</div>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">Open and closed sets</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400">The open set stores candidates to visit next, while the closed set tracks nodes that have already been expanded.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm">3</div>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">Practical pathfinding</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400">A* is fast enough for real-world navigation when paired with a sensible heuristic such as Manhattan distance on a grid.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="p-6">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.03em" }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Time and Space Complexity
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-[#f3f4f6] dark:border-[#222]">
                <h4 className="font-bold text-[#a435f0] mb-2 uppercase text-xs tracking-wider">Worst case</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">A* can examine many nodes when the heuristic is weak, so the worst case is still exponential in the search depth.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-[#f3f4f6] dark:border-[#222]">
                <h4 className="font-bold text-[#a435f0] mb-2 uppercase text-xs tracking-wider">Best case</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">A strong heuristic dramatically cuts exploration and moves the search quickly toward the target.</p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;
