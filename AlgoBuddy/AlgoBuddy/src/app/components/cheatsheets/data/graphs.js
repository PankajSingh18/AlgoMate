export const graphsCheatsheets = [
  {
    id: "bfs",
    title: "Breadth-First Search",
    category: "graphs",
    difficulty: "intermediate",
    timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    code: {
      javascript: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  visited.add(start);
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return result;
}`,
      python: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result`
    },
    steps: [
      "Start from the given source node",
      "Mark it visited and enqueue it",
      "Dequeue a node, process it, and enqueue all unvisited neighbors",
      "Repeat until the queue is empty"
    ],
    whenToUse: "Shortest path in unweighted graphs; level-order traversal; web crawling",
    pitfalls: "O(V) memory for the queue; may explore many nodes unnecessarily for deep targets"
  },
  {
    id: "dfs",
    title: "Depth-First Search",
    category: "graphs",
    difficulty: "intermediate",
    timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    code: {
      javascript: `// Iterative
function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  const result = [];
  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    result.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) stack.push(neighbor);
    }
  }
  return result;
}
// Recursive
function dfsRecursive(graph, node, visited = new Set(), result = []) {
  visited.add(node);
  result.push(node);
  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) dfsRecursive(graph, neighbor, visited, result);
  }
  return result;
}`,
      python: `def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []
    while stack:
        node = stack.pop()
        if node in visited: continue
        visited.add(node)
        result.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)
    return result

def dfs_recursive(graph, node, visited=None, result=None):
    if visited is None: visited = set()
    if result is None: result = []
    visited.add(node)
    result.append(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited, result)
    return result`
    },
    steps: [
      "Start from the source node and mark it visited",
      "Recursively visit an unvisited neighbor (or push to stack)",
      "Backtrack when no unvisited neighbors remain",
      "Continue until all reachable nodes are visited"
    ],
    whenToUse: "Path existence; cycle detection; topological sorting; maze solving",
    pitfalls: "May go very deep; iterative version avoids recursion stack overflow"
  },
  {
    id: "dijkstra",
    title: "Dijkstra's Algorithm",
    category: "graphs",
    difficulty: "advanced",
    timeComplexity: { best: "O((V + E) log V)", average: "O((V + E) log V)", worst: "O((V + E) log V)" },
    spaceComplexity: "O(V)",
    code: {
      javascript: `function dijkstra(graph, start) {
  const dist = {};
  const pq = [[0, start]];
  for (const node in graph) dist[node] = Infinity;
  dist[start] = 0;
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d > dist[u]) continue;
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  return dist;
}`,
      python: `import heapq

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(pq, (dist[v], v))
    return dist`
    },
    steps: [
      "Initialize distances: source = 0, all others = infinity",
      "Extract the unvisited node with the smallest distance",
      "Relax all its neighbors (update if shorter path found)",
      "Repeat until all nodes are processed"
    ],
    whenToUse: "Shortest path in weighted graphs with non-negative edges; GPS navigation",
    pitfalls: "Fails with negative edge weights; use a priority queue for efficiency"
  }
];
