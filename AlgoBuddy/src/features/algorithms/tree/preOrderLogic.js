/**
 * Pure function to generate step-by-step frames for Pre-Order Traversal.
 * Decoupled from React UI.
 */
export function generatePreOrderSteps(treeRoot) {
  const records = [];
  const visited = [];
  const stack = [];

  const traverse = (node) => {
    if (!node) return;

    // Line 2: visit
    visited.push(node.value);
    records.push({
      currentNode: node.value,
      visited: [...visited],
      explanation: `Visit node ${node.value} and add it to our traversal result list.`,
      codeLine: 2,
      stack: [...stack].map((n) => n.value),
      highlightedNodes: { [node.value]: "visiting" },
      threads: [],
    });

    // Line 3: left child
    if (node.left) {
      stack.push(node);
      records.push({
        currentNode: node.left.value,
        visited: [...visited],
        explanation: `Move to the left child of ${node.value} -> ${node.left.value}.`,
        codeLine: 3,
        stack: [...stack].map((n) => n.value),
        highlightedNodes: { [node.value]: "active", [node.left.value]: "visiting" },
        threads: [],
      });
      traverse(node.left);
      stack.pop();
    } else {
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Node ${node.value} has no left child. So we skip left subtree recursion.`,
        codeLine: 3,
        stack: [...stack].map((n) => n.value),
        highlightedNodes: { [node.value]: "active" },
        threads: [],
      });
    }

    // Line 4: right child
    if (node.right) {
      stack.push(node);
      records.push({
        currentNode: node.right.value,
        visited: [...visited],
        explanation: `Move to the right child of ${node.value} -> ${node.right.value}.`,
        codeLine: 4,
        stack: [...stack].map((n) => n.value),
        highlightedNodes: { [node.value]: "active", [node.right.value]: "visiting" },
        threads: [],
      });
      traverse(node.right);
      stack.pop();
    } else {
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Node ${node.value} has no right child. So we skip right subtree recursion.`,
        codeLine: 4,
        stack: [...stack].map((n) => n.value),
        highlightedNodes: { [node.value]: "active" },
        threads: [],
      });
    }
  };

  if (!treeRoot) return records;

  records.push({
    currentNode: treeRoot.value,
    visited: [],
    explanation: `Start Pre-Order traversal from the root node ${treeRoot.value}.`,
    codeLine: 0,
    stack: [],
    highlightedNodes: {},
    threads: [],
  });

  traverse(treeRoot);

  records.push({
    currentNode: null,
    visited: [...visited],
    explanation: `Pre-Order traversal is complete! Visited nodes: [${visited.join(", ")}].`,
    codeLine: 5,
    stack: [],
    highlightedNodes: {},
    threads: [],
  });

  return records;
}
