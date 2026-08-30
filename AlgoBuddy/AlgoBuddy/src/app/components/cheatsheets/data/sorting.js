export const sortingCheatsheets = [
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    category: "sorting",
    difficulty: "beginner",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    code: {
      javascript: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    for i in range(len(arr) - 1):
        for j in range(len(arr) - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`
    },
    steps: [
      "Compare adjacent elements",
      "Swap if they are in the wrong order",
      "Largest element bubbles to the end",
      "Reduce range and repeat until sorted"
    ],
    whenToUse: "Small datasets or nearly sorted data; educational purposes",
    pitfalls: "Very slow for large datasets; O(n²) worst-case performance"
  },
  {
    id: "selection-sort",
    title: "Selection Sort",
    category: "sorting",
    difficulty: "beginner",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: false,
    inPlace: true,
    code: {
      javascript: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
      python: `def selection_sort(arr):
    for i in range(len(arr) - 1):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`
    },
    steps: [
      "Find the minimum element in the unsorted portion",
      "Swap it with the first unsorted element",
      "Grow the sorted portion from the left",
      "Repeat until fully sorted"
    ],
    whenToUse: "Small datasets; minimal memory writes are important",
    pitfalls: "Always O(n²) regardless of input; not stable"
  },
  {
    id: "insertion-sort",
    title: "Insertion Sort",
    category: "sorting",
    difficulty: "beginner",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    code: {
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
    },
    steps: [
      "Start with the second element as the key",
      "Compare key with elements to its left",
      "Shift larger elements one position right",
      "Insert key into its correct position"
    ],
    whenToUse: "Small or nearly sorted datasets; online sorting (streaming data)",
    pitfalls: "Slow for reverse-sorted data; O(n²) average case"
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    category: "sorting",
    difficulty: "intermediate",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    stable: true,
    inPlace: false,
    code: {
      javascript: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]`
    },
    steps: [
      "Divide the array into two halves recursively",
      "Base case: array of size 0 or 1 is already sorted",
      "Merge two sorted halves by comparing elements",
      "Combine results to form the fully sorted array"
    ],
    whenToUse: "Large datasets; stable sort required; linked list sorting",
    pitfalls: "Requires O(n) additional memory; slower for small arrays"
  },
  {
    id: "quick-sort",
    title: "Quick Sort",
    category: "sorting",
    difficulty: "intermediate",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    stable: false,
    inPlace: true,
    code: {
      javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
    },
    steps: [
      "Choose a pivot element (typically last element)",
      "Partition: elements smaller than pivot go left, larger go right",
      "Recursively apply the same process to left and right subarrays",
      "Base case: subarray of size 0 or 1 is already sorted"
    ],
    whenToUse: "Large datasets; average-case performance is excellent",
    pitfalls: "Worst-case O(n²) on already sorted arrays with poor pivot choice"
  },
  {
    id: "heap-sort",
    title: "Heap Sort",
    category: "sorting",
    difficulty: "intermediate",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(1)",
    stable: false,
    inPlace: true,
    code: {
      javascript: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}
function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1, right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
      python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    left, right = 2 * i + 1, 2 * i + 2
    if left < n and arr[left] > arr[largest]: largest = left
    if right < n and arr[right] > arr[largest]: largest = right
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`
    },
    steps: [
      "Build a max heap from the input array",
      "Swap the root (largest) with the last element",
      "Reduce heap size by 1 and heapify the root",
      "Repeat until the heap is empty"
    ],
    whenToUse: "Large datasets with guaranteed O(n log n); limited memory available",
    pitfalls: "Not stable; slower in practice than Quick Sort due to cache behavior"
  }
];
