const baseRelatedLinks = [
  {
    key: "adjacency-matrix",
    text: "Adjacency Matrix",
    url: "/visualizer/graph/adjacency-matrix",
  },
  {
    key: "adjacency-list",
    text: "Adjacency List",
    url: "/visualizer/graph/adjacency-list",
  },
  { key: "bfs", text: "BFS", url: "/visualizer/graph/bfs" },
  { key: "dfs", text: "DFS", url: "/visualizer/graph/dfs" },
  { key: "dijkstra", text: "Dijkstra", url: "/visualizer/graph/dijkstra" },
  { key: "bellman-ford", text: "Bellman-Ford", url: "/visualizer/graph/bellman-ford" },
  { key: "kosaraju", text: "Kosaraju", url: "/visualizer/graph/kosaraju" },
  {
    key: "floyd-warshall",
    text: "Floyd-Warshall",
    url: "/visualizer/graph/floyd-warshall",
  },
  { key: "prim", text: "Prim", url: "/visualizer/graph/prim" },
  { key: "kruskal", text: "Kruskal", url: "/visualizer/graph/kruskal" },
  {
    key: "topological-sort",
    text: "Topological Sort",
    url: "/visualizer/graph/topological-sort",
  },
  {
    key: "kosaraju",
    text: "Kosaraju's Algorithm",
    url: "/visualizer/graph/kosaraju",
  },
  {
    key: "tarjan",
    text: "Tarjan's Algorithm",
    url: "/visualizer/graph/tarjan",
  },
];

export const graphTopics = {
  "adjacency-matrix": {
    key: "adjacency-matrix",
    title: "Adjacency Matrix",
    category: "Graph Representation",
    description:
      "Represent graph connections with a two-dimensional matrix where each cell shows whether an edge exists between two vertices.",
    animationType: "matrix",
    summary: [
      "An adjacency matrix stores graph edges in a V x V grid.",
      "Cell matrix[i][j] is 1 or the edge weight when vertex i connects to vertex j.",
      "It gives O(1) edge lookup, but uses O(V^2) space even for sparse graphs.",
    ],
    steps: [
      "List all vertices as rows and columns.",
      "Mark matrix[i][j] when an edge connects vertex i to vertex j.",
      "Mirror the value for undirected graphs.",
      "Use weights instead of 1 for weighted graphs.",
    ],
    complexity: [
      { label: "Space", value: "O(V^2)" },
      { label: "Edge lookup", value: "O(1)" },
      { label: "List neighbors", value: "O(V)" },
    ],
  },
  "adjacency-list": {
    key: "adjacency-list",
    title: "Adjacency List",
    category: "Graph Representation",
    description:
      "Represent each vertex with a list of neighbors, making sparse graphs compact and easy to traverse.",
    animationType: "list",
    summary: [
      "An adjacency list maps every vertex to the vertices directly connected to it.",
      "It uses space proportional to vertices plus edges.",
      "It is the common default for traversal and graph algorithms on sparse graphs.",
    ],
    steps: [
      "Create one list for every vertex.",
      "Append each destination vertex to the source list.",
      "For undirected graphs, append both directions.",
      "Store edge weights beside neighbors when needed.",
    ],
    complexity: [
      { label: "Space", value: "O(V + E)" },
      { label: "Edge lookup", value: "O(degree)" },
      { label: "List neighbors", value: "O(degree)" },
    ],
  },
  bfs: {
    key: "bfs",
    title: "Breadth-First Search",
    category: "Graph Traversal",
    description:
      "Explore a graph level by level using a queue, visiting all nearest vertices before moving deeper.",
    animationType: "bfs",
    summary: [
      "BFS starts from one source vertex and explores neighbors level by level.",
      "A queue preserves the order of discovery.",
      "It finds shortest paths in unweighted graphs.",
    ],
    steps: [
      "Push the start vertex into a queue and mark it visited.",
      "Remove the front vertex from the queue.",
      "Visit each unvisited neighbor and push it into the queue.",
      "Repeat until the queue is empty.",
    ],
    complexity: [
      { label: "Time", value: "O(V + E)" },
      { label: "Space", value: "O(V)" },
      { label: "Best for", value: "Unweighted shortest path" },
    ],
  },
  dfs: {
    key: "dfs",
    title: "Depth-First Search",
    category: "Graph Traversal",
    description:
      "Explore as far as possible along one path before backtracking to visit remaining branches.",
    animationType: "dfs",
    summary: [
      "DFS dives deep into one branch before returning to alternatives.",
      "It can be implemented with recursion or an explicit stack.",
      "It is useful for connected components, cycle checks, and topological ordering.",
    ],
    steps: [
      "Start from a vertex and mark it visited.",
      "Move to an unvisited neighbor.",
      "Continue until no unvisited neighbor remains.",
      "Backtrack and explore the next available branch.",
    ],
    complexity: [
      { label: "Time", value: "O(V + E)" },
      { label: "Space", value: "O(V)" },
      { label: "Best for", value: "Reachability and cycles" },
    ],
  },
  dijkstra: {
    key: "dijkstra",
    title: "Dijkstra's Algorithm",
    category: "Advanced Graphs",
    description:
      "Find shortest paths from one source to all vertices in a weighted graph with non-negative edge weights.",
    animationType: "dijkstra",
    summary: [
      "Dijkstra keeps the shortest known distance to each vertex.",
      "The next vertex chosen is always the unvisited one with the smallest distance.",
      "It does not support negative edge weights.",
    ],
    steps: [
      "Set source distance to 0 and all others to infinity.",
      "Pick the unvisited vertex with the smallest distance.",
      "Relax all outgoing edges from that vertex.",
      "Repeat until all reachable vertices are finalized.",
    ],
    complexity: [
      { label: "Time", value: "O((V + E) log V)" },
      { label: "Space", value: "O(V)" },
      { label: "Requirement", value: "No negative weights" },
    ],
  },
  "floyd-warshall": {
    key: "floyd-warshall",
    title: "Floyd-Warshall Algorithm",
    category: "Graph Algorithm",
    description:
      "Find the shortest paths between every pair of vertices by repeatedly allowing one more intermediate vertex.",
    animationType: "floyd-warshall",
    summary: [
      "Floyd-Warshall computes all-pairs shortest paths with dynamic programming.",
      "The distance matrix starts with direct edge weights, zeroes on the diagonal, and infinity for unreachable pairs.",
      "For each intermediate vertex k, it checks whether i -> k -> j improves the current distance from i to j.",
    ],
    steps: [
      "Initialize a V x V distance matrix from the weighted graph.",
      "Choose each vertex k as the allowed intermediate vertex.",
      "For every source i and destination j, compare dist[i][j] with dist[i][k] + dist[k][j].",
      "Update dist[i][j] when the route through k is shorter.",
      "After all k values are processed, the matrix stores shortest distances for every ordered pair.",
    ],
    complexity: [
      { label: "Time", value: "O(V^3)" },
      { label: "Space", value: "O(V^2)" },
      { label: "Output", value: "All-pairs shortest paths" },
    ],
  },
  prim: {
    key: "prim",
    title: "Prim's Algorithm",
    category: "Minimum Spanning Tree",
    description:
      "Build a minimum spanning tree by repeatedly adding the cheapest edge from the current tree to a new vertex.",
    animationType: "prim",
    summary: [
      "Prim grows one connected tree from an arbitrary start vertex.",
      "At each step it chooses the lowest-weight edge leaving the current tree.",
      "It works on connected, weighted, undirected graphs.",
    ],
    steps: [
      "Start from any vertex.",
      "Find all edges that connect the tree to an unvisited vertex.",
      "Choose the smallest such edge.",
      "Add the edge and vertex to the tree until all vertices are included.",
    ],
    complexity: [
      { label: "Time", value: "O(E log V)" },
      { label: "Space", value: "O(V)" },
      { label: "Output", value: "Minimum spanning tree" },
    ],
  },
  kruskal: {
    key: "kruskal",
    title: "Kruskal's Algorithm",
    category: "Minimum Spanning Tree",
    description:
      "Build a minimum spanning tree by sorting edges and adding the smallest edges that do not create a cycle.",
    animationType: "kruskal",
    summary: [
      "Kruskal sorts all edges by weight.",
      "It adds the next smallest edge only when it connects two different components.",
      "Union-Find is used to detect cycles efficiently.",
    ],
    steps: [
      "Sort all graph edges by ascending weight.",
      "Start with every vertex in its own component.",
      "Take the next smallest edge.",
      "Add it if it connects two different components; otherwise skip it.",
      "Stop after selecting V - 1 edges.",
    ],
    complexity: [
      { label: "Time", value: "O(E log E)" },
      { label: "Space", value: "O(V)" },
      { label: "Output", value: "Minimum spanning tree" },
    ],
  },
  "topological-sort": {
    key: "topological-sort",
    title: "Topological Sort",
    category: "Directed Acyclic Graph",
    description:
      "Order vertices so every directed edge points from an earlier vertex to a later vertex.",
    animationType: "topological",
    summary: [
      "Topological sort works only on directed acyclic graphs.",
      "It is useful for dependency scheduling and build order problems.",
      "Kahn's algorithm repeatedly removes vertices with zero incoming edges.",
    ],
    steps: [
      "Compute indegree for each vertex.",
      "Push all zero-indegree vertices into a queue.",
      "Remove one vertex and append it to the order.",
      "Decrease indegree of its neighbors.",
      "Repeat until all vertices are ordered.",
    ],
    complexity: [
      { label: "Time", value: "O(V + E)" },
      { label: "Space", value: "O(V)" },
      { label: "Requires", value: "DAG" },
    ],
  },

  "bellman-ford": {
    key: "bellman-ford",
    title: "Bellman-Ford Algorithm",
    category: "Graph Algorithm",
    description:
      "Find shortest paths from a source vertex to all others, handling negative weight edges and detecting negative weight cycles.",
    animationType: "bellman-ford",
    summary: [
      "Bellman-Ford relaxes all edges V-1 times, where V is the number of vertices.",
      "Unlike Dijkstra, it correctly handles negative weight edges.",
      "A final extra pass over all edges detects negative weight cycles.",
      "If any distance still improves in the final pass, a negative cycle exists.",
    ],
    steps: [
      "Set distance to source as 0 and all other distances to infinity.",
      "Repeat V-1 times: for every edge (u, v, w), if dist[u] + w < dist[v], update dist[v].",
      "Run one more pass over all edges.",
      "If any distance improves, a negative cycle is present in the graph.",
    ],
    complexity: [
      { label: "Time", value: "O(V * E)" },
      { label: "Space", value: "O(V)" },
      { label: "Best for", value: "Negative weight edges / cycle detection" },
    ],
  },
  kosaraju: {
    key: "kosaraju",
    title: "Kosaraju's Algorithm",
    category: "Strongly Connected Components",
    description:
      "Find Strongly Connected Components (SCCs) in a directed graph using two passes of Depth-First Search (DFS).",
    animationType: "kosaraju",
    summary: [
      "Kosaraju's algorithm uses two DFS passes.",
      "First pass finds the finishing times of nodes in the original graph.",
      "Second pass runs DFS on the transposed (reversed) graph in order of decreasing finishing time.",
    ],
    steps: [
      "Run DFS on the original graph and push finished nodes to a stack.",
      "Reverse the direction of all edges to create a transposed graph.",
      "Pop nodes from the stack and run DFS on unvisited nodes in the transposed graph.",
      "Each resulting DFS forest is a Strongly Connected Component.",
    ],
    complexity: [
      { label: "Time", value: "O(V + E)" },
      { label: "Space", value: "O(V + E)" },
      { label: "Best for", value: "Finding SCCs efficiently" },
    ],
  },
  tarjan: {
    key: "tarjan",
    title: "Tarjan's Algorithm",
    category: "Strongly Connected Components",
    description:
      "Find Strongly Connected Components (SCCs) in a single pass using a stack and tracking low-link values.",
    animationType: "tarjan",
    summary: [
      "Tarjan's algorithm finds SCCs in a single DFS pass.",
      "It maintains an id, a low-link value, and a boolean for whether a node is on the current stack.",
      "An SCC is found when a node's id matches its low-link value after returning from its descendants.",
    ],
    steps: [
      "Run DFS, assigning IDs and low-link values, pushing nodes to a stack.",
      "Update a node's low-link value based on descendants and back-edges to nodes on the stack.",
      "If a node's ID equals its low-link value, it is the root of an SCC.",
      "Pop the stack to extract all nodes in this newly discovered SCC.",
    ],
    complexity: [
      { label: "Time", value: "O(V + E)" },
      { label: "Space", value: "O(V)" },
      { label: "Best for", value: "Single-pass SCC finding" },
    ],
  },
};

export function getGraphRelatedLinks(currentKey) {
  return baseRelatedLinks
    .filter((link) => link.key !== currentKey)
    .map(({ key, ...link }) => link);
}