import dynamic from 'next/dynamic';

export const algorithmRegistry = {
  "ai/alpha-beta-pruning": {
    metadata: {
  title: "Alpha Beta Pruning | Step-by-Step Animation",
  description:
    "Visualize Alpha Beta Pruning with intuitive step-by-step animations, code examples in JavaScript, C++, Python, and Java.",
  keywords: [
    "Alpha Beta Pruning Visualizer",
    "Alpha Beta Pruning Visualization",
    "Alpha Beta Pruning Animation",
    "Learn Alpha Beta Pruning",
    "Alpha Beta Pruning for Beginners",
    "Alpha Beta Pruning Step-by-Step",
    "Visualize Alpha Beta Pruning Algorithm",
    "Adversarial Search",
    "Game Tree Optimization",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/ai/alpha-beta-pruning/AlgorithmClient')),
  },
  "ai/mcts": {
    metadata: {
  title: "Monte Carlo Tree Search (MCTS) | Step-by-Step Animation",
  description: "Visualize Monte Carlo Tree Search with visit counts, win rates and live playouts.",
},
    component: dynamic(() => import('@/app/visualizer/ai/mcts/AlgorithmClient')),
  },
  "ai/minmax": {
    metadata: {
  title: "Min Max Algorithm | Step-by-Step Animation",
  description:
    "Visualize the Min Max algorithm with intuitive step-by-step animations, code examples in JavaScript, C++, Python, and Java.",
  keywords: [
    "Min Max Visualizer",
    "Min Max Visualization",
    "Min Max Animation",
    "Learn Min Max",
    "Min Max for Beginners",
    "Min Max Step-by-Step",
    "Visualize Min Max Algorithm",
    "Adversarial Search",
    "Game Tree Algorithm",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/ai/minmax/AlgorithmClient')),
  },
  "array/binarysearch": {
    metadata: {
  title: "Binary Search Algorithm | Step-by-Step Animation",
  description:
    "Visualize the Binary Search algorithm with intuitive step-by-step animations, code examples in JavaScript, C, Python, and Java, and an interactive Binary Search Quiz to test your knowledge. Perfect for DSA preparation and beginners learning efficient search algorithms.",
  keywords: [
    "Binary Search Visualizer",
    "Binary Search Visualization",
    "Binary Search Animation",
    "Learn Binary Search",
    "Binary Search for Beginners",
    "Binary Search Step-by-Step",
    "Visualize Binary Search Algorithm",
    "DSA Binary Search",
    "Binary Search Explanation",
    "Binary Search Visualization Tool",
    "Efficient Searching Algorithms",
    "Binary Search in JavaScript",
    "Binary Search in C",
    "Binary Search in Python",
    "Binary Search in Java",
    "Binary Search Code Examples",
    "Binary Search Quiz",
    "Interactive Binary Search Quiz",
    "DSA Quiz",
    "Quiz for Binary Search",
    "Learn DSA with Quizzes",
    "Binary Search Practice",
    "Test Your Binary Search Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/array/binarySearch.png",
        width: 1200,
        height: 630,
        alt: "Binary Search Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/array/binarysearch/AlgorithmClient')),
  },
  "array/bubblesort": {
    metadata: {
  title: "Bubble Sort Algorithm | Step-by-Step Animation",
  description: "Visualize Bubble Sort in action with interactive animations.",
  robots: "index, follow",
  openGraph: { images: [{ url: "/og/array/bubbleSort.png", width: 1200, height: 630, alt: "Bubble Sort" }] },
},
    component: dynamic(() => import('@/app/visualizer/array/bubblesort/AlgorithmClient')),
  },
  "array/comparison": {
    metadata: {
  title: "Sorting Algorithm Comparison Mode | Side-by-Side Visualizer",
  description:
    "Compare Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, and Heap Sort side-by-side on AlgoBuddy. Watch synchronous animations on identical datasets and compare comparisons, swaps, and time in real-time.",
  keywords: [
    "algorithm comparison",
    "sorting visualizer",
    "bubble sort vs merge sort",
    "quick sort vs merge sort",
    "dsa visualizer comparison",
    "sorting algorithm performance",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/array/comparison.png",
        width: 1200,
        height: 630,
        alt: "Sorting Algorithm Comparison Mode Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/array/comparison/AlgorithmClient')),
  },
  "array/countingsort": {
    metadata: {
  title: "Counting Sort Algorithm | Step-by-Step Animation",
  description: "Learn Counting Sort with interactive animations.",
  robots: "index, follow",
  openGraph: { images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Counting Sort" }] },
},
    component: dynamic(() => import('@/app/visualizer/array/countingsort/AlgorithmClient')),
  },
  "array/heapsort": {
    metadata: {
  title: "Heap Sort Algorithm | Learn with Interactive Animations",
  description: "Learn Heap Sort with step-by-step visualization of max-heap construction, swapping, heapifying, and extraction.",
  robots: "index, follow",
  openGraph: {
    images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Heap Sort Algorithm Visualization" }],
  },
},
    component: dynamic(() => import('@/app/visualizer/array/heapsort/AlgorithmClient')),
  },
  "array/radixsort": {
  metadata: {
    title: "Radix Sort Algorithm | Step-by-Step Visualization",
    description:
      "Learn Radix Sort with interactive animations and step-by-step visualization.",
    robots: "index, follow",
    openGraph: {
      images: [
        {
          url: "/og/visualizer.png",
          width: 1200,
          height: 630,
          alt: "Radix Sort Algorithm Visualization",
        },
      ],
    },
  },
  component: dynamic(
    () => import("@/app/visualizer/array/radixsort/AlgorithmClient")
  ),
},
  "array/insertionsort": {
    metadata: {
  title: "Insertion Sort Algorithm | Step-by-Step Visualization",
  description: "Learn Insertion Sort with interactive animations and step-by-step visualization.",
  robots: "index, follow",
  openGraph: {
    images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Insertion Sort Algorithm Visualization" }],
  },
},
    component: dynamic(() => import('@/app/visualizer/array/insertionsort/AlgorithmClient')),
  },
  "array/linearsearch": {
    metadata: {
  title: "Linear Search Algorithm | Step-by-Step Animation",
  description:
    "Visualize the Linear Search algorithm with step-by-step animations, code examples in JavaScript, C, Python, and Java, and a Linear Search Quiz to test your understanding. Build a strong foundation in DSA through interactive learning.",
  keywords: [
    "Linear Search Visualizer",
    "Linear Search Visualization",
    "Linear Search Animation",
    "Learn Linear Search",
    "Linear Search for Beginners",
    "Step-by-Step Linear Search",
    "Visualize Linear Search Algorithm",
    "DSA Linear Search",
    "Algorithm Visualizer",
    "DSA Searching Algorithms",
    "Search Algorithms DSA",
    "Linear Search in JavaScript",
    "Linear Search in C",
    "Linear Search in Python",
    "Linear Search in Java",
    "Linear Search Code Examples",
    "Linear Search Quiz",
    "Interactive Linear Search Quiz",
    "DSA Quiz",
    "Quiz for Searching Algorithms",
    "Learn DSA with Quizzes",
    "Linear Search Practice",
    "Test Your Linear Search Skills",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/array/linearSearch.png",
        width: 1200,
        height: 630,
        alt: "Linear Search Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/array/linearsearch/AlgorithmClient')),
  },
  "array/mergesort": {
    metadata: {
  title: "Merge Sort Algorithm | Step-by-Step Animation",
  description: "Learn Merge Sort with interactive animations.",
  robots: "index, follow",
  openGraph: { images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Merge Sort" }] },
},
    component: dynamic(() => import('@/app/visualizer/array/mergesort/AlgorithmClient')),
  },
  "array/quicksort": {
    metadata: {
  title: "Quick Sort Algorithm | Step-by-Step Visualization",
  description: "Learn Quick Sort with interactive animations and step-by-step visualization.",
  robots: "index, follow",
  openGraph: {
    images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Quick Sort Algorithm Visualization" }],
  },
},
    component: dynamic(() => import('@/app/visualizer/array/quicksort/AlgorithmClient')),
  },
  "array/selectionsort": {
    metadata: {
  title: "Selection Sort Algorithm | Step-by-Step Visualization",
  description: "Learn Selection Sort with interactive animations and step-by-step visualization.",
  robots: "index, follow",
  openGraph: {
    images: [{ url: "/og/visualizer.png", width: 1200, height: 630, alt: "Selection Sort Algorithm Visualization" }],
  },
},
    component: dynamic(() => import('@/app/visualizer/array/selectionsort/AlgorithmClient')),
  },
  "array/slidingwindow": {
    metadata: {
  title: "Sliding Window Technique Visualizer | Array Algorithms",
  description:
    "Visualize the Sliding Window technique with step-by-step animations. Learn fixed-size and variable-size window patterns, view code implementations, and take an interactive quiz.",
  keywords: [
    "Sliding Window Visualizer",
    "Sliding Window Technique",
    "Two Pointers",
    "Array Algorithms",
    "Fixed Size Window",
    "Variable Size Window",
    "Longest Substring Without Repeating Characters",
    "Maximum Sum Subarray of Size K",
    "Algorithm Visualization",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/visualizer.png",
        width: 1200,
        height: 630,
        alt: "Sliding Window Technique Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/array/slidingwindow/AlgorithmClient')),
  },"array/twopointers": {
    component: dynamic(() => import("@/app/visualizer/array/twopointers/AlgorithmClient")),
    metadata: {
      title: "Two Pointers Technique | AlgoBuddy",
      description: "Visualize how the Two Pointers technique solves array problems like Pair Sum, Remove Duplicates, Container With Most Water, and Three Sum.",
    },
  },
  "complexity-analyzer": {
    metadata: {
  title: "Complexity Analyzer | AlgoBuddy",
  description:
    "Interactive complexity analyzer for visualizing Big-O growth curves and comparing algorithm efficiency.",
},
    component: dynamic(() => import('@/app/visualizer/complexity-analyzer/AlgorithmClient')),
  },
  "dry-run": {
    metadata: {
  title: "Code Dry Run Visualizer | AlgoBuddy",
  description:
    "Paste code and inspect a safe step-by-step dry run with line highlighting, variables, console output, and data-structure snapshots.",
  keywords: [
    "code dry run",
    "algorithm debugger",
    "DSA visualizer",
    "step by step code execution",
    "custom code visualizer",
  ],
},
    component: dynamic(() => import('@/app/visualizer/dry-run/AlgorithmClient')),
  },
  "hashmap/delete": {
    metadata: {
  title: "HashMap Delete Visualizer | Learn HashMap Operations",
  description: "Understand HashMap Delete operation through step-by-step animations with code examples in JavaScript, Python, Java, and C.",
},
    component: dynamic(() => import('@/app/visualizer/hashmap/delete/AlgorithmClient')),
  },
  "hashmap/insert": {
    metadata: {
  title: "HashMap Insert Visualizer | Learn HashMap Operations",
  description: "Understand HashMap Insert operation through step-by-step animations with code examples in JavaScript, Python, Java, and C++.",
},
    component: dynamic(() => import('@/app/visualizer/hashmap/insert/AlgorithmClient')),
  },
  "hashmap/search": {
    metadata: {
  title: "HashMap Search Visualizer | Learn HashMap Operations",
  description: "Understand HashMap Search operation through step-by-step animations with code examples in JavaScript, Python, Java, and C.",
},
    component: dynamic(() => import('@/app/visualizer/hashmap/search/AlgorithmClient')),
  },
  "linkedlist/operations/comparison": {
    metadata: {
  title:
    "Linked List Comparison Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Learn how comparison works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the comparison process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Comparison",
    "Comparison Animation Linked List",
    "Visualize Comparison in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Comparison",
    "Linked List Comparison Visualization",
    "Interactive Linked List",
    "Comparison Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Comparison Code Example",
    "Linked List Tutorial",
    "Comparison using C",
    "Comparison using Java",
    "Comparison using Javascript",
    "Comparison using Python",
    "Comparison using linked list",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/operations/comparison/AlgorithmClient')),
  },
  "linkedlist/operations/deletion": {
    metadata: {
  title:
    "Linked List Deletion Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Learn how deletion works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the deletion process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Deletion",
    "Deletion Animation Linked List",
    "Visualize Deletion in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Deletion",
    "Linked List Deletion Visualization",
    "Interactive Linked List",
    "Deletion Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Deletion Code Example",
    "Linked List Tutorial",
    "Deletion using C",
    "Deletion using Java",
    "Deletion using Javascript",
    "Deletion using Python",
    "Deletion using linked list",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/operations/deletion/AlgorithmClient')),
  },
  "linkedlist/operations/insertion": {
    metadata: {
  title:
    "Linked List Insertion Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Learn how insertion works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the insertion process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Insertion",
    "Insertion Animation Linked List",
    "Visualize Insertion in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Insertion",
    "Linked List Insertion Visualization",
    "Interactive Linked List",
    "Insertion Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Insertion Code Example",
    "Linked List Tutorial",
    "Insertion using C",
    "Insertion using Java",
    "Insertion using Javascript",
    "Insertion using Python",
    "Insertion using linked list",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/operations/insertion/AlgorithmClient')),
  },
  "linkedlist/operations/merge": {
    metadata: {
  title:
    "Linked List Merge Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Learn how merging works in Linked Lists with interactive animations, detailed explanations, and hands-on practice. Visualize each step of the merge process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Merge",
    "Merge Animation Linked List",
    "Visualize Merge in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Merge",
    "Linked List Merge Visualization",
    "Interactive Linked List",
    "Merge Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Merge Code Example",
    "Linked List Tutorial",
    "Merge using C",
    "Merge using Java",
    "Merge using Javascript",
    "Merge using Python",
    "Merge using linked list",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/operations/merge/AlgorithmClient')),
  },
  "linkedlist/operations/sorting": {
    metadata: {
    title:
      "Linked List Sorting Algorithm | Interactive Visualization & Step-by-Step Guide",
    description:
      "Learn how linked list sorting works with interactive animations, detailed explanations, and hands-on practice. Visualize the sorting process step by step and master linked list sorting techniques.",
    keywords: [
      "Linked List Sorting",
      "Merge Sort Linked List",
      "Linked List Sort Visualization",
      "Sorting Algorithm",
      "Data Structures",
      "DSA Linked List",
      "Interactive Sorting",
      "Linked List Tutorial",
      "Merge Sort Visualization",
      "Sorting Step-by-Step",
      "Linked List Learning",
      "Sorting using C",
      "Sorting using Java",
      "Sorting using JavaScript",
      "Sorting using Python"
    ],
    robots: "index, follow",
  },

  component: dynamic(() =>
    import('@/app/visualizer/linkedlist/operations/sorting/AlgorithmClient')
  ),  
  },
  "linkedlist/operations/reverse": {
    metadata: {
  title:
    "Linked List Reverse Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Explore how reversing a linked list works with interactive animations, clear explanations, and hands-on practice. Visualize each step of the reverse process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Reverse",
    "Reverse Animation Linked List",
    "Visualize Reverse in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Reverse",
    "Linked List Reverse Visualization",
    "Interactive Linked List",
    "Reverse Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Reverse Code Example",
    "Linked List Tutorial",
    "Reverse using C",
    "Reverse using Java",
    "Reverse using Javascript",
    "Reverse using Python",
    "Reverse linked list",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/operations/reverse/AlgorithmClient')),
  },
  "linkedlist/operations/traversal": {
    metadata: {
  title:
    "Linked List Traversal Algorithm | Interactive Visualization & Step-by-Step Guide",
  description:
    "Explore how traversal works in Linked Lists with interactive animations, clear explanations, and hands-on practice. Visualize each step of the traversal process and master linked list algorithms efficiently.",
  keywords: [
    "Linked List Traversal",
    "Traversal Animation Linked List",
    "Visualize Traversal in Linked List",
    "Linked List Algorithm",
    "DSA Linked List Traversal",
    "Linked List Traversal Visualization",
    "Interactive Linked List",
    "Traversal Step-by-Step",
    "Linked List Learning",
    "Data Structures Animation",
    "DSA Practice Linked List",
    "Traversal Code Example",
    "Linked List Tutorial",
    "Traversal using C",
    "Traversal using Java",
    "Traversal using Javascript",
    "Traversal using Python",
    "Traversal using linked list",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/operations/traversal/AlgorithmClient')),
  },
  "linkedlist/types/circular": {
    metadata: {
  title:
    "Circular Linked List Algorithm | Interactive Learning & Step-by-Step Animation",
  description:
    "Master Circular Linked Lists with interactive visualizations, quizzes, and implementation code. Learn insertion, deletion, and traversal through animations and practice with hands-on exercises.",
  keywords: [
    "Circular Linked List Visualizer",
    "CLL Animation",
    "Visualize Circular Linked List",
    "Learn Circular Linked List",
    "Circular Linked List DSA",
    "Circular Linked List for Beginners",
    "Insertion in Circular Linked List",
    "Deletion in Circular Linked List",
    "Circular Linked List Traversal",
    "DSA Circular Linked List Visualization",
    "DSA Quiz Circular Linked List",
    "Circular Linked List Implementation Code",
    "DSA Learning Platform",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/types/circular/AlgorithmClient')),
  },
  "linkedlist/types/doubly": {
    metadata: {
  title:
    "Doubly Linked List Implementation | Visualize Doubly Linked List in JS, C, Python, Java",
  description:
    "Explore Doubly Linked List implementation with interactive animations and code examples in JavaScript, C, Python, and Java. Learn insertion, deletion, and traversal from both directions. Perfect for DSA beginners and interview preparation.",
  keywords: [
    "Doubly Linked List Implementation",
    "DLL Visualization",
    "Doubly Linked List in JavaScript",
    "Doubly Linked List in C",
    "Doubly Linked List in Python",
    "Doubly Linked List in Java",
    "DSA Doubly Linked List",
    "Bidirectional Linked List",
    "Insertion in DLL",
    "Deletion in DLL",
    "DLL Operations",
    "Learn Doubly Linked List",
    "DSA for Beginners",
    "Interactive Linked List Visualizer",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/types/doubly/AlgorithmClient')),
  },
  "linkedlist/types/singly": {
    metadata: {
  title:
    "Singly Linked List Implementation | Visualize Linked List in JS, C, Python, Java",
  description:
    "Explore Singly Linked List implementation with interactive visualizations and real-time code examples in JavaScript, C, Python, and Java. Learn insertion, deletion, and traversal with step-by-step animations. Perfect for DSA beginners and interview preparation.",
  keywords: [
    "Singly Linked List Implementation",
    "Singly Linked List Visualization",
    "Linked List in JavaScript",
    "Linked List in C",
    "Linked List in Python",
    "Linked List in Java",
    "DSA Linked List",
    "Linked List Operations",
    "Insertion in Linked List",
    "Deletion in Linked List",
    "Traverse Linked List",
    "Learn Linked List",
    "Visualize Linked List",
    "DSA for Beginners",
    "Interactive Linked List Tool",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/linkedlist/types/singly/AlgorithmClient')),
  },
  "queue/implementation/array": {
    metadata: {
  title:
    "Queue Implementation Using Array | Visualize Queue Operations in JS, C, Python, Java",
  description:
    "Learn Queue implementation using arrays with real-time visualizations and code examples in JavaScript, C, Python, and Java. Understand how Enqueue and Dequeue work step-by-step without quizzes. Ideal for DSA beginners.",
  keywords: [
    "Queue Implementation",
    "Queue using Array",
    "Enqueue Dequeue Operations",
    "Queue Data Structure",
    "Queue Visualization",
    "DSA Queue Tutorial",
    "Queue in JavaScript",
    "Queue in C",
    "Queue in Python",
    "Queue in Java",
    "Learn Queue",
    "Interactive Queue Visualizer",
    "Array based Queue",
    "DSA for Beginners",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/queueArray.png",
        width: 1200,
        height: 630,
        alt: "Implementation of Queue using Array Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/implementation/array/AlgorithmClient')),
  },
  "queue/implementation/linkedList": {
    metadata: {
  title:
    "Queue Implementation Using Linked List | Visualize Queue in JS, C, Python, Java",
  description:
    "Explore Queue implementation using Linked List with real-time visualizations and code examples in JavaScript, C, Python, and Java. Understand how Enqueue and Dequeue work in a dynamic memory structure. Perfect for DSA beginners and interview prep.",
  keywords: [
    "Queue Implementation",
    "Queue using Linked List",
    "Enqueue Dequeue Operations",
    "Queue Data Structure",
    "Linked List Queue",
    "Queue Visualization",
    "DSA Queue Tutorial",
    "Queue in JavaScript",
    "Queue in C",
    "Queue in Python",
    "Queue in Java",
    "Learn Queue",
    "Interactive DSA Tools",
    "DSA with Linked List",
    "DSA for Beginners",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/queueLinkedList.png",
        width: 1200,
        height: 630,
        alt: "Implementation of Queue using Linked List Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/implementation/linkedList/AlgorithmClient')),
  },
  "queue/operations/enqueue-dequeue": {
    metadata: {
  title:
    "Enqueue and Dequeue Operations in Queue | Learn Queue with JS, C, Python, Java Code",
  description:
    "Visualize and understand the Enqueue and Dequeue operations in a Queue with real-time animations and code examples in JavaScript, C, Python, and Java. Perfect for DSA beginners and interview preparation.",
  keywords: [
    "Enqueue Operation",
    "Dequeue Operation",
    "Queue Operations",
    "Queue DSA",
    "Queue Enqueue Dequeue",
    "Learn Queue",
    "Queue Visualization",
    "Interactive DSA Tools",
    "Queue Data Structure",
    "Queue Code Examples",
    "Enqueue Dequeue in JavaScript",
    "Enqueue Dequeue in C",
    "Enqueue Dequeue in Python",
    "Enqueue Dequeue in Java",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/enqueueDequeue.png",
        width: 1200,
        height: 630,
        alt: "Enqueue Dequeue Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/operations/enqueue-dequeue/AlgorithmClient')),
  },
  "queue/operations/isempty": {
    metadata: {
  title: "Queue Is Empty Operation | Learn with JS, C, Python, Java Code",
  description:
    "Learn how to check if a Queue is empty using interactive visualizations and complete code examples in JavaScript, C, Python, and Java. Ideal for DSA beginners and interview prep.",
  keywords: [
    "Queue Is Empty",
    "Is Empty Operation Queue",
    "Queue Empty Condition",
    "Queue Code in JavaScript",
    "Queue Code in C",
    "Queue Code in Python",
    "Queue Code in Java",
    "DSA Queue Check",
    "Queue Operations",
    "Visualize Queue",
    "Learn Queue DSA",
    "Queue Data Structure",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/isEmpty.png",
        width: 1200,
        height: 630,
        alt: "isEmpty Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/operations/isempty/AlgorithmClient')),
  },
  "queue/operations/isfull": {
    metadata: {
  title: "Queue Is Full Operation | Learn with JS, C, Python, Java Code",
  description:
    "Understand how to check if a Queue is full using interactive visualizations and detailed code examples in JavaScript, C, Python, and Java. Perfect for mastering DSA and technical interviews.",
  keywords: [
    "Queue Is Full",
    "Is Full Operation Queue",
    "Queue Full Condition",
    "Queue Capacity Check",
    "Queue Code in JavaScript",
    "Queue Code in C",
    "Queue Code in Python",
    "Queue Code in Java",
    "Queue DSA",
    "Learn Queue Operations",
    "Queue Data Structure",
    "Visualize Queue",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/isFull.png",
        width: 1200,
        height: 630,
        alt: "isFull Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/operations/isfull/AlgorithmClient')),
  },
  "queue/operations/peek-front": {
    metadata: {
  title: "Queue Peek Front Operation | Learn with JS, C, Java, Python Code",
  description:
    "Understand the Peek Front operation in Queue with interactive animations and code examples in JavaScript, C, Python, and Java. Ideal for DSA beginners and interview preparation.",
  keywords: [
    "Queue Peek Front",
    "Queue peek front Visulaization",
    "Peek Front Operation",
    "Queue DSA",
    "Queue Front Element",
    "Queue Peek in JavaScript",
    "Queue Peek in C",
    "Queue Peek in Python",
    "Queue Peek in Java",
    "Queue Data Structure",
    "DSA Queue Operations",
    "Peek Front Code Examples",
    "Queue Visualization",
    "Learn Queue DSA",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/peekFront.png",
        width: 1200,
        height: 630,
        alt: "Peek Front Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/operations/peek-front/AlgorithmClient')),
  },
  "queue/types/circular": {
    metadata: {
  title: "Circular Queue | Learn with JS, C, Python, Java Code",
  description:
    "Understand how Circular Queue works in Data Structures using animations and complete code examples in JavaScript, C, Python, and Java. Ideal for DSA beginners and interview preparation.",
  keywords: [
    "Circular Queue",
    "Circular Queue Visualizer",
    "Circular Queue DSA",
    "Circular Queue in JavaScript",
    "Circular Queue in C",
    "Circular Queue in Python",
    "Circular Queue in Java",
    "Queue Data Structure",
    "DSA Queue Operations",
    "Learn Circular Queue",
    "Circular Queue Code Examples",
    "DSA Visualizer",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/circularQueue.png",
        width: 1200,
        height: 630,
        alt: "Circular Queue Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/types/circular/AlgorithmClient')),
  },
  "queue/types/deque": {
    metadata: {
  title: "Double Ended Queue (Deque) | Learn with JS, C, Python, Java Code",
  description:
    "Explore Double Ended Queue (Deque) in Data Structures with visual animations and full code implementations in JavaScript, C, Python, and Java. Perfect for mastering DSA concepts and interview preparation.",
  keywords: [
    "Double Ended Queue",
    "Double Ended Queue Visualizer",
    "Deque in DSA",
    "DSA Deque",
    "Double Ended Queue in JavaScript",
    "Deque in C",
    "Deque in Python",
    "Deque in Java",
    "DSA Queue Operations",
    "Learn Deque DSA",
    "Deque Code Examples",
    "DSA Visualizer",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/deque.png",
        width: 1200,
        height: 630,
        alt: "Double Ended Queue Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/types/deque/AlgorithmClient')),
  },
  "queue/types/priority": {
    metadata: {
  title:
    "Priority Queue Algorithm | Visual Guide with Code in JavaScript, C, Python, Java",
  description:
    "Master Priority Queue in Data Structures with easy-to-understand visualizations and complete code examples in JavaScript, C, Python, and Java. Perfect for DSA learners and coding interview prep.",
  keywords: [
    "Priority Queue",
    "Priority Queue DSA",
    "Priority Queue Data Structure",
    "Priority Queue in JavaScript",
    "Priority Queue in C",
    "Priority Queue in Python",
    "Priority Queue in Java",
    "Priority Queue Examples",
    "DSA Queue Operations",
    "Learn Priority Queue",
    "Priority Queue Code",
    "Priority Queue Visualization",
    "DSA Visualizer",
    "Priority Queue for Interviews",
    "Priority Queue Tutorial",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/priorityQueue.png",
        width: 1200,
        height: 630,
        alt: "Priority Queue Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/types/priority/AlgorithmClient')),
  },
  "queue/types/singleEnded": {
    metadata: {
  title: "Single Ended Queue | Learn with JS, C, Python, Java Code",
  description:
    "Understand Single Ended Queue in Data Structures with animations and full code examples in JavaScript, C, Python, and Java. Ideal for beginners learning queue operations and preparing for interviews.",
  keywords: [
    "Single Ended Queue",
    "Single Ended Queue DSA",
    "Queue Data Structure",
    "Single Ended Queue in JavaScript",
    "Single Ended Queue in C",
    "Single Ended Queue in Python",
    "Single Ended Queue in Java",
    "DSA Queue Operations",
    "Learn Queue DSA",
    "Queue Code Examples",
    "DSA Visualizer",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/queue/singleEnded.png",
        width: 1200,
        height: 630,
        alt: "Single Ended Queue Algorithm Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/queue/types/singleEnded/AlgorithmClient')),
  },
  "recursion/backtracking": {
    metadata: {
  title: "Backtracking | AlgoBuddy",
  description: "Visualize classical backtracking recursively through the N-Queens placement puzzle.",
  keywords: ["Backtracking", "N-Queens", "Recursion", "DSA"],
},
    component: dynamic(() => import('@/app/visualizer/recursion/backtracking/AlgorithmClient')),
  },
  "recursion/basic-recursion": {
    metadata: {
  title: "Basic Recursion Roadmap | AlgoBuddy",
  description: "Explore the basics of recursion by stepping through Print 1 to N and Print N to 1 flow animations.",
  keywords: ["Basic Recursion", "Print 1 to N", "Print N to 1", "Recursion", "DSA"],
},
    component: dynamic(() => import('@/app/visualizer/recursion/basic-recursion/AlgorithmClient')),
  },
  "recursion/binary-search": {
    metadata: {
  title: "Recursive Binary Search | AlgoBuddy",
  description: "Visualize how Binary Search operates recursively by halving search intervals.",
  keywords: ["Recursive Binary Search", "Binary Search", "Recursion", "DSA"],
},
    component: dynamic(() => import('@/app/visualizer/recursion/binary-search/AlgorithmClient')),
  },
  "recursion/factorial": {
    metadata: {
  title: "Factorial Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize the Factorial recursive algorithm step by step. Learn how stack frames are pushed and popped with animations, line-by-line trace, and conceptual quizzes.",
  keywords: [
    "Factorial Visualizer",
    "Factorial Recursion",
    "Call Stack Animation",
    "Stack Frames",
    "DSA Recursion",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/factorial/AlgorithmClient')),
  },
  "recursion/tower-of-hanoi": {
    metadata: {
  title: "Tower of Hanoi Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize the Tower of Hanoi recursive algorithm step-by-step. Witness disk transfers between pegs, call stack frame updates, and line-by-line active code traces.",
  keywords: [
    "Tower of Hanoi Visualizer",
    "Tower of Hanoi Recursion",
    "Call Stack Animation",
    "Peg Transfer",
    "DSA Recursion",
    "Recurrence Relation",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/tower-of-hanoi/AlgorithmClient')),
  },
  "recursion/fibonacci": {
    metadata: {
  title: "Fibonacci Tree Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize Fibonacci tree recursion step-by-step. Witness LIFO call stack and recursion tree nodes updating dynamically, with line-by-line active code traces.",
  keywords: [
    "Fibonacci Visualizer",
    "Fibonacci Recursion Tree",
    "Tree Recursion",
    "Call Stack Animation",
    "DSA Recursion",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/fibonacci/AlgorithmClient')),
  },
  "recursion/functional-parameterized": {
    metadata: {
  title: "Functional & Parameterized Recursion | AlgoBuddy",
  description: "Visualize parameter passing, return values, array reversals, and palindrome checks recursively.",
  keywords: ["Functional Recursion", "Parameterized Recursion", "Sum of N", "Factorial", "Reverse Array", "Palindrome", "DSA"],
},
    component: dynamic(() => import('@/app/visualizer/recursion/functional-parameterized/AlgorithmClient')),
  },
  "recursion/multiple-calls": {
    metadata: {
  title: "Multiple Recursive Calls | AlgoBuddy",
  description: "Visualize how functions call themselves multiple times, branching like trees and generating duplicate subproblems.",
  keywords: ["Multiple Recursive Calls", "Fibonacci", "Recursion", "DSA"],
},
    component: dynamic(() => import('@/app/visualizer/recursion/multiple-calls/AlgorithmClient')),
  },
  "recursion/n-queens": {
    metadata: {
  title: "N-Queens Placement Backtracking Visualizer | AlgoBuddy",
  description:
    "Visualize the N-Queens backtracking recursive algorithm step-by-step. See placement, conflicts, backtracking, and solutions on a 4x4 chessboard.",
  keywords: [
    "N-Queens",
    "Backtracking",
    "Chessboard",
    "Recursion Visualizer",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/n-queens/AlgorithmClient')),
  },
  "recursion/palindrome": {
    metadata: {
  title: "String Palindrome Check Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize recursive palindrome checking step-by-step. Witness character comparisons and call stack trace changes.",
  keywords: [
    "Palindrome Check",
    "String Recursion",
    "Two Pointers",
    "Call Stack",
    "Visualizer",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/palindrome/AlgorithmClient')),
  },
  "recursion/print-1-to-n": {
    metadata: {
  title: "Print 1 to N Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize basic recursion by printing numbers 1 to N step-by-step. Witness stack frame pushes and LIFO pops.",
  keywords: [
    "Print 1 to N",
    "Basic Recursion",
    "Call Stack",
    "Visualizer",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/print-1-to-n/AlgorithmClient')),
  },
  "recursion/print-n-to-1": {
    metadata: {
  title: "Print N to 1 Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize basic recursion by printing numbers N down to 1 step-by-step. Witness stack frame pushes and LIFO pops.",
  keywords: [
    "Print N to 1",
    "Basic Recursion",
    "Call Stack",
    "Visualizer",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/print-n-to-1/AlgorithmClient')),
  },
  "recursion/reverse-array": {
    metadata: {
  title: "Reverse Array Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize array reversing using two-pointer recursion. Witness swaps and call stack frame changes step-by-step.",
  keywords: [
    "Reverse Array",
    "Array Recursion",
    "Two Pointers",
    "Call Stack",
    "Visualizer",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/reverse-array/AlgorithmClient')),
  },
  "recursion/stack": {
    metadata: {
  title: "Call Stack Visualization | AlgoBuddy",
  description: "Visualize how system stack frames are pushed and popped recursively.",
  keywords: ["Call Stack", "Stack Frames", "Factorial Stack", "Recursion", "DSA"],
},
    component: dynamic(() => import('@/app/visualizer/recursion/stack/AlgorithmClient')),
  },
  "recursion/subsequences": {
    metadata: {
  title: "Subsequences Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize recursion on subsequences step-by-step. Witness the subset decision tree (Take vs. Not Take), active stack, and generated subsets list.",
  keywords: [
    "Subsequences",
    "Subset Generation",
    "Backtracking",
    "Recursion Tree",
    "Visualizer",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/subsequences/AlgorithmClient')),
  },
  "recursion/sum-of-n": {
    metadata: {
  title: "Sum of N Numbers Recursion Visualizer | AlgoBuddy",
  description:
    "Visualize the Sum of First N Numbers recursive algorithm. See stack frames pushed and popped with animations, line trace, and conceptual quizzes.",
  keywords: [
    "Sum of N Numbers Visualizer",
    "Sum Recursion",
    "Call Stack Animation",
    "DSA Recursion",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/recursion/sum-of-n/AlgorithmClient')),
  },
  "recursion/trees": {
    metadata: {
  title: "Recursion Trees | AlgoBuddy",
  description: "Visualize execution branching dynamically to understand Recursion Trees.",
  keywords: ["Recursion Trees", "Fibonacci Tree", "Recursion", "DSA"],
},
    component: dynamic(() => import('@/app/visualizer/recursion/trees/AlgorithmClient')),
  },
  "stack/implementation/usingArray": {
    metadata: {
  title:
    "Stack Implementation using Array | Learn Stack in DSA with JS, C, Python, Java Code",
  description:
    "Understand how to implement a Stack using an Array with visual explanations, animations, and complete code examples in JavaScript, C, Python, and Java. Perfect for DSA beginners and interview prep.",
  keywords: [
    "Stack using Array",
    "Stack Implementation",
    "Stack Implementation in JavaScript",
    "Stack Implementation in C",
    "Stack Implementation in Python",
    "Stack Implementation in Java",
    "DSA Stack",
    "Array Stack",
    "Data Structures Stack",
    "Stack Push Pop Array",
    "Learn Stack DSA",
    "Visualize Stack Implementation",
    "Stack Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/stackArray.png",
        width: 1200,
        height: 630,
        alt: "Stack Implementation using Array",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/stack/implementation/usingArray/AlgorithmClient')),
  },
  "stack/implementation/usingLinkedList": {
    metadata: {
  title:
    "Stack Implementation using Linked List | Learn Stack in DSA with JS, C, Python, Java Code",
  description:
    "Explore how to implement a Stack using a Linked List with step-by-step visual explanations, animations, and complete code in JavaScript, C, Python, and Java. Ideal for DSA learners and coding interview prep.",
  keywords: [
    "Stack using Linked List",
    "Stack Implementation",
    "Stack Implementation in JavaScript",
    "Stack Implementation in C",
    "Stack Implementation in Python",
    "Stack Implementation in Java",
    "Linked List Stack",
    "DSA Stack",
    "Data Structures Stack",
    "Stack Push Pop Linked List",
    "Learn Stack DSA",
    "Visualize Stack Implementation",
    "Stack Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/stackLinkedList.png",
        width: 1200,
        height: 630,
        alt: "Stack Implementation using Linked List",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/stack/implementation/usingLinkedList/AlgorithmClient')),
  },
  "stack/isempty": {
    metadata: {
  title:
    "Stack is empty Visualizer | Learn Stack IsEmpty Operation in JS, C, Python, Java",
  description:
    "Visualize how Stack isEmpty operation works in DSA using interactive animations. Great for beginners and interview prep. Includes code examples in JavaScript, C, Python, and Java.",
  keywords: [
    "Stack DSA",
    "Stack Visualizer",
    "Learn Stack",
    "DSA Animation",
    "Stack isEmpty Operation",
    "Check if Stack is Empty",
    "Stack Implementation in JavaScript",
    "Stack Implementation in C",
    "Stack in Python",
    "Stack in Java",
    "Stack Code Examples",
    "Interactive Stack Tool",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/isEmpty.png",
        width: 1200,
        height: 630,
        alt: "Stack isEmpty Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/stack/isempty/AlgorithmClient')),
  },
  "stack/isfull": {
    metadata: {
  title:
    "Stack Is Full Visualizer | Check Full Condition in Stack with Code in JS, C, Python, Java",
  description:
    "Understand how to check if a Stack is full using interactive animations and code examples in JavaScript, C, Python, and Java. A simple guide for beginners and DSA interview preparation.",
  keywords: [
    "Stack Is Full",
    "Is Full Operation Stack",
    "Stack Full Condition",
    "Stack Capacity Check",
    "DSA Stack Animation",
    "Learn Stack Operations",
    "Stack in JavaScript",
    "Stack in C",
    "Stack in Python",
    "Stack in Java",
    "Stack Code Examples",
    "Stack Overflow Condition",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/isFull.png",
        width: 1200,
        height: 630,
        alt: "Stack isFull Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/stack/isfull/AlgorithmClient')),
  },
  "stack/monotonic/largestrectangle": {
    metadata: {
  title:
    "Largest Rectangle in Histogram Visualizer | Learn Monotonic Stack",
  description:
    "Understand the Largest Rectangle in Histogram algorithm using a Monotonic Stack through step-by-step animations.",
  keywords: [
    "Largest Rectangle in Histogram",
    "Monotonic Stack",
    "Stack Visualization",
    "Data Structure Visualization",
    "Learn Monotonic Stack",
    "Interactive Algorithm Tool",
    "Practice Stack Operations",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/stack/monotonic/largestrectangle/AlgorithmClient')),
  },
  "stack/peek": {
    metadata: {
  title:
    "Stack Peek Visualizer | Understand Peek Operation in Stack with Code in JS, C, Python, Java",
  description:
    "Learn how the Peek operation works in a Stack using interactive animations and code examples in JavaScript, C, Python, and Java. Perfect for beginners and DSA interview preparation.",
  keywords: [
    "Stack Peek",
    "Peek Operation Stack",
    "Stack Top Element",
    "Peek in DSA",
    "DSA Stack Animation",
    "Learn Stack Operations",
    "Stack in JavaScript",
    "Stack in C",
    "Stack in Python",
    "Stack in Java",
    "Peek Operation Example",
    "Stack Code Examples",
    "Top of Stack",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/peek.png",
        width: 1200,
        height: 630,
        alt: "Stack Peek Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/stack/peek/AlgorithmClient')),
  },
  "stack/polish/postfix": {
    metadata: {
  title:
    "Postfix Notation using Stack | Learn Postfix Evaluation in DSA with Code in JS, C, Python, Java",
  description:
    "Visualize how Postfix expressions are evaluated using a Stack through interactive animations and code examples in JavaScript, C, Python, and Java. Perfect for DSA beginners and technical interview preparation.",
  keywords: [
    "Postfix Notation",
    "Postfix Evaluation Stack",
    "Stack DSA",
    "Postfix Expression",
    "DSA Postfix",
    "Evaluate Postfix using Stack",
    "Learn Postfix Notation",
    "Postfix Evaluation in JavaScript",
    "Postfix Evaluation in C",
    "Postfix Evaluation in Python",
    "Postfix Evaluation in Java",
    "Stack Code Examples",
    "DSA Expression Evaluation",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/postfix.png",
        width: 1200,
        height: 630,
        alt: "Stack infix to postfix",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/stack/polish/postfix/AlgorithmClient')),
  },
  "stack/polish/prefix": {
    metadata: {
  title:
    "Prefix Notation using Stack | Learn Prefix Evaluation in DSA with Code in JS, C, Python, Java",
  description:
    "Understand how to evaluate Prefix expressions using a Stack with interactive animations and code examples in JavaScript, C, Python, and Java. Essential for mastering DSA concepts and preparing for interviews.",
  keywords: [
    "Prefix Notation",
    "Prefix Evaluation Stack",
    "Stack DSA",
    "Prefix Expression",
    "DSA Prefix",
    "Evaluate Prefix using Stack",
    "Learn Prefix Notation",
    "Prefix Evaluation in JavaScript",
    "Prefix Evaluation in C",
    "Prefix Evaluation in Python",
    "Prefix Evaluation in Java",
    "Stack Code Examples",
    "DSA Expression Evaluation",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/prefix.png",
        width: 1200,
        height: 630,
        alt: "Stack infix to prefix",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/stack/polish/prefix/AlgorithmClient')),
  },
  "stack/push-pop": {
    metadata: {
  title:
    "Stack Push & Pop Visualizer & Quiz | Learn Stack Operations with Code in JS, C, Python, Java",
  description:
    "Understand Stack Push and Pop operations through step-by-step animations and test your knowledge with an interactive quiz. Includes code examples in JavaScript, C, Python, and Java. Ideal for beginners and interview preparation to master stack-based data structures visually and through hands-on coding.",
  keywords: [
    "Stack Push Visualizer",
    "Stack Pop Visualizer",
    "Push and Pop Animation",
    "Stack Operations",
    "Stack Algorithm",
    "Stack Quiz",
    "Data Structure Visualization",
    "Learn Stack Push",
    "Learn Stack Pop",
    "Interactive Stack Tool",
    "Practice Stack Operations",
    "Test Stack Knowledge",
    "Stack in JavaScript",
    "Stack in C",
    "Stack in Python",
    "Stack in Java",
    "Stack Code Examples",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/stack/pushPop.png",
        width: 1200,
        height: 630,
        alt: "Stack Push and Pop Visualization",
      },
    ],
  },
},
    component: dynamic(() => import('@/app/visualizer/stack/push-pop/AlgorithmClient')),
  },
  "tree/advanced/b-trees": {
    metadata: {
  title: "B-Tree Visualizer | Interactive Key Insertion & Node Splitting | AlgoBuddy",
  description:
    "Explore multi-way search B-Tree structures, node insertions, splitting criteria, and search traversals with step-by-step visual modules and practice quizzes.",
  keywords: [
    "B-Tree",
    "Multi-Way Search Tree",
    "Node Splitting",
    "Database Indexing",
    "DSA Trees Visualizer"
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/advanced/b-trees/AlgorithmClient')),
  },
  "tree/advanced/dsu": {
    metadata: {
  title: "Disjoint Set Union (DSU) Visualizer | Interactive Union-Find Algorithm | AlgoBuddy",
  description:
    "Visualize the Disjoint Set Union (DSU / Union-Find) algorithm with step-by-step interactive SVG tree diagrams and parent array grids. Explore Path Compression and Union by Rank optimizations with code examples and custom operations.",
  keywords: [
    "DSU Visualizer",
    "Disjoint Set Union Visualizer",
    "Union-Find Visualizer",
    "Union-Find Animation",
    "Path Compression Visualizer",
    "Union by Rank Visualizer",
    "Learn DSU",
    "Advanced Tree Algorithms",
    "Amortized Complexity Alpha",
    "DSU in JavaScript",
    "DSU in Python",
    "DSU in C++"
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/advanced/dsu/AlgorithmClient')),
  },
  "tree/advanced/fenwick": {
    metadata: {
  title: "Fenwick Tree (Binary Indexed Tree) Visualizer | Interactive Queries & Updates | AlgoBuddy",
  description:
    "Explore Fenwick Tree (Binary Indexed Tree) structures, dynamic LSB update steps, prefix sum queries, and point updates with educational modules and quizzes.",
  keywords: [
    "Fenwick Tree",
    "Binary Indexed Tree",
    "Prefix Sum Query",
    "LSB Operations",
    "DSA Tree Animations"
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/advanced/fenwick/AlgorithmClient')),
  },
  "tree/advanced/red-black": {
    metadata: {
  title: "Red-Black Tree Visualizer | Interactive Rotations & Recoloring | AlgoBuddy",
  description:
    "Visualize Red-Black Tree self-balancing operations, node insertions, left/right rotations, and color flips step-by-step with educational modules and quizzes.",
  keywords: [
    "Red-Black Tree",
    "Self-Balancing Binary Tree",
    "Tree Rotations",
    "Color Flips",
    "DSA Tree Animations",
    "Learn Red-Black Tree"
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/advanced/red-black/AlgorithmClient')),
  },
  "tree/advanced/segment": {
    metadata: {
  title: "Segment Tree Visualizer | Interactive Range Query & Point Updates | AlgoBuddy",
  description:
    "Explore Segment Tree structures, dynamic range queries, segment builds, and point updates step-by-step with educational animations and quizzes.",
  keywords: [
    "Segment Tree",
    "Range Query",
    "Point Update",
    "DSA Tree Animations",
    "Interval Tree"
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/advanced/segment/AlgorithmClient')),
  },
  "tree/advanced/trie": {
    metadata: {
  title: "Trie (Prefix Tree) Visualizer | Interactive Word Search & Autocomplete | AlgoBuddy",
  description:
    "Visualize Trie (Prefix Tree) character-by-character string insertion, search, and prefix matching step-by-step with interactive SVG animations, code blocks, and quizzes.",
  keywords: [
    "Trie Visualizer",
    "Prefix Tree Visualizer",
    "Trie Animation",
    "Trie Insertion",
    "Trie Search",
    "Prefix Match",
    "DSA Word Search",
    "Learn Tries",
    "Autocomplete Data Structure",
    "Trie in JavaScript",
    "Trie in Python",
    "Trie in C++"
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/advanced/trie/AlgorithmClient')),
  },
  "tree/algorithms/diameter": {
    metadata: {
  title: "Tree Diameter Visualizer | Tree Algorithm | AlgoBuddy",
  description:
    "Explore tree diameter calculation with practical examples, recursion strategies, and complexity analysis for tree algorithms.",
  keywords: ["Tree Diameter", "Tree Algorithms", "Binary Tree", "AlgoBuddy"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/algorithms/diameter/AlgorithmClient')),
  },
  "tree/algorithms/isomorphism": {
    metadata: {
  title: "Tree Isomorphism Visualizer | Tree Algorithm | AlgoBuddy",
  description:
    "Learn how to determine whether two binary trees are structurally identical using tree isomorphism checks, supported by examples and code.",
  keywords: ["Tree Isomorphism", "Binary Tree", "AlgoBuddy"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/algorithms/isomorphism/AlgorithmClient')),
  },
  "tree/algorithms/lca": {
    metadata: {
  title: "Lowest Common Ancestor Visualizer | Tree Algorithm | AlgoBuddy",
  description:
    "Learn the Lowest Common Ancestor algorithm for binary trees with clear examples, time and space complexity analysis, and implementation details.",
  keywords: [
    "Lowest Common Ancestor",
    "LCA",
    "Tree Algorithms",
    "Binary Tree",
    "AlgoBuddy",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/algorithms/lca/AlgorithmClient')),
  },
  "tree/algorithms/serialization": {
    metadata: {
  title: "Serialize/Deserialize Binary Tree | Tree Algorithm | AlgoBuddy",
  description:
    "Master binary tree serialization and deserialization with step-by-step examples and JavaScript implementation details.",
  keywords: ["Serialize Binary Tree", "Deserialize Binary Tree", "Tree Algorithms", "AlgoBuddy"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/algorithms/serialization/AlgorithmClient')),
  },
  "tree/applications/decision-trees": {
    metadata: {
  title: "Decision Trees Visualizer | Tree Applications | AlgoBuddy",
  description:
    "Learn Decision Trees, a popular machine learning algorithm. Visualize how decisions are made based on conditions and features.",
  keywords: [
    "Decision Trees",
    "Machine Learning",
    "Tree Applications",
    "Classification",
    "AlgoBuddy",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/applications/decision-trees/AlgorithmClient')),
  },
  "tree/applications/heap": {
    metadata: {
  title: "Heap Visualizer (Min Heap & Max Heap) | Tree Applications | AlgoBuddy",
  description:
    "Interactively learn Min Heap and Max Heap operations including insert, extract root, peek, and heapify with synchronized tree and array animation.",
  keywords: ["Heap", "Min Heap", "Max Heap", "Tree Applications", "AlgoBuddy"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/applications/heap/AlgorithmClient')),
  },
  "tree/applications/heapsort": {
    metadata: {
  title: "Heap Sort Visualizer | Tree Applications | AlgoBuddy",
  description:
    "Learn Heap Sort, an efficient sorting algorithm based on binary heap data structure. Visualize heap construction, heapify process, and sort arrays.",
  keywords: [
    "Heap Sort",
    "Tree Applications",
    "Sorting Algorithms",
    "Binary Heap",
    "AlgoBuddy",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/applications/heapsort/AlgorithmClient')),
  },
  "tree/applications/huffman": {
    metadata: {
  title: "Huffman Coding Visualizer | Tree Applications | AlgoBuddy",
  description:
    "Learn Huffman Coding, an efficient data compression algorithm. Visualize tree construction, encoding, and decoding processes.",
  keywords: [
    "Huffman Coding",
    "Data Compression",
    "Tree Applications",
    "Greedy Algorithm",
    "AlgoBuddy",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/applications/huffman/AlgorithmClient')),
  },
  "tree/applications/syntax-trees": {
    metadata: {
  title: "Syntax Trees Visualizer | Tree Applications | AlgoBuddy",
  description:
    "Learn Abstract Syntax Trees (ASTs), a tree representation of the abstract syntactic structure of source code. Used heavily in compilers and interpreters.",
  keywords: [
    "Syntax Trees",
    "AST",
    "Abstract Syntax Tree",
    "Compilers",
    "Tree Applications",
    "AlgoBuddy",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/applications/syntax-trees/AlgorithmClient')),
  },
  "tree/avl/deletion": {
    metadata: {
  title: "AVL Deletion Visualizer | Interactive AVL Tree Operations | AlgoBuddy",
  description: "Visualize AVL tree deletion step-by-step with balancing rotations, height updates, and interactive animations.",
  keywords: ["AVL Deletion", "AVL Tree", "Balanced BST", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/avl/deletion/AlgorithmClient')),
  },
  "tree/avl/insertion": {
    metadata: {
  title: "AVL Insertion Visualizer | Interactive AVL Tree Operations | AlgoBuddy",
  description: "Visualize AVL tree insertion step-by-step with balancing rotations, height updates, and interactive animations.",
  keywords: ["AVL Insertion", "AVL Tree", "Balanced BST", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/avl/insertion/AlgorithmClient')),
  },
  "tree/binaryTree/properties": {
    metadata: {
  title: "Binary Tree Structure & Properties | Learn Terminology and Metrics | AlgoBuddy",
  description:
    "Learn about Binary Tree structure, properties, and terminology in Data Structures and Algorithms. Discover root, parent, child, sibling, leaf, and internal nodes along with height, depth, level, degrees, and common formulas with interactive animations and code examples in JavaScript, Python, Java, C, and C++.",
  keywords: [
    "Binary Tree",
    "Binary Tree Structure",
    "Binary Tree Properties",
    "Tree Height",
    "Tree Depth",
    "Leaf Nodes",
    "Binary Tree Formulas",
    "Interactive Tree Inspector",
    "Data Structures",
    "Algorithms",
    "Learn DSA",
    "Binary Tree in C++",
    "Binary Tree in JavaScript",
    "Binary Tree in Python",
    "Binary Tree in Java",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/binaryTree/properties/AlgorithmClient')),
  },
  "tree/binaryTree/types": {
    metadata: {
  title: "Binary Tree Types | Learn Full, Complete, and Degenerate Binary Trees in DSA",
  description:
    "Learn about Binary Tree types in Data Structures and Algorithms, including Full Binary Tree, Complete Binary Tree, and Degenerate Tree with clear visual explanations, animations, and code examples in JavaScript, C, Python, and Java.",
  keywords: [
    "Binary Tree",
    "Binary Tree Types",
    "Full Binary Tree",
    "Complete Binary Tree",
    "Degenerate Tree",
    "Binary Tree Visualization",
    "DSA Binary Trees",
    "Binary Tree Animation",
    "Binary Tree Implementation",
    "Binary Tree in JavaScript",
    "Binary Tree in C",
    "Binary Tree in Python",
    "Binary Tree in Java",
    "Learn Binary Trees DSA",
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/binaryTree/types/AlgorithmClient')),
  },
  "tree/bst/avl": {
    metadata: {
  title: "AVL Tree Balancing | Self-Balancing BST | AlgoBuddy",
  description:
    "Learn about AVL Trees, the first self-balancing binary search trees. Explore height-balancing, single and double rotations, and complexity analysis.",
  keywords: [
    "AVL Tree",
    "Self-Balancing BST",
    "Tree Rotations",
    "Height Balanced Tree",
    "DSA Tree"
  ],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/bst/avl/AlgorithmClient')),
  },
  "tree/bst/deletion": {
    metadata: {
  title: "BST Deletion Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Learn how deleting nodes works in a Binary Search Tree, visualizing leaf, single-child, and two-children predecessor/successor deletions.",
  keywords: ["BST Deletion", "Delete Node BST", "Inorder Successor Deletion", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/bst/deletion/AlgorithmClient')),
  },
  "tree/bst/in-order": {
    metadata: {
  title: "BST In-Order Traversal Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree in-order traversal step-by-step with interactive animations, path highlighting, and quizzes.",
  keywords: ["BST In-Order Traversal", "Binary Search Tree", "Inorder Traversal", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/bst/in-order/AlgorithmClient')),
  },
  "tree/bst/insertion": {
    metadata: {
  title: "BST Insertion Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree element insertion step-by-step with interactive animations, path highlightings, and quizzes.",
  keywords: ["BST Insertion", "Binary Search Tree", "Insert Node BST", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/bst/insertion/AlgorithmClient')),
  },
  "tree/bst/post-order": {
    metadata: {
  title: "BST Post-Order Traversal Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree post-order traversal step-by-step with interactive animations, path highlighting, and quizzes.",
  keywords: ["BST Post-Order Traversal", "Binary Search Tree", "Postorder Traversal", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/bst/post-order/AlgorithmClient')),
  },
  "tree/bst/pre-order": {
    metadata: {
  title: "BST Pre-Order Traversal Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Visualize Binary Search Tree pre-order traversal step-by-step with interactive animations, path highlighting, and quizzes.",
  keywords: ["BST Pre-Order Traversal", "Binary Search Tree", "Preorder Traversal", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/bst/pre-order/AlgorithmClient')),
  },
  "tree/bst/searching": {
    metadata: {
  title: "BST Search Visualizer | Interactive Binary Search Tree Operations | AlgoBuddy",
  description: "Learn how searching works in Binary Search Trees with step-by-step interactive animations, pseudocode highlighting, and quizzes.",
  keywords: ["BST Search", "Binary Search Tree", "BST Traversal", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/bst/searching/AlgorithmClient')),
  },
  "tree/heap/max-heap": {
    metadata: {
  title: "Max Heap Visualizer | Interactive Heap Operations | AlgoBuddy",
  description: "Visualize max-heap operations step-by-step with interactive array and tree animations.",
  keywords: ["Max Heap", "Heap Visualizer", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/heap/max-heap/AlgorithmClient')),
  },
  "tree/heap/min-heap": {
    metadata: {
  title: "Min Heap Visualizer | Interactive Heap Operations | AlgoBuddy",
  description: "Visualize min-heap operations step-by-step with interactive array and tree animations.",
  keywords: ["Min Heap", "Heap Visualizer", "DSA Visualizations"],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/heap/min-heap/AlgorithmClient')),
  },
  "tree/traversing/in-order": {
    metadata: {
  title: 'In-Order Traversal Visualizer | AlgoBuddy',
  description: 'Visualize In-Order (Left → Root → Right) binary tree traversal step-by-step with interactive animations, pseudocode highlighting, and quizzes.',
  keywords: ['In-Order Traversal', 'Binary Tree', 'BST', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/traversing/in-order/AlgorithmClient')),
  },
  "tree/traversing/level-order": {
    metadata: {
  title: 'Level-Order (BFS) Traversal Visualizer | AlgoBuddy',
  description: 'Visualize Level-Order (Breadth-First Search) binary tree traversal step-by-step with live queue animations, pseudocode highlighting, and quizzes.',
  keywords: ['Level-Order Traversal', 'BFS', 'Binary Tree', 'Breadth First Search', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/traversing/level-order/AlgorithmClient')),
  },
  "tree/traversing/morris": {
    metadata: {
  title: 'Morris Traversal Visualizer | AlgoBuddy',
  description: 'Visualize Morris Traversal (threaded binary tree, O(1) space) step-by-step with dynamic thread link animations, pseudocode highlighting, and quizzes.',
  keywords: ['Morris Traversal', 'Threaded Binary Tree', 'O(1) Space', 'Binary Tree', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/traversing/morris/AlgorithmClient')),
  },
  "tree/traversing/post-order": {
    metadata: {
  title: 'Post-Order Traversal Visualizer | AlgoBuddy',
  description: 'Visualize Post-Order (Left → Right → Root) binary tree traversal step-by-step with interactive animations, pseudocode highlighting, and quizzes.',
  keywords: ['Post-Order Traversal', 'Binary Tree', 'BST', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/traversing/post-order/AlgorithmClient')),
  },
  "tree/traversing/pre-order": {
    metadata: {
  title: 'Pre-Order Traversal Visualizer | AlgoBuddy',
  description: 'Visualize Pre-Order (Root → Left → Right) binary tree traversal step-by-step with interactive animations, pseudocode highlighting, and quizzes.',
  keywords: ['Pre-Order Traversal', 'Binary Tree', 'BST', 'DSA Animation', 'Tree Visualizer'],
  robots: "index, follow",
},
    component: dynamic(() => import('@/app/visualizer/tree/traversing/pre-order/AlgorithmClient')),
  },
};
