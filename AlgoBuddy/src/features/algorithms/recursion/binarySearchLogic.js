export function* generateBinarySearchFrames(arr, target) {
  const stack = [];
  let frameIdCounter = 0;

  function* run(low, high, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "binarySearch",
      low,
      high,
      mid: null,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid: null,
      activeLine: 1,
      description: `Calling binarySearch(low = ${low}, high = ${high}). Pushing new stack frame.`,
      activeFrameId: myId,
    };

    // Check base case: low > high
    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid: null,
      activeLine: 2,
      description: `Checking base case: low (${low}) > high (${high})?`,
      activeFrameId: myId,
    };

    if (low > high) {
      stack[stack.length - 1].status = "not_found";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid: null,
        activeLine: 2,
        description: `Base case met: low (${low}) > high (${high}). Target element ${target} not found!`,
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid: null,
        activeLine: 2,
        description: `Returning -1 from binarySearch(low = ${low}, high = ${high}).`,
        activeFrameId: myId,
      };

      stack.pop();
      return -1;
    }

    // Compute mid
    const mid = Math.floor((low + high) / 2);
    stack[stack.length - 1].mid = mid;
    stack[stack.length - 1].status = "computing_mid";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid,
      activeLine: 4,
      description: `Computing mid index: mid = Math.floor((${low} + ${high}) / 2) = ${mid}. Element at mid is ${arr[mid]}.`,
      activeFrameId: myId,
    };

    // Check if target found
    stack[stack.length - 1].status = "checking_match";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid,
      activeLine: 5,
      description: `Checking if arr[mid] (${arr[mid]}) === target (${target})?`,
      activeFrameId: myId,
    };

    if (arr[mid] === target) {
      stack[stack.length - 1].status = "found";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid,
        activeLine: 5,
        description: `Target element found at index ${mid}!`,
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid,
        activeLine: 5,
        description: `Returning index ${mid} from binarySearch(low = ${low}, high = ${high}).`,
        activeFrameId: myId,
      };

      stack.pop();
      return mid;
    }

    // Check if target is smaller
    stack[stack.length - 1].status = "checking_less";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      low,
      high,
      mid,
      activeLine: 7,
      description: `Checking if target (${target}) < arr[mid] (${arr[mid]})?`,
      activeFrameId: myId,
    };

    if (target < arr[mid]) {
      stack[stack.length - 1].status = "searching_left";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid,
        activeLine: 8,
        description: `Target ${target} is smaller than ${arr[mid]}. Searching left half: binarySearch(low = ${low}, high = ${mid - 1}).`,
        activeFrameId: myId,
      };

      const res = yield* run(low, mid - 1, myId);

      const myFrameIndex = stack.findIndex((f) => f.id === myId);
      if (myFrameIndex !== -1) {
        stack[myFrameIndex].status = "returning";
        yield {
          stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
          low,
          high,
          mid,
          activeLine: 8,
          description: `Returning ${res} to caller from binarySearch(low = ${low}, high = ${high}).`,
          activeFrameId: myId,
        };
        stack.pop();
      }
      return res;
    } else {
      stack[stack.length - 1].status = "searching_right";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        low,
        high,
        mid,
        activeLine: 10,
        description: `Target ${target} is greater than ${arr[mid]}. Searching right half: binarySearch(low = ${mid + 1}, high = ${high}).`,
        activeFrameId: myId,
      };

      const res = yield* run(mid + 1, high, myId);

      const myFrameIndex = stack.findIndex((f) => f.id === myId);
      if (myFrameIndex !== -1) {
        stack[myFrameIndex].status = "returning";
        yield {
          stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
          low,
          high,
          mid,
          activeLine: 10,
          description: `Returning ${res} to caller from binarySearch(low = ${low}, high = ${high}).`,
          activeFrameId: myId,
        };
        stack.pop();
      }
      return res;
    }
  }

  const result = yield* run(0, arr.length - 1);
  yield {
    stack: [],
    low: null,
    high: null,
    mid: null,
    activeLine: 0,
    description: `Recursion finished. Binary Search result index is ${result}.`,
    activeFrameId: null,
  };
}
