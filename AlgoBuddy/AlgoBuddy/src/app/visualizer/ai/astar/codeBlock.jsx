'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// A* Search on a 2D grid in JavaScript
function aStar(start, goal, grid) {
  const openSet = [start];
  const cameFrom = new Map();
  const gScore = new Map([[key(start), 0]]);
  const fScore = new Map([[key(start), h(start, goal)]]);

  while (openSet.length) {
    // Sort openSet by fScore (lowest first)
    openSet.sort((a, b) => (fScore.get(key(a)) ?? Infinity) - (fScore.get(key(b)) ?? Infinity));
    const current = openSet.shift();

    if (current.row === goal.row && current.col === goal.col) {
      return reconstructPath(cameFrom, current);
    }

    for (const neighbor of getNeighbors(current, grid)) {
      const tentativeG = (gScore.get(key(current)) ?? Infinity) + 1;
      if (tentativeG < (gScore.get(key(neighbor)) ?? Infinity)) {
        cameFrom.set(key(neighbor), current);
        gScore.set(key(neighbor), tentativeG);
        fScore.set(key(neighbor), tentativeG + h(neighbor, goal));
        if (!openSet.some((node) => node.row === neighbor.row && node.col === neighbor.col)) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return []; // No path found
}

const key = (node) => \`\${node.row},\${node.col}\`;
const h = (a, b) => Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(key(current))) {
    current = cameFrom.get(key(current));
    path.push(current);
  }
  return path.reverse();
}

function getNeighbors(node, grid) {
  const neighbors = [];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of dirs) {
    const r = node.row + dr;
    const c = node.col + dc;
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length && !grid[r][c]) {
      neighbors.push({ row: r, col: c });
    }
  }
  return neighbors;
}`,

  python: `# A* Search on a 2D grid in Python
def a_star(start, goal, grid):
    open_set = [start]
    came_from = {}
    
    g_score = {start: 0}
    f_score = {start: h(start, goal)}

    while open_set:
        # Get node with the lowest f_score
        current = min(open_set, key=lambda node: f_score.get(node, float('inf')))
        
        if current == goal:
            return reconstruct_path(came_from, current)

        open_set.remove(current)

        for neighbor in get_neighbors(current, grid):
            tentative_g = g_score.get(current, float('inf')) + 1
            if tentative_g < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + h(neighbor, goal)
                if neighbor not in open_set:
                    open_set.append(neighbor)

    return []

def h(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    return list(reversed(path))

def get_neighbors(node, grid):
    neighbors = []
    r, c = node
    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nr, nc = r + dr, c + dc
        # 0 represents an empty cell, 1 represents a wall
        if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] == 0:
            neighbors.append((nr, nc))
    return neighbors`,

  java: `// A* Search on a 2D grid in Java
import java.util.*;

public class AStarGrid {
    static class Node {
        int r, c;
        Node(int r, int c) { this.r = r; this.c = c; }
        
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (!(o instanceof Node)) return false;
            Node node = (Node) o;
            return r == node.r && c == node.c;
        }

        @Override
        public int hashCode() {
            return Objects.hash(r, c);
        }
    }

    private static int h(Node a, Node b) {
        return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
    }

    public static List<Node> aStar(Node start, Node goal, int[][] grid) {
        PriorityQueue<Node> openSet = new PriorityQueue<>(
            Comparator.comparingInt(n -> h(n, goal))
        );
        Map<Node, Node> cameFrom = new HashMap<>();
        Map<Node, Integer> gScore = new HashMap<>();
        
        gScore.put(start, 0);
        openSet.add(start);

        while (!openSet.isEmpty()) {
            Node current = openSet.poll();

            if (current.equals(goal)) {
                return reconstructPath(cameFrom, current);
            }

            for (Node neighbor : getNeighbors(current, grid)) {
                int tentativeG = gScore.getOrDefault(current, Integer.MAX_VALUE) + 1;
                if (tentativeG < gScore.getOrDefault(neighbor, Integer.MAX_VALUE)) {
                    cameFrom.put(neighbor, current);
                    gScore.put(neighbor, tentativeG);
                    if (!openSet.contains(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }
        return new ArrayList<>(); // No path found
    }

    private static List<Node> reconstructPath(Map<Node, Node> cameFrom, Node current) {
        List<Node> path = new ArrayList<>();
        path.add(current);
        while (cameFrom.containsKey(current)) {
            current = cameFrom.get(current);
            path.add(current);
        }
        Collections.reverse(path);
        return path;
    }

    private static List<Node> getNeighbors(Node node, int[][] grid) {
        List<Node> neighbors = new ArrayList<>();
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        for (int[] d : dirs) {
            int nr = node.r + d[0];
            int nc = node.c + d[1];
            if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length && grid[nr][nc] == 0) {
                neighbors.add(new Node(nr, nc));
            }
        }
        return neighbors;
    }
}`,

  cpp: `// A* Search on a 2D grid in C++
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <cmath>
#include <algorithm>

struct Node {
    int r, c;
    bool operator==(const Node& other) const {
        return r == other.r && c == other.c;
    }
};

// Custom hash function for Node to use in unordered_map
struct NodeHash {
    std::size_t operator()(const Node& n) const {
        return std::hash<int>()(n.r) ^ (std::hash<int>()(n.c) << 1);
    }
};

int h(const Node& a, const Node& b) {
    return std::abs(a.r - b.r) + std::abs(a.c - b.c);
}

std::vector<Node> reconstructPath(std::unordered_map<Node, Node, NodeHash>& cameFrom, Node current) {
    std::vector<Node> path = {current};
    while (cameFrom.count(current)) {
        current = cameFrom[current];
        path.push_back(current);
    }
    std::reverse(path.begin(), path.end());
    return path;
}

std::vector<Node> getNeighbors(const Node& node, const std::vector<std::vector<int>>& grid) {
    std::vector<Node> neighbors;
    int dirs[4][2] = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
    for (auto& d : dirs) {
        int nr = node.r + d[0];
        int nc = node.c + d[1];
        if (nr >= 0 && nr < grid.size() && nc >= 0 && nc < grid[0].size() && grid[nr][nc] == 0) {
            neighbors.push_back({nr, nc});
        }
    }
    return neighbors;
}

std::vector<Node> aStar(Node start, Node goal, const std::vector<std::vector<int>>& grid) {
    // Min-heap sorted by f-score
    auto cmp = [&](const Node& left, const Node& right) {
        return h(left, goal) > h(right, goal);
    };
    std::priority_queue<Node, std::vector<Node>, decltype(cmp)> openSet(cmp);
    
    std::unordered_map<Node, Node, NodeHash> cameFrom;
    std::unordered_map<Node, int, NodeHash> gScore;
    
    gScore[start] = 0;
    openSet.push(start);
    
    while (!openSet.empty()) {
        Node current = openSet.top();
        openSet.pop();
        
        if (current == goal) {
            return reconstructPath(cameFrom, current);
        }
        
        for (const Node& neighbor : getNeighbors(current, grid)) {
            int tentativeG = gScore[current] + 1;
            if (!gScore.count(neighbor) || tentativeG < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeG;
                openSet.push(neighbor);
            }
        }
    }
    
    return {}; // No path found
}`,
};

const fileNames = {
  javascript: 'astar.js',
  python: 'astar.py',
  java: 'AStarGrid.java',
  cpp: 'astar.cpp',
};

const AStarCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default AStarCode;
