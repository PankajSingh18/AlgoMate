/**
 * Pure generator functions for Two Pointers algorithms.
 * Yields state objects representing pointer positions at each step.
 * No async, no timers — timing and abort are handled by useAlgorithmPlayer.
 */

// ─── 1. Pair Sum (Sorted Array) ───────────────────────────────────────────────
export function* generateStatesPairSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  yield {
    left, right,
    current: `arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]}`,
    best: 'Searching...',
    explanation: `Initialize: left=${left} (${arr[left]}), right=${right} (${arr[right]}). Target: ${target}.`,
    activePointers: [left, right]
  };

  while (left < right) {
    const sum = arr[left] + arr[right];

    yield {
      left, right,
      current: `${arr[left]} + ${arr[right]} = ${sum}`,
      best: `Target: ${target}`,
      explanation: `Checking arr[${left}] + arr[${right}] = ${arr[left]} + ${arr[right]} = ${sum}.`,
      activePointers: [left, right]
    };

    if (sum === target) {
      yield {
        left, right,
        current: `${arr[left]} + ${arr[right]} = ${sum}`,
        best: `Found! Indices [${left}, ${right}]`,
        explanation: `Pair found! arr[${left}] + arr[${right}] = ${sum} equals target ${target}.`,
        activePointers: [left, right],
        success: true,
        done: true
      };
      return;
    } else if (sum < target) {
      yield {
        left, right,
        current: `${sum} < ${target}`,
        best: 'Searching...',
        explanation: `Sum ${sum} < target ${target}. Move left pointer right to increase sum.`,
        activePointers: [left, right],
        movingLeft: true
      };
      left++;
    } else {
      yield {
        left, right,
        current: `${sum} > ${target}`,
        best: 'Searching...',
        explanation: `Sum ${sum} > target ${target}. Move right pointer left to decrease sum.`,
        activePointers: [left, right],
        movingRight: true
      };
      right--;
    }
  }

  yield {
    left, right,
    current: 'No pair found',
    best: 'Not found',
    explanation: `Pointers crossed. No pair with sum ${target} exists in the array.`,
    activePointers: [left, right],
    done: true
  };
}

// ─── 2. Remove Duplicates (Sorted Array) ─────────────────────────────────────
export function* generateStatesRemoveDuplicates(arr) {
  if (arr.length === 0) return;

  let slow = 0;

  yield {
    left: slow, right: 1,
    current: `slow=${slow}, fast=1`,
    best: 'Unique count: 1',
    explanation: `Initialize: slow pointer at index 0 (${arr[0]}). Fast pointer will scan ahead.`,
    activePointers: [slow, 1]
  };

  for (let fast = 1; fast < arr.length; fast++) {
    yield {
      left: slow, right: fast,
      current: `arr[slow]=${arr[slow]}, arr[fast]=${arr[fast]}`,
      best: `Unique count: ${slow + 1}`,
      explanation: `Fast pointer at index ${fast} (${arr[fast]}). Comparing with slow at index ${slow} (${arr[slow]}).`,
      activePointers: [slow, fast]
    };

    if (arr[fast] !== arr[slow]) {
      slow++;
      yield {
        left: slow, right: fast,
        current: `New unique: ${arr[fast]}`,
        best: `Unique count: ${slow + 1}`,
        explanation: `${arr[fast]} != ${arr[slow - 1]}. New unique element! Move slow to ${slow}, copy ${arr[fast]}.`,
        activePointers: [slow, fast],
        success: true
      };
    } else {
      yield {
        left: slow, right: fast,
        current: `Duplicate: ${arr[fast]}`,
        best: `Unique count: ${slow + 1}`,
        explanation: `${arr[fast]} = ${arr[slow]}. Duplicate found. Skip — fast pointer advances.`,
        activePointers: [slow, fast],
        violation: true
      };
    }
  }

  yield {
    left: slow, right: arr.length - 1,
    current: 'Done',
    best: `Unique count: ${slow + 1}`,
    explanation: `Finished. Array has ${slow + 1} unique elements.`,
    activePointers: [slow, arr.length - 1],
    done: true
  };
}

// ─── 3. Container With Most Water ────────────────────────────────────────────
export function* generateStatesContainerWater(arr) {
  let left = 0;
  let right = arr.length - 1;
  let maxWater = 0;

  yield {
    left, right,
    current: `height[${left}]=${arr[left]}, height[${right}]=${arr[right]}`,
    best: 'Max water: 0',
    explanation: `Initialize: left=${left}, right=${right}. Calculate area at each step.`,
    activePointers: [left, right]
  };

  while (left < right) {
    const width = right - left;
    const height = Math.min(arr[left], arr[right]);
    const water = width * height;
    const updated = water > maxWater;
    maxWater = Math.max(maxWater, water);

    yield {
      left, right,
      current: `width=${width} x height=${height} = ${water}`,
      best: `Max water: ${maxWater}`,
      explanation: `Area = min(${arr[left]}, ${arr[right]}) x (${right} - ${left}) = ${height} x ${width} = ${water}.${updated ? ' New maximum!' : ''}`,
      activePointers: [left, right],
      success: updated
    };

    if (arr[left] < arr[right]) {
      yield {
        left, right,
        current: `arr[left]=${arr[left]} < arr[right]=${arr[right]}`,
        best: `Max water: ${maxWater}`,
        explanation: `Left height (${arr[left]}) is smaller. Move left pointer right to find taller line.`,
        activePointers: [left, right],
        movingLeft: true
      };
      left++;
    } else {
      yield {
        left, right,
        current: `arr[right]=${arr[right]} <= arr[left]=${arr[left]}`,
        best: `Max water: ${maxWater}`,
        explanation: `Right height (${arr[right]}) is smaller or equal. Move right pointer left to find taller line.`,
        activePointers: [left, right],
        movingRight: true
      };
      right--;
    }
  }

  yield {
    left, right,
    current: 'Pointers met',
    best: `Max water: ${maxWater}`,
    explanation: `Finished. Maximum water container holds ${maxWater} units.`,
    activePointers: [left, right],
    done: true
  };
}

// ─── 4. Three Sum ────────────────────────────────────────────────────────────
export function* generateStatesThreeSum(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const result = [];

  yield {
    left: 0, right: sorted.length - 1,
    current: `Sorted: [${sorted.join(', ')}]`,
    best: 'Triplets found: 0',
    explanation: `Sort array first: [${sorted.join(', ')}]. Fix one element, use two pointers for the rest.`,
    activePointers: [0, sorted.length - 1],
    fixedIndex: -1
  };

  for (let i = 0; i < sorted.length - 2; i++) {
    if (i > 0 && sorted[i] === sorted[i - 1]) {
      yield {
        left: i + 1, right: sorted.length - 1,
        current: `Skip duplicate: ${sorted[i]}`,
        best: `Triplets: [${result.map(t => `[${t}]`).join(', ')}]`,
        explanation: `sorted[${i}]=${sorted[i]} is duplicate of previous. Skip to avoid duplicate triplets.`,
        activePointers: [i + 1, sorted.length - 1],
        fixedIndex: i,
        violation: true
      };
      continue;
    }

    let left = i + 1;
    let right = sorted.length - 1;

    yield {
      left, right,
      current: `Fixed: ${sorted[i]}`,
      best: `Triplets: ${result.length}`,
      explanation: `Fix sorted[${i}]=${sorted[i]}. Two pointers: left=${left}, right=${right}.`,
      activePointers: [left, right],
      fixedIndex: i
    };

    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];

      yield {
        left, right,
        current: `${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum}`,
        best: `Triplets: ${result.length}`,
        explanation: `Sum = ${sorted[i]} + ${sorted[left]} + ${sorted[right]} = ${sum}. Target: 0.`,
        activePointers: [left, right],
        fixedIndex: i
      };

      if (sum === 0) {
        result.push([sorted[i], sorted[left], sorted[right]]);
        yield {
          left, right,
          current: `Triplet: [${sorted[i]}, ${sorted[left]}, ${sorted[right]}]`,
          best: `Triplets: [${result.map(t => `[${t}]`).join(', ')}]`,
          explanation: `Triplet found: [${sorted[i]}, ${sorted[left]}, ${sorted[right]}]!`,
          activePointers: [left, right],
          fixedIndex: i,
          success: true
        };
        left++;
        right--;
      } else if (sum < 0) {
        yield {
          left, right,
          current: `${sum} < 0`,
          best: `Triplets: ${result.length}`,
          explanation: `Sum ${sum} < 0. Move left pointer right to increase sum.`,
          activePointers: [left, right],
          fixedIndex: i,
          movingLeft: true
        };
        left++;
      } else {
        yield {
          left, right,
          current: `${sum} > 0`,
          best: `Triplets: ${result.length}`,
          explanation: `Sum ${sum} > 0. Move right pointer left to decrease sum.`,
          activePointers: [left, right],
          fixedIndex: i,
          movingRight: true
        };
        right--;
      }
    }
  }

  yield {
    left: 0, right: sorted.length - 1,
    current: 'Done',
    best: `Triplets: [${result.map(t => `[${t}]`).join(', ')}]`,
    explanation: `Finished. Found ${result.length} unique triplet(s) that sum to zero.`,
    activePointers: [0, sorted.length - 1],
    done: true
  };
}