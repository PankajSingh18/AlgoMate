/**
 * Pure generator function for Insertion Sort algorithm.
 * Yields frames representing the state of the sort.
 * No async, no timers — timing and abort are handled by useAlgorithmPlayer.
 *
 * @param {number[]} initialArray - The array to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* insertionSortGenerator(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let shifts = 0;
  let step = 0;
  const totalSteps = Math.floor((n * (n - 1)) / 2);

  yield {
    type: 'init',
    payload: { totalSteps }
  };

  for (let i = 1; i < n; i++) {
    const current = arr[i];
    let j = i - 1;

    yield {
      type: 'phase_start',
      payload: { pass: i, totalPasses: n - 1, i, j, current, arr: [...arr] }
    };

    while (j >= 0) {
      comparisons++;
      step++;

      yield {
        type: 'comparing',
        payload: { i, j, current, arr: [...arr], comparisons, shifts, step, totalSteps }
      };

      if (arr[j] > current) {
        arr[j + 1] = arr[j];
        shifts++;

        yield {
          type: 'shifting',
          payload: { i, j, current, arr: [...arr], comparisons, shifts, step, totalSteps }
        };

        j--;
      } else {
        break;
      }
    }

    yield {
      type: 'found_insertion_point',
      payload: { i, j, current, arr: [...arr], comparisons, shifts, step, totalSteps }
    };

    arr[j + 1] = current;

    yield {
      type: 'inserted',
      payload: { i, j, current, arr: [...arr], comparisons, shifts, step, totalSteps }
    };
  }

  yield { type: 'completed', payload: { arr, comparisons, shifts } };
}