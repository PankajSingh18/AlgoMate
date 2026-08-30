"use client";
import React from "react";
import ComplexityGraph from "@/app/components/ui/graph";

const DsuContent = () => {
  const paragraphs = [
    `Disjoint Set Union (DSU), also known as the Union-Find data structure, is an advanced tree-based data structure that tracks a set of elements partitioned into a number of disjoint (non-overlapping) subsets. It provides near-constant time operations to merge two sets and to determine if elements belong to the same set.`,
    `DSU is incredibly powerful and serves as the core backbone of several graph algorithms, such as Kruskal's Minimum Spanning Tree (MST), network connectivity tracking, cycle detection in undirected graphs, and dynamic connectivity queries.`,
    `At its core, DSU models each set as a tree. The root of the tree serves as the 'representative' or 'signature' of that entire set. Elements within the same set point upward towards their parent nodes, eventually terminating at the root.`,
    `Without optimizations, operations can degrade to O(N) when trees grow into deep straight chains (similar to degenerate linked lists). However, two simple optimizations keep the trees extremely flat and balanced: Path Compression and Union by Rank.`
  ];

  const makeSetSteps = [
    { points: "Create a parent array of size N." },
    { points: "For each element i, set parent[i] = i, indicating that every element is initially in its own set of size 1." },
    { points: "Initialize a rank or size array for every element, setting rank[i] = 0 or size[i] = 1." }
  ];

  const findSteps = [
    { points: "Start at the target element X." },
    { points: "Follow parent pointers upward (parent[x]) until reaching a node where parent[root] == root." },
    { points: "If Path Compression is enabled: During the backtracking phase of recursion, set parent[x] = root for all nodes visited along the traversal path." },
    { points: "Return the root node as the set representative." }
  ];

  const unionSteps = [
    { points: "Find the root representatives of both target elements X and Y using the Find operation: rootX = Find(X) and rootY = Find(Y)." },
    { points: "If rootX == rootY, the elements are already in the same set; terminate the operation." },
    { points: "If Union by Rank is enabled: Compare rank[rootX] and rank[rootY]. Attach the root with smaller rank under the root with larger rank." },
    { points: "If ranks are identical, attach one under the other arbitrarily, and increment the rank of the new root by 1." },
    { points: "If optimizations are off: simply point parent[rootX] = rootY." }
  ];

  const complexity = [
    { data: "Initialization (MakeSet) Time Complexity: O(N) - to set up parent arrays." },
    { data: "Amortized Operation (Find/Union) Complexity: O(α(N)) - when combining both Path Compression and Union by Rank optimizations." },
    { data: "Unoptimized Find/Union Complexity: O(N) - in worst-case degenerate chain conditions." },
    { data: "Space Complexity: O(N) - to store parent and rank arrays." }
  ];

  return (
    <main className="max-w-7xl mx-auto mt-8">
      <article className="max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden mb-8 shadow-sm">
        {/* What is DSU */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            What is Disjoint Set Union (Union-Find)?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>{paragraphs[0]}</p>
            <p>{paragraphs[1]}</p>
          </div>
        </section>

        {/* Tree & Node Representation */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Underlying Representation
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db] leading-relaxed space-y-4">
            <p>{paragraphs[2]}</p>
            <p>{paragraphs[3]}</p>
            <div className="bg-gray-50 dark:bg-[#1b1b1b] p-4 rounded-xl border border-gray-200 dark:border-gray-800 font-mono text-sm space-y-2">
              <div>
                <span className="text-purple-600 dark:text-purple-400">class</span> DSU {"{"}<br />
                &nbsp;&nbsp;<span className="text-purple-600 dark:text-purple-400">vector&lt;int&gt;</span> parent;<br />
                &nbsp;&nbsp;<span className="text-purple-600 dark:text-purple-400">vector&lt;int&gt;</span> rank;<br />
                <span className="text-purple-600 dark:text-purple-400">public:</span><br />
                &nbsp;&nbsp;DSU(<span className="text-primary dark:text-[#c27cf7]">int</span> n) {"{"}<br />
                &nbsp;&nbsp;&nbsp;&nbsp;parent.resize(n);<br />
                &nbsp;&nbsp;&nbsp;&nbsp;rank.assign(n, 0);<br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary dark:text-[#c27cf7]">for</span>(<span className="text-primary dark:text-[#c27cf7]">int</span> i=0; i&lt;n; ++i) parent[i] = i;<br />
                &nbsp;&nbsp;{"}"}<br />
                {"}"};
              </div>
            </div>
          </div>
        </section>

        {/* Operations */}
        <section className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e] space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              1. MakeSet Algorithm
            </h2>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 text-[#374151] dark:text-[#d1d5db]">
              {makeSetSteps.map((step, idx) => (
                <li key={idx} className="pl-1">{step.points}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              2. Find Representative Algorithm
            </h2>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 text-[#374151] dark:text-[#d1d5db]">
              {findSteps.map((step, idx) => (
                <li key={idx} className="pl-1">{step.points}</li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
              3. Union Merge Algorithm
            </h2>
            <ol className="space-y-2 list-decimal pl-5 marker:text-gray-500 text-[#374151] dark:text-[#d1d5db]">
              {unionSteps.map((step, idx) => (
                <li key={idx} className="pl-1">{step.points}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Time Complexity */}
        <section className="p-6">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white mb-4 flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Performance and Complexity
          </h2>
          <div className="prose dark:prose-invert max-w-none text-[#374151] dark:text-[#d1d5db]">
            <ul className="space-y-3 list-disc pl-5 marker:text-gray-500 dark:marker:text-gray-400">
              {complexity.map((item, index) => (
                <li key={index} className="pl-2">
                  <span className="font-mono bg-[#f3f4f6] dark:bg-[#222] px-2 py-1 rounded-md text-sm font-semibold text-purple-700 dark:text-purple-300">
                    {item.data.split(":")[0]}:
                  </span>
                  <span className="ml-2">{item.data.split(":")[1]}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3">Time Complexity with Optimizations: α(N) vs log(N)</h3>
              <ComplexityGraph
                bestCase={(n) => 1}
                averageCase={(n) => Math.log2(n) / 2}
                worstCase={(n) => Math.log2(n)}
                maxN={20}
              />
            </div>

            <div className="mt-6 p-4 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-xl border border-[#e9d5ff] dark:border-[#3b1a6e]">
              <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-1">Amortized Complexity O(α(N)):</h4>
              <p className="text-[#374151] dark:text-[#d1d5db] leading-relaxed">
                The Inverse Ackermann function α(N) grows incredibly slowly. For all physical values of N in our universe (e.g. N = 2^(2^65536)), α(N) ≤ 4. Therefore, combining both Union by Rank and Path Compression gives the data structure a practically **constant amortized time complexity** of O(1) per operation.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
};

export default DsuContent;
