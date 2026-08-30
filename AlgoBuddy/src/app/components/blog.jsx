"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Calendar, User, Clock, ArrowRight, X, Newspaper } from "lucide-react";
import Footer from "@/app/components/footer";

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Power of Visual Learning in Mastering DSA",
    summary: "Why static textbooks fall short and how dynamic, step-by-step visualizations help developers form a permanent mental model of stack, tree, and graph operations.",
    author: "Sohan Rout",
    date: "June 02, 2026",
    readTime: "5 min read",
    tags: ["Learning Theory", "DSA"],
    content: (
      <>
        <p className="mb-4">
          Learning Data Structures and Algorithms (DSA) has traditionally been approached through thick textbooks, black-and-white node diagrams, and dense code snippets. While this rigor is essential for academic foundations, it often leaves a significant gap when trying to build intuition.
        </p>
        <h3 className="text-xl font-bold font-serif my-4 text-[var(--udemy-text)] dark:text-white">The Limits of Static Diagrams</h3>
        <p className="mb-4">
          When you read about a AVL tree rotation or a quicksort partition step, you are looking at a static snapshot. However, algorithms are dynamic processes. They are sets of instructions that change states, move pointers, and restructure memory over time.
        </p>
        <p className="mb-4">
          Without active visualization, your brain has to manually run the algorithm's execution loop, keeping track of indices, swap variables, and recursive frames. For complex operations like graph traversals or balance factor corrections, this mental stack quickly overflows.
        </p>
        <h3 className="text-xl font-bold font-serif my-4 text-[var(--udemy-text)] dark:text-white">Why Interactive Visualizations Work</h3>
        <p className="mb-4">
          Interactive tools like AlgoBuddy bridge this gap by mapping computational actions directly to visual transitions. By seeing elements slide into a Stack or watching a pivot element swap positions in an Array:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>You build spatial memory:</strong> You associate operations with spatial shifts (e.g., LIFO as a vertical container).</li>
          <li><strong>You inspect variables in real-time:</strong> Seeing indices moving helps you see exactly *why* off-by-one errors happen.</li>
          <li><strong>You learn edge cases:</strong> Boundary conditions (like empty lists or single nodes) become visually obvious.</li>
        </ul>
        <p className="mb-4">
          Next time you struggle to understand how an algorithm works, don't just stare at the code. Go to the visualizer, feed it custom inputs, step through it line-by-line, and watch the structure evolve.
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "Demystifying Big O: A Visual Guide to Complexity",
    summary: "Confused about logarithmic growth vs quadratic growth? Learn how to visualize complexity curves and optimize your algorithms with confidence.",
    author: "Megh Patel",
    date: "May 28, 2026",
    readTime: "8 min read",
    tags: ["Core Concepts", "Analysis"],
    content: (
      <>
        <p className="mb-4">
          In software engineering, speed and efficiency are key. But how do we describe how fast an algorithm runs without relying on specific hardware benchmarks? The answer is Big O Notation.
        </p>
        <h3 className="text-xl font-bold font-serif my-4 text-[var(--udemy-text)] dark:text-white">Measuring Growth, Not Seconds</h3>
        <p className="mb-4">
          Big O doesn't measure runtime in milliseconds. Instead, it describes how the execution time or memory space of an algorithm grows as the size of the input data ($n$) increases.
        </p>
        <h3 className="text-xl font-bold font-serif my-4 text-[var(--udemy-text)] dark:text-white">Common Growth Rates</h3>
        <div className="space-y-4 mb-4">
          <p>
            <strong>1. Constant Time - $O(1)$:</strong> The execution time remains the same regardless of data size. Example: Accessing an element in an array by its index.
          </p>
          <p>
            <strong>2. Logarithmic Time - $O(\log n)$:</strong> With each step, the problem size is halved. Example: Binary Search. This is highly efficient even for billions of elements.
          </p>
          <p>
            <strong>3. Linear Time - $O(n)$:</strong> The runtime grows in direct proportion to the input size. Example: Linear search through an unsorted array.
          </p>
          <p>
            <strong>4. Quadratic Time - $O(n²)$:</strong> The runtime is proportional to the square of the input size. Example: Bubble Sort with nested loops. Performance degrades rapidly on larger datasets.
          </p>
        </div>
        <p className="mb-4">
          Understanding these bounds helps you make smart trade-offs. If you expect your input size to be small, an $O(n²)$ algorithm might be acceptable due to simplicity. But for large-scale systems, optimization to $O(n \log n)$ or $O(n)$ is mandatory.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: "Graph Traversal: Deciding Between BFS and DFS",
    summary: "A practical guide comparing Breadth-First Search (BFS) and Depth-First Search (DFS) traversals, their memory trade-offs, and typical use cases in interviews.",
    author: "Pankaj Singh",
    date: "May 15, 2026",
    readTime: "7 min read",
    tags: ["Algorithms", "Graphs"],
    content: (
      <>
        <p className="mb-4">
          Graphs are everywhere—from social networks and search engines to pathfinding in video games. Exploring these networks requires robust traversal algorithms. The two foundational methods are BFS and DFS.
        </p>
        <h3 className="text-xl font-bold font-serif my-4 text-[var(--udemy-text)] dark:text-white">Breadth-First Search (BFS)</h3>
        <p className="mb-4">
          BFS explores the graph level-by-level. It starts at a source node, visits all its immediate neighbors, and then visits the neighbors of those neighbors. It uses a <strong>Queue</strong> data structure (FIFO) to track vertices.
        </p>
        <p className="mb-4">
          <strong>Key Use Case:</strong> Shortest path on unweighted graphs. Since BFS radiates outward equally, the first time it reaches a target node, it is guaranteed to have taken the path with the fewest edges.
        </p>
        <h3 className="text-xl font-bold font-serif my-4 text-[var(--udemy-text)] dark:text-white">Depth-First Search (DFS)</h3>
        <p className="mb-4">
          DFS explores as deep as possible along each branch before backtracking. It goes down a path until it hits a dead end, then backtracks to the most recent branch node. It uses a recursive call stack or an explicit <strong>Stack</strong> (LIFO).
        </p>
        <p className="mb-4">
          <strong>Key Use Case:</strong> Topological sort, cycle detection, solving puzzles/mazes where you want to find *any* path rather than the shortest path.
        </p>
        <h3 className="text-xl font-bold font-serif my-4 text-[var(--udemy-text)] dark:text-white">Memory Trade-offs</h3>
        <p className="mb-4">
          BFS stores entire levels in memory, which can grow huge (width of the tree/graph). DFS only stores the current branch path (height of the tree/graph). Hence, DFS is often more memory-efficient on deep, narrow graphs.
        </p>
      </>
    ),
  },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-[var(--udemy-dark-bg)]">
      <main className="container-app section-app">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-sm font-bold tracking-wider uppercase mb-4">
              <Newspaper className="w-4 h-4" />
              AlgoBuddy Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-black font-serif text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-6">
              Insights &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] dark:from-[var(--color-primary-light)] dark:to-[var(--color-primary)]">
                Guides
              </span>
            </h1>
            <p className="text-xl text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] max-w-2xl mx-auto">
              Deepen your understanding with technical explanations, learning theories, and coding interview strategies.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
              <input
                type="text"
                placeholder="Search articles or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent rounded-[var(--radius-md)] border border-[var(--color-border)] outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]"
              />
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="card-surface p-6 flex flex-col justify-between group hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1 transition-all duration-[var(--motion-normal)] cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-udemy-purple/5 dark:bg-udemy-purple-light/5 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-xl font-bold font-serif text-[var(--udemy-text)] dark:text-white mb-3 group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-light)] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  <div>
                    {/* Meta info */}
                    <div className="flex items-center justify-between text-xs text-[var(--color-muted)] pt-4 border-t border-[var(--color-border)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 card-surface p-8">
              <Newspaper className="w-12 h-12 text-[var(--color-muted)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] mb-2">
                No articles found
              </h3>
              <p className="text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)] max-w-sm mx-auto text-sm">
                Try searching for another keyword or tag.
              </p>
            </div>
          )}

          {/* Back Home */}
          <div className="mt-16 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all font-semibold text-sm text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Blog Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[var(--udemy-dark-surface)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 shadow-elevated animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-[var(--color-neutral-100)] dark:bg-[var(--color-neutral-800)] hover:bg-[var(--color-neutral-200)] dark:hover:bg-[var(--color-neutral-700)] text-[var(--udemy-text)] dark:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 border-b border-[var(--color-border)] pb-6 pr-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-udemy-purple/10 dark:bg-udemy-purple-light/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl md:text-3xl font-black font-serif text-[var(--udemy-text)] dark:text-white mb-4 leading-tight">
                {selectedPost.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  By {selectedPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedPost.readTime}
                </span>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="text-base leading-relaxed text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)] select-text">
              {selectedPost.content}
            </div>

            {/* Modal Footer */}
            <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-right">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-bold text-sm transition-all"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
