'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Disjoint Set Union (DSU / Union-Find) Implementation
class DSU {
    constructor(n) {
        // Initialize parent pointing to itself and rank/size to default
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.size = new Array(n).fill(1);
    }

    // Find operation with Path Compression
    find(i) {
        if (this.parent[i] === i) {
            return i;
        }
        // Path compression: recursively point parent directly to the root
        this.parent[i] = this.find(this.parent[i]);
        return this.parent[i];
    }

    // Union operation by Rank
    unionByRank(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);

        if (rootI === rootJ) {
            return false; // Already in the same set
        }

        // Attach smaller rank tree under larger rank tree
        if (this.rank[rootI] < this.rank[rootJ]) {
            this.parent[rootI] = rootJ;
            this.size[rootJ] += this.size[rootI];
        } else if (this.rank[rootI] > this.rank[rootJ]) {
            this.parent[rootJ] = rootI;
            this.size[rootI] += this.size[rootJ];
        } else {
            this.parent[rootJ] = rootI;
            this.size[rootI] += this.size[rootJ];
            this.rank[rootI] += 1;
        }
        return true;
    }
}

// Example usage:
const dsu = new DSU(6);
dsu.unionByRank(0, 1);
dsu.unionByRank(2, 3);
dsu.unionByRank(1, 2);
console.log(dsu.find(0) === dsu.find(3)); // true`,

  python: `# Disjoint Set Union (DSU / Union-Find) Implementation
class DSU:
    def __init__(self, n):
        # Initialize parent pointing to itself and rank/size to default
        self.parent = list(range(n))
        self.rank = [0] * n
        self.size = [1] * n

    # Find operation with Path Compression
    def find(self, i):
        if self.parent[i] == i:
            return i
        # Path compression: recursively point parent directly to the root
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    # Union operation by Rank
    def union_by_rank(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)

        if root_i == root_j:
            return False  # Already in the same set

        # Attach smaller rank tree under larger rank tree
        if self.rank[root_i] < self.rank[root_j]:
            self.parent[root_i] = root_j
            self.size[root_j] += self.size[root_i]
        elif self.rank[root_i] > self.rank[root_j]:
            self.parent[root_j] = root_i
            self.size[root_i] += self.size[root_j]
        else:
            self.parent[root_j] = root_i
            self.size[root_i] += self.size[root_j]
            self.rank[root_i] += 1
        return True`,

  java: `// Disjoint Set Union (DSU / Union-Find) Implementation
public class DSU {
    private int[] parent;
    private int[] rank;
    private int[] size;

    public DSU(int n) {
        parent = new int[n];
        rank = new int[n];
        size = new int[n];
        // Initialize parent pointing to itself and rank/size to default
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0;
            size[i] = 1;
        }
    }

    // Find operation with Path Compression
    public int find(int i) {
        if (parent[i] == i) {
            return i;
        }
        // Path compression: recursively point parent directly to the root
        parent[i] = find(parent[i]);
        return parent[i];
    }

    // Union operation by Rank
    public boolean unionByRank(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);

        if (rootI == rootJ) {
            return false; // Already in the same set
        }

        // Attach smaller rank tree under larger rank tree
        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
            size[rootJ] += size[rootI];
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
        } else {
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
            rank[rootI] += 1;
        }
        return true;
    }
}`,

  cpp: `// Disjoint Set Union (DSU / Union-Find) Implementation
#include <vector>
#include <numeric>

using namespace std;

class DSU {
private:
    vector<int> parent;
    vector<int> rank;
    vector<int> size;

public:
    DSU(int n) {
        parent.resize(n);
        iota(parent.begin(), parent.end(), 0); // parent[i] = i
        rank.assign(n, 0);
        size.assign(n, 1);
    }

    // Find operation with Path Compression
    int find(int i) {
        if (parent[i] == i) {
            return i;
        }
        // Path compression: recursively point parent directly to the root
        return parent[i] = find(parent[i]);
    }

    // Union operation by Rank
    bool unionByRank(int i, int j) {
        int rootI = find(i);
        int rootJ = find(j);

        if (rootI == rootJ) {
            return false; // Already in the same set
        }

        // Attach smaller rank tree under larger rank tree
        if (rank[rootI] < rank[rootJ]) {
            parent[rootI] = rootJ;
            size[rootJ] += size[rootI];
        } else if (rank[rootI] > rank[rootJ]) {
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
        } else {
            parent[rootJ] = rootI;
            size[rootI] += size[rootJ];
            rank[rootI] += 1;
        }
        return true;
    }
};`
};

const fileNames = {
  javascript: 'dsu.js',
  python: 'dsu.py',
  java: 'DSU.java',
  cpp: 'dsu.cpp'
};

const CodeBlock = () => (
  <CodeBlockUI
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default CodeBlock;
