export function* generateHanoiFrames(n) {
  const stack = [];
  const pegs = {
    A: Array.from({ length: n }, (_, i) => n - i), // e.g. [3, 2, 1]
    B: [],
    C: []
  };
  let frameIdCounter = 0;

  function moveDisk(disk, from, to) {
    const diskIndex = pegs[from].indexOf(disk);
    if (diskIndex !== -1) {
      pegs[from].splice(diskIndex, 1);
    }
    pegs[to].push(disk);
  }

  function* solve(val, src, dest, aux, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      n: val,
      src,
      dest,
      aux,
      status: "calling",
      parentId
    };
    stack.push(currentFrame);

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      pegs: JSON.parse(JSON.stringify(pegs)),
      activeLine: "entry",
      description: `Calling hanoi(n = ${val}, src = '${src}', dest = '${dest}', aux = '${aux}'). Pushing stack frame onto the Call Stack.`,
      activeFrameId: myId,
      movingDisk: null
    };

    stack[stack.length - 1].status = "checking_base";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      pegs: JSON.parse(JSON.stringify(pegs)),
      activeLine: "check",
      description: `Checking base case condition: is n (${val}) === 1?`,
      activeFrameId: myId,
      movingDisk: null
    };

    if (val === 1) {
      stack[stack.length - 1].status = "base_case";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        pegs: JSON.parse(JSON.stringify(pegs)),
        activeLine: "move1",
        description: `Base case met! Moving disk 1 from peg ${src} to peg ${dest}.`,
        activeFrameId: myId,
        movingDisk: 1,
        fromPeg: src,
        toPeg: dest
      };

      moveDisk(1, src, dest);

      stack[stack.length - 1].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        pegs: JSON.parse(JSON.stringify(pegs)),
        activeLine: "ret1",
        description: `Disk 1 moved. Returning from hanoi(1, '${src}', '${dest}', '${aux}').`,
        activeFrameId: myId,
        movingDisk: null
      };

      stack.pop();
      return;
    }

    stack[stack.length - 1].status = "waiting_1";
    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      pegs: JSON.parse(JSON.stringify(pegs)),
      activeLine: "recurse1",
      description: `n = ${val} > 1. Recursively solve for top n - 1 (${val - 1}) disks: move from peg ${src} to peg ${aux} using peg ${dest}.`,
      activeFrameId: myId,
      movingDisk: null
    };

    yield* solve(val - 1, src, aux, dest, myId);

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    if (myFrameIndex !== -1) {
      stack[myFrameIndex].status = "moving";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
        pegs: JSON.parse(JSON.stringify(pegs)),
        activeLine: "moveN",
        description: `Recursive call returned. Move the remaining largest disk ${val} from peg ${src} to peg ${dest}.`,
        activeFrameId: myId,
        movingDisk: val,
        fromPeg: src,
        toPeg: dest
      };

      moveDisk(val, src, dest);

      stack[myFrameIndex].status = "waiting_2";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
        pegs: JSON.parse(JSON.stringify(pegs)),
        activeLine: "recurse2",
        description: `Largest disk ${val} placed on destination. Recursively solve for the n - 1 (${val - 1}) disks on peg ${aux}: move to peg ${dest} using peg ${src}.`,
        activeFrameId: myId,
        movingDisk: null
      };

      yield* solve(val - 1, aux, dest, src, myId);
    }

    const myFrameIndex2 = stack.findIndex((f) => f.id === myId);
    if (myFrameIndex2 !== -1) {
      stack[myFrameIndex2].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex2 + 1))),
        pegs: JSON.parse(JSON.stringify(pegs)),
        activeLine: "recurse2",
        description: `Completed both recursive subproblems. Returning from hanoi(${val}, '${src}', '${dest}', '${aux}').`,
        activeFrameId: myId,
        movingDisk: null
      };
      stack.pop();
    }
  }

  yield* solve(n, "A", "C", "B");

  yield {
    stack: [],
    pegs: JSON.parse(JSON.stringify(pegs)),
    activeLine: "completed",
    description: `Tower of Hanoi solved! All ${n} disks successfully moved to peg C.`,
    activeFrameId: null,
    movingDisk: null
  };
}
