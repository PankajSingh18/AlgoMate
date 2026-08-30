"use client";

import SharedCodeBlock from "@/app/components/ui/SharedCodeBlock";

export default function HeapCodeBlock() {
  const codeExamples = {
    javascript: `class Heap {
  constructor(type = "min") {
    this.heap = [];
    this.type = type;
  }

  compare(a, b) {
    return this.type === "min" ? a < b : a > b;
  }

  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  extractRoot() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);
    return root;
  }

  peek() {
    return this.heap.length ? this.heap[0] : null;
  }

  heapifyUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.compare(this.heap[i], this.heap[p])) break;
      [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
      i = p;
    }
  }

  heapifyDown(i) {
    const n = this.heap.length;
    while (true) {
      let target = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;

      if (l < n && this.compare(this.heap[l], this.heap[target])) target = l;
      if (r < n && this.compare(this.heap[r], this.heap[target])) target = r;
      if (target === i) break;

      [this.heap[i], this.heap[target]] = [this.heap[target], this.heap[i]];
      i = target;
    }
  }
}`,
    python: `class Heap:
    def __init__(self, heap_type="min"):
        self.heap = []
        self.heap_type = heap_type

    def compare(self, a, b):
        return a < b if self.heap_type == "min" else a > b

    def insert(self, value):
        self.heap.append(value)
        self.heapify_up(len(self.heap) - 1)

    def extract_root(self):
        if not self.heap:
            return None
        if len(self.heap) == 1:
            return self.heap.pop()

        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self.heapify_down(0)
        return root

    def peek(self):
        return self.heap[0] if self.heap else None

    def heapify_up(self, i):
        while i > 0:
            p = (i - 1) // 2
            if not self.compare(self.heap[i], self.heap[p]):
                break
            self.heap[i], self.heap[p] = self.heap[p], self.heap[i]
            i = p

    def heapify_down(self, i):
        n = len(self.heap)
        while True:
            target = i
            l = 2 * i + 1
            r = 2 * i + 2

            if l < n and self.compare(self.heap[l], self.heap[target]):
                target = l
            if r < n and self.compare(self.heap[r], self.heap[target]):
                target = r
            if target == i:
                break

            self.heap[i], self.heap[target] = self.heap[target], self.heap[i]
            i = target`,
    java: `class Heap {
    private List<Integer> heap = new ArrayList<>();
    private String type;

    public Heap(String type) {
        this.type = type; // "min" or "max"
    }

    private boolean compare(int a, int b) {
        return type.equals("min") ? a < b : a > b;
    }

    public void insert(int value) {
        heap.add(value);
        heapifyUp(heap.size() - 1);
    }

    public Integer extractRoot() {
        if (heap.isEmpty()) return null;
        if (heap.size() == 1) return heap.remove(0);

        int root = heap.get(0);
        heap.set(0, heap.remove(heap.size() - 1));
        heapifyDown(0);
        return root;
    }
}`,
    cpp: `class Heap {
  vector<int> heap;
  bool isMin;

  bool compare(int a, int b) {
    return isMin ? a < b : a > b;
  }

public:
  Heap(bool minHeap = true) : isMin(minHeap) {}

  void insert(int value) {
    heap.push_back(value);
    heapifyUp(heap.size() - 1);
  }

  int extractRoot() {
    if (heap.empty()) return -1;
    int root = heap[0];
    heap[0] = heap.back();
    heap.pop_back();
    heapifyDown(0);
    return root;
  }

  void heapifyUp(int i) {
    while (i > 0) {
      int p = (i - 1) / 2;
      if (!compare(heap[i], heap[p])) break;
      swap(heap[i], heap[p]);
      i = p;
    }
  }

  void heapifyDown(int i) {
    int n = heap.size();
    while (true) {
      int target = i;
      int l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && compare(heap[l], heap[target])) target = l;
      if (r < n && compare(heap[r], heap[target])) target = r;
      if (target == i) break;
      swap(heap[i], heap[target]);
      i = target;
    }
  }
};`,
  };

  return <SharedCodeBlock title="Min Heap & Max Heap Operations" codeExamples={codeExamples} color="text-purple-500" />;
}
