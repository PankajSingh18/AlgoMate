/**
 * Pure generator logic for Topological Sort (Kahn's Algorithm)
 */

export function* topologicalSortGenerator(adj, nodes) {
  const inDegree = {};
  nodes.forEach(n => inDegree[n] = 0);

  Object.values(adj).forEach(neighbors => {
    neighbors.forEach(v => {
      const vId = typeof v === 'object' ? v.node : v;
      inDegree[vId] = (inDegree[vId] || 0) + 1;
    });
  });

  const queue = nodes.filter(n => inDegree[n] === 0);
  const result = [];

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(queue),
    activeEdge: null,
    queue: [...queue],
    result: [],
    description: "Initializing Topological Sort: computing in-degrees.",
  };

  while (queue.length > 0) {
    const u = queue.shift();
    result.push(u);

    yield {
      visitedNodes: new Set(result),
      visitingNodes: new Set([u]),
      activeEdge: null,
      queue: [...queue],
      result: [...result],
      description: `Processing node ${u} (in-degree 0), adding to result.`,
    };

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      const vId = typeof v === 'object' ? v.node : v;
      inDegree[vId]--;
      
      yield {
        visitedNodes: new Set(result),
        visitingNodes: new Set([u, vId]),
        activeEdge: { from: u, to: vId },
        queue: [...queue],
        result: [...result],
        description: `Decreasing in-degree of neighbor ${vId}.`,
      };

      if (inDegree[vId] === 0) {
        queue.push(vId);
        yield {
          visitedNodes: new Set(result),
          visitingNodes: new Set([vId]),
          activeEdge: null,
          queue: [...queue],
          result: [...result],
          description: `Node ${vId} now has in-degree 0, adding to queue.`,
        };
      }
    }
  }

  yield {
    visitedNodes: new Set(result),
    visitingNodes: new Set(),
    activeEdge: null,
    queue: [...queue],
    result: [...result],
    description: result.length === nodes.length 
      ? "Topological Sort complete. Valid ordering found."
      : "Topological Sort complete. Cycle detected! Not all nodes are in the result.",
  };
}
