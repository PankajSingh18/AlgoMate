// Operation count models — pure math, no actual sorting
export const ALGORITHMS = {
  "Bubble Sort": {
    label: "Bubble Sort",
    complexity: "O(n²)",
    color: "#f87171",
    getOps: (n) => (n * (n - 1)) / 2,
  },
  "Selection Sort": {
    label: "Selection Sort",
    complexity: "O(n²)",
    color: "#fb923c",
    getOps: (n) => (n * (n - 1)) / 2,
  },
  "Insertion Sort": {
    label: "Insertion Sort",
    complexity: "O(n²)",
    color: "#facc15",
    getOps: (n) => (n * (n - 1)) / 4, // avg case
  },
  "Merge Sort": {
    label: "Merge Sort",
    complexity: "O(n log n)",
    color: "#34d399",
    getOps: (n) => n * Math.log2(n || 1),
  },
  "Quick Sort": {
    label: "Quick Sort",
    complexity: "O(n log n)",
    color: "#22d3ee",
    getOps: (n) => n * Math.log2(n || 1),
  },
  "Binary Search": {
    label: "Binary Search",
    complexity: "O(log n)",
    color: "#818cf8",
    getOps: (n) => Math.log2(n || 1),
  },
  "Linear Search": {
    label: "Linear Search",
    complexity: "O(n)",
    color: "#e879f9",
    getOps: (n) => n,
  },
};

export const REFERENCE_CURVES = [
  { label: "O(1)",       color: "#94a3b8", getOps: ()  => 1 },
  { label: "O(log n)",   color: "#818cf8", getOps: (n) => Math.log2(n || 1) },
  { label: "O(n)",       color: "#34d399", getOps: (n) => n },
  { label: "O(n log n)", color: "#fbbf24", getOps: (n) => n * Math.log2(n || 1) },
  { label: "O(n²)",      color: "#f87171", getOps: (n) => n * n },
];

export function generatePoints(getOps, nValues) {
  return nValues.map((n) => ({ n, ops: getOps(n) }));
}