export function* generateNQueensFrames() {
  const stack = [];
  const board = [-1, -1, -1, -1];
  const solutions = [];
  let frameIdCounter = 0;

  function isSafe(row, col) {
    for (let c = 0; c < col; c++) {
      if (board[c] === row) return false;
    }
    for (let r = row, c = col; r >= 0 && c >= 0; r--, c--) {
      if (board[c] === r) return false;
    }
    for (let r = row, c = col; r < 4 && c >= 0; r++, c--) {
      if (board[c] === r) return false;
    }
    return true;
  }

  function* solve(col, parentId = null) {
    const myId = ++frameIdCounter;
    const currentFrame = {
      id: myId,
      name: "solve",
      col,
      status: "trying",
      parentId,
    };
    stack.push(currentFrame);

    yield {
      stack: JSON.parse(JSON.stringify(stack)),
      board: [...board],
      solutions: JSON.parse(JSON.stringify(solutions)),
      activeCell: { row: -1, col },
      conflictCell: null,
      activeLine: 1,
      description: `Calling solve(col = ${col}). Searching for a safe row in this column.`,
      activeFrameId: myId,
    };

    if (col >= 4) {
      solutions.push([...board]);
      stack[stack.length - 1].status = "base_case";
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        board: [...board],
        solutions: JSON.parse(JSON.stringify(solutions)),
        activeCell: null,
        conflictCell: null,
        activeLine: 2,
        description: `Base case met! All 4 queens placed safely. Solution #${solutions.length} found!`,
        activeFrameId: myId,
      };

      stack.pop();
      return;
    }

    for (let row = 0; row < 4; row++) {
      board[col] = row;
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        board: [...board],
        solutions: JSON.parse(JSON.stringify(solutions)),
        activeCell: { row, col },
        conflictCell: null,
        activeLine: 5,
        description: `Placing Queen at cell (${row}, ${col}). Checking safety...`,
        activeFrameId: myId,
      };

      const safe = isSafe(row, col);
      if (safe) {
        yield {
          stack: JSON.parse(JSON.stringify(stack)),
          board: [...board],
          solutions: JSON.parse(JSON.stringify(solutions)),
          activeCell: { row, col },
          conflictCell: null,
          activeLine: 6,
          description: `Position (${row}, ${col}) is SAFE. Placing queen and calling recursively...`,
          activeFrameId: myId,
        };

        yield* solve(col + 1, myId);
        
        const myIndex = stack.findIndex((f) => f.id === myId);
        if (myIndex !== -1) {
          stack[myIndex].status = "trying";
        }
      } else {
        let conflictCol = -1;
        for (let c = 0; c < col; c++) {
          if (board[c] === row || Math.abs(board[c] - row) === Math.abs(c - col)) {
            conflictCol = c;
            break;
          }
        }
        yield {
          stack: JSON.parse(JSON.stringify(stack)),
          board: [...board],
          solutions: JSON.parse(JSON.stringify(solutions)),
          activeCell: { row, col },
          conflictCell: conflictCol !== -1 ? { row: board[conflictCol], col: conflictCol } : null,
          activeLine: 5,
          description: `Conflict found with Queen at cell (${board[conflictCol]}, ${conflictCol}). Backtracking...`,
          activeFrameId: myId,
        };
      }

      board[col] = -1;
      yield {
        stack: JSON.parse(JSON.stringify(stack)),
        board: [...board],
        solutions: JSON.parse(JSON.stringify(solutions)),
        activeCell: { row, col },
        conflictCell: null,
        activeLine: 5,
        description: `Removing Queen from cell (${row}, ${col}) to try the next row.`,
        activeFrameId: myId,
      };
    }

    const myFrameIndex = stack.findIndex((f) => f.id === myId);
    if (myFrameIndex !== -1) {
      stack[myFrameIndex].status = "returning";
      yield {
        stack: JSON.parse(JSON.stringify(stack.slice(0, myFrameIndex + 1))),
        board: [...board],
        solutions: JSON.parse(JSON.stringify(solutions)),
        activeCell: null,
        conflictCell: null,
        activeLine: 9,
        description: `All rows in column ${col} explored. Backtracking to column ${col - 1}.`,
        activeFrameId: myId,
      };
    }

    stack.pop();
  }

  yield* solve(0);
  yield {
    stack: [],
    board: [-1, -1, -1, -1],
    solutions: JSON.parse(JSON.stringify(solutions)),
    activeCell: null,
    conflictCell: null,
    activeLine: 0,
    description: `Backtracking completed! Total solutions found: ${solutions.length}.`,
    activeFrameId: null,
  };
}
