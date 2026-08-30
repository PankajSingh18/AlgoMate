/**
 * Pure generator logic for Floyd-Warshall Algorithm
 */

const formatDistance = (value) => (value === Infinity ? "Infinity" : value);

export function* floydWarshallGenerator(nodes, edges) {
  const ids = nodes.map((node) => node.id);
  if (ids.length === 0) return;

  const labels = Object.fromEntries(nodes.map((node) => [node.id, node.label || node.id]));
  const dist = {};

  ids.forEach((from) => {
    dist[from] = {};
    ids.forEach((to) => {
      dist[from][to] = from === to ? 0 : Infinity;
    });
  });

  const cloneMatrix = () =>
    Object.fromEntries(ids.map((from) => [from, Object.fromEntries(ids.map((to) => [to, dist[from][to]]))]));

  yield {
    visitedNodes: new Set(),
    visitingNodes: new Set(),
    activeEdge: null,
    matrix: cloneMatrix(),
    matrixNodes: ids,
    description: "Initialize the distance matrix with 0 on the diagonal and infinity elsewhere.",
  };

  for (const edge of edges) {
    const weight = Number(edge.weight) || 0;
    if (!dist[edge.from] || !(edge.to in dist[edge.from])) continue;
    dist[edge.from][edge.to] = Math.min(dist[edge.from][edge.to], weight);
    if (!edge.directed && dist[edge.to] && edge.from in dist[edge.to]) {
      dist[edge.to][edge.from] = Math.min(dist[edge.to][edge.from], weight);
    }

    yield {
      visitedNodes: new Set(),
      visitingNodes: new Set([edge.from, edge.to]),
      activeEdge: { from: edge.from, to: edge.to },
      matrix: cloneMatrix(),
      matrixNodes: ids,
      row: edge.from,
      col: edge.to,
      description: `Set direct distance ${labels[edge.from]} → ${labels[edge.to]} to ${weight}.`,
    };
  }

  for (const k of ids) {
    yield {
      visitedNodes: new Set(),
      visitingNodes: new Set([k]),
      activeEdge: null,
      matrix: cloneMatrix(),
      matrixNodes: ids,
      intermediate: k,
      description: `Allow ${labels[k]} as an intermediate vertex.`,
    };

    for (const i of ids) {
      for (const j of ids) {
        const viaK =
          dist[i][k] === Infinity || dist[k][j] === Infinity
            ? Infinity
            : dist[i][k] + dist[k][j];
        const current = dist[i][j];
        const improves = viaK < current;

        yield {
          visitedNodes: new Set(),
          visitingNodes: new Set([i, k, j]),
          activeEdge: i !== k ? { from: i, to: k } : k !== j ? { from: k, to: j } : null,
          matrix: cloneMatrix(),
          matrixNodes: ids,
          intermediate: k,
          row: i,
          col: j,
          via: viaK,
          description: `Check ${labels[i]} → ${labels[j]} through ${labels[k]}: ${formatDistance(current)} vs ${formatDistance(viaK)}.`,
        };

        if (improves) {
          dist[i][j] = viaK;
          yield {
            visitedNodes: new Set(),
            visitingNodes: new Set([i, k, j]),
            activeEdge: k !== j ? { from: k, to: j } : null,
            matrix: cloneMatrix(),
            matrixNodes: ids,
            intermediate: k,
            row: i,
            col: j,
            updatedCell: { row: i, col: j },
            description: `Update ${labels[i]} → ${labels[j]} to ${viaK} using ${labels[k]}.`,
          };
        }
      }
    }
  }

  yield {
    visitedNodes: new Set(ids),
    visitingNodes: new Set(),
    activeEdge: null,
    matrix: cloneMatrix(),
    matrixNodes: ids,
    description: "Floyd-Warshall complete. The matrix now contains all-pairs shortest paths.",
  };
}
