export const searchingCheatsheets = [
  {
    id: "linear-search",
    title: "Linear Search",
    category: "searching",
    difficulty: "beginner",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    code: {
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      python: `def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target: return i
    return -1`
    },
    steps: [
      "Start at the first element of the array",
      "Compare each element with the target value",
      "If found, return the index",
      "If the end is reached, return -1"
    ],
    whenToUse: "Small or unsorted datasets; single search operation",
    pitfalls: "Inefficient for large datasets; O(n) worst-case time"
  },
  {
    id: "binary-search",
    title: "Binary Search",
    category: "searching",
    difficulty: "beginner",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    code: {
      javascript: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1`
    },
    steps: [
      "Find the middle element of the sorted array",
      "If it matches the target, return its index",
      "If target is greater, search the right half",
      "If target is smaller, search the left half",
      "Repeat until found or the range is empty"
    ],
    whenToUse: "Sorted arrays; frequent search operations; large datasets",
    pitfalls: "Requires sorted input; not suitable for linked lists"
  },
  {
    id: "jump-search",
    title: "Jump Search",
    category: "searching",
    difficulty: "intermediate",
    timeComplexity: { best: "O(1)", average: "O(√n)", worst: "O(√n)" },
    spaceComplexity: "O(1)",
    code: {
      javascript: `function jumpSearch(arr, target) {
  const n = arr.length;
  let step = Math.floor(Math.sqrt(n));
  let prev = 0;
  while (arr[Math.min(step, n) - 1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  for (let i = prev; i < Math.min(step, n); i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
      python: `import math
def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n: return -1
    for i in range(prev, min(step, n)):
        if arr[i] == target: return i
    return -1`
    },
    steps: [
      "Determine the block size (√n)",
      "Jump ahead by block size until the target is less than the block's last element",
      "Perform linear search within the block",
      "Return the index if found, or -1"
    ],
    whenToUse: "Sorted arrays; better than linear search but simpler than binary search",
    pitfalls: "Only works on sorted arrays; slightly worse constant than binary search"
  }
];
