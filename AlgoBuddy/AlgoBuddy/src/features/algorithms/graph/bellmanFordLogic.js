/**
 * Pure generator logic for Bellman-Ford Algorithm
 */

export function* bellmanFordGenerator(nodes, edges, startNode) {
  if (!startNode || nodes.length === 0) return;

  const nodeIds = nodes.map((n) => n.id);
  const distances = {};
  nodeIds.forEach((id) => { distances[id] = id === startNode ? 0 : Infinity; });

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set([startNode]),
    activeEdge: null,
    distances: { ...distances },
    updatedNode: null,
    phase: "relaxing",
    negativeCycle: false,
    description: `Initialize: distance to ${startNode} = 0, all others = ∞`,
  };

  const V = nodeIds.length;

  for (let pass = 1; pass <= V - 1; pass++) {
    let anyUpdate = false;
    for (const edge of edges) {
      const { from, to, weight } = edge;
      const w = Number(weight) || 0;
      
      yield {
        visitedNodes: new Set(),
        visitingNodes: new Set([from, to]),
        activeEdge: { from, to },
        distances: { ...distances },
        updatedNode: null,
        phase: "relaxing",
        negativeCycle: false,
        description: `Pass ${pass}: checking edge ${from} → ${to} (weight: ${w})`,
      };
      
      if (distances[from] !== Infinity && distances[from] + w < distances[to]) {
        distances[to] = distances[from] + w;
        anyUpdate = true;
        
        yield {
          visitedNodes: new Set(),
          visitingNodes: new Set([from, to]),
          activeEdge: { from, to },
          distances: { ...distances },
          updatedNode: to,
          phase: "relaxing",
          negativeCycle: false,
          description: `Relaxed! dist[${to}] updated to ${distances[to]} via ${from}`,
        };
      }
    }
    if (!anyUpdate) {
      yield { 
        visitedNodes: new Set(nodeIds), 
        visitingNodes: new Set(), 
        activeEdge: null, 
        distances: { ...distances }, 
        updatedNode: null, 
        phase: "done", 
        negativeCycle: false, 
        description: `Early termination after pass ${pass} — shortest paths found.` 
      };
      return;
    }
  }

  let negativeCycle = false;
  for (const edge of edges) {
    const { from, to, weight } = edge;
    const w = Number(weight) || 0;
    
    yield { 
      visitedNodes: new Set(), 
      visitingNodes: new Set([from, to]), 
      activeEdge: { from, to }, 
      distances: { ...distances }, 
      updatedNode: null, 
      phase: "detecting", 
      negativeCycle: false, 
      description: `Negative cycle check: edge ${from} → ${to}` 
    };
    
    if (distances[from] !== Infinity && distances[from] + w < distances[to]) {
      negativeCycle = true;
      yield { 
        visitedNodes: new Set(), 
        visitingNodes: new Set([from, to]), 
        activeEdge: { from, to }, 
        distances: { ...distances }, 
        updatedNode: to, 
        phase: "detecting", 
        negativeCycle: true, 
        description: `⚠️ Negative cycle detected! Edge ${from} → ${to} still improves distance.` 
      };
      break;
    }
  }

  yield { 
    visitedNodes: new Set(nodeIds), 
    visitingNodes: new Set(), 
    activeEdge: null, 
    distances: { ...distances }, 
    updatedNode: null, 
    phase: "done", 
    negativeCycle, 
    description: negativeCycle ? "⚠️ Bellman-Ford complete — Negative cycle detected!" : "✅ Bellman-Ford complete — Shortest paths found." 
  };
}
