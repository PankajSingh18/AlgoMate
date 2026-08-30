/**
 * Pure function to generate step-by-step frames for Tree Level-Order Traversal.
 * Decoupled from React UI.
 */
export function generateLevelOrderSteps(treeRoot) {
  const records = [];
  const visited = [];
  const queue = [];

  if (!treeRoot) return records;

  records.push({
    currentNode: treeRoot.value,
    visited: [],
    queue: [treeRoot.value],
    explanation: `Start Level-Order traversal. Enqueue root node ${treeRoot.value}.`,
    codeLine: 2,
    stack: [],
    highlightedNodes: { [treeRoot.value]: "visiting" },
    threads: [],
  });

  const runQueue = [{ node: treeRoot, path: [treeRoot.value] }];

  while (runQueue.length > 0) {
    const currentItem = runQueue.shift();
    const node = currentItem.node;

    visited.push(node.value);

    const currentQueueValues = runQueue.map((q) => q.node.value);

    // Line 4: Dequeue and visit
    records.push({
      currentNode: node.value,
      visited: [...visited],
      queue: [node.value, ...currentQueueValues],
      explanation: `Dequeue node ${node.value} from the queue and visit it. Current path: [${visited.join(", ")}].`,
      codeLine: 4,
      stack: [],
      highlightedNodes: { [node.value]: "visiting" },
      threads: [],
    });

    // Line 5: Enqueue left child
    if (node.left) {
      currentQueueValues.push(node.left.value);
      runQueue.push({ node: node.left, path: [...currentItem.path, node.left.value] });
      records.push({
        currentNode: node.value,
        visited: [...visited],
        queue: [...currentQueueValues],
        explanation: `Node ${node.value} has a left child ${node.left.value}. Add it to the back of the queue.`,
        codeLine: 5,
        stack: [],
        highlightedNodes: { [node.value]: "active", [node.left.value]: "visiting" },
        threads: [],
      });
    } else {
      records.push({
        currentNode: node.value,
        visited: [...visited],
        queue: [...currentQueueValues],
        explanation: `Node ${node.value} has no left child. Nothing to enqueue.`,
        codeLine: 5,
        stack: [],
        highlightedNodes: { [node.value]: "active" },
        threads: [],
      });
    }

    // Line 6: Enqueue right child
    if (node.right) {
      currentQueueValues.push(node.right.value);
      runQueue.push({ node: node.right, path: [...currentItem.path, node.right.value] });
      records.push({
        currentNode: node.value,
        visited: [...visited],
        queue: [...currentQueueValues],
        explanation: `Node ${node.value} has a right child ${node.right.value}. Add it to the back of the queue.`,
        codeLine: 6,
        stack: [],
        highlightedNodes: { [node.value]: "active", [node.right.value]: "visiting" },
        threads: [],
      });
    } else {
      records.push({
        currentNode: node.value,
        visited: [...visited],
        queue: [...currentQueueValues],
        explanation: `Node ${node.value} has no right child. Nothing to enqueue.`,
        codeLine: 6,
        stack: [],
        highlightedNodes: { [node.value]: "active" },
        threads: [],
      });
    }
  }

  records.push({
    currentNode: null,
    visited: [...visited],
    queue: [],
    explanation: `The queue is empty! Level-Order traversal successfully finished.`,
    codeLine: 7,
    stack: [],
    highlightedNodes: {},
    threads: [],
  });

  return records;
}
