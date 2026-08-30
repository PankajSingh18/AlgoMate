export const queueCheatsheets = [
  {
    id: "queue",
    title: "Queue",
    category: "queue",
    difficulty: "beginner",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `class Queue {
  constructor() { this.items = []; }
  enqueue(val) { this.items.push(val); }
  dequeue() { return this.items.shift(); }
  front() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
}
// Usage
const q = new Queue();
q.enqueue(1); q.enqueue(2);
console.log(q.dequeue()); // 1`,
      python: `from collections import deque

class Queue:
    def __init__(self):
        self.queue = deque()
    def enqueue(self, val):
        self.queue.append(val)
    def dequeue(self):
        return self.queue.popleft()
    def front(self):
        return self.queue[0]
    def is_empty(self):
        return len(self.queue) == 0
    def size(self):
        return len(self.queue)`
    },
    steps: [
      "Enqueue: add element to the rear (O(1))",
      "Dequeue: remove element from the front (O(1))",
      "Front: view the front element without removing it (O(1))",
      "Follows FIFO (First In, First Out) principle"
    ],
    whenToUse: "BFS traversal; job scheduling; print spooler; buffering; breadth-first algorithms",
    pitfalls: "Using array.shift() for dequeue is O(n); use a proper linked-list-based queue for performance"
  },
  {
    id: "deque",
    title: "Deque (Double-Ended Queue)",
    category: "queue",
    difficulty: "intermediate",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `class Deque {
  constructor() { this.items = []; }
  addFront(val) { this.items.unshift(val); }
  addRear(val) { this.items.push(val); }
  removeFront() { return this.items.shift(); }
  removeRear() { return this.items.pop(); }
  front() { return this.items[0]; }
  rear() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}`,
      python: `from collections import deque
# Python's deque is a double-ended queue
d = deque()
d.append(1)       # add to right
d.appendleft(2)   # add to left
d.pop()           # remove from right
d.popleft()       # remove from left`
    },
    steps: [
      "Supports insertion and deletion at both ends in O(1)",
      "Combines stack and queue capabilities",
      "Used in sliding window problems and palindrome checking"
    ],
    whenToUse: "Sliding window maximum/minimum; palindrome checking; undo-redo with limits",
    pitfalls: "Not a pure FIFO structure; choose the right operation for your use case"
  }
];
