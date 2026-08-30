const cloneArray = (array) => array.slice();

const createStep = (array, step) => ({
  ...step,
  arraySnapshot: cloneArray(array),
});

const compareParentValues = (childValue, parentValue, isMinHeap) => {
  return isMinHeap ? childValue < parentValue : childValue > parentValue;
};

const compareChildValues = (currentValue, childValue, isMinHeap) => {
  return isMinHeap ? childValue < currentValue : childValue > currentValue;
};

const chooseChildIndex = (array, currentIndex, isMinHeap) => {
  const leftIndex = currentIndex * 2;
  const rightIndex = leftIndex + 1;
  const hasLeft = leftIndex < array.length && array[leftIndex] !== undefined;
  const hasRight = rightIndex < array.length && array[rightIndex] !== undefined;

  if (!hasLeft) return null;
  if (!hasRight) return leftIndex;

  return compareChildValues(array[leftIndex], array[rightIndex], isMinHeap) ? rightIndex : leftIndex;
};

const heapifyUp = (array, index, isMinHeap, steps) => {
  let currentIndex = index;

  while (currentIndex > 1) {
    const parentIndex = Math.floor(currentIndex / 2);
    const currentValue = array[currentIndex];
    const parentValue = array[parentIndex];

    steps.push(
      createStep(array, {
        currentNode: currentIndex,
        visited: [parentIndex, currentIndex],
        explanation: `Compare element ${currentValue} with its parent ${parentValue}.`,
        codeLine: 2,
        stepType: "compare-parent",
        highlightedIndices: [parentIndex, currentIndex],
        highlightedNodes: {
          [parentIndex]: "comparing",
          [currentIndex]: "comparing",
        },
      })
    );

    if (!compareParentValues(currentValue, parentValue, isMinHeap)) {
      break;
    }

    const temp = array[currentIndex];
    array[currentIndex] = array[parentIndex];
    array[parentIndex] = temp;

    steps.push(
      createStep(array, {
        currentNode: parentIndex,
        visited: [parentIndex, currentIndex],
        explanation: `Swap ${array[currentIndex]} with parent ${array[parentIndex]} to restore heap order.`,
        codeLine: 3,
        stepType: "swap-up",
        highlightedIndices: [parentIndex, currentIndex],
        highlightedNodes: {
          [parentIndex]: "swapping",
          [currentIndex]: "swapping",
        },
      })
    );

    currentIndex = parentIndex;
  }

  steps.push(
    createStep(array, {
      currentNode: currentIndex,
      visited: [currentIndex],
      explanation: `Heapify-up complete. Element settled at index ${currentIndex}.`,
      codeLine: 4,
      stepType: "heapify-up-done",
      highlightedIndices: [currentIndex],
      highlightedNodes: {
        [currentIndex]: "done",
      },
    })
  );

  return array;
};

const heapifyDown = (array, index, isMinHeap, steps) => {
  let currentIndex = index;
  const totalNodes = array.length - 1;

  while (true) {
    const leftIndex = currentIndex * 2;
    const rightIndex = leftIndex + 1;
    if (leftIndex > totalNodes) break;

    const childIndex = chooseChildIndex(array, currentIndex, isMinHeap);
    const highlighted = [currentIndex];
    if (leftIndex <= totalNodes) highlighted.push(leftIndex);
    if (rightIndex <= totalNodes) highlighted.push(rightIndex);

    steps.push(
      createStep(array, {
        currentNode: currentIndex,
        visited: highlighted,
        explanation: childIndex
          ? `Compare element ${array[currentIndex]} with its child ${array[childIndex]}.`
          : `Compare element ${array[currentIndex]} with its only child ${array[leftIndex]}.`,
        codeLine: 3,
        stepType: "compare-children",
        highlightedIndices: highlighted,
        highlightedNodes: highlighted.reduce((acc, heapIndex) => {
          acc[heapIndex] = "comparing";
          return acc;
        }, {}),
      })
    );

    if (childIndex == null) break;

    const shouldSwap = compareChildValues(array[currentIndex], array[childIndex], isMinHeap);
    if (!shouldSwap) break;

    const temp = array[currentIndex];
    array[currentIndex] = array[childIndex];
    array[childIndex] = temp;

    steps.push(
      createStep(array, {
        currentNode: childIndex,
        visited: [currentIndex, childIndex],
        explanation: `Swap ${array[currentIndex]} with child ${array[childIndex]} to restore heap order.`,
        codeLine: 4,
        stepType: "swap-down",
        highlightedIndices: [currentIndex, childIndex],
        highlightedNodes: {
          [currentIndex]: "swapping",
          [childIndex]: "swapping",
        },
      })
    );

    currentIndex = childIndex;
  }

  steps.push(
    createStep(array, {
      currentNode: currentIndex,
      visited: [currentIndex],
      explanation: `Heapify-down complete. Element settled at index ${currentIndex}.`,
      codeLine: 5,
      stepType: "heapify-down-done",
      highlightedIndices: [currentIndex],
      highlightedNodes: {
        [currentIndex]: "done",
      },
    })
  );

  return array;
};

export const heapIndexToTreeCoords = (heapArray, totalNodes, svgWidth) => {
  const coords = [];
  const maxIndex = Math.min(totalNodes, heapArray.length - 1);

  const traverse = (index, x, y, level, parentIndex) => {
    if (index > maxIndex || heapArray[index] === undefined || heapArray[index] === null) return;

    coords.push({
      index,
      value: heapArray[index],
      x,
      y,
      parentIndex,
    });

    const xOffset = 260 / Math.pow(2, level);
    const yOffset = 80;

    const leftIndex = index * 2;
    const rightIndex = leftIndex + 1;

    if (leftIndex <= maxIndex) {
      traverse(leftIndex, x - xOffset, y + yOffset, level + 1, index);
    }

    if (rightIndex <= maxIndex) {
      traverse(rightIndex, x + xOffset, y + yOffset, level + 1, index);
    }
  };

  if (maxIndex >= 1) {
    traverse(1, svgWidth / 2, 60, 0, null);
  }

  return coords;
};

export const insertHeap = (array, value, isMinHeap, steps = []) => {
  const nextArray = cloneArray(array.length ? array : [null]);
  if (nextArray[0] !== null) nextArray.unshift(null);
  nextArray.push(value);

  const insertIndex = nextArray.length - 1;
  steps.push(
    createStep(nextArray, {
      currentNode: insertIndex,
      visited: [insertIndex],
      explanation: `Placed ${value} at the end of the heap array.`,
      codeLine: 1,
      stepType: "insert-end",
      highlightedIndices: [insertIndex],
      highlightedNodes: {
        [insertIndex]: "inserted",
      },
    })
  );

  heapifyUp(nextArray, insertIndex, isMinHeap, steps);
  return { array: nextArray, steps };
};

export const extractRoot = (array, isMinHeap, steps = []) => {
  const nextArray = cloneArray(array.length ? array : [null]);
  if (nextArray.length <= 1) {
    return { extractedValue: null, array: [null], steps };
  }

  const extractedValue = nextArray[1];
  steps.push(
    createStep(nextArray, {
      currentNode: 1,
      visited: [1],
      explanation: `Extract the root value ${extractedValue} from the heap.`,
      codeLine: 1,
      stepType: "extract-root",
      highlightedIndices: [1],
      highlightedNodes: {
        [1]: "extracted",
      },
    })
  );

  if (nextArray.length === 2) {
    nextArray.pop();
    return { extractedValue, array: nextArray, steps };
  }

  const lastValue = nextArray.pop();
  nextArray[1] = lastValue;

  steps.push(
    createStep(nextArray, {
      currentNode: 1,
      visited: [1],
      explanation: `Move last element ${lastValue} to the root position.`,
      codeLine: 2,
      stepType: "move-last-to-root",
      highlightedIndices: [1],
      highlightedNodes: {
        [1]: "swapping",
      },
    })
  );

  heapifyDown(nextArray, 1, isMinHeap, steps);
  return { extractedValue, array: nextArray, steps };
};

export const buildHeap = (inputArray, isMinHeap, steps = []) => {
  const nextArray = [null, ...inputArray];

  steps.push(
    createStep(nextArray, {
      currentNode: inputArray.length > 0 ? 1 : null,
      visited: [],
      explanation: `Render the initial unsorted array as a complete binary tree.`,
      codeLine: 1,
      stepType: "build-heap-start",
      highlightedIndices: [],
      highlightedNodes: {},
    })
  );

  for (let i = Math.floor((nextArray.length - 1) / 2); i >= 1; i -= 1) {
    steps.push(
      createStep(nextArray, {
        currentNode: i,
        visited: [i],
        explanation: `Heapify down from index ${i} during Floyd's build-heap algorithm.`,
        codeLine: 2,
        stepType: "build-heap-step",
        highlightedIndices: [i],
        highlightedNodes: {
          [i]: "comparing",
        },
      })
    );
    heapifyDown(nextArray, i, isMinHeap, steps);
  }

  return { array: nextArray, steps };
};
