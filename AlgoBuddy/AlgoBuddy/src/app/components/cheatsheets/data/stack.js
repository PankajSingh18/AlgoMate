export const stackCheatsheets = [
  {
    id: "stack",
    title: "Stack",
    category: "stack",
    difficulty: "beginner",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `class Stack {
  constructor() { this.items = []; }
  push(val) { this.items.push(val); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
}
// Usage
const stack = new Stack();
stack.push(1); stack.push(2);
console.log(stack.pop()); // 2
console.log(stack.peek()); // 1`,
      python: `class Stack:
    def __init__(self):
        self.items = []
    def push(self, val):
        self.items.append(val)
    def pop(self):
        return self.items.pop()
    def peek(self):
        return self.items[-1]
    def is_empty(self):
        return len(self.items) == 0
    def size(self):
        return len(self.items)

# Usage
stack = Stack()
stack.push(1); stack.push(2)
print(stack.pop())  # 2`
    },
    steps: [
      "Push: add element to the top (O(1))",
      "Pop: remove element from the top (O(1))",
      "Peek: view the top element without removing it (O(1))",
      "Follows LIFO (Last In, First Out) principle"
    ],
    whenToUse: "Function call stack (recursion); expression evaluation; undo/redo; backtracking",
    pitfalls: "Limited access — only the top element is accessible at any time"
  }
];
