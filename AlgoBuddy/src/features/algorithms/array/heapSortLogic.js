/**
 * Pure generator function for Heap Sort algorithm.
 * Yields frames representing the state of the sort.
 * No async, no timers — timing and abort are handled by useAlgorithmPlayer.
 *
 * @param {number[]} initialArray - The array to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* heapSortGenerator(initialArray) {
  const arr = [...initialArray];
  let comparisons = 0;
  let swaps = 0;
  const sorted = [];

  const yieldStep = (params) => ({
    type: 'step',
    payload: {
      array: [...arr],
      activeIndices: params.activeIndices || [],
      compareIndices: params.compareIndices || [],
      swapIndices: params.swapIndices || [],
      sortedIndices: [...sorted],
      heapSize: params.heapSize !== undefined ? params.heapSize : arr.length,
      phase: params.phase,
      message: params.message,
      comparisons,
      swaps,
    }
  });

  function* heapify(heapSize, rootIndex, phase) {
    let largest = rootIndex;
    const left = 2 * rootIndex + 1;
    const right = 2 * rootIndex + 2;

    yield yieldStep({
      phase,
      message: `Heapify index ${rootIndex}; assume ${arr[rootIndex]} is largest.`,
      activeIndices: [rootIndex],
      heapSize,
    });

    if (left < heapSize) {
      comparisons++;
      yield yieldStep({
        phase,
        message: `Compare parent ${arr[largest]} with left child ${arr[left]}.`,
        activeIndices: [rootIndex],
        compareIndices: [largest, left],
        heapSize,
      });
      if (arr[left] > arr[largest]) {
        largest = left;
        yield yieldStep({
          phase,
          message: `Left child ${arr[left]} becomes the largest candidate.`,
          activeIndices: [largest],
          heapSize,
        });
      }
    }

    if (right < heapSize) {
      comparisons++;
      yield yieldStep({
        phase,
        message: `Compare current largest ${arr[largest]} with right child ${arr[right]}.`,
        activeIndices: [rootIndex],
        compareIndices: [largest, right],
        heapSize,
      });
      if (arr[right] > arr[largest]) {
        largest = right;
        yield yieldStep({
          phase,
          message: `Right child ${arr[right]} becomes the largest candidate.`,
          activeIndices: [largest],
          heapSize,
        });
      }
    }

    if (largest !== rootIndex) {
      yield yieldStep({
        phase,
        message: `Swap ${arr[rootIndex]} with ${arr[largest]} to restore the heap property.`,
        swapIndices: [rootIndex, largest],
        heapSize,
      });

      const temp = arr[rootIndex];
      arr[rootIndex] = arr[largest];
      arr[largest] = temp;
      swaps++;

      yield yieldStep({
        phase,
        message: `Continue heapifying the affected subtree at index ${largest}.`,
        activeIndices: [largest],
        swapIndices: [rootIndex, largest],
        heapSize,
      });

      yield* heapify(heapSize, largest, phase);
    } else {
      yield yieldStep({
        phase,
        message: `Subtree rooted at index ${rootIndex} already satisfies the max-heap rule.`,
        activeIndices: [rootIndex],
        heapSize,
      });
    }
  }

  yield yieldStep({
    phase: 'Ready',
    message: 'Start by treating the array as a complete binary tree.',
  });

  yield yieldStep({
    phase: 'Build Max-Heap',
    message: 'Build the max-heap from the last non-leaf node upward.',
  });

  for (let index = Math.floor(arr.length / 2) - 1; index >= 0; index--) {
    yield yieldStep({
      phase: 'Build Max-Heap',
      message: `Heapify subtree rooted at index ${index}.`,
      activeIndices: [index],
    });
    yield* heapify(arr.length, index, 'Build Max-Heap');
  }

  yield yieldStep({
    phase: 'Extract Max',
    message: 'The max-heap is ready. Repeatedly move the root to the sorted region.',
  });

  for (let end = arr.length - 1; end > 0; end--) {
    yield yieldStep({
      phase: 'Extract Max',
      message: `Swap max ${arr[0]} with the last heap value ${arr[end]}.`,
      swapIndices: [0, end],
      heapSize: end + 1,
    });

    const temp = arr[0];
    arr[0] = arr[end];
    arr[end] = temp;
    swaps++;
    sorted.push(end);

    yield yieldStep({
      phase: 'Extract Max',
      message: `${arr[end]} is fixed at index ${end}; shrink the heap.`,
      activeIndices: [end],
      sortedIndices: [...sorted],
      heapSize: end,
    });

    yield* heapify(end, 0, 'Heapify Reduced Heap');
  }

  sorted.push(0);
  yield yieldStep({
    phase: 'Complete',
    message: 'Heap Sort complete. Every value is in ascending order.',
    sortedIndices: [...sorted],
    heapSize: 0,
  });
}