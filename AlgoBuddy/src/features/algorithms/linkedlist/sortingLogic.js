export function* sortingGenerator(list) {
  if (list.length === 0) return;

  const nodes = list.map((node) => ({ ...node }));

  yield {
    phase: "start",
    list: [...nodes],
    leftRange: null,
    rightRange: null,
    currentIndex: -1,
    compareIndex: -1,
    explanation: "Starting Merge Sort."
  };

  function* mergeSort(arr, start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    yield {
      phase: "split",
      list: [...nodes],
      leftRange: [start, mid],
      rightRange: [mid + 1, end],
      currentIndex: -1,
      compareIndex: -1,
      explanation: `Splitting range ${start}-${end} into ${start}-${mid} and ${mid + 1}-${end}.`
    };

    yield* mergeSort(arr, start, mid);
    yield* mergeSort(arr, mid + 1, end);

    const temp = [];
    let i = start;
    let j = mid + 1;

    while (i <= mid && j <= end) {
      yield {
        phase: "compare",
        list: [...nodes],
        leftRange: [start, mid],
        rightRange: [mid + 1, end],
        currentIndex: i,
        compareIndex: j,
        explanation: `Comparing ${arr[i].value} (left half) and ${arr[j].value} (right half).`
      };

      if (arr[i].value <= arr[j].value) {
        temp.push(arr[i]);
        i++;
      } else {
        temp.push(arr[j]);
        j++;
      }
    }

    while (i <= mid) {
      temp.push(arr[i]);
      i++;
    }

    while (j <= end) {
      temp.push(arr[j]);
      j++;
    }

    for (let k = 0; k < temp.length; k++) {
      arr[start + k] = temp[k];
      nodes[start + k] = temp[k];
    }

    yield {
      phase: "merge",
      list: [...nodes],
      leftRange: [start, mid],
      rightRange: [mid + 1, end],
      currentIndex: -1,
      compareIndex: -1,
      explanation: `Merged elements from index ${start} to ${end} into sorted order.`
    };
  }

  yield* mergeSort(nodes, 0, nodes.length - 1);

  yield {
    phase: "complete",
    list: [...nodes],
    leftRange: null,
    rightRange: null,
    currentIndex: -1,
    compareIndex: -1,
    explanation: "Merge Sort complete. List is now fully sorted."
  };
}