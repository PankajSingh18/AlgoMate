import React from "react";
import Footer from "@/app/components/footer";
import VisualizerClient from "./VisualizerClient";
import ArrayModal from "@/app/components/models/ArrayModal";
import StackModal from "@/app/components/models/StackModel";
import QueueModal from "@/app/components/models/QueueModal";
import LinkedListModal from "@/app/components/models/LinkedListModal";
import TreeModal from "@/app/components/models/TreeModal";
import GraphModal from "@/app/components/models/GraphModal";
import TutorialOverlay from "@/app/components/ui/TutorialOverlay";
import BackToTop from "../components/ui/backtotop";
import BookmarkSection from "@/app/components/ui/BookmarkSection";

export const metadata = {
  title: "Algorithm Visualizer | AlgoBuddy",
  description:
    "Explore visual representations and source code for various DSA algorithms including searching, sorting, stacks, queues, trees, graphs, and stack-based expression evaluation like Polish Notation using arrays and linked lists. Interactive and beginner-friendly!",
  keywords: [
    "DSA Visualizer",
    "Algorithm Visualizer",
    "Data Structures",
    "Searching Algorithms",
    "Sorting Algorithms",
    "Stack",
    "Queue",
    "Tree",
    "Graph",
    "Graph Algorithms",
    "BFS",
    "DFS",
    "Linear Search",
    "Bubble Sort",
    "Tree Traversal",
    "Heap Sort",
    "Linked List",
    "Singly Linked List",
    "Doubly Linked List",
    "Circular Linked List",
    "Prefix Notation",
    "Postfix Notation",
    "Polish Notation",
    "Stack using Array",
    "Stack using Linked List",
    "Prefix using Stack",
    "Postfix using Stack",
    "Polish Notation Implementation",
    "Queue using Array",
    "Queue using Linked List",
    "Circular Queue",
    "Priority Queue",
    "Deque",
    "Queue Operations",
    "Graph Traversal",
    "Code for DSA Algorithms",
    "Code for Data Structures",
    "Interactive Code Samples",
    "DSA with Code",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/visualizer.png",
        width: 1200,
        height: 630,
        alt: "Algorithm Visualization",
      },
    ],
  },
};

const sections = [
  {
    title: "Code Lab",
    slug: "code-lab",
    desc: "Write custom code, run safe step-by-step dry runs, and analyze time & space complexity",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l-4 3 4 3m8-6l4 3-4 3M14 5l-4 14"
        />
      </svg>
    ),
    info: {
      About:
        "The Code Lab provides essential developer tools. Use the Dry Run Visualizer to inspect line-by-line execution state, and the Complexity Analyzer to understand Big O notations, best/worst cases, and optimization insights.",
      Representation: null,
    },
    subsections: [
      {
        title: "Tools",
        items: [
          {
            name: "Dry Run Visualizer",
            path: "/visualizer/dry-run",
          },
          {
            name: "Complexity Analyzer",
            path: "/visualizer/complexity-analyzer",
          },
          {
            name: "Code Execution Visualizer",
            path: "/visualizer/code-execution",
          },
        ],
      },
    ],
  },
  {
    title: "Array",
    slug: "array",
    desc: "Searching & sorting algorithms on contiguous memory",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    ),
    info: {
      About:
        "An array is a data structure that stores multiple values of the same type in a single variable. Each value is stored at a specific index, starting from 0.",
      Representation: <ArrayModal />,
    },
    subsections: [
      {
        title: "Searching",
        items: [
          { name: "Linear Search", path: "/visualizer/array/linearsearch" },
          { name: "Binary Search", path: "/visualizer/array/binarysearch" },
        ],
      },
      {
        title: "Sorting",
        items: [
          { name: "Bubble Sort", path: "/visualizer/array/bubblesort" },
          { name: "Selection Sort", path: "/visualizer/array/selectionsort" },
          { name: "Insertion Sort", path: "/visualizer/array/insertionsort" },
          { name: "Merge Sort", path: "/visualizer/array/mergesort" },
          { name: "Quick Sort", path: "/visualizer/array/quicksort" },
          { name: "Heap Sort", path: "/visualizer/array/heapsort" },
          { name: "Radix Sort", path: "/visualizer/array/radixsort" },
          { name: "Counting Sort", path: "/visualizer/array/countingsort" },
        ],
      },
      {
        title: "Interview Patterns",
        items: [
          { name: "Sliding Window", path: "/visualizer/array/slidingwindow" },
          { name: "Two Pointers", path: "/visualizer/array/twopointers" },
        ],
      },
    ],
  },
  {
    title: "Recursion",
    slug: "recursion",
    desc: "Understand stack frames, call stacks, base cases, and tree recursion through animated execution flow",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.306 7.5L20 9"
        />
      </svg>
    ),
    info: {
      About:
        "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. A recursive function consists of a base case (to stop recursion) and a recursive case (to continue).",
      Representation: null,
    },
    subsections: [
      {
        title: "Recursion Topics",
        items: [
          { name: "Basic Recursion", path: "/visualizer/recursion/basic-recursion" },
          { name: "Functional & Parameterized Recursion", path: "/visualizer/recursion/functional-parameterized" },
          { name: "Multiple Recursive Calls", path: "/visualizer/recursion/multiple-calls" },
          { name: "Recursion on Subsequences", path: "/visualizer/recursion/subsequences" },
          { name: "Backtracking", path: "/visualizer/recursion/backtracking" },
          { name: "Recursion Trees", path: "/visualizer/recursion/trees" },
          { name: "Call Stack Visualization", path: "/visualizer/recursion/stack" },
          { name: "Recursive Binary Search", path: "/visualizer/recursion/binary-search" },
        ],
      },
    ],
  },
  {
    title: "Stack",
    slug: "stack",
    desc: "LIFO operations, polish notations & implementations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
    info: {
      About:
        "LIFO data structure; push adds to top; pop removes from top; peek views top; works like a stack of plates. Used in function calls, undo, expression evaluation.",
      Representation: <StackModal />,
    },
    subsections: [
      {
        title: "Operations",
        items: [
          { name: "Push & Pop", path: "/visualizer/stack/push-pop" },
          { name: "Peek", path: "/visualizer/stack/peek" },
          { name: "Is Empty", path: "/visualizer/stack/isempty" },
          { name: "Is Full", path: "/visualizer/stack/isfull" },
        ],
      },
      {
        title: "Polish Notations Evaluation",
        items: [
          { name: "Postfix", path: "/visualizer/stack/polish/postfix" },
          { name: "Prefix", path: "/visualizer/stack/polish/prefix" },
        ],
      },
      {
        title: "Implementation",
        items: [
          {
            name: "Using Array",
            path: "/visualizer/stack/implementation/usingArray",
          },
          {
            name: "Using Linked List",
            path: "/visualizer/stack/implementation/usingLinkedList",
          },
        ],
      },
    ],
  },
  {
    title: "Queue",
    slug: "queue",
    desc: "FIFO operations, variants & implementations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    ),
    info: {
      About:
        "FIFO data structure; enqueue adds to rear; dequeue removes from front; peek views front; works like a line in a queue. Used in scheduling, buffering, BFS.",
      Representation: <QueueModal />,
    },
    subsections: [
      {
        title: "Operations",
        items: [
          {
            name: "Enqueue & Dequeue",
            path: "/visualizer/queue/operations/enqueue-dequeue",
          },
          {
            name: "Peek Front",
            path: "/visualizer/queue/operations/peek-front",
          },
          { name: "Is Empty", path: "/visualizer/queue/operations/isempty" },
          { name: "Is Full", path: "/visualizer/queue/operations/isfull" },
        ],
      },
      {
        title: "Types",
        items: [
          {
            name: "Single Ended Queue",
            path: "/visualizer/queue/types/singleEnded",
          },
          {
            name: "Double Ended Queue",
            path: "/visualizer/queue/types/deque",
          },
          { name: "Circular Queue", path: "/visualizer/queue/types/circular" },
          { name: "Priority Queue", path: "/visualizer/queue/types/priority" },
        ],
      },
      {
        title: "Implementation",
        items: [
          {
            name: "Using Array",
            path: "/visualizer/queue/implementation/array",
          },
          {
            name: "Using Linked List",
            path: "/visualizer/queue/implementation/linkedList",
          },
        ],
      },
    ],
  },
  {
    title: "Linked List",
    slug: "linkedlist",
    desc: "Singly, doubly, circular — traversal to merge",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 5l7 7-7 7"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5l7 7-7 7"
        />
      </svg>
    ),
    info: {
      About:
        "Linear data structure; elements (nodes) connected using pointers; each node has data + next; no fixed size; types: singly, doubly, circular. Used in dynamic memory, insert/delete operations.",
      Representation: <LinkedListModal />,
    },
    subsections: [
      {
        title: "Types",
        items: [
          {
            name: "Singly Linked List",
            path: "/visualizer/linkedlist/types/singly",
          },
          {
            name: "Doubly Linked List",
            path: "/visualizer/linkedlist/types/doubly",
          },
          {
            name: "Circular Linked List",
            path: "/visualizer/linkedlist/types/circular",
          },
        ],
      },
      {
        title: "Operations",
        items: [
          {
            name: "Traversal",
            path: "/visualizer/linkedlist/operations/traversal",
          },
          {
            name: "Insertion",
            path: "/visualizer/linkedlist/operations/insertion",
          },
          {
            name: "Deletion",
            path: "/visualizer/linkedlist/operations/deletion",
          },
          {
            name: "Searching",
            path: "/visualizer/linkedlist/operations/search",
          },
          {
            name: "Reverse",
            path: "/visualizer/linkedlist/operations/reverse",
          },
          {
            name: "Merge",
            path: "/visualizer/linkedlist/operations/merge",
          },
          {
            name: "Comparison",
            path: "/visualizer/linkedlist/operations/comparison",
          },
          {
            name: "Sorting",
            path: "/visualizer/linkedlist/operations/sorting",
          },
        ],
      },
    ],
  },
  {
    title: "Tree",
    slug: "tree",
    desc: "BST, AVL, traversals, tries & advanced trees",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12h6m-6 4h6m0-8h6m6 0h-6m6 4h-6m-6-8v12m6-12v12"
        />
      </svg>
    ),
    info: {
      About:
        "Hierarchical data structure; has root, nodes, edges; each node has parent/child; no cycles; Used in hierarchies, file systems, searching.",
      Types: "binary tree, BST, AVL, etc.",
      Representation: <TreeModal maxLevel={3} />,
    },
    subsections: [
      {
        title: "Binary Tree",
        items: [
          {
            name: "Structure & Properties",
            path: "/visualizer/tree/binaryTree/properties",
          },
          {
            name: "Types of Binary Trees",
            path: "/visualizer/tree/binaryTree/types",
          },
        ],
      },
      {
        title: "Binary Search Tree",
        items: [
          { name: "Insertion", path: "/visualizer/tree/bst/insertion" },
          { name: "Deletion", path: "/visualizer/tree/bst/deletion" },
          { name: "Searching", path: "/visualizer/tree/bst/searching" },
          { name: "In-order Traversal", path: "/visualizer/tree/bst/in-order" },
          { name: "Pre-order Traversal", path: "/visualizer/tree/bst/pre-order" },
          { name: "Post-order Traversal", path: "/visualizer/tree/bst/post-order" },
          { name: "Balancing (AVL)", path: "/visualizer/tree/bst/avl" },
        ],
      },
      {
        title: "Traversal",
        items: [
          { name: "Pre-order", path: "/visualizer/tree/traversing/pre-order" },
          { name: "In-order", path: "/visualizer/tree/traversing/in-order" },
          {
            name: "Post-order",
            path: "/visualizer/tree/traversing/post-order",
          },
          {
            name: "Level-order (BFS)",
            path: "/visualizer/tree/traversing/level-order",
          },
          {
            name: "Morris Traversal",
            path: "/visualizer/tree/traversing/morris",
          },
        ],
      },
      {
        title: "Advanced Trees",
        items: [
          {
            name: "Red-Black Trees",
            path: "/visualizer/tree/advanced/red-black",
          },
          { name: "B-Trees", path: "/visualizer/tree/advanced/b-trees" },
          { name: "AVL Tree Insertion", path: "/visualizer/tree/avl/insertion" },
          { name: "AVL Tree Deletion", path: "/visualizer/tree/avl/deletion" },
          {
            name: "Trie (Prefix Tree)",
            path: "/visualizer/tree/advanced/trie",
          },
          { name: "Segment Trees", path: "/visualizer/tree/advanced/segment" },
          { name: "Fenwick Trees", path: "/visualizer/tree/advanced/fenwick" },
          { name: "Disjoint Set Union (DSU)", path: "/visualizer/tree/advanced/dsu" },
        ],
      },
      {
        title: "Algorithms",
        items: [
          {
            name: "Lowest Common Ancestor",
            path: "/visualizer/tree/algorithms/lca",
          },
          {
            name: "Tree Diameter",
            path: "/visualizer/tree/algorithms/diameter",
          },
          {
            name: "Tree Isomorphism",
            path: "/visualizer/tree/algorithms/isomorphism",
          },
          {
            name: "Serialize/Deserialize",
            path: "/visualizer/tree/algorithms/serialization",
          },
        ],
      },
      {
        title: "Applications",
        items: [
          {
            name: "Heap (Min/Max)",
            path: "/visualizer/tree/heap/min-heap",
          },
          { name: "Heap (Max)", path: "/visualizer/tree/heap/max-heap" },
          {
            name: "Heap Sort",
            path: "/visualizer/tree/applications/heapsort",
          },
          {
            name: "Huffman Coding",
            path: "/visualizer/tree/applications/huffman",
          },
          {
            name: "Decision Trees",
            path: "/visualizer/tree/applications/decision-trees",
          },
          {
            name: "Syntax Trees",
            path: "/visualizer/tree/applications/syntax-trees",
          },
        ],
      },
    ],
  },
  {
    title: "HashMap",
    slug: "hashmap",
    desc: "Key-value pairs with hash function and collision handling",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
        />
      </svg>
    ),
    info: {
      About:
        "HashMap stores key-value pairs using a hash function to compute bucket index. Provides O(1) average time for insert, search, and delete. Collision handled via chaining.",
      Representation: null,
    },
    subsections: [
      {
        title: "Operations",
        items: [
          { name: "Insert (put)", path: "/visualizer/hashmap/insert" },
          { name: "Search (get)", path: "/visualizer/hashmap/search" },
          { name: "Delete (remove)", path: "/visualizer/hashmap/delete" },
        ],
      },
    ],
  },
  {
    title: "Graph",
    slug: "graph",
    desc: "BFS, DFS, shortest paths, MST & topological sort",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    info: {
      About:
        "A graph is a data structure made up of: Nodes (also called vertices) Represent entities. Edges Represent connections between nodes.",
      Representation: <GraphModal />,
    },
    subsections: [
      {
        title: "Representation",
        items: [
          {
            name: "Adjacency Matrix",
            path: "/visualizer/graph/adjacency-matrix",
          },
          {
            name: "Adjacency List",
            path: "/visualizer/graph/adjacency-list",
          },
        ],
      },
      {
        title: "Traversal",
        items: [
          {
            name: "Breadth-First Search (BFS)",
            path: "/visualizer/graph/bfs",
          },
          {
            name: "Depth-First Search (DFS)",
            path: "/visualizer/graph/dfs",
          },
        ],
      },
      {
        title: "Algorithms",
        items: [
          {
            name: "Dijkstra's Algorithm",
            path: "/visualizer/graph/dijkstra",
          },
          {
            name: "Floyd-Warshall Algorithm",
            path: "/visualizer/graph/floyd-warshall",
          },
          {
            name: "Prim's Algorithm",
            path: "/visualizer/graph/prim",
          },
          {
            name: "Kruskal's Algorithm",
            path: "/visualizer/graph/kruskal",
          },
          {
            name: "Topological Sort",
            path: "/visualizer/graph/topological-sort",
          },
        ],
      },
    ],
  },
  {
    title: "Dynamic Programming",
    slug: "dp",
    desc: "Visualized matrices for the Knapsack Problem, Longest Common Subsequence, and Coin Change",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    info: {
      About:
        "Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems. It is applicable when the problem has overlapping subproblems and optimal substructure.",
      Representation: null,
    },
    subsections: [
      {
        title: "Algorithms",
        items: [
          {
            name: "0/1 Knapsack Problem",
            path: "/visualizer/dp/knapsack",
          },
          {
            name: "Longest Common Subsequence",
            path: "/visualizer/dp/lcs",
          },
          {
            name: "Coin Change",
            path: "/visualizer/dp/coin-change",
          },
        ],
      },
    ],
  },
  {
    title: "AI Algorithms",
    slug: "ai",
    desc: "Search algorithms used in Artificial Intelligence, heuristic pathfinding, and game tree decision making",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    info: {
      About:
        "AI algorithms involve search and optimization techniques used to find the best possible moves or paths, often used in game theory like Chess or Tic-Tac-Toe. Examples include Min Max, Alpha Beta Pruning, A* Search, and Monte Carlo Tree Search.",
      Representation: null,
    },
    subsections: [
      {
        title: "Adversarial Search",
        items: [
          {
            name: "Min Max Algorithm",
            path: "/visualizer/ai/minmax",
          },
          {
            name: "Alpha Beta Pruning",
            path: "/visualizer/ai/alpha-beta-pruning",
          },
          {
            name: "A* Search",
            path: "/visualizer/ai/astar",
          },
          {
            name: "Monte Carlo Tree Search (MCTS)",
            path: "/visualizer/ai/mcts",
          },
        ],
      },
    ],
  },
];

const Visualizer = () => {
  const clientSections = sections.map(({ info, ...rest }) => ({
    ...rest,
    slug: rest.slug || rest.title.toLowerCase().replace(/\s+/g, "-")
  }));

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#1c1d1f] text-gray-800 dark:text-gray-200 flex flex-col"
      style={{ fontFamily: "'Inter', 'Source Sans 3', sans-serif" }}
    >
      <TutorialOverlay />
      <VisualizerClient initialSections={clientSections} />
      <BackToTop />
      <div className="w-full relative">
        <BookmarkSection />
        <Footer />
      </div>
    </div>
  );
};

export default Visualizer;
