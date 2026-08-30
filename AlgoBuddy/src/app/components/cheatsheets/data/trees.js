export const treesCheatsheets = [
  {
    id: "binary-search-tree",
    title: "Binary Search Tree",
    category: "trees",
    difficulty: "beginner",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
class BST {
  constructor() { this.root = null; }
  insert(value) {
    const newNode = new Node(value);
    if (!this.root) { this.root = newNode; return; }
    let curr = this.root;
    while (true) {
      if (value < curr.value) {
        if (!curr.left) { curr.left = newNode; return; }
        curr = curr.left;
      } else {
        if (!curr.right) { curr.right = newNode; return; }
        curr = curr.right;
      }
    }
  }
  search(value) {
    let curr = this.root;
    while (curr) {
      if (value === curr.value) return curr;
      curr = value < curr.value ? curr.left : curr.right;
    }
    return null;
  }
}`,
      python: `class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, value):
        if not self.root:
            self.root = Node(value)
            return
        curr = self.root
        while True:
            if value < curr.value:
                if not curr.left:
                    curr.left = Node(value); return
                curr = curr.left
            else:
                if not curr.right:
                    curr.right = Node(value); return
                curr = curr.right

    def search(self, value):
        curr = self.root
        while curr:
            if value == curr.value: return curr
            curr = curr.left if value < curr.value else curr.right
        return None`
    },
    steps: [
      "Left subtree contains values smaller than the root",
      "Right subtree contains values larger than the root",
      "Left and right subtrees are also BSTs",
      "In-order traversal yields sorted order"
    ],
    whenToUse: "Dynamic sorted data; fast search, insert, and delete operations",
    pitfalls: "Degrades to O(n) if input is sorted; use AVL or Red-Black for guaranteed log n"
  },
  {
    id: "avl-tree",
    title: "AVL Tree",
    category: "trees",
    difficulty: "advanced",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}
function getHeight(node) { return node ? node.height : 0; }
function getBalance(node) { return node ? getHeight(node.left) - getHeight(node.right) : 0; }
function rotateRight(y) {
  const x = y.left; const T2 = x.right;
  x.right = y; y.left = T2;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  return x;
}
function rotateLeft(x) {
  const y = x.right; const T2 = y.left;
  y.left = x; x.right = T2;
  x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
  y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
  return y;
}`,
      python: `class AVLNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.height = 1

def get_height(node): return node.height if node else 0

def get_balance(node): return get_height(node.left) - get_height(node.right) if node else 0

def rotate_right(y):
    x = y.left; T2 = x.right
    x.right = y; y.left = T2
    y.height = max(get_height(y.left), get_height(y.right)) + 1
    x.height = max(get_height(x.left), get_height(x.right)) + 1
    return x

def rotate_left(x):
    y = x.right; T2 = y.left
    y.left = x; x.right = T2
    x.height = max(get_height(x.left), get_height(x.right)) + 1
    y.height = max(get_height(y.left), get_height(y.right)) + 1
    return y`
    },
    steps: [
      "Insert or delete as in a standard BST",
      "Update heights of all affected nodes",
      "Compute balance factor (left height - right height)",
      "If |balance| > 1, perform appropriate rotation (LL, RR, LR, RL)"
    ],
    whenToUse: "When guaranteed O(log n) operations are critical; lookup-heavy workloads",
    pitfalls: "Extra memory for height storage; more rotations than Red-Black Trees"
  },
  {
    id: "heap",
    title: "Heap (Priority Queue)",
    category: "trees",
    difficulty: "intermediate",
    timeComplexity: { best: "O(log n)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `class MinHeap {
  constructor() { this.heap = []; }
  getParent(i) { return Math.floor((i - 1) / 2); }
  getLeft(i) { return 2 * i + 1; }
  getRight(i) { return 2 * i + 2; }
  push(val) {
    this.heap.push(val);
    let i = this.heap.length - 1;
    while (i > 0 && this.heap[this.getParent(i)] > this.heap[i]) {
      [this.heap[i], this.heap[this.getParent(i)]] = [this.heap[this.getParent(i)], this.heap[i]];
      i = this.getParent(i);
    }
  }
  pop() {
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.siftDown(0);
    return min;
  }
  siftDown(i) {
    const left = this.getLeft(i), right = this.getRight(i);
    let smallest = i;
    if (left < this.heap.length && this.heap[left] < this.heap[smallest]) smallest = left;
    if (right < this.heap.length && this.heap[right] < this.heap[smallest]) smallest = right;
    if (smallest !== i) {
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      this.siftDown(smallest);
    }
  }
}`,
      python: `import heapq
# Python's heapq is a min-heap
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 3)
smallest = heapq.heappop(heap)  # 3
# For max-heap, push negative values`
    },
    steps: [
      "Insert: add element at the end, bubble up to maintain heap property",
      "Extract min/max: replace root with last element, sift down",
      "Heapify: build heap from array in O(n) time",
      "Used internally by Heap Sort and priority queues"
    ],
    whenToUse: "Priority queues; Dijkstra's algorithm; scheduling; K smallest/largest elements",
    pitfalls: "Not suitable for searching arbitrary values (no order beyond parent-child)"
  }
];
