/**
 * Pure generator logic for Dijkstra's Algorithm
 */

export function* dijkstraGenerator(adj, startNode) {
  if (!startNode || !adj[startNode]) return;

  const distances = {};
  const visited = new Set();
  const pq = [{ node: startNode, dist: 0 }];
  
  Object.keys(adj).forEach(node => {
    distances[node] = Infinity;
  });
  distances[startNode] = 0;

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    distances: { ...distances },
    currentNode: startNode,
    description: `Initializing Dijkstra: start node ${startNode} distance set to 0`,
  };

  while (pq.length > 0) {
    // Simple PQ: sort and shift
    pq.sort((a, b) => a.dist - b.dist);
    const { node: u, dist: d } = pq.shift();

    if (visited.has(u)) continue;
    visited.add(u);

    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      distances: { ...distances },
      currentNode: u,
      description: `Processing node ${u} with current shortest distance ${d}`,
    };

    const neighbors = adj[u] || [];
    for (const edge of neighbors) {
      const v = edge.node;
      const weight = edge.weight;

      if (!visited.has(v)) {
        const newDist = distances[u] + weight;
        
        yield {
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, v]),
          activeEdge: { from: u, to: v },
          distances: { ...distances },
          currentNode: u,
          description: `Checking edge ${u} -> ${v} (weight: ${weight})`,
        };

        if (newDist < distances[v]) {
          distances[v] = newDist;
          pq.push({ node: v, dist: newDist });

          yield {
            visitedNodes: new Set(visited),
            visitingNodes: new Set([u, v]),
            activeEdge: { from: u, to: v },
            distances: { ...distances },
            currentNode: u,
            description: `Relaxed distance to ${v}: ${newDist}`,
          };
        }
      }
    }
  }

  yield {
    visitedNodes: new Set(visited),
    visitingNodes: new Set(),
    activeEdge: null,
    distances: { ...distances },
    currentNode: null,
    description: `Dijkstra's algorithm complete`,
  };
}
