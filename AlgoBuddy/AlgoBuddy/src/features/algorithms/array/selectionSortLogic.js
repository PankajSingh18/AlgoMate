/**
 * Pure generator function for Selection Sort algorithm.
 * Yields frames representing the state of the sort.
 * No async, no timers — timing and abort are handled by useAlgorithmPlayer.
 *
 * @param {number[]} initialArray - The array to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* selectionSortGenerator(initialArray) {
  const arr = [...initialArray];
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
    let minIndex = i;

    yield {
      type: 'phase_start',
      payload: { pass: i + 1, totalPasses: n - 1, i, minIndex }
    };

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      step++;

      yield {
        type: 'comparing',
        payload: { i, j, minIndex, arr: [...arr], comparisons, swaps, step, totalSteps }
      };

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        yield {
          type: 'new_min',
          payload: { i, j, minIndex, arr: [...arr], comparisons, swaps, step, totalSteps }
        };
      }
    }

    if (minIndex !== i) {
      yield {
        type: 'swap_needed',
        payload: { i, minIndex, arr: [...arr], comparisons, swaps, step, totalSteps }
      };

      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      swaps++;

      yield {
        type: 'swapped',
        payload: { i, minIndex, arr: [...arr], comparisons, swaps, step, totalSteps }
      };
    } else {
      yield {
        type: 'no_swap',
        payload: { i, minIndex, arr: [...arr], comparisons, swaps, step, totalSteps }
      };
    }
  }

  yield { type: 'completed', payload: { arr, comparisons, swaps } };
}