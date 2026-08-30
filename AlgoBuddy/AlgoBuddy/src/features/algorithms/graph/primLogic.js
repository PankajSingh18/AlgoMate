/**
 * Pure generator logic for Prim's Algorithm
 */

export function* primGenerator(adj, startNode) {
  if (!startNode || !adj[startNode]) return;

  const visited = new Set();
  const mstEdges = [];
  const pq = [{ node: startNode, weight: 0, from: null }];

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    mstEdges: [],
    description: `Starting Prim's algorithm from node ${startNode}`,
  };

  while (pq.length > 0) {
    pq.sort((a, b) => a.weight - b.weight);
    const { node: u, weight: w, from: p } = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);
    if (p !== null) mstEdges.push({ from: p, to: u });

    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: p ? { from: p, to: u } : null,
      mstEdges: [...mstEdges],
      description: `Adding node ${u} to MST${p ? ` via edge from ${p}` : ""}`,
    };

    const neighbors = adj[u] || [];
    for (const edge of neighbors) {
      const v = edge.node;
      if (!visited.has(v)) {
        pq.push({ node: v, weight: edge.weight, from: u });
        yield {
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, v]),
          activeEdge: { from: u, to: v },
          mstEdges: [...mstEdges],
          description: `Considering edge ${u} → ${v} with weight ${edge.weight}`,
        };
      }
    }
  }

  yield {
    visitedNodes: new Set(visited),
    visitingNodes: new Set(),
    activeEdge: null,
    mstEdges: [...mstEdges],
    description: `Prim's algorithm complete. MST constructed.`,
  };
}
