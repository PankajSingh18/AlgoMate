/**
 * Pure generator functions for various Sliding Window algorithms.
 * Yields state objects representing the window at each step.
 * No async, no timers — timing and abort are handled by useAlgorithmPlayer.
 */

// ─── 1. Fixed Window — Maximum Sum ───────────────────────────────────────────
export function* generateStatesFixedMax(arr, k) {
  let maxSum = -Infinity;
  let windowSum = 0;

  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
    yield {
      left: 0, right: i,
      current: windowSum,
      best: maxSum === -Infinity ? 'None' : maxSum,
      explanation: `Expanding initial window: Adding ${arr[i]} at index ${i}. Current sum: ${windowSum}.`,
      activeWindow: [0, i]
    };
  }

  maxSum = windowSum;
  yield {
    left: 0, right: k - 1,
    current: windowSum,
    best: maxSum,
    explanation: `Initial window of size ${k} complete. Best sum so far: ${maxSum}.`,
    activeWindow: [0, k - 1]
  };

  for (let i = k; i < arr.length; i++) {
    const leftIdx = i - k;
    yield {
      left: leftIdx, right: i,
      current: windowSum,
      best: maxSum,
      explanation: `Sliding window forward. Preparing to remove ${arr[leftIdx]} and add ${arr[i]}.`,
      activeWindow: [leftIdx, i]
    };

    windowSum = windowSum - arr[leftIdx] + arr[i];
    const updated = windowSum > maxSum;
    maxSum = Math.max(maxSum, windowSum);

    yield {
      left: leftIdx + 1, right: i,
      current: windowSum,
      best: maxSum,
      explanation: `Slid window: Removed ${arr[leftIdx]}, Added ${arr[i]}. New sum: ${windowSum}.${updated ? ' New maximum found!' : ''}`,
      activeWindow: [leftIdx + 1, i]
    };
  }

  yield {
    left: arr.length - k, right: arr.length - 1,
    current: windowSum,
    best: maxSum,
    explanation: `Finished. Maximum sum of subarray of size ${k} is ${maxSum}.`,
    activeWindow: [arr.length - k, arr.length - 1],
    done: true
  };
}

// ─── 2. Fixed Window — Average ────────────────────────────────────────────────
export function* generateStatesFixedAvg(arr, k) {
  const result = [];
  let windowSum = 0;

  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
    yield {
      left: 0, right: i,
      current: (windowSum / (i + 1)).toFixed(2),
      best: 'N/A',
      explanation: `Expanding initial window: Adding ${arr[i]}. Current sum: ${windowSum}.`,
      activeWindow: [0, i]
    };
  }

  result.push((windowSum / k).toFixed(2));
  yield {
    left: 0, right: k - 1,
    current: (windowSum / k).toFixed(2),
    best: `Averages: [${result.join(', ')}]`,
    explanation: `Initial window complete. First average: ${(windowSum / k).toFixed(2)}.`,
    activeWindow: [0, k - 1]
  };

  for (let i = k; i < arr.length; i++) {
    const leftIdx = i - k;
    windowSum = windowSum - arr[leftIdx] + arr[i];
    result.push((windowSum / k).toFixed(2));

    yield {
      left: leftIdx + 1, right: i,
      current: (windowSum / k).toFixed(2),
      best: `Averages: [${result.join(', ')}]`,
      explanation: `Slid window: Removed ${arr[leftIdx]}, Added ${arr[i]}. New average: ${(windowSum / k).toFixed(2)}.`,
      activeWindow: [leftIdx + 1, i]
    };
  }

  yield {
    left: arr.length - k, right: arr.length - 1,
    current: (windowSum / k).toFixed(2),
    best: `Averages: [${result.join(', ')}]`,
    explanation: `Finished calculating all averages of subarrays of size ${k}.`,
    activeWindow: [arr.length - k, arr.length - 1],
    done: true
  };
}

// ─── 3. Variable Window — Longest Substring Without Repeating Characters ─────
export function* generateStatesVarLongestSub(s) {
  const charSet = new Set();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    yield {
      left, right,
      current: Array.from(charSet).join(''),
      best: maxLength,
      explanation: `Right pointer at '${s[right]}'. Checking if it's already in the window.`,
      activeWindow: [left, right]
    };

    while (charSet.has(s[right])) {
      yield {
        left, right,
        current: Array.from(charSet).join(''),
        best: maxLength,
        explanation: `Duplicate '${s[right]}' found! Shrinking window from left to remove '${s[left]}'.`,
        activeWindow: [left, right],
        violation: true
      };
      charSet.delete(s[left]);
      left++;
    }

    charSet.add(s[right]);
    const updated = (right - left + 1) > maxLength;
    maxLength = Math.max(maxLength, right - left + 1);

    yield {
      left, right,
      current: s.substring(left, right + 1),
      best: maxLength,
      explanation: `Added '${s[right]}' to window. Current valid substring: "${s.substring(left, right + 1)}".${updated ? ' New max length!' : ''}`,
      activeWindow: [left, right]
    };
  }

  yield {
    left, right: s.length - 1,
    current: s.substring(left, s.length),
    best: maxLength,
    explanation: `Finished processing. Longest substring without repeating characters has length ${maxLength}.`,
    activeWindow: [left, s.length - 1],
    done: true
  };
}

// ─── 4. Variable Window — Smallest Subarray with Sum >= Target ────────────────
export function* generateStatesVarSmallestSub(arr, target) {
  let left = 0;
  let windowSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < arr.length; right++) {
    windowSum += arr[right];

    yield {
      left, right,
      current: windowSum,
      best: minLength === Infinity ? 'None' : minLength,
      explanation: `Expanding right pointer: Added ${arr[right]}. Current sum: ${windowSum}.`,
      activeWindow: [left, right]
    };

    while (windowSum >= target) {
      const updated = (right - left + 1) < minLength;
      minLength = Math.min(minLength, right - left + 1);

      yield {
        left, right,
        current: windowSum,
        best: minLength,
        explanation: `Sum ${windowSum} >= target ${target}!${updated ? ' New minimum length found!' : ''} Shrinking from left to find smaller valid window.`,
        activeWindow: [left, right],
        success: true
      };

      windowSum -= arr[left];
      left++;

      if (left <= right) {
        yield {
          left, right,
          current: windowSum,
          best: minLength,
          explanation: `Shrunk window: removed ${arr[left - 1]}. New sum: ${windowSum}.`,
          activeWindow: [left, right]
        };
      }
    }
  }

  yield {
    left, right: arr.length - 1,
    current: windowSum,
    best: minLength === Infinity ? 0 : minLength,
    explanation: `Finished. Smallest subarray with sum >= ${target} has length ${minLength === Infinity ? 0 : minLength}.`,
    activeWindow: [Math.max(0, left - 1), arr.length - 1],
    done: true
  };
}