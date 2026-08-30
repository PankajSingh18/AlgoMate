/**
 * Reusable pure frame generators for graph algorithms.
 * Note: BFS, DFS, Dijkstra, Bellman-Ford, and Floyd-Warshall have been migrated to src/features/algorithms/graph/
 */

const formatDistance = (value) => (value === Infinity ? "Infinity" : value);

/**
 * A* Search Frame Generator
 * @param {Array} nodeList   - Array of { id, x, y } node objects
 * @param {Array} edgeList   - Array of { from, to, weight } edge objects
 * @param {string} startNode - Starting node ID
 * @param {string} goalNode  - Goal node ID
 */
export const aStarFrames = (nodeList, edgeList, startNode, goalNode) => {
  const frames = [];
  if (!startNode || !goalNode || startNode === goalNode) return frames;

  // Build position map and weighted adjacency list (directed)
  const pos = {};
  nodeList.forEach((n) => { pos[n.id] = { x: n.x, y: n.y }; });

  const adj = {};
  nodeList.forEach((n) => { adj[n.id] = []; });
  edgeList.forEach((e) => {
    adj[e.from] = adj[e.from] || [];
    adj[e.from].push({ node: e.to, weight: Number(e.weight) || 1 });
  });

  const heuristic = (a, b) => {
    const pa = pos[a];
    const pb = pos[b];
    if (!pa || !pb) return 0;
    return Math.sqrt(Math.pow(pa.x - pb.x, 2) + Math.pow(pa.y - pb.y, 2));
  };

  const gScore = {};
  const fScore = {};
  const cameFrom = {};
  nodeList.forEach((n) => {
    gScore[n.id] = Infinity;
    fScore[n.id] = Infinity;
  });
  gScore[startNode] = 0;
  fScore[startNode] = heuristic(startNode, goalNode);

  const openSet = new Set([startNode]);
  const closedSet = new Set();

  const reconstructPath = (current) => {
    const path = [current];
    let c = current;
    while (cameFrom[c]) {
      c = cameFrom[c];
      path.unshift(c);
    }
    return path;
  };

  const cloneScores = () => ({
    gScore: { ...gScore },
    fScore: { ...fScore },
  });

  frames.push({
    visited: new Set(closedSet),
    openSet: new Set(openSet),
    current: startNode,
    path: [],
    ...cloneScores(),
    activeEdge: null,
    phase: "searching",
    goalNode,
    description: `A* initialized. Start: ${startNode}, Goal: ${goalNode}. g(${startNode})=0, f(${startNode})=${fScore[startNode].toFixed(1)}`,
  });

  while (openSet.size > 0) {
    // Pick node with lowest fScore in open set
    let current = null;
    let lowestF = Infinity;
    for (const n of openSet) {
      if (fScore[n] < lowestF) {
        lowestF = fScore[n];
        current = n;
      }
    }

    if (current === goalNode) {
      const finalPath = reconstructPath(current);
      frames.push({
        visited: new Set(closedSet),
        openSet: new Set(openSet),
        current,
        path: finalPath,
        ...cloneScores(),
        activeEdge: null,
        phase: "found",
        goalNode,
        description: `Goal ${goalNode} reached! Path: ${finalPath.join(" → ")} (cost: ${gScore[goalNode].toFixed(1)})`,
      });
      return frames;
    }

    openSet.delete(current);
    closedSet.add(current);

    frames.push({
      visited: new Set(closedSet),
      openSet: new Set(openSet),
      current,
      path: reconstructPath(current),
      ...cloneScores(),
      activeEdge: null,
      phase: "searching",
      goalNode,
      description: `Expanding node ${current} (f=${fScore[current].toFixed(1)})`,
    });

    const neighbors = adj[current] || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = gScore[current] + weight;

      frames.push({
        visited: new Set(closedSet),
        openSet: new Set(openSet),
        current,
        path: reconstructPath(current),
        ...cloneScores(),
        activeEdge: { from: current, to: neighbor },
        phase: "searching",
        goalNode,
        description: `Checking edge ${current} → ${neighbor} (weight: ${weight}, tentative g: ${tentativeG.toFixed(1)})`,
      });

      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, goalNode);
        openSet.add(neighbor);

        frames.push({
          visited: new Set(closedSet),
          openSet: new Set(openSet),
          current,
          path: reconstructPath(current),
          ...cloneScores(),
          activeEdge: { from: current, to: neighbor },
          phase: "searching",
          goalNode,
          description: `Updated ${neighbor}: g=${gScore[neighbor].toFixed(1)}, h=${heuristic(neighbor, goalNode).toFixed(1)}, f=${fScore[neighbor].toFixed(1)}`,
        });
      }
    }
  }

  // No path found
  frames.push({
    visited: new Set(closedSet),
    openSet: new Set(),
    current: null,
    path: [],
    ...cloneScores(),
    activeEdge: null,
    phase: "no_path",
    goalNode,
    description: `No path exists from ${startNode} to ${goalNode}.`,
  });

  return frames;
};

/**
 * Note: Prim, Kruskal, Topological Sort, Kosaraju, and Tarjan algorithms
 * have been migrated to src/features/algorithms/graph/
 */

/**
 * Adjacency List Frame Generator
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All edges
 */
export const adjacencyListFrames = (nodes, edges) => {
  const frames = [];
  
  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Initializing Adjacency List: creating empty lists for each vertex.",
  });

  nodes.forEach(node => {
    const neighbors = edges
      .filter(e => e.from === node.id || (!e.directed && e.to === node.id))
      .map(e => ({ to: e.from === node.id ? e.to : e.from, edge: e }));

    frames.push({
      visitedNodes: new Set(),
      visitingNodes: new Set([node.id]),
      activeEdge: null,
      description: `Building list for Node ${node.label}.`,
    });

    neighbors.forEach(({ to, edge }) => {
      frames.push({
        visitedNodes: new Set(),
        visitingNodes: new Set([node.id, to]),
        activeEdge: { from: edge.from, to: edge.to },
        description: `Adding neighbor ${to} to Node ${node.label}'s list.`,
      });
    });
  });

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Adjacency List construction complete.",
  });

  return frames;
};

/**
 * Adjacency Matrix Frame Generator
 * @param {Array} nodes - All nodes
 * @param {Array} edges - All edges
 */
export const adjacencyMatrixFrames = (nodes, edges) => {
  const frames = [];
  
  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Initializing Adjacency Matrix: creating V x V grid.",
  });

  nodes.forEach(row => {
    frames.push({
      visitedNodes: new Set(),
      visitingNodes: new Set([row.id]),
      activeEdge: null,
      description: `Checking connections for Node ${row.label} (Row ${row.label}).`,
    });

    nodes.forEach(col => {
      const edge = edges.find(e => 
        (e.from === row.id && e.to === col.id) || 
        (!e.directed && ((e.from === row.id && e.to === col.id) || (e.from === col.id && e.to === row.id)))
      );

      frames.push({
        visitedNodes: new Set(),
        visitingNodes: new Set([row.id, col.id]),
        activeEdge: edge ? { from: edge.from, to: edge.to } : null,
        description: `Checking connection between ${row.label} and ${col.label}: ${edge ? "Edge found" : "No edge"}.`,
      });
    });
  });

  frames.push({
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    description: "Adjacency Matrix construction complete.",
  });

  return frames;
};