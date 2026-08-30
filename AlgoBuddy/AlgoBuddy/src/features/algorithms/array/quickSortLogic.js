/**
 * Pure generator function for Quick Sort algorithm.
 * Yields frames representing the state of the sort.
 * No async, no timers — timing and abort are handled by useAlgorithmPlayer.
 *
 * @param {number[]} initialArray - The array to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* quickSortGenerator(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let step = 0;
  const totalSteps = Math.floor((n * (n - 1)) / 2);

  const stack = [];
  stack.push({ low: 0, high: arr.length - 1 });
  let partitions = [];

  yield { type: 'init', payload: { totalSteps } };

  while (stack.length > 0) {
    const { low, high } = stack.pop();

    if (low < high) {
      partitions.push({ low, high });

      yield {
        type: 'partition_start',
        payload: { low, high, stack: [...stack], partitions: [...partitions], arr: [...arr] }
      };

      const pivot = arr[high];
      let i = low - 1;

      yield {
        type: 'pivot_chosen',
        payload: { pivot, low, high, left: low, right: high - 1, stack: [...stack], partitions: [...partitions], arr: [...arr] }
      };

      for (let j = low; j < high; j++) {
        comparisons++;
        step++;

        yield {
          type: 'comparing',
          payload: { j, i, pivot, low, high, stack: [...stack], partitions: [...partitions], arr: [...arr], comparisons, swaps, step, totalSteps }
        };

        if (arr[j] < pivot) {
          i++;

          yield {
            type: 'swap_needed',
            payload: { i, j, pivot, low, high, stack: [...stack], partitions: [...partitions], arr: [...arr], comparisons, swaps, step, totalSteps }
          };

          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;

          yield {
            type: 'swapped',
            payload: { i, j, pivot, low, high, stack: [...stack], partitions: [...partitions], arr: [...arr], comparisons, swaps, step, totalSteps }
          };
        } else {
          yield {
            type: 'no_swap',
            payload: { j, i, pivot, low, high, stack: [...stack], partitions: [...partitions], arr: [...arr], comparisons, swaps, step, totalSteps }
          };
        }
      }

      yield {
        type: 'pivot_swap_needed',
        payload: { i: i + 1, high, pivot, low, stack: [...stack], partitions: [...partitions], arr: [...arr], comparisons, swaps, step, totalSteps }
      };

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      swaps++;

      yield {
        type: 'pivot_swapped',
        payload: { i: i + 1, high, pivot, low, stack: [...stack], partitions: [...partitions], arr: [...arr], comparisons, swaps, step, totalSteps }
      };

      const pi = i + 1;

      yield {
        type: 'partition_completed',
        payload: { pi, stack: [...stack], partitions: [...partitions], arr: [...arr] }
      };

      stack.push({ low: pi + 1, high });
      stack.push({ low, high: pi - 1 });

      partitions = partitions.filter((p) => !(p.low === low && p.high === high));

      yield {
        type: 'stack_updated',
        payload: { stack: [...stack], partitions: [...partitions], arr: [...arr] }
      };
    }
  }

  yield { type: 'completed', payload: { arr, comparisons, swaps } };
}