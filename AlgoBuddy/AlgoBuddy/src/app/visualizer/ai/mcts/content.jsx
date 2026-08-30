"use client";
import React from "react";

const Content = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <article className="max-w-4xl bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        {/* What is MCTS */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Monte Carlo Tree Search?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
              Monte Carlo Tree Search (MCTS) is a heuristic search algorithm for decision processes, most notably used in game-playing AI. Unlike exhaustive 
              search algorithms like Minimax, MCTS builds a search tree by performing randomized simulations (playouts) of a game. This allows it to 
              operate effectively in games with massive branching factors (like Go) where traditional heuristics are difficult to define.
            </p>
          </div>
        </section>

        {/* The 4 Phases */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            The 4 Phases of MCTS
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-6 leading-relaxed">
              MCTS iterates through four distinct phases to gradually explore the most promising branches of a decision tree:
            </p>

            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">1</div>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">Selection</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Starting at the root, move down the tree by picking nodes with the best UCT (Upper Confidence Bound for Trees) score until a leaf node is reached.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">2</div>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">Expansion</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400">If the leaf node isn&apos;t a terminal state, create one or more child nodes to represent possible future moves.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm">3</div>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">Simulation</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Perform a &quot;playout&quot; from the new node by choosing moves (often randomly) until the end of the game is reached.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">4</div>
                <div>
                  <strong className="text-gray-900 dark:text-white block mb-1">Backpropagation</strong>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Propagate the result of the simulation (win or loss) back up the path to update the visit count and win rate of all ancestor nodes.</p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* UCT Formula */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Balancing via UCT
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-6 leading-relaxed">
              To decide which node to visit, MCTS uses the <strong>Upper Confidence Bound for Trees</strong> formula. This helps balance the 
              need to <em>exploit</em> high-winning branches and <em>explore</em> less-visited ones:
            </p>
            
            <div className="bg-[#f9fafb] dark:bg-[#1a1a1a] p-8 rounded-2xl border border-[#f3f4f6] dark:border-[#222] text-center mb-6 shadow-inner">
              <span className="text-xl md:text-2xl font-mono text-[#a435f0]">
                UCT = (w<sub>i</sub> / n<sub>i</sub>) + C * √[ ln(N<sub>i</sub>) / n<sub>i</sub> ]
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono text-gray-500 dark:text-gray-400">
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-lg"><strong>w</strong> = node wins</div>
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-lg"><strong>n</strong> = node visits</div>
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-lg"><strong>N</strong> = parent visits</div>
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-lg"><strong>C</strong> = constant</div>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="p-6">
          <h1 className="text-2xl font-black text-[#1a1a1a] dark:text-white mb-4 flex items-center" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Why MCTS?
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-[#374151] dark:text-[#d1d5db] mb-6 leading-relaxed">
              MCTS offers several advantages over traditional game-tree search algorithms:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
                <h4 className="font-bold text-[#a435f0] mb-2 uppercase text-xs tracking-wider">Massive Complexity</h4>
                <p className="text-sm">It handles games with huge branching factors where Minimax fails due to depth limits.</p>
              </div>
              <div className="p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
                <h4 className="font-bold text-[#a435f0] mb-2 uppercase text-xs tracking-wider">No Expert Knowledge</h4>
                <p className="text-sm">It doesn&apos;t require a hand-crafted evaluation function; the &quot;knowledge&quot; is built statistically.</p>
              </div>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default Content;


