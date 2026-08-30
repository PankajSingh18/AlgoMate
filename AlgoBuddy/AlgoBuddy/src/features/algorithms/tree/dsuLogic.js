/**
 * Pure generator logic for Disjoint Set Union (DSU) operations.
 */

export function* findGenerator(targetId, numElements, parentArray, rankArray, sizeArray, pathCompression) {
  if (targetId < 0 || targetId >= numElements) {
    yield { type: 'error', message: `⚠️ Node ${targetId} is out of bounds. Element must be 0 to ${numElements - 1}.` };
    return;
  }

  let currentParent = [...parentArray];
  let currentRank = [...rankArray];
  let currentSize = [...sizeArray];
  
  const parentBefore = [...parentArray];
  const rankBefore = [...rankArray];
  const sizeBefore = [...sizeArray];

  const path = [];
  let curr = targetId;
  
  while (true) {
    path.push(curr);
    const activeHighlights = {};
    const activeEdges = {};
    
    path.forEach(n => { activeHighlights[n] = "active"; });
    activeHighlights[curr] = "visiting";
    
    if (currentParent[curr] !== curr) {
      activeEdges[`${curr}->${currentParent[curr]}`] = true;
    }
    
    yield {
      type: 'step',
      highlightedNodes: { ...activeHighlights },
      highlightedEdges: { ...activeEdges },
      parent: [...currentParent],
      rank: [...currentRank],
      size: [...currentSize],
      parentBefore,
      rankBefore,
      sizeBefore,
      explanation: currentParent[curr] === curr
        ? `Node ${curr} points to itself. Root / Representative is found at Node ${curr}!`
        : `Check Node ${curr}. Parent is Node ${currentParent[curr]}. Traverse upward to representative...`
    };

    if (currentParent[curr] === curr) break;
    curr = currentParent[curr];
  }

  const root = curr;

  if (pathCompression && path.length > 2) {
    yield {
      type: 'step',
      highlightedNodes: path.reduce((acc, el) => ({ ...acc, [el]: "active" }), {}),
      highlightedEdges: {},
      parent: [...currentParent],
      rank: [...currentRank],
      size: [...currentSize],
      parentBefore,
      rankBefore,
      sizeBefore,
      explanation: `Path Compression enabled! Now, update the parent pointer of all elements traversed: ${path.slice(0, -1).join(", ")} will point directly to Root Node ${root}.`
    };

    for (let i = 0; i < path.length - 1; i++) {
      const nodeToCompress = path[i];
      if (currentParent[nodeToCompress] !== root) {
        currentParent[nodeToCompress] = root;
        
        const stepHighlights = { [root]: "matched", [nodeToCompress]: "visiting" };
        const stepEdges = { [`${nodeToCompress}->${root}`]: true };
        
        yield {
          type: 'step',
          highlightedNodes: stepHighlights,
          highlightedEdges: stepEdges,
          parent: [...currentParent],
          rank: [...currentRank],
          size: [...currentSize],
          parentBefore,
          rankBefore,
          sizeBefore,
          arrayHighlight: nodeToCompress,
          explanation: `Compressing Node ${nodeToCompress}: Update parent pointer parent[${nodeToCompress}] = Root Node ${root}.`
        };
      }
    }
  }

  yield {
    type: 'step',
    highlightedNodes: { [root]: "matched" },
    highlightedEdges: {},
    parent: [...currentParent],
    rank: [...currentRank],
    size: [...currentSize],
    parentBefore,
    rankBefore,
    sizeBefore,
    explanation: `Operation complete. Representative of Element ${targetId} is Node ${root}.`
  };
}

export function* unionGenerator(x, y, numElements, parentArray, rankArray, sizeArray, unionByRank) {
  if (x < 0 || x >= numElements || y < 0 || y >= numElements) {
    yield { type: 'error', message: `⚠️ Out of bounds. Elements must be between 0 and ${numElements - 1}` };
    return;
  }

  let currentParent = [...parentArray];
  let currentRank = [...rankArray];
  let currentSize = [...sizeArray];
  
  const parentBefore = [...parentArray];
  const rankBefore = [...rankArray];
  const sizeBefore = [...sizeArray];

  // Find root of X
  let pathX = [];
  let currX = x;
  while (true) {
    pathX.push(currX);
    if (currentParent[currX] === currX) break;
    currX = currentParent[currX];
  }
  const rootX = currX;

  // Find root of Y
  let pathY = [];
  let currY = y;
  while (true) {
    pathY.push(currY);
    if (currentParent[currY] === currY) break;
    currY = currentParent[currY];
  }
  const rootY = currY;

  yield {
    type: 'step',
    highlightedNodes: { [x]: "visiting" },
    highlightedEdges: {},
    parent: [...parentBefore],
    rank: [...rankBefore],
    size: [...sizeBefore],
    parentBefore,
    rankBefore,
    sizeBefore,
    explanation: `To merge sets containing Node ${x} and Node ${y}, first perform Find(${x}) to locate its root representative.`
  };

  for (let i = 0; i < pathX.length; i++) {
    const node = pathX[i];
    const activeHighlights = {};
    pathX.slice(0, i + 1).forEach(n => { activeHighlights[n] = "active"; });
    activeHighlights[node] = "visiting";
    
    const activeEdges = {};
    if (currentParent[node] !== node) {
      activeEdges[`${node}->${currentParent[node]}`] = true;
    }

    yield {
      type: 'step',
      highlightedNodes: activeHighlights,
      highlightedEdges: activeEdges,
      parent: [...parentBefore],
      rank: [...rankBefore],
      size: [...sizeBefore],
      parentBefore,
      rankBefore,
      sizeBefore,
      explanation: currentParent[node] === node
        ? `Root of Node ${x} found at Node ${node}.`
        : `Find(${x}): Checking Node ${node}. Parent is Node ${currentParent[node]}...`
    };
  }

  yield {
    type: 'step',
    highlightedNodes: { [rootX]: "active", [y]: "visiting" },
    highlightedEdges: {},
    parent: [...parentBefore],
    rank: [...rankBefore],
    size: [...sizeBefore],
    parentBefore,
    rankBefore,
    sizeBefore,
    explanation: `Root of ${x} is Representative ${rootX}. Now, perform Find(${y}) to locate its representative.`
  };

  for (let i = 0; i < pathY.length; i++) {
    const node = pathY[i];
    const activeHighlights = { [rootX]: "active" };
    pathY.slice(0, i + 1).forEach(n => { activeHighlights[n] = "active"; });
    activeHighlights[node] = "visiting";
    
    const activeEdges = {};
    if (currentParent[node] !== node) {
      activeEdges[`${node}->${currentParent[node]}`] = true;
    }

    yield {
      type: 'step',
      highlightedNodes: activeHighlights,
      highlightedEdges: activeEdges,
      parent: [...parentBefore],
      rank: [...rankBefore],
      size: [...sizeBefore],
      parentBefore,
      rankBefore,
      sizeBefore,
      explanation: currentParent[node] === node
        ? `Root of Node ${y} found at Node ${node}.`
        : `Find(${y}): Checking Node ${node}. Parent is Node ${currentParent[node]}...`
    };
  }

  yield {
    type: 'step',
    highlightedNodes: { [rootX]: "matched", [rootY]: "matched" },
    highlightedEdges: {},
    parent: [...parentBefore],
    rank: [...rankBefore],
    size: [...sizeBefore],
    parentBefore,
    rankBefore,
    sizeBefore,
    explanation: `Roots identified. Root of ${x} is Node ${rootX}; Root of ${y} is Node ${rootY}.`
  };

  if (rootX === rootY) {
    yield {
      type: 'step',
      highlightedNodes: { [rootX]: "matched" },
      highlightedEdges: {},
      parent: [...parentBefore],
      rank: [...rankBefore],
      size: [...sizeBefore],
      parentBefore,
      rankBefore,
      sizeBefore,
      explanation: `Roots are identical: rootX (${rootX}) == rootY (${rootY}). Elements ${x} and ${y} are already in the same disjoint set. No merge necessary.`
    };
  } else {
    if (unionByRank) {
      yield {
        type: 'step',
        highlightedNodes: { [rootX]: "matched", [rootY]: "matched" },
        highlightedEdges: {},
        parent: [...parentBefore],
        rank: [...rankBefore],
        size: [...sizeBefore],
        parentBefore,
        rankBefore,
        sizeBefore,
        explanation: `Union by Rank enabled! Compare Rank[${rootX}] = ${currentRank[rootX]} vs Rank[${rootY}] = ${currentRank[rootY]}.`
      };

      if (currentRank[rootX] < currentRank[rootY]) {
        currentParent[rootX] = rootY;
        currentSize[rootY] += currentSize[rootX];
        yield {
          type: 'step',
          highlightedNodes: { [rootX]: "visiting", [rootY]: "matched" },
          highlightedEdges: { [`${rootX}->${rootY}`]: true },
          parent: [...currentParent],
          rank: [...currentRank],
          size: [...currentSize],
          parentBefore,
          rankBefore,
          sizeBefore,
          arrayHighlight: rootX,
          explanation: `Rank[${rootX}] < Rank[${rootY}]. Attach Tree ${rootX} under Root ${rootY}. Set parent[${rootX}] = ${rootY}.`
        };
      } else if (currentRank[rootX] > currentRank[rootY]) {
        currentParent[rootY] = rootX;
        currentSize[rootX] += currentSize[rootY];
        yield {
          type: 'step',
          highlightedNodes: { [rootX]: "matched", [rootY]: "visiting" },
          highlightedEdges: { [`${rootY}->${rootX}`]: true },
          parent: [...currentParent],
          rank: [...currentRank],
          size: [...currentSize],
          parentBefore,
          rankBefore,
          sizeBefore,
          arrayHighlight: rootY,
          explanation: `Rank[${rootX}] > Rank[${rootY}]. Attach Tree ${rootY} under Root ${rootX}. Set parent[${rootY}] = ${rootX}.`
        };
      } else {
        currentParent[rootY] = rootX;
        currentSize[rootX] += currentSize[rootY];
        currentRank[rootX] += 1;
        yield {
          type: 'step',
          highlightedNodes: { [rootX]: "matched", [rootY]: "visiting" },
          highlightedEdges: { [`${rootY}->${rootX}`]: true },
          parent: [...currentParent],
          rank: [...currentRank],
          size: [...currentSize],
          parentBefore,
          rankBefore,
          sizeBefore,
          arrayHighlight: rootY,
          explanation: `Ranks are equal. Attach root ${rootY} under root ${rootX}. Increment Rank[${rootX}] to ${currentRank[rootX]}.`
        };
      }
    } else {
      currentParent[rootY] = rootX;
      currentSize[rootX] += currentSize[rootY];
      yield {
        type: 'step',
        highlightedNodes: { [rootX]: "matched", [rootY]: "visiting" },
        highlightedEdges: { [`${rootY}->${rootX}`]: true },
        parent: [...currentParent],
        rank: [...currentRank],
        size: [...currentSize],
        parentBefore,
        rankBefore,
        sizeBefore,
        arrayHighlight: rootY,
        explanation: `Union by Rank off. Attach Tree ${rootY} under Root ${rootX} arbitrarily. Set parent[${rootY}] = ${rootX}.`
      };
    }

    yield {
      type: 'step',
      highlightedNodes: { [rootX]: "matched" },
      highlightedEdges: {},
      parent: [...currentParent],
      rank: [...currentRank],
      size: [...currentSize],
      parentBefore,
      rankBefore,
      sizeBefore,
      explanation: `Sets successfully merged! Node ${x} and Node ${y} now share a single representative root.`
    };
  }
}
