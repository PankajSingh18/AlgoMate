// Shared data source for all visualizer sections.
// Used by both /visualizer (grid) and /visualizer/[category] (module view).

export const sections = [
  {
    title: "Code Lab",
    slug: "code-lab",
    desc: "Write custom code, run safe step-by-step dry runs, and analyze time & space complexity",
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
        ],
      },
    ],
  },
  {
    title: "Array",
    slug: "array",
    desc: "Searching & sorting algorithms on contiguous memory",
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
          { name: "Radix Sort", path: "/visualizer/array/radixsort"},
          { name: "Counting Sort", path: "/visualizer/array/countingsort" },
          { name: "Comparison Mode", path: "/visualizer/array/comparison" },
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
          { name: "Tower of Hanoi", path: "/visualizer/recursion/tower-of-hanoi" },
        ],
      },
    ],
  },
  {
    title: "Stack",
    slug: "stack",
    desc: "LIFO operations, polish notations & implementations",
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
          { name: "Using Array", path: "/visualizer/stack/implementation/usingArray" },
          { name: "Using Linked List", path: "/visualizer/stack/implementation/usingLinkedList" },
        ],
      },
      {
        title: "Monotonic Stack",
        items: [
          { name: "Largest Rectangle in Histogram", path: "/visualizer/stack/monotonic/largestrectangle" },
        ],
      },
    ],
  },
  {
    title: "Queue",
    slug: "queue",
    desc: "FIFO operations, variants & implementations",
    subsections: [
      {
        title: "Operations",
        items: [
          { name: "Enqueue & Dequeue", path: "/visualizer/queue/operations/enqueue-dequeue" },
          { name: "Peek Front", path: "/visualizer/queue/operations/peek-front" },
          { name: "Is Empty", path: "/visualizer/queue/operations/isempty" },
          { name: "Is Full", path: "/visualizer/queue/operations/isfull" },
        ],
      },
      {
        title: "Types",
        items: [
          { name: "Single Ended Queue", path: "/visualizer/queue/types/singleEnded" },
          { name: "Double Ended Queue", path: "/visualizer/queue/types/deque" },
          { name: "Circular Queue", path: "/visualizer/queue/types/circular" },
          { name: "Priority Queue", path: "/visualizer/queue/types/priority" },
        ],
      },
      {
        title: "Implementation",
        items: [
          { name: "Using Array", path: "/visualizer/queue/implementation/array" },
          { name: "Using Linked List", path: "/visualizer/queue/implementation/linkedList" },
        ],
      },
    ],
  },
  {
    title: "Linked List",
    slug: "linked-list",
    desc: "Singly, doubly, circular — traversal to merge",
    subsections: [
      {
        title: "Types",
        items: [
          { name: "Singly Linked List", path: "/visualizer/linkedlist/types/singly" },
          { name: "Doubly Linked List", path: "/visualizer/linkedlist/types/doubly" },
          { name: "Circular Linked List", path: "/visualizer/linkedlist/types/circular" },
        ],
      },
      {
        title: "Operations",
        items: [
          { name: "Traversal", path: "/visualizer/linkedlist/operations/traversal" },
          { name: "Insertion", path: "/visualizer/linkedlist/operations/insertion" },
          { name: "Deletion", path: "/visualizer/linkedlist/operations/deletion" },
          { name: "Searching", path: "/visualizer/linkedlist/operations/search" },
          { name: "Reverse", path: "/visualizer/linkedlist/operations/reverse" },
          { name: "Merge", path: "/visualizer/linkedlist/operations/merge" },
          { name: "Comparison", path: "/visualizer/linkedlist/operations/comparison" },
          { name: "Sorting", path: "/visualizer/linkedlist/operations/sorting" },
        ],
      },
    ],
  },
  {
    title: "Tree",
    slug: "tree",
    desc: "BST, AVL, traversals, tries & advanced trees",
    subsections: [
      {
        title: "Binary Tree",
        items: [
          { name: "Structure & Properties", path: "/visualizer/tree/binaryTree/properties" },
          { name: "Types of Binary Trees", path: "/visualizer/tree/binaryTree/types" },
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
          { name: "Post-order", path: "/visualizer/tree/traversing/post-order" },
          { name: "Level-order (BFS)", path: "/visualizer/tree/traversing/level-order" },
          { name: "Morris Traversal", path: "/visualizer/tree/traversing/morris" },
        ],
      },
      {
        title: "Advanced Trees",
        items: [
          { name: "Red-Black Trees", path: "/visualizer/tree/advanced/red-black" },
          { name: "B-Trees", path: "/visualizer/tree/advanced/b-trees" },
          { name: "AVL Tree Insertion", path: "/visualizer/tree/avl/insertion" },
          { name: "AVL Tree Deletion", path: "/visualizer/tree/avl/deletion" },
          { name: "Trie (Prefix Tree)", path: "/visualizer/tree/advanced/trie" },
          { name: "Segment Trees", path: "/visualizer/tree/advanced/segment" },
          { name: "Fenwick Trees", path: "/visualizer/tree/advanced/fenwick" },
        ],
      },
      {
        title: "Algorithms",
        items: [
          { name: "Lowest Common Ancestor", path: "/visualizer/tree/algorithms/lca" },
          { name: "Tree Diameter", path: "/visualizer/tree/algorithms/diameter" },
          { name: "Tree Isomorphism", path: "/visualizer/tree/algorithms/isomorphism" },
          { name: "Serialize/Deserialize", path: "/visualizer/tree/algorithms/serialization" },
        ],
      },
      {
        title: "Applications",
        items: [
          { name: "Heap (Min/Max)", path: "/visualizer/tree/heap/min-heap" },
          { name: "Heap (Max)", path: "/visualizer/tree/heap/max-heap" },
          { name: "Heap Sort", path: "/visualizer/tree/applications/heapsort" },
          { name: "Huffman Coding", path: "/visualizer/tree/applications/huffman" },
          { name: "Decision Trees", path: "/visualizer/tree/applications/decision-trees" },
          { name: "Syntax Trees", path: "/visualizer/tree/applications/syntax-trees" },
        ],
      },
    ],
  },
  {
    title: "HashMap",
    slug: "hashmap",
    desc: "Key-value pairs with hash function and collision handling",
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
    subsections: [
      {
        title: "Representation",
        items: [
          { name: "Adjacency Matrix", path: "/visualizer/graph/adjacency-matrix" },
          { name: "Adjacency List", path: "/visualizer/graph/adjacency-list" },
        ],
      },
      {
        title: "Traversal",
        items: [
          { name: "Breadth-First Search (BFS)", path: "/visualizer/graph/bfs" },
          { name: "Depth-First Search (DFS)", path: "/visualizer/graph/dfs" },
        ],
      },
      {
        title: "Algorithms",
        items: [
          { name: "Dijkstra's Algorithm", path: "/visualizer/graph/dijkstra" },
          { name: "Floyd-Warshall Algorithm", path: "/visualizer/graph/floyd-warshall" },
          { name: "Prim's Algorithm", path: "/visualizer/graph/prim" },
          { name: "Kruskal's Algorithm", path: "/visualizer/graph/kruskal" },
          { name: "Topological Sort", path: "/visualizer/graph/topological-sort" },
        ],
      },
    ],
  },
  {
    title: "Dynamic Programming",
    slug: "dp",
    desc: "Visualized matrices for the Knapsack Problem, Longest Common Subsequence, and Coin Change",
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
    subsections: [
      {
        title: "Adversarial Search",
        items: [
          { name: "Min Max Algorithm", path: "/visualizer/ai/minmax" },
          { name: "Alpha Beta Pruning", path: "/visualizer/ai/alpha-beta-pruning" },
          { name: "A* Search", path: "/visualizer/ai/astar" },
          { name: "Monte Carlo Tree Search (MCTS)", path: "/visualizer/ai/mcts" },
        ],
      },
    ],
  },
];
