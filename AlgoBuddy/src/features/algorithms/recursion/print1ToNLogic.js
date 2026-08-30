export function* generatePrint1ToNFrames(n) {
  const stack = [];
  const printed = [];
  let frameIdCounter = 0;

  function* run(i, maxVal, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "print1ToN",
      i,
      n: maxVal,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 1,
      description: `Calling print1ToN(i = ${i}, n = ${maxVal}). Pushing new stack frame.`,
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 2,
      description: `Checking base case condition: is i (${i}) > n (${maxVal})?`,
      activeFrameId: myId,
    };

    if (i > maxVal) {
      stack[stack.length - 1].status = "base_case";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Base case met! i (${i}) > n (${maxVal}). Stopping recursion.`,
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Returning from print1ToN(i = ${i}). Stack frame is ready to pop.`,
        activeFrameId: myId,
      };

      stack.pop();
      return;
    }

    // Print i
    printed.push(i);
    stack[stack.length - 1].status = "printing";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 3,
      description: `Printing value: ${i}. Output array is updated.`,
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "waiting";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 4,
      description: `Making recursive call for next number: print1ToN(i = ${i + 1}, n = ${maxVal}).`,
      activeFrameId: myId,
    };

    yield* run(i + 1, maxVal, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    if (myFrameIndex !== -1) {
      stack[myFrameIndex].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
        printed: [...printed],
        activeLine: 4,
        description: `Returning back to caller print1ToN(i = ${i}). Stack frame is ready to pop.`,
        activeFrameId: myId,
      };
      stack.pop();
    }
  }

  yield* run(1, n);
  yield {
    stack: [],
    printed: [...printed],
    activeLine: 0,
    description: `Recursion finished. All numbers from 1 to ${n} have been printed.`,
    activeFrameId: null,
  };
}
