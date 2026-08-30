/**
 * Pure generator functions for Heap operations.
 * Yields frames representing the state of the operation.
 */

const parentIndex = (i) => Math.floor((i - 1) / 2);
const leftChild = (i) => 2 * i + 1;
const rightChild = (i) => 2 * i + 2;

export function compare(a, b, mode) {
  return mode === "min" ? a < b : a > b;
}

export function* buildHeapGenerator(seedHeap, mode) {
  const arr = [...seedHeap];
  yield {
    heap: [...arr],
    operation: `Switch to ${mode === "min" ? "Min Heap" : "Max Heap"}`,
    explanation: "Rebuilding structure to satisfy the new heap property.",
    type: "start"
  };

  const heapifyDown = function* (start, size) {
    let i = start;
    while (true) {
      let target = i;
      const l = leftChild(i);
      const r = rightChild(i);

      if (l < size) {
        yield {
          heap: [...arr],
          operation: "Heapify",
          explanation: `${mode === "min" ? "Min" : "Max"} Heap property check in progress.`,
          comparison: `Comparing node ${arr[i]} with left child ${arr[l]}`,
          activeIndices: [i, l],
          type: "step"
        };
        if (compare(arr[l], arr[target], mode)) target = l;
      }

      if (r < size) {
        yield {
          heap: [...arr],
          operation: "Heapify",
          explanation: `${mode === "min" ? "Min" : "Max"} Heap property check in progress.`,
          comparison: `Comparing node ${arr[target]} with right child ${arr[r]}`,
          activeIndices: [target, r],
          type: "step"
        };
        if (compare(arr[r], arr[target], mode)) target = r;
      }

      if (target === i) break;

      yield {
        heap: [...arr],
        operation: "Heapify",
        explanation: `Swapping nodes to restore ${mode === "min" ? "Min" : "Max"} Heap property.`,
        comparison: `Swapping ${arr[i]} and ${arr[target]}`,
        swappingIndices: [i, target],
        activeIndices: [i, target],
        type: "step"
      };

      const temp = arr[i];
      arr[i] = arr[target];
      arr[target] = temp;

      yield {
        heap: [...arr],
        operation: "Heapify",
        explanation: "Partial heap fixed. Continuing down the tree.",
        activeIndices: [target],
        type: "step"
      };

      i = target;
    }
  };

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i -= 1) {
    yield* heapifyDown(i, arr.length);
  }

  yield {
    heap: [...arr],
    operation: "Heapify Complete",
    explanation: `${mode === "min" ? "Min" : "Max"} Heap property restored for entire tree.`,
    type: "complete"
  };
}

export function* insertGenerator(currentHeap, value, mode) {
  const arr = [...currentHeap, value];
  yield {
    heap: [...arr],
    operation: "Insert",
    explanation: `Inserted ${value} at the end of the heap (next available position).`,
    activeIndices: [arr.length - 1],
    type: "start"
  };

  let i = arr.length - 1;
  while (i > 0) {
    const p = parentIndex(i);
    yield {
      heap: [...arr],
      operation: "Heapify Up",
      explanation: "Checking if child violates heap property with its parent.",
      comparison: `Comparing ${arr[i]} with parent ${arr[p]}`,
      activeIndices: [i, p],
      type: "step"
    };

    if (!compare(arr[i], arr[p], mode)) break;

    yield {
      heap: [...arr],
      operation: "Heapify Up",
      explanation: `Swapping nodes to maintain ${mode === "min" ? "Min" : "Max"} Heap property.`,
      comparison: `Swapping ${arr[i]} and ${arr[p]}`,
      swappingIndices: [i, p],
      activeIndices: [i, p],
      type: "step"
    };

    const temp = arr[i];
    arr[i] = arr[p];
    arr[p] = temp;

    yield {
      heap: [...arr],
      operation: "Heapify Up",
      explanation: "Node moved up one level.",
      activeIndices: [p],
      type: "step"
    };

    i = p;
  }

  yield {
    heap: [...arr],
    operation: "Insert Complete",
    explanation: `${value} inserted and heap property is satisfied.`,
    type: "complete"
  };
}

export function* extractRootGenerator(currentHeap, mode) {
  if (currentHeap.length === 0) {
    yield { type: "error", explanation: "Heap is empty. Nothing to extract." };
    return;
  }

  const arr = [...currentHeap];
  const rootLabel = mode === "min" ? "Min" : "Max";
  const rootValue = arr[0];
  
  yield {
    heap: [...arr],
    operation: `Extract ${rootLabel}`,
    explanation: `Removing root value ${rootValue}.`,
    activeIndices: [0],
    type: "start"
  };

  if (arr.length === 1) {
    yield {
      heap: [],
      operation: `Extract ${rootLabel} Complete`,
      explanation: `Extracted ${rootValue}. Heap is now empty.`,
      type: "complete"
    };
    return;
  }

  const last = arr[arr.length - 1];
  arr[0] = last;
  arr.pop();

  yield {
    heap: [...arr],
    operation: "Replace Root",
    explanation: `Replaced root with last node ${last}. Heapify Down begins.`,
    activeIndices: [0],
    type: "step"
  };

  let i = 0;
  while (true) {
    let target = i;
    const l = leftChild(i);
    const r = rightChild(i);

    if (l < arr.length) {
      yield {
        heap: [...arr],
        operation: "Heapify Down",
        explanation: "Comparing root candidate with children.",
        comparison: `Comparing ${arr[target]} with left child ${arr[l]}`,
        activeIndices: [target, l],
        type: "step"
      };
      if (compare(arr[l], arr[target], mode)) target = l;
    }

    if (r < arr.length) {
      yield {
        heap: [...arr],
        operation: "Heapify Down",
        explanation: "Choosing best child according to heap type.",
        comparison: `Comparing ${arr[target]} with right child ${arr[r]}`,
        activeIndices: [target, r],
        type: "step"
      };
      if (compare(arr[r], arr[target], mode)) target = r;
    }

    if (target === i) break;

    yield {
      heap: [...arr],
      operation: "Heapify Down",
      explanation: "Swapping to restore heap property.",
      comparison: `Swapping ${arr[i]} and ${arr[target]}`,
      swappingIndices: [i, target],
      activeIndices: [i, target],
      type: "step"
    };

    const temp = arr[i];
    arr[i] = arr[target];
    arr[target] = temp;

    yield {
      heap: [...arr],
      operation: "Heapify Down",
      explanation: "Continuing down toward leaves.",
      activeIndices: [target],
      type: "step"
    };

    i = target;
  }

  yield {
    heap: [...arr],
    operation: `Extract ${rootLabel} Complete`,
    explanation: `Extracted ${rootValue}. Final heap structure restored.`,
    type: "complete"
  };
}

export function* peekRootGenerator(currentHeap, mode) {
  if (currentHeap.length === 0) {
    yield { type: "error", explanation: "Heap is empty. No root to peek." };
    return;
  }

  yield {
    heap: [...currentHeap],
    operation: "Peek",
    explanation: `Root value is ${currentHeap[0]}.`,
    comparison: `${mode === "min" ? "Min" : "Max"} element always stays at root.`,
    activeIndices: [0],
    type: "complete"
  };
}
