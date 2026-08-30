/**
 * Pure generator logic for Tarjan's Algorithm (Strongly Connected Components)
 */

export function* tarjanGenerator(adj, nodes) {
  const nodeIds = nodes.map(n => n.id);
  if (nodeIds.length === 0) return;

  let id = 0;
  const ids = {};
  const low = {};
  const onStack = {};
  const stack = [];
  const sccs = [];

  nodeIds.forEach(n => {
    ids[n] = -1;
    low[n] = -1;
    onStack[n] = false;
  });

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    stack: [],
    sccs: [],
    ids: { ...ids },
    low: { ...low },
    description: "Initializing Tarjan's Algorithm: variables (id, low) set to -1.",
  };

  function* dfs(u) {
    ids[u] = low[u] = id++;
    stack.push(u);
    onStack[u] = true;

    yield {
      visitedNodes: new Set(Object.keys(ids).filter(k => ids[k] !== -1)),
      visitingNodes: new Set([u]),
      activeEdge: null,
      stack: [...stack],
      sccs: [...sccs],
      ids: { ...ids },
      low: { ...low },
      description: `Visiting ${u}: id=${ids[u]}, low=${low[u]}, pushed to stack.`,
    };

    const neighbors = adj[u] || [];
    for (const v of neighbors) {
      const neighborId = typeof v === 'object' ? v.node : v;
      
      yield {
        visitedNodes: new Set(Object.keys(ids).filter(k => ids[k] !== -1)),
        visitingNodes: new Set([u, neighborId]),
        activeEdge: { from: u, to: neighborId },
        stack: [...stack],
        sccs: [...sccs],
        ids: { ...ids },
        low: { ...low },
        description: `Checking edge ${u} → ${neighborId}`,
      };

      if (ids[neighborId] === -1) {
        // Unvisited
        yield* dfs(neighborId);
        low[u] = Math.min(low[u], low[neighborId]);
        yield {
          visitedNodes: new Set(Object.keys(ids).filter(k => ids[k] !== -1)),
          visitingNodes: new Set([u]),
          activeEdge: null,
          stack: [...stack],
          sccs: [...sccs],
          ids: { ...ids },
          low: { ...low },
          description: `Returned to ${u} from ${neighborId}. Updated low[${u}] = ${low[u]}.`,
        };
      } else if (onStack[neighborId]) {
        // Visited and on stack (back edge)
        low[u] = Math.min(low[u], ids[neighborId]);
        yield {
          visitedNodes: new Set(Object.keys(ids).filter(k => ids[k] !== -1)),
          visitingNodes: new Set([u]),
          activeEdge: null,
          stack: [...stack],
          sccs: [...sccs],
          ids: { ...ids },
          low: { ...low },
          description: `Node ${neighborId} is on stack. Updated low[${u}] = ${low[u]}.`,
        };
      }
    }

    // After visiting all neighbors, check if we found an SCC root
    if (ids[u] === low[u]) {
      const currentScc = [];
      let poppedNode;
      do {
        poppedNode = stack.pop();
        onStack[poppedNode] = false;
        currentScc.push(poppedNode);
      } while (poppedNode !== u);
      
      sccs.push([...currentScc]);
      
      yield {
        visitedNodes: new Set(Object.keys(ids).filter(k => ids[k] !== -1)),
        visitingNodes: new Set(),
        activeEdge: null,
        stack: [...stack],
        sccs: [...sccs],
        ids: { ...ids },
        low: { ...low },
        description: `ids[${u}] == low[${u}]. Popped SCC: [${currentScc.join(', ')}]`,
      };
    }
  }

  for (const n of nodeIds) {
    if (ids[n] === -1) {
      yield* dfs(n);
    }
  }

  yield {
    visitedNodes: new Set(Object.keys(ids).filter(k => ids[k] !== -1)),
    visitingNodes: new Set(),
    activeEdge: null,
    stack: [],
    sccs: [...sccs],
    ids: { ...ids },
    low: { ...low },
    description: `Tarjan's Algorithm complete. Found ${sccs.length} SCCs.`,
  };
}
