import React from "react";

const AlphaBetaPruningContent = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Alpha-Beta Pruning
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Alpha-beta pruning is an optimization technique for the minimax algorithm that reduces the number of nodes evaluated by the minimax algorithm in its search tree. It is an adversarial search algorithm used commonly for machine playing of two-player games (Tic-tac-toe, Chess, Connect 4, etc.).
        </p>
      </section>

      <section className="bg-blue-50 dark:bg-slate-800/50 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
          How it Works
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The algorithm maintains two values, <strong>Alpha</strong> and <strong>Beta</strong>, which represent the minimum score that the maximizing player is assured of and the maximum score that the minimizing player is assured of, respectively.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
          <li><strong>Alpha:</strong> The best value (highest) that the <em>maximizing</em> player can guarantee at that level or above. Initial value: -&infin;.</li>
          <li><strong>Beta:</strong> The best value (lowest) that the <em>minimizing</em> player can guarantee at that level or above. Initial value: +&infin;.</li>
          <li>If at any time <strong>Alpha &ge; Beta</strong>, the current branch can be pruned, as the opponent will never allow the game to reach this state.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Why use Alpha-Beta Pruning?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Minimax explores all possible states in the game tree. For games like Chess, the number of states is astronomical. Alpha-beta pruning allows us to search much deeper in the same amount of time by cutting off branches that won&apos;t affect the final decision.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-xl">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Time Complexity</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Worst Case:</strong> O(b<sup>d</sup>) (Same as minimax if search order is poor)<br />
            <strong>Best Case:</strong> O(b<sup>d/2</sup>) (With perfect move ordering, it effectively doubles search depth)
          </p>
        </div>
        <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-xl">
          <h4 className="font-bold text-gray-800 dark:text-white mb-2">Space Complexity</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Space:</strong> O(d) where d is the maximum depth of the tree (due to recursion stack).
          </p>
        </div>
      </section>
    </div>
  );
};

export default AlphaBetaPruningContent;
