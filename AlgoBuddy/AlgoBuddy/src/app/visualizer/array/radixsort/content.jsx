import React from "react";

const CountingSortContent = () => {
  return (
    <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
      <h2 className="text-2xl font-semibold mb-4">What is Counting Sort?</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Counting Sort is a non-comparison-based sorting algorithm that works by counting the number of occurrences of each value and using those counts to place elements into the correct position.
      </p>
      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
        <li>It is especially efficient when the range of input values is small relative to the number of elements.</li>
        <li>Counting Sort builds a count array, computes prefix sums, and then places each element into the output array in stable order.</li>
        <li>It does not perform swaps between arbitrary elements; instead, it moves elements directly to their final sorted positions.</li>
      </ul>
    </div>
  );
};

export default CountingSortContent;
