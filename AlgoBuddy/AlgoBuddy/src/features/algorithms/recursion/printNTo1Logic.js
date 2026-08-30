export function* generatePrintNTo1Frames(n) {
  const stack = [];
  const printed = [];
  let frameIdCounter = 0;

  function* run(i, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "printNTo1",
      i,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 1,
      description: `Calling printNTo1(i = ${i}). Pushing new stack frame.`,
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      printed: [...printed],
      activeLine: 2,
      description: `Checking base case condition: is i (${i}) < 1?`,
      activeFrameId: myId,
    };

    if (i < 1) {
      stack[stack.length - 1].status = "base_case";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Base case met! i (${i}) < 1. Stopping recursion.`,
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        printed: [...printed],
        activeLine: 2,
        description: `Returning from printNTo1(i = ${i}). Stack frame is ready to pop.`,
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
      description: `Making recursive call for next number: printNTo1(i = ${i - 1}).`,
      activeFrameId: myId,
    };

    yield* run(i - 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    if (myFrameIndex !== -1) {
      stack[myFrameIndex].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
        printed: [...printed],
        activeLine: 4,
        description: `Returning back to caller printNTo1(i = ${i}). Stack frame is ready to pop.`,
        activeFrameId: myId,
      };
      stack.pop();
    }
  }

  yield* run(n);

  yield {
    stack: [],
    printed: [...printed],
    activeLine: null,
    description: "Recursion tree completely unspooled. All frames popped.",
    activeFrameId: null,
  };
}
