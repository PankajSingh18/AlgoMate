export function* generateReverseFrames(initialArr) {
  const stack = [];
  let arr = [...initialArr];
  let frameIdCounter = 0;

  function* run(l, r, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "reverse",
      l,
      r,
      status: "calling",
      parentId,
    };
    stack.push(currentFrame);

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 1,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Calling reverse(l = ${l}, r = ${r}). Pushing stack frame.`,
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 2,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Checking base case condition: is l (${l}) >= r (${r})?`,
      activeFrameId: myId,
    };

    if (l >= r) {
      stack[stack.length - 1].status = "base_case";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        arr: [...arr],
        activeLine: 2,
        lIndex: l,
        rIndex: r,
        isSwapping: false,
        description: `Base case met! l (${l}) >= r (${r}). Stopping recursion.`,
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        arr: [...arr],
        activeLine: 2,
        lIndex: l,
        rIndex: r,
        isSwapping: false,
        description: `Returning from reverse(l = ${l}, r = ${r}). Ready to pop.`,
        activeFrameId: myId,
      };

      stack.pop();
      return;
    }

    // Swap
    stack[stack.length - 1].status = "swapping";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 3,
      lIndex: l,
      rIndex: r,
      isSwapping: true,
      description: `Swapping elements at index ${l} (${arr[l]}) and index ${r} (${arr[r]}).`,
      activeFrameId: myId,
    };

    const temp = arr[l];
    arr[l] = arr[r];
    arr[r] = temp;

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 3,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Swap complete. Array is now: [${arr.join(", ")}].`,
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "waiting";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      arr: [...arr],
      activeLine: 4,
      lIndex: l,
      rIndex: r,
      isSwapping: false,
      description: `Calling recursively for inner indices: reverse(l = ${l + 1}, r = ${r - 1}).`,
      activeFrameId: myId,
    };

    yield* run(l + 1, r - 1, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    if (myFrameIndex !== -1) {
      stack[myFrameIndex].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
        arr: [...arr],
        activeLine: 4,
        lIndex: l,
        rIndex: r,
        isSwapping: false,
        description: `Returning back to caller reverse(l = ${l}, r = ${r}). Stack frame is ready to pop.`,
        activeFrameId: myId,
      };
      stack.pop();
    }
  }

  yield* run(0, arr.length - 1);
  yield {
    stack: [],
    arr: [...arr],
    activeLine: 0,
    lIndex: -1,
    rIndex: -1,
    isSwapping: false,
    description: `Recursion complete! Final reversed array is: [${arr.join(", ")}].`,
    activeFrameId: null,
  };
}
