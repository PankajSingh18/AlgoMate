/**
 * Pure generator function for Bubble Sort algorithm.
 * Yields frames representing the state of the sort.
 * No async, no timers — this is deliberately pure.
 * The caller (useAlgorithmPlayer) owns all timing and abort logic.
 *
 * @param {number[]} initialArray - The array to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* bubbleSortGenerator(initialArray) {
  let arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let step = 0;
  const totalSteps = Math.floor((n * (n - 1)) / 2);

  yield {
    type: 'init',
    payload: { totalSteps }
  };

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    yield {
      type: 'phase_start',
      payload: { pass: i + 1, totalPasses: n - 1 }
    };

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      step++;

      yield {
        type: 'comparing',
        payload: { j, jNext: j + 1, arr: [...arr], comparisons, swaps, step, totalSteps }
      };

      if (arr[j] > arr[j + 1]) {
        yield {
          type: 'swap_needed',
          payload: { j, jNext: j + 1, arr: [...arr], comparisons, swaps, step, totalSteps }
        };

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        swaps++;

        yield {
          type: 'swapped',
          payload: { j, jNext: j + 1, arr: [...arr], comparisons, swaps, step, totalSteps }
        };
      } else {
        yield {
          type: 'no_swap',
          payload: { j, jNext: j + 1, arr: [...arr], comparisons, swaps, step, totalSteps }
        };
      }
    }

    // Mark this pass's last element as fully sorted
    yield {
      type: 'sorted_element',
      payload: { index: n - 1 - i, arr: [...arr] }
    };

    if (!swapped) {
      yield { type: 'early_completion' };
      break;
    }
  }

  yield { type: 'completed', payload: { arr, comparisons, swaps } };
}