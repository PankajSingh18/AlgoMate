/**
 * Pure generator logic for Breadth-First Search (BFS)
 */

export function* bfsGenerator(adj, startNode) {
  if (!startNode || !adj[startNode]) return;

  const visited = new Set();
  const queue = [startNode];
  visited.add(startNode);

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    queue: [...queue],
    currentNode: startNode,
    description: `Starting BFS from node ${startNode}`,
  };

  while (queue.length > 0) {
    const u = queue.shift();
    
    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: null,
      queue: [...queue],
      currentNode: u,
      description: `Exploring neighbors of node ${u}`,
    };

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      const neighborId = typeof v === 'object' ? v.node : v;
      
      if (!visited.has(neighborId)) {
        yield {
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u, neighborId]),
          activeEdge: { from: u, to: neighborId },
          queue: [...queue],
          currentNode: u,
          description: `Found unvisited neighbor ${neighborId}, adding to queue`,
        };

        visited.add(neighborId);
        queue.push(neighborId);

        yield {
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u]),
          activeEdge: null,
          queue: [...queue],
          currentNode: u,
          description: `Node ${neighborId} is now in queue`,
        };
      }
    }
    
    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set(),
      activeEdge: null,
      queue: [...queue],
      currentNode: u,
      description: `Finished exploring node ${u}`,
    };
  }
}
