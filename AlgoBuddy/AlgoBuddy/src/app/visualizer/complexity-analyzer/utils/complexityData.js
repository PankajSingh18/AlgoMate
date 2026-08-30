export const complexityInfo = [
  {
    complexity: "O(1)",
    title: "Constant Time",
    description:
      "Performance remains constant regardless of input size.",
    examples: ["Array Access", "HashMap Lookup"],
  },

  {
    complexity: "O(log n)",
    title: "Logarithmic Time",
    description:
      "Growth increases very slowly as input size increases.",
    examples: ["Binary Search", "Balanced BST Search"],
  },

  {
    complexity: "O(n)",
    title: "Linear Time",
    description:
      "Operations increase proportionally with input size.",
    examples: ["Linear Search", "Array Traversal"],
  },

  {
    complexity: "O(n log n)",
    title: "Linearithmic Time",
    description:
      "Efficient scaling used in advanced sorting algorithms.",
    examples: ["Merge Sort", "Heap Sort", "Quick Sort"],
  },

  {
    complexity: "O(n²)",
    title: "Quadratic Time",
    description:
      "Growth becomes expensive as datasets increase.",
    examples: ["Bubble Sort", "Selection Sort"],
  },

  {
    complexity: "O(n³)",
    title: "Cubic Time",
    description:
      "Very expensive for medium and large datasets.",
    examples: ["Naive Matrix Multiplication"],
  },

  {
    complexity: "O(2ⁿ)",
    title: "Exponential Time",
    description:
      "Becomes impractical extremely quickly as input grows.",
    examples: ["Recursive Fibonacci", "Subset Enumeration"],
  },
];

export const algorithmComparisons = [
  {
    name: "Bubble Sort",
    time: "O(n²)",
    space: "O(1)",
  },

  {
    name: "Merge Sort",
    time: "O(n log n)",
    space: "O(n)",
  },

  {
    name: "Quick Sort",
    time: "O(n log n)",
    space: "O(log n)",
  },

  {
    name: "Linear Search",
    time: "O(n)",
    space: "O(1)",
  },

  {
    name: "Binary Search",
    time: "O(log n)",
    space: "O(1)",
  },
];