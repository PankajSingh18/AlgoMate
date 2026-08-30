import React from 'react';

const Content = () => {
  return (
    <div className="mt-8 mb-4 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
        Min Max Algorithm
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 text-center leading-relaxed">
        The Min Max algorithm is a recursive or backtracking algorithm used in decision-making and game theory. It provides an optimal move for the player assuming the opponent is also playing optimally.
      </p>

      <div className="bg-blue-50 dark:bg-[#202020] p-6 rounded-lg shadow-sm border border-blue-100 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">
          How It Works
        </h2>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Construct the game tree to a certain depth or to the terminal nodes.</li>
          <li>Evaluate the non-terminal nodes by evaluating the terminal nodes.</li>
          <li>For the Maximizer turn, choose the child node with the highest value.</li>
          <li>For the Minimizer turn, choose the child node with the lowest value.</li>
          <li>Propagate values up the tree until the root is reached.</li>
        </ol>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-green-700 dark:text-green-400">
            Time Complexity
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li><span className="font-semibold text-gray-900 dark:text-gray-100">Best Case:</span> O(b^d)</li>
            <li><span className="font-semibold text-gray-900 dark:text-gray-100">Average Case:</span> O(b^d)</li>
            <li><span className="font-semibold text-gray-900 dark:text-gray-100">Worst Case:</span> O(b^d)</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Where b is the branching factor and d is depth.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-3 text-purple-700 dark:text-purple-400">
            Space Complexity
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li><span className="font-semibold text-gray-900 dark:text-gray-100">Complexity:</span> O(b * d)</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            The space is mainly consumed by the recursive call stack during the deep-first search traversal of the game tree.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Content;
