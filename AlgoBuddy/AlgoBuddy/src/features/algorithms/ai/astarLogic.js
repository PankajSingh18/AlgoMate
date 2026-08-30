const pointKey = (row, col) => `${row},${col}`;
const parsePointKey = (key) => {
  const [row, col] = key.split(",").map(Number);
  return { row, col };
};

const heuristicDistance = (a, b, heuristic) => {
  const dr = Math.abs(a.row - b.row);
  const dc = Math.abs(a.col - b.col);
  if (heuristic === "euclidean") return Math.sqrt(dr * dr + dc * dc);
  if (heuristic === "chebyshev") return Math.max(dr, dc);
  return dr + dc;
};

const reconstructPath = (cameFrom, currentKey) => {
  const path = [currentKey];
  let cursor = currentKey;
  while (cameFrom.has(cursor)) {
    cursor = cameFrom.get(cursor);
    path.push(cursor);
  }
  return path.reverse();
};

const getNeighbors = (row, col, size) => {
  const neighbors = [];
  if (row > 0) neighbors.push({ row: row - 1, col });
  if (row < size - 1) neighbors.push({ row: row + 1, col });
  if (col > 0) neighbors.push({ row, col: col - 1 });
  if (col < size - 1) neighbors.push({ row, col: col + 1 });
  return neighbors;
};

export function* astarGenerator(start, goal, walls, gridSize, heuristic) {
  const startKey = pointKey(start.row, start.col);
  const goalKey = pointKey(goal.row, goal.col);
  const wallSet = new Set([...walls].filter((cell) => cell !== startKey && cell !== goalKey));
  const openSet = new Set([startKey]);
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = new Map([[startKey, 0]]);
  const fScore = new Map([[startKey, heuristicDistance(start, goal, heuristic)]]);

  const yieldState = (messageText, detailText, currentKey = null, path = [], goalReached = false) => {
    const currentPoint = currentKey ? parsePointKey(currentKey) : null;
    const currentG = currentKey ? gScore.get(currentKey) ?? 0 : 0;
    const currentH = currentPoint ? heuristicDistance(currentPoint, goal, heuristic) : 0;
    const currentF = currentKey ? fScore.get(currentKey) ?? currentG + currentH : 0;
    
    return {
      message: messageText,
      detail: detailText,
      currentKey,
      open: [...openSet],
      closed: [...closedSet],
      path,
      g: currentG,
      h: currentH,
      f: currentF,
      goalReached,
    };
  };

  const pickNext = () => {
    let bestKey = null;
    for (const candidateKey of openSet) {
      if (!bestKey) {
        bestKey = candidateKey;
        continue;
      }

      const candidateF = fScore.get(candidateKey) ?? Infinity;
      const bestF = fScore.get(bestKey) ?? Infinity;
      if (candidateF !== bestF) {
        if (candidateF < bestF) bestKey = candidateKey;
        continue;
      }

      const candidatePoint = parsePointKey(candidateKey);
      const bestPoint = parsePointKey(bestKey);
      const candidateH = heuristicDistance(candidatePoint, goal, heuristic);
      const bestH = heuristicDistance(bestPoint, goal, heuristic);
      if (candidateH !== bestH) {
        if (candidateH < bestH) bestKey = candidateKey;
        continue;
      }

      const candidateG = gScore.get(candidateKey) ?? Infinity;
      const bestG = gScore.get(bestKey) ?? Infinity;
      if (candidateG !== bestG) {
        if (candidateG < bestG) bestKey = candidateKey;
        continue;
      }

      if (candidateKey < bestKey) bestKey = candidateKey;
    }
    return bestKey;
  };

  yield yieldState(
    "A* is ready. The frontier begins at the start node.",
    "The priority of each node is computed with f = g + h.",
    null
  );

  while (openSet.size > 0) {
    const currentKey = pickNext();
    const currentPoint = parsePointKey(currentKey);

    if (currentKey === goalKey) {
      const path = reconstructPath(cameFrom, currentKey);
      yield yieldState(
        "Goal reached. Reconstructing the shortest route.",
        "The goal node was removed from the open set with the best score.",
        currentKey,
        path,
        true
      );
      return;
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    yield yieldState(
      `Expanding node (${currentPoint.row + 1}, ${currentPoint.col + 1}).`,
      `Selected node has g = ${gScore.get(currentKey) ?? 0}, h = ${heuristicDistance(currentPoint, goal, heuristic).toFixed(2)}, and f = ${(fScore.get(currentKey) ?? 0).toFixed(2)}.`,
      currentKey
    );

    for (const neighbor of getNeighbors(currentPoint.row, currentPoint.col, gridSize)) {
      const neighborKey = pointKey(neighbor.row, neighbor.col);
      if (wallSet.has(neighborKey) || closedSet.has(neighborKey)) continue;

      const tentativeG = (gScore.get(currentKey) ?? Infinity) + 1;
      const knownG = gScore.get(neighborKey) ?? Infinity;
      if (tentativeG < knownG) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        const nextH = heuristicDistance(neighbor, goal, heuristic);
        fScore.set(neighborKey, tentativeG + nextH);
        openSet.add(neighborKey);
        yield yieldState(
          `Updated neighbor (${neighbor.row + 1}, ${neighbor.col + 1}).`,
          `New values: g = ${tentativeG}, h = ${nextH.toFixed(2)}, f = ${(tentativeG + nextH).toFixed(2)}.`,
          currentKey
        );
      }
    }
  }

  yield yieldState(
    "No path was found.",
    "The open set is empty, so the goal cannot be reached with the current walls."
  );
}
