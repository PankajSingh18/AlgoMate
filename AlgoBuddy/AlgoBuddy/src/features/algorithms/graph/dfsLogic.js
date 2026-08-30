/**
 * Pure generator logic for Depth-First Search (DFS)
 */

export function* dfsGenerator(adj, startNode) {
  if (!startNode || !adj[startNode]) return;

  const visited = new Set();
  const stack = [startNode];

  function* runDFS(u, p = null) {
    visited.add(u);
    
    yield {
      visitedNodes: new Set(visited),
      visitingNodes: new Set([u]),
      activeEdge: p ? { from: p, to: u } : null,
      stack: [...stack],
      currentNode: u,
      description: `Visiting node ${u}`,
    };

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      const neighborId = typeof v === 'object' ? v.node : v;
      if (!visited.has(neighborId)) {
        stack.push(neighborId);
        yield* runDFS(neighborId, u);
        
        // Backtracking frame
        yield {
          visitedNodes: new Set(visited),
          visitingNodes: new Set([u]),
          activeEdge: null,
          stack: [...stack],
          currentNode: u,
          description: `Backtracking to node ${u}`,
        };
      }
    }
    stack.pop();
  }

  yield* runDFS(startNode);
  
  yield {
    visitedNodes: new Set(visited),
    visitingNodes: new Set(),
    activeEdge: null,
    stack: [...stack],
    currentNode: null,
    description: `DFS traversal complete`,
  };
}
