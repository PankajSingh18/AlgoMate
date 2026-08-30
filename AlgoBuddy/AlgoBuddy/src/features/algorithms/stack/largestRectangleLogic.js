/**
 * Pure generator function for finding the Largest Rectangle in a Histogram
 * using a Monotonic Stack.
 * Yields state objects representing the algorithm's progress at each step.
 */

export function* largestRectangleGenerator(arr) {
  let stack = [];
  let currentMaxArea = 0;

  for (let i = 0; i <= arr.length; i++) {
    const h = i === arr.length ? 0 : arr[i];
    
    yield {
      currentIndex: i,
      stack: [...stack],
      maxArea: currentMaxArea,
      currentRect: null,
      explanation: i === arr.length 
        ? `Reached end of histogram. Flushing remaining elements from stack.`
        : `Evaluating index ${i} with height ${h}.`,
      action: "evaluate"
    };

    while (stack.length > 0 && h < arr[stack[stack.length - 1]]) {
      const poppedIndex = stack.pop();
      const height = arr[poppedIndex];
      const prevSmallerIndex = stack.length === 0 ? -1 : stack[stack.length - 1];
      const width = i - prevSmallerIndex - 1;
      const area = height * width;
      
      currentMaxArea = Math.max(currentMaxArea, area);

      yield {
        currentIndex: i,
        stack: [...stack],
        maxArea: currentMaxArea,
        currentRect: { height, width, leftBoundary: prevSmallerIndex + 1, rightBoundary: i - 1, area },
        explanation: `Height ${h} < top of stack (${height}). Popped index ${poppedIndex}. Width is ${i} - ${prevSmallerIndex} - 1 = ${width}. Area = ${height} x ${width} = ${area}. Max Area is ${currentMaxArea}.`,
        action: "pop"
      };
    }
    
    if (i < arr.length) {
      stack.push(i);
      yield {
        currentIndex: i,
        stack: [...stack],
        maxArea: currentMaxArea,
        currentRect: null,
        explanation: `Pushed index ${i} to stack. Stack maintains monotonically increasing heights.`,
        action: "push"
      };
    }
  }

  yield {
    currentIndex: arr.length,
    stack: [],
    maxArea: currentMaxArea,
    currentRect: null,
    explanation: `Finished processing. Largest Rectangle Area is ${currentMaxArea}.`,
    action: "done",
    done: true
  };
}
