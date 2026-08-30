/**
 * Pure generator function for Counting Sort algorithm.
 * Yields frames representing the state of the sort.
 * No async, no timers — timing and abort are handled by useAlgorithmPlayer.
 *
 * @param {number[]} initialArray - The array to sort.
 * @returns {Generator<{type: string, payload: any}, void, unknown>}
 */
export function* countingSortGenerator(initialArray) {
  const arr = [...initialArray];
  const n = arr.length;
  if (n === 0) return;

  const maxVal = Math.max(...arr);
  const count = new Array(maxVal + 1).fill(0);
  const result = new Array(n).fill(null);

  let comparisons = 0;
  let swaps = 0;
  let step = 0;
  const totalSteps = n + maxVal + 1 + n;

  yield {
    type: 'init',
    payload: { arr: [...arr], count: [...count], result: [...result], totalSteps }
  };

  yield {
    type: 'counting_start',
    payload: { arr: [...arr], count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
  };

  for (let i = 0; i < n; i++) {
    const value = arr[i];
    comparisons++;
    step++;

    yield {
      type: 'counting',
      payload: { arr: [...arr], value, current: i, countIndex: value, count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
    };

    count[value] += 1;

    yield {
      type: 'counted',
      payload: { arr: [...arr], value, current: i, countIndex: value, count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
    };
  }

  yield {
    type: 'prefix_start',
    payload: { arr: [...arr], count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
  };

  for (let i = 1; i < count.length; i++) {
    step++;

    yield {
      type: 'prefix',
      payload: { arr: [...arr], value: i, countIndex: i, count: [...count], prevTotal: count[i - 1], result: [...result], comparisons, swaps, step, totalSteps }
    };

    count[i] += count[i - 1];

    yield {
      type: 'prefixed',
      payload: { arr: [...arr], value: i, countIndex: i, count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
    };
  }

  yield {
    type: 'placement_start',
    payload: { arr: [...arr], count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
  };

  for (let i = n - 1; i >= 0; i--) {
    const value = arr[i];
    const position = count[value] - 1;
    step++;

    yield {
      type: 'placement',
      payload: { arr: [...arr], value, current: i, countIndex: value, position, count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
    };

    result[position] = value;
    count[value] -= 1;
    swaps++;

    yield {
      type: 'placed',
      payload: { arr: [...arr], value, current: i, countIndex: value, outputIndex: position, count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
    };
  }

  yield {
    type: 'completed',
    payload: { arr: [...result], count: [...count], result: [...result], comparisons, swaps, step, totalSteps }
  };
}