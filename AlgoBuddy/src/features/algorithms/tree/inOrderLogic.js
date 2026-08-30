/**
 * Pure function to generate step-by-step frames for Tree In-Order Traversal.
 * Decoupled from React UI.
 */
export function generateInOrderSteps(treeRoot) {
  if (!treeRoot) return [];

  const records = [];
  const visited = [];
  const stack = [];

  const traverse = (node) => {
    if (!node) return;

    // Line 2: left subtree
    if (node.left) {
      stack.push(node);
      records.push({
        currentNode: node.left.value,
        visited: [...visited],
        explanation: `Recurse into left child of ${node.value} -> ${node.left.value}.`,
        codeLine: 2,
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
        explanation: `Node ${node.value} has no left child. Backtracking...`,
        codeLine: 2,
        stack: [...stack].map((n) => n.value),
        highlightedNodes: { [node.value]: "active" },
        threads: [],
      });
    }

    // Line 3: visit
    visited.push(node.value);
    records.push({
      currentNode: node.value,
      visited: [...visited],
      explanation: `Visit node ${node.value} and add it to our traversal path.`,
      codeLine: 3,
      stack: [...stack].map((n) => n.value),
      highlightedNodes: { [node.value]: "visiting" },
      threads: [],
    });

    // Line 4: right subtree
    if (node.right) {
      stack.push(node);
      records.push({
        currentNode: node.right.value,
        visited: [...visited],
        explanation: `Recurse into right child of ${node.value} -> ${node.right.value}.`,
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
        explanation: `Node ${node.value} has no right child. Backtracking...`,
        codeLine: 4,
        stack: [...stack].map((n) => n.value),
        highlightedNodes: { [node.value]: "active" },
        threads: [],
      });
    }
  };

  records.push({
    currentNode: treeRoot.value,
    visited: [],
    explanation: `Start In-Order traversal from the root node ${treeRoot.value}.`,
    codeLine: 0,
    stack: [],
    highlightedNodes: {},
    threads: [],
  });

  traverse(treeRoot);

  records.push({
    currentNode: null,
    visited: [...visited],
    explanation: `In-Order traversal is complete! Notice that the BST values are printed in sorted order: [${visited.join(", ")}].`,
    codeLine: 5,
    stack: [],
    highlightedNodes: {},
    threads: [],
  });

  return records;
}
