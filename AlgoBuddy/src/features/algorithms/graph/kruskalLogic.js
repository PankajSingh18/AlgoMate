/**
 * Pure generator logic for Kruskal's Algorithm
 */

export function* kruskalGenerator(nodes, edges) {
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const parent = {};
  nodes.forEach(n => parent[n] = n);

  const find = (i) => {
    if (parent[i] === i) return i;
    return find(parent[i]);
  };

  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  };

  const mstEdges = [];

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    mstEdges: [],
    description: "Starting Kruskal's algorithm. Edges sorted by weight.",
  };

  for (const edge of sortedEdges) {
    yield {
      visitedNodes: new Set(),
      visitingNodes: new Set([edge.from, edge.to]),
      activeEdge: { from: edge.from, to: edge.to },
      mstEdges: [...mstEdges],
      description: `Checking smallest remaining edge: ${edge.from} — ${edge.to} (weight: ${edge.weight})`,
    };

    if (find(edge.from) !== find(edge.to)) {
      union(edge.from, edge.to);
      mstEdges.push({ from: edge.from, to: edge.to });
      yield {
        visitedNodes: new Set(),
        visitingNodes: new Set([edge.from, edge.to]),
        activeEdge: { from: edge.from, to: edge.to },
        mstEdges: [...mstEdges],
        description: `Edge ${edge.from} — ${edge.to} doesn't form a cycle. Adding to MST.`,
      };
    } else {
      yield {
        visitedNodes: new Set(),
        visitingNodes: new Set([edge.from, edge.to]),
        activeEdge: { from: edge.from, to: edge.to },
        mstEdges: [...mstEdges],
        description: `Edge ${edge.from} — ${edge.to} forms a cycle. Skipping.`,
      };
    }
  }

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    mstEdges: [...mstEdges],
    description: "Kruskal's algorithm complete. MST constructed.",
  };
}
