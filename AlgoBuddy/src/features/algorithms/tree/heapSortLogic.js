/**
 * Pure generator function for Heap Sort.
 * Yields frames representing the state of the sort.
 */
export function* heapSortGenerator(initialArray) {
  const n = initialArray.length;
  const arr = [...initialArray];
  const sorted = [];

  const pushStep = (msg, currentArr, active, currentSorted, hs) => {
    return {
      message: msg,
      array: [...currentArr],
      activeIndices: [...active],
      sortedIndices: [...currentSorted],
      heapSize: hs,
    };
  };

  yield pushStep("Phase 1: Build Max-Heap", arr, [], [], n);

  const heapify = function* (arr, size, i, sortedList, hs) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    yield pushStep(`Checking node ${arr[i]} at index ${i}`, arr, [i], sortedList, hs);

    if (left < size) {
      yield pushStep(`Comparing ${arr[largest]} with left child ${arr[left]}`, arr, [i, left], sortedList, hs);
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      yield pushStep(`Comparing ${arr[largest]} with right child ${arr[right]}`, arr, [largest, right], sortedList, hs);
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      yield pushStep(`Swapping ${arr[i]} and ${arr[largest]}`, arr, [i, largest], sortedList, hs);
      
      const temp = arr[i];
      arr[i] = arr[largest];
      arr[largest] = temp;
      
      yield pushStep(`Swapped`, arr, [i, largest], sortedList, hs);
      yield* heapify(arr, size, largest, sortedList, hs);
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(arr, n, i, sorted, n);
  }

  yield pushStep("Max-Heap built successfully!", arr, [], [], n);
  yield pushStep("Phase 2: Extract max and shrink heap", arr, [], [], n);

  for (let i = n - 1; i > 0; i--) {
    yield pushStep(`Swapping root (Max: ${arr[0]}) with last heap element ${arr[i]}`, arr, [0, i], sorted, i + 1);

    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    sorted.push(i);
    yield pushStep(`Element ${arr[i]} is now in its sorted position.`, arr, [], sorted, i);

    yield* heapify(arr, i, 0, sorted, i);
  }
  
  sorted.push(0);
  yield pushStep("Heap Sort complete!", arr, [], sorted, 0);
}
