/**
 * Pure generator logic for BST Pre-Order Traversal.
 * Decoupled from React UI.
 * @param {Object} treeRoot - The root of the BST
 * @returns {Array} sequence of state events for visualization
 */
export function generatePreOrderSteps(treeRoot) {
  const records = [];
  const visited = [];

  const traverse = (node) => {
    if (!node) return;

    visited.push(node.value);
    records.push({
      currentNode: node.value,
      visited: [...visited],
      explanation: `Visit node ${node.value} before traversing its children.`,
      codeLine: 2,
      highlightedNodes: { [node.value]: "visiting" }
    });

    if (node.left) {
      records.push({
        currentNode: node.left.value,
        visited: [...visited],
        explanation: `Move to the left child of ${node.value} -> ${node.left.value}.`,
        codeLine: 3,
        highlightedNodes: { [node.value]: "active", [node.left.value]: "visiting" }
      });
      traverse(node.left);
    } else {
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Node ${node.value} has no left child. Skipping left subtree.`,
        codeLine: 3,
        highlightedNodes: { [node.value]: "active" }
      });
    }

    if (node.right) {
      records.push({
        currentNode: node.right.value,
        visited: [...visited],
        explanation: `Move to the right child of ${node.value} -> ${node.right.value}.`,
        codeLine: 4,
        highlightedNodes: { [node.value]: "active", [node.right.value]: "visiting" }
      });
      traverse(node.right);
    } else {
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Node ${node.value} has no right child. Skipping right subtree.`,
        codeLine: 4,
        highlightedNodes: { [node.value]: "active" }
      });
    }
  };

  if (!treeRoot) return records;

  records.push({
    currentNode: treeRoot.value,
    visited: [],
    explanation: `Start Pre-Order traversal from the root node ${treeRoot.value}.`,
    codeLine: 0,
    highlightedNodes: {}
  });

  traverse(treeRoot);

  records.push({
    currentNode: null,
    visited: [...visited],
    explanation: `Pre-Order traversal is complete! Visited nodes: [${visited.join(", ")}].`,
    codeLine: 5,
    highlightedNodes: {}
  });

  return records;
}
