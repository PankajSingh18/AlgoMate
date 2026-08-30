/**
 * Pure generator function for Linear Search algorithm.
 * Yields frames representing the state of the search.
 * No async, no timers — timing and abort are handled by useAlgorithmPlayer.
 *
 * @param {number[]} arr - The array to search through.
 * @param {number} targetValue - The value to search for.
 * @returns {Generator<{type: string, index?: number}, void, unknown>}
 */
export function* linearSearchGenerator(arr, targetValue) {
  for (let index = 0; index < arr.length; index++) {
    yield { type: 'checking', index };

    if (arr[index] === targetValue) {
      yield { type: 'found', index };
      return;
    }
  }

  yield { type: 'not_found' };
}