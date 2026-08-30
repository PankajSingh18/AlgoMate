/**
 * Pure generator logic for BST In-Order Traversal.
 * Decoupled from React UI.
 * @param {Object} treeRoot - The root of the BST
 * @returns {Array} sequence of state events for visualization
 */
export function generateInOrderSteps(treeRoot) {
  const records = [];
  const visited = [];

  const traverse = (node) => {
    if (!node) return;

    if (node.left) {
      records.push({
        currentNode: node.left.value,
        visited: [...visited],
        explanation: `Move to the left child of ${node.value} -> ${node.left.value}.`,
        codeLine: 1,
        highlightedNodes: { [node.value]: "active", [node.left.value]: "visiting" }
      });
      traverse(node.left);
    } else {
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Node ${node.value} has no left child. Backtracking to visit it now.`,
        codeLine: 1,
        highlightedNodes: { [node.value]: "active" }
      });
    }

    visited.push(node.value);
    records.push({
      currentNode: node.value,
      visited: [...visited],
      explanation: `Visit node ${node.value} and add it to the inorder result.`,
      codeLine: 2,
      highlightedNodes: { [node.value]: "visiting" }
    });

    if (node.right) {
      records.push({
        currentNode: node.right.value,
        visited: [...visited],
        explanation: `Move to the right child of ${node.value} -> ${node.right.value}.`,
        codeLine: 3,
        highlightedNodes: { [node.value]: "active", [node.right.value]: "visiting" }
      });
      traverse(node.right);
    } else {
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Node ${node.value} has no right child. Backtracking...`,
        codeLine: 3,
        highlightedNodes: { [node.value]: "active" }
      });
    }
  };

  records.push({
    currentNode: treeRoot.value,
    visited: [],
    explanation: `Start In-Order traversal from the root node ${treeRoot.value}.`,
    codeLine: 0,
    highlightedNodes: {}
  });

  traverse(treeRoot);

  records.push({
    currentNode: null,
    visited: [...visited],
    explanation: `In-Order traversal is complete! Visited nodes: [${visited.join(", ")}].`,
    codeLine: 4,
    highlightedNodes: {}
  });

  return records;
}
