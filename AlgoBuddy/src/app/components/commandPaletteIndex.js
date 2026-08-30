/**
 * commandPaletteIndex.js
 *
 * Static search index for the global Command Palette (Ctrl+K / Cmd+K).
 * Derived from the actual visualizer routes defined in
 * src/app/visualizer/page.jsx and the top-level site pages.
 *
 * MAINTAINERS: when you add a new visualizer or page, add it here too.
 */

// ─── Visualizers ────────────────────────────────────────────────────────────

const VISUALIZERS = [
  // Code Lab
  { name: "Dry Run Visualizer",                  path: "/visualizer/dry-run",                                  category: "Code Lab"   },
  { name: "Complexity Analyzer",                 path: "/visualizer/complexity-analyzer",                      category: "Code Lab"   },

  // Array – Searching
  { name: "Linear Search",                       path: "/visualizer/array/linearsearch",                       category: "Array"      },
  { name: "Binary Search",                       path: "/visualizer/array/binarysearch",                       category: "Array"      },

  // Array – Sorting
  { name: "Bubble Sort",                         path: "/visualizer/array/bubblesort",                         category: "Array"      },
  { name: "Selection Sort",                      path: "/visualizer/array/selectionsort",                      category: "Array"      },
  { name: "Insertion Sort",                      path: "/visualizer/array/insertionsort",                      category: "Array"      },
  { name: "Merge Sort",                          path: "/visualizer/array/mergesort",                          category: "Array"      },
  { name: "Quick Sort",                          path: "/visualizer/array/quicksort",                          category: "Array"      },
  { name: "Counting Sort",                       path: "/visualizer/array/countingsort",                       category: "Array"      },
  { name: "Heap Sort",                           path: "/visualizer/array/heapsort",                           category: "Array"      },
  { name: "Sliding Window",                      path: "/visualizer/array/slidingwindow",                      category: "Array"      },

  // Recursion
  { name: "Basic Recursion",                     path: "/visualizer/recursion/basic-recursion",                category: "Recursion"  },
  { name: "Functional & Parameterized Recursion",path: "/visualizer/recursion/functional-parameterized",       category: "Recursion"  },
  { name: "Multiple Recursive Calls",            path: "/visualizer/recursion/multiple-calls",                 category: "Recursion"  },
  { name: "Recursion on Subsequences",           path: "/visualizer/recursion/subsequences",                   category: "Recursion"  },
  { name: "Backtracking",                        path: "/visualizer/recursion/backtracking",                   category: "Recursion"  },
  { name: "Recursion Trees",                     path: "/visualizer/recursion/trees",                          category: "Recursion"  },
  { name: "Call Stack Visualization",            path: "/visualizer/recursion/stack",                          category: "Recursion"  },
  { name: "Recursive Binary Search",             path: "/visualizer/recursion/binary-search",                  category: "Recursion"  },

  // Stack
  { name: "Stack using Array",                   path: "/visualizer/stack/array",                              category: "Stack"      },
  { name: "Stack using Linked List",             path: "/visualizer/stack/linkedlist",                         category: "Stack"      },
  { name: "Prefix (Polish) Notation",            path: "/visualizer/stack/prefix",                             category: "Stack"      },
  { name: "Postfix (Reverse Polish) Notation",   path: "/visualizer/stack/postfix",                            category: "Stack"      },

  // Queue
  { name: "Queue using Array",                   path: "/visualizer/queue/array",                              category: "Queue"      },
  { name: "Queue using Linked List",             path: "/visualizer/queue/linkedlist",                         category: "Queue"      },
  { name: "Circular Queue",                      path: "/visualizer/queue/circular",                           category: "Queue"      },
  { name: "Priority Queue",                      path: "/visualizer/queue/priority",                           category: "Queue"      },
  { name: "Deque",                               path: "/visualizer/queue/deque",                              category: "Queue"      },

  // Linked List
  { name: "Singly Linked List",                  path: "/visualizer/linkedlist/singly",                        category: "Linked List"},
  { name: "Doubly Linked List",                  path: "/visualizer/linkedlist/doubly",                        category: "Linked List"},
  { name: "Circular Linked List",                path: "/visualizer/linkedlist/circular",                      category: "Linked List"},

  // Tree
  { name: "BST (Binary Search Tree)",            path: "/visualizer/tree/bst",                                 category: "Tree"       },
  { name: "AVL Tree",                            path: "/visualizer/tree/avl",                                 category: "Tree"       },
  { name: "Heap Tree",                           path: "/visualizer/tree/heap",                                category: "Tree"       },
  { name: "In-order Traversal",                  path: "/visualizer/tree/traversing",                          category: "Tree"       },

  // Graph
  { name: "Breadth-First Search (BFS)",          path: "/visualizer/graph/bfs",                                category: "Graph"      },
  { name: "Depth-First Search (DFS)",            path: "/visualizer/graph/dfs",                                category: "Graph"      },
  { name: "Dijkstra's Algorithm",                path: "/visualizer/graph/dijkstra",                           category: "Graph"      },
  { name: "Prim's Algorithm",                    path: "/visualizer/graph/prim",                               category: "Graph"      },
  { name: "Kruskal's Algorithm",                 path: "/visualizer/graph/kruskal",                            category: "Graph"      },
  { name: "Topological Sort",                    path: "/visualizer/graph/topological",                        category: "Graph"      },
  { name: "Floyd-Warshall",                      path: "/visualizer/graph/floyd-warshall",                     category: "Graph"      },

  // Hash Map
  { name: "Hash Map",                            path: "/visualizer/hashmap",                                  category: "Hash Map"   },
];

// ─── Site Pages ─────────────────────────────────────────────────────────────

const PAGES = [
  { name: "Home",          path: "/",              category: "Page" },
  { name: "Visualizer",   path: "/visualizer",    category: "Page" },
  { name: "Practice",     path: "/practice",      category: "Page" },
  { name: "Arena",        path: "/arena",          category: "Page" },
  { name: "Community",    path: "/community",      category: "Page" },
  { name: "Blog",         path: "/blog",           category: "Blog" },
  { name: "Roadmaps",     path: "/roadmaps",       category: "Page" },
  { name: "Cheatsheets",  path: "/cheatsheets",    category: "Page" },
  { name: "Tutorials",    path: "/tutorials",      category: "Page" },
  { name: "FAQ",          path: "/faq",            category: "Page" },
  { name: "About",        path: "/about",          category: "Page" },
  { name: "Contact Us",   path: "/contactus",      category: "Page" },
];

// ─── Combined index ──────────────────────────────────────────────────────────

/** Full flat list used by CommandPalette for filtering */
export const SEARCH_INDEX = [...VISUALIZERS, ...PAGES];

/** Unique categories in priority order — used for grouped display */
export const CATEGORIES = [
  "Code Lab",
  "Array",
  "Recursion",
  "Stack",
  "Queue",
  "Linked List",
  "Tree",
  "Graph",
  "Hash Map",
  "Blog",
  "Page",
];
