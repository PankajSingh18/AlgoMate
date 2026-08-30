const content = () => {
  const overview = [
    `Sorting a linked list means arranging its nodes in ascending or descending order based on their values.`,
    `Merge Sort is the most efficient sorting algorithm for linked lists because it does not require random access and works efficiently by splitting and merging linked lists.`
  ];

  const sortingSteps = [
    { step: "Find the middle node of the linked list using slow and fast pointers" },
    { step: "Split the linked list into two halves" },
    { step: "Recursively sort both halves using Merge Sort" },
    { step: "Merge the two sorted linked lists" },
    { step: "Repeat until the entire list becomes sorted" }
  ];

  const edgeCases = [
    "Empty linked list",
    "Single-node linked list",
    "Already sorted linked list",
    "Linked list with duplicate values",
    "Linked list sorted in reverse order"
  ];

  const bestPractices = [
    "Use Merge Sort for linked lists due to its O(n log n) performance",
    "Avoid Bubble Sort and Selection Sort for large linked lists",
    "Use slow and fast pointers to find the middle efficiently",
    "Test with duplicate and negative values",
    "Verify all node links after merging"
  ];

  return (
    <main className="max-w-4xl mx-auto">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        {/* Overview */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Sorting a Linked List
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            {overview.map((para, index) => (
              <p key={index} className="text-[#374151] dark:text-[#d1d5db] mb-3 leading-relaxed">
                {para}
              </p>
            ))}
            <div className="mt-4 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                <strong>Tip:</strong> Merge Sort is considered the best general-purpose sorting algorithm for linked lists because it achieves O(n log n) time complexity while efficiently handling node-based structures.
              </p>
            </div>
          </div>
        </section>

        {/* Merge Steps */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Steps to Sort</h2>
          <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 dark:marker:text-gray-400">
            {sortingSteps.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db] pl-2">
                {item.step}
              </li>
            ))}
          </ol>
        </section>

        {/* Edge Cases */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edge Cases</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-yellow-500 dark:marker:text-yellow-400">
            {edgeCases.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db]">{item}</li>
            ))}
          </ul>
        </section>

        {/* Best Practices */}
        <section className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Best Practices</h2>
          <ul className="list-disc pl-5 space-y-2 marker:text-green-500 dark:marker:text-green-400">
            {bestPractices.map((item, index) => (
              <li key={index} className="text-[#374151] dark:text-[#d1d5db]">{item}</li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
};

export default content;