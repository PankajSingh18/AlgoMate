// utils/graph.js
// Pure graph logic — no React, no DOM. Works for both directed and undirected graphs.

/**
 * Build adjacency list from edges
 * In weighted mode, each entry is { to, weight } instead of just a node index.
 * @param {number} nodeCount
 * @param {Array<{from: number, to: number, weight?: number}>} edges
 * @param {boolean} isDirected
 * @param {boolean} isWeighted
 * @returns {Object} adjacency list
 */
export function buildAdjacencyList(nodeCount, edges, isDirected, isWeighted = false) {
  const adj = {};
  for (let i = 0; i < nodeCount; i++) adj[i] = [];

  for (const { from, to, weight = 1 } of edges) {
    adj[from].push(isWeighted ? { to, weight } : to);
    if (!isDirected) adj[to].push(isWeighted ? { to: from, weight } : from);
  }
  return adj;
}

/**
 * Build adjacency matrix from edges
 * In weighted mode, matrix[u][v] = weight instead of 1.
 * @param {number} nodeCount
 * @param {Array<{from: number, to: number, weight?: number}>} edges
 * @param {boolean} isDirected
 * @param {boolean} isWeighted
 * @returns {number[][]} n×n matrix
 */
export function buildAdjacencyMatrix(nodeCount, edges, isDirected, isWeighted = false) {
  const matrix = Array.from({ length: nodeCount }, () => Array(nodeCount).fill(0));
  for (const { from, to, weight = 1 } of edges) {
    matrix[from][to] = isWeighted ? weight : 1;
    if (!isDirected) matrix[to][from] = isWeighted ? weight : 1;
  }
  return matrix;
}

/**
 * BFS traversal — returns ordered array of step snapshots
 * Each step: { visited: Set, current: number, queue: number[] }
 * @param {Object} adj adjacency list
 * @param {number} start starting node
 * @returns {Array} steps
 */
export function bfsSteps(adj, start) {
  const steps = [];
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift();
    steps.push({ current, visited: new Set(visited), queue: [...queue] });

    for (const neighbor of (adj[current] || [])) {
      const id = typeof neighbor === "object" ? neighbor.to : neighbor;
      if (!visited.has(id)) {
        visited.add(id);
        queue.push(id);
      }
    }
  }
  return steps;
}

/**
 * DFS traversal — returns ordered array of step snapshots
 * Each step: { visited: Set, current: number, stack: number[] }
 * @param {Object} adj adjacency list
 * @param {number} start starting node
 * @returns {Array} steps
 */
export function dfsSteps(adj, start) {
  const steps = [];
  const visited = new Set();

  function dfs(node) {
    visited.add(node);
    steps.push({ current: node, visited: new Set(visited), stack: [] });
    for (const neighbor of (adj[node] || [])) {
      const id = typeof neighbor === "object" ? neighbor.to : neighbor;
      if (!visited.has(id)) dfs(id);
    }
  }

  dfs(start);
  return steps;
}

/**
 * Dijkstra's shortest path algorithm
 * @param {Object} adj weighted adjacency list { to, weight }[]
 * @param {number} start starting node
 * @param {number} nodeCount
 * @returns {Array} steps — each step: { current, visited: Set, distances: Object }
 */
export function dijkstraSteps(adj, start, nodeCount) {
  const steps = [];
  const distances = {};
  const visited = new Set();

  for (let i = 0; i < nodeCount; i++) distances[i] = Infinity;
  distances[start] = 0;

  for (let i = 0; i < nodeCount; i++) {
    // Pick unvisited node with smallest distance
    let u = -1;
    for (let v = 0; v < nodeCount; v++) {
      if (!visited.has(v) && (u === -1 || distances[v] < distances[u])) u = v;
    }
    if (u === -1 || distances[u] === Infinity) break;

    visited.add(u);
    steps.push({ current: u, visited: new Set(visited), distances: { ...distances } });

    for (const { to, weight } of (adj[u] || [])) {
      if (!visited.has(to) && distances[u] + weight < distances[to]) {
        distances[to] = distances[u] + weight;
      }
    }
  }
  return steps;
}

/**
 * Prim's MST algorithm
 * @param {Object} adj weighted adjacency list { to, weight }[]
 * @param {number} start starting node
 * @param {number} nodeCount
 * @returns {Array} steps — each step: { current, visited: Set, mstEdges: Array }
 */
export function primSteps(adj, start, nodeCount) {
  const steps = [];
  const visited = new Set();
  const mstEdges = [];

  visited.add(start);

  while (visited.size < nodeCount) {
    let bestEdge = null;
    let bestWeight = Infinity;

    for (const u of visited) {
      for (const { to, weight } of (adj[u] || [])) {
        if (!visited.has(to) && weight < bestWeight) {
          bestWeight = weight;
          bestEdge = { from: u, to, weight };
        }
      }
    }

    if (!bestEdge) break;

    visited.add(bestEdge.to);
    mstEdges.push(bestEdge);
    steps.push({ current: bestEdge.to, visited: new Set(visited), mstEdges: [...mstEdges] });
  }
  return steps;
}

/**
 * Detect cycle in a directed graph using DFS
 * @param {number} nodeCount
 * @param {Object} adj adjacency list
 * @returns {boolean}
 */
export function hasCycleDirected(nodeCount, adj) {
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = Array(nodeCount).fill(WHITE);

  function dfs(u) {
    color[u] = GRAY;
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === "object" ? neighbor.to : neighbor;
      if (color[v] === GRAY) return true;
      if (color[v] === WHITE && dfs(v)) return true;
    }
    color[u] = BLACK;
    return false;
  }

  for (let i = 0; i < nodeCount; i++) {
    if (color[i] === WHITE && dfs(i)) return true;
  }
  return false;
}

/**
 * Topological sort (Kahn's algorithm) — only valid for directed acyclic graphs
 * @param {number} nodeCount
 * @param {Object} adj adjacency list
 * @returns {number[] | null} sorted order, or null if cycle detected
 */
export function topologicalSort(nodeCount, adj) {
  const inDegree = Array(nodeCount).fill(0);
  for (let u = 0; u < nodeCount; u++) {
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === "object" ? neighbor.to : neighbor;
      inDegree[v]++;
    }
  }

  const queue = [];
  for (let i = 0; i < nodeCount; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const neighbor of (adj[u] || [])) {
      const v = typeof neighbor === "object" ? neighbor.to : neighbor;
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    }
  }

  return order.length === nodeCount ? order : null;
}