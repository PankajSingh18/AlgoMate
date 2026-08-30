export function* generateFibonacciFrames(n) {
  const stack = [];
  let frameIdCounter = 0;
  const treeNodesMap = {};

  function prebuildTree(val, path = "root") {
    treeNodesMap[path] = {
      id: path,
      label: `fib(${val})`,
      val,
      status: "pending",
      result: null,
      parentId: path.includes("-") ? path.substring(0, path.lastIndexOf("-")) : null,
    };
    if (val <= 1) return;
    prebuildTree(val - 1, path + "-L");
    prebuildTree(val - 2, path + "-R");
  }

  prebuildTree(n);

  function* fib(val, path = "root", parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "fib",
      n: val,
      status: "calling",
      retVal: null,
      parentId,
      path,
    };
    stack.push(currentFrame);
    treeNodesMap[path].status = "active";

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 1,
      description: `Calling fib(${val}). Pushing onto the call stack and activating tree node.`,
      phase: "call",
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 2,
      description: `Checking base case condition for fib(${val}): is n <= 1?`,
      phase: "call",
      activeFrameId: myId,
    };

    if (val <= 1) {
      stack[stack.length - 1].status = "base_case";
      treeNodesMap[path].status = "base";
      treeNodesMap[path].result = val;
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        activeLine: 2,
        description: `Base case met! fib(${val}) returns ${val}.`,
        phase: "basecase",
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      stack[stack.length - 1].retVal = val;
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        activeLine: 2,
        description: `Returning ${val} from fib(${val}). Stack frame is ready to pop.`,
        phase: "return",
        activeFrameId: myId,
      };

      stack.pop();
      return val;
    }

    stack[stack.length - 1].status = "waiting_L";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `fib(${val}) requires left term fib(${val - 1}). Calling fib(${val - 1}).`,
      phase: "call",
      activeFrameId: myId,
    };

    const leftVal = yield* fib(val - 1, path + "-L", myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex].status = "waiting_R";
    stack[myFrameIndex].leftVal = leftVal;
    yield {
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Left child returned ${leftVal}. Now fib(${val}) requires right term fib(${val - 2}). Calling fib(${val - 2}).`,
      phase: "call",
      activeFrameId: myId,
    };

    const rightVal = yield* fib(val - 2, path + "-R", myId);

    const myFrameIndex2 = stack.findIndex((f) => f.id === myId);
    stack[myFrameIndex2].status = "calculating";
    stack[myFrameIndex2].rightVal = rightVal;
    stack[myFrameIndex2].retVal = leftVal + rightVal;
    treeNodesMap[path].status = "returned";
    treeNodesMap[path].result = leftVal + rightVal;

    yield {
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Right child returned ${rightVal}. Calculating fib(${val}) = left (${leftVal}) + right (${rightVal}) = ${leftVal + rightVal}.`,
      phase: "return",
      activeFrameId: myId,
    };

    stack[myFrameIndex2].status = "returning";
    yield {
      stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      activeLine: 3,
      description: `Returning ${leftVal + rightVal} from fib(${val}). Stack frame is ready to pop.`,
      phase: "return",
      activeFrameId: myId,
    };

    stack.pop();
    return leftVal + rightVal;
  }

  const finalResult = yield* fib(n);
  yield {
    stack: [],
    treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
    activeLine: 0,
    description: `Recursion finished! Final returned value is ${finalResult}.`,
    phase: "completed",
    activeFrameId: null,
  };
}
