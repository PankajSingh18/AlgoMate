export function* radixSortGenerator(initialArray) {
  let arr = [...initialArray];

  if (arr.length === 0) return;

  const getDigit = (num, place) =>
    Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;

  const digitCount = (num) =>
    num === 0 ? 1 : Math.floor(Math.log10(Math.abs(num))) + 1;

  const mostDigits = (nums) =>
    Math.max(...nums.map(digitCount));

  const maxDigits = mostDigits(arr);

  let comparisons = 0;
  let swaps = 0;
  let step = 0;
  const totalSteps = arr.length * maxDigits;

  yield {
    type: "init",
    payload: {
      arr: [...arr],
      digit: 0,
      comparisons,
      swaps,
      step,
      totalSteps,
    },
  };

  for (let k = 0; k < maxDigits; k++) {
    yield {
      type: "digit_start",
      payload: {
        arr: [...arr],
        digit: k,
        comparisons,
        swaps,
        step,
        totalSteps,
      },
    };

    const buckets = Array.from({ length: 10 }, () => []);

    for (let i = 0; i < arr.length; i++) {
      const digit = getDigit(arr[i], k);

      comparisons++;
      step++;

      yield {
        type: "placing",
        payload: {
          arr: [...arr],
          current: i,
          digit,
          digitPlace: k,
          comparisons,
          swaps,
          step,
          totalSteps,
        },
      };

      buckets[digit].push(arr[i]);
    }

    arr = [].concat(...buckets);

    swaps += arr.length;

    yield {
      type: "digit_complete",
      payload: {
        arr: [...arr],
        digitPlace: k,
        comparisons,
        swaps,
        step,
        totalSteps,
      },
    };
  }

  yield {
    type: "completed",
    payload: {
      arr: [...arr],
      comparisons,
      swaps,
      step,
      totalSteps,
    },
  };
}