/**
 * Pure function to generate step-by-step frames for Tree Post-Order Traversal.
 * Decoupled from React UI.
 */
export function generatePostOrderSteps(treeRoot) {
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
        explanation: `Node ${node.value} has no left child.`,
        codeLine: 2,
        stack: [...stack].map((n) => n.value),
        highlightedNodes: { [node.value]: "active" },
        threads: [],
      });
    }

    // Line 3: right subtree
    if (node.right) {
      stack.push(node);
      records.push({
        currentNode: node.right.value,
        visited: [...visited],
        explanation: `Recurse into right child of ${node.value} -> ${node.right.value}.`,
        codeLine: 3,
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
        explanation: `Node ${node.value} has no right child.`,
        codeLine: 3,
        stack: [...stack].map((n) => n.value),
        highlightedNodes: { [node.value]: "active" },
        threads: [],
      });
    }

    // Line 4: visit
    visited.push(node.value);
    records.push({
      currentNode: node.value,
      visited: [...visited],
      explanation: `Both subtrees of node ${node.value} are fully processed. Now we visit the parent node itself.`,
      codeLine: 4,
      stack: [...stack].map((n) => n.value),
      highlightedNodes: { [node.value]: "visiting" },
      threads: [],
    });
  };

  records.push({
    currentNode: treeRoot.value,
    visited: [],
    explanation: `Start Post-Order traversal from the root node ${treeRoot.value}.`,
    codeLine: 0,
    stack: [],
    highlightedNodes: {},
    threads: [],
  });

  traverse(treeRoot);

  records.push({
    currentNode: null,
    visited: [...visited],
    explanation: `Post-Order traversal is complete! Visited nodes: [${visited.join(", ")}].`,
    codeLine: 5,
    stack: [],
    highlightedNodes: {},
    threads: [],
  });

  return records;
}
