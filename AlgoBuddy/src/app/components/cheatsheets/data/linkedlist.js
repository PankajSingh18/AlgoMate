export const linkedListCheatsheets = [
  {
    id: "singly-linked-list",
    title: "Singly Linked List",
    category: "linked-list",
    difficulty: "beginner",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `class ListNode {
  constructor(val) { this.val = val; this.next = null; }
}
class SinglyLinkedList {
  constructor() { this.head = null; this.tail = null; }
  push(val) {
    const node = new ListNode(val);
    if (!this.head) { this.head = this.tail = node; return; }
    this.tail.next = node; this.tail = node;
  }
  pop() {
    if (!this.head) return null;
    if (this.head === this.tail) { const val = this.head.val; this.head = this.tail = null; return val; }
    let curr = this.head;
    while (curr.next !== this.tail) curr = curr.next;
    const val = this.tail.val;
    curr.next = null; this.tail = curr;
    return val;
  }
  get(index) {
    let curr = this.head;
    for (let i = 0; curr && i < index; i++) curr = curr.next;
    return curr ? curr.val : undefined;
  }
}`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class SinglyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def push(self, val):
        node = ListNode(val)
        if not self.head:
            self.head = self.tail = node
            return
        self.tail.next = node
        self.tail = node

    def pop(self):
        if not self.head: return None
        if self.head == self.tail:
            val = self.head.val
            self.head = self.tail = None
            return val
        curr = self.head
        while curr.next != self.tail: curr = curr.next
        val = self.tail.val
        curr.next = None; self.tail = curr
        return val`
    },
    steps: [
      "Each node stores a value and a pointer to the next node",
      "Head points to the first node; tail points to the last",
      "Traversal starts at head and follows next pointers",
      "Insertion/deletion at head is O(1); at tail/index is O(n)"
    ],
    whenToUse: "Frequent insertions/deletions at the beginning; no random access needed",
    pitfalls: "No O(1) random access; extra memory for pointer per element"
  },
  {
    id: "doubly-linked-list",
    title: "Doubly Linked List",
    category: "linked-list",
    difficulty: "beginner",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `class DoublyListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
    this.prev = null;
  }
}
class DoublyLinkedList {
  constructor() { this.head = null; this.tail = null; }
  push(val) {
    const node = new DoublyListNode(val);
    if (!this.head) { this.head = this.tail = node; return; }
    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;
  }
  pop() {
    if (!this.tail) return null;
    const val = this.tail.val;
    this.tail = this.tail.prev;
    if (this.tail) this.tail.next = null;
    else this.head = null;
    return val;
  }
}`,
      python: `class DoublyListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def push(self, val):
        node = DoublyListNode(val)
        if not self.head:
            self.head = self.tail = node
            return
        node.prev = self.tail
        self.tail.next = node
        self.tail = node

    def pop(self):
        if not self.tail: return None
        val = self.tail.val
        self.tail = self.tail.prev
        if self.tail: self.tail.next = None
        else: self.head = None
        return val`
    },
    steps: [
      "Each node stores value, next, and prev pointers",
      "Allows O(1) deletion at both ends",
      "Traversal is possible in both directions",
      "Used as the underlying structure for Deque"
    ],
    whenToUse: "When you need efficient deletion from both ends; LRU cache implementation",
    pitfalls: "Double the pointer overhead compared to singly linked list"
  }
];
