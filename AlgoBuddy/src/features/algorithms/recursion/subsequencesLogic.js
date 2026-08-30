export function* generateSubsequencesFrames(arr) {
  const stack = [];
  const completed = [];
  const treeNodesMap = {};

  function prebuildTree(idx, currentPath = "root") {
    treeNodesMap[currentPath] = {
      id: currentPath,
      label: `idx=${idx}`,
      status: "pending",
      sub: [],
      parentId: currentPath.includes("-") ? currentPath.substring(0, currentPath.lastIndexOf("-")) : null,
    };
    if (idx === arr.length) return;
    prebuildTree(idx + 1, currentPath + "-L"); // Take
    prebuildTree(idx + 1, currentPath + "-R"); // Not Take
  }

  prebuildTree(0);

  let frameIdCounter = 0;

  function* run(idx, current, path = "root", parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "solve",
      index: idx,
      current: [...current],
      status: "calling",
      parentId,
      path,
    };
    stack.push(currentFrame);
    treeNodesMap[path].status = "active";
    treeNodesMap[path].sub = [...current];

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 1,
      description: `Calling solve(index = ${idx}, current = [${current.join(", ")}]).`,
      activeFrameId: myId,
    };

    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 2,
      description: `Checking base case: is index (${idx}) == array length (${arr.length})?`,
      activeFrameId: myId,
    };

    if (idx === arr.length) {
      stack[stack.length - 1].status = "base_case";
      treeNodesMap[path].status = "base";
      completed.push([...current]);
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        completed: [...completed],
        activeLine: 3,
        description: `Base case met! Adding [${current.join(", ")}] to list of subsequences.`,
        activeFrameId: myId,
      };

      stack[stack.length - 1].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        completed: [...completed],
        activeLine: 3,
        description: `Returning from base case call. Ready to pop stack frame.`,
        activeFrameId: myId,
      };

      stack.pop();
      return;
    }

    // Choice 1: Take element
    stack[stack.length - 1].status = "taking";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 5,
      description: `Choice 1: TAKE element arr[${idx}] (${arr[idx]}). Adding to current.`,
      activeFrameId: myId,
    };

    const taken = [...current, arr[idx]];
    
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
      completed: [...completed],
      activeLine: 6,
      description: `Calling solve(index = ${idx + 1}, current = [${taken.join(", ")}]).`,
      activeFrameId: myId,
    };

    yield* run(idx + 1, taken, path + "-L", myId);

    // Choice 2: Don't take element
    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    if (myFrameIndex !== -1) {
      stack[myFrameIndex].status = "not_taking";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        completed: [...completed],
        activeLine: 8,
        description: `Choice 2: BACKTRACK (remove arr[${idx}] = ${arr[idx]}) and DO NOT TAKE it.`,
        activeFrameId: myId,
      };

      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        completed: [...completed],
        activeLine: 9,
        description: `Calling solve(index = ${idx + 1}, current = [${current.join(", ")}]).`,
        activeFrameId: myId,
      };

      yield* run(idx + 1, current, path + "-R", myId);
    }

    const myFrameIndex2 = stack.findIndex((f) => f.id === myId);
    if (myFrameIndex2 !== -1) {
      stack[myFrameIndex2].status = "returning";
      treeNodesMap[path].status = "returned";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
        treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
        completed: [...completed],
        activeLine: 9,
        description: `Both choices explored for index ${idx}. Returning.`,
        activeFrameId: myId,
      };
      stack.pop();
    }
  }

  yield* run(0, []);
  yield {
    stack: [],
    treeNodes: JSON.parse(JSON.stringify(Object.values(treeNodesMap))),
    completed: [...completed],
    activeLine: 0,
    description: `Subsequences generation completed! Total subsequences: ${completed.length}.`,
    activeFrameId: null,
  };
}
