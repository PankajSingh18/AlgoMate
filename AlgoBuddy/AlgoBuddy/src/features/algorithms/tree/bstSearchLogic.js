/**
 * Pure function to generate step-by-step frames for BST Search.
 * Decoupled from React UI.
 */
export function generateSearchSteps(treeRoot, val) {
  const records = [];
  const path = [];

  const recurse = (node) => {
    // Line 1: search header
    // Line 2: if (root == null || root.key == key)
    if (!node) {
      records.push({
        currentNode: null,
        visited: [...path],
        explanation: `Node ${val} is not found in the BST (reached null pointer).`,
        codeLine: 1,
        highlightedNodes: { ...Object.fromEntries(path.map((v) => [v, "active"])) },
      });
      return;
    }

    path.push(node.value);

    records.push({
      currentNode: node.value,
      visited: [...path],
      explanation: `Comparing key ${val} with current node ${node.value}.`,
      codeLine: 1,
      highlightedNodes: {
        ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
        [node.value]: "visiting",
      },
    });

    if (node.value === val) {
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Success! Node ${val} is found in the BST.`,
        codeLine: 2,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "found",
        },
      });
      return;
    }

    if (val < node.value) {
      // Line 4: if (key < root.key) -> true
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Since search key ${val} < current node ${node.value}, traverse to the left subtree.`,
        codeLine: 3,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "visiting",
        },
      });
      // Line 5: return search(root.left, key)
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Move to left child.`,
        codeLine: 4,
        highlightedNodes: { ...Object.fromEntries(path.map((v) => [v, "active"])) },
      });
      recurse(node.left);
    } else {
      // Line 4: if (key < root.key) -> false
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Since search key ${val} > current node ${node.value}, traverse to the right subtree.`,
        codeLine: 3,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "visiting",
        },
      });
      // Line 6: return search(root.right, key)
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Move to right child.`,
        codeLine: 5,
        highlightedNodes: { ...Object.fromEntries(path.map((v) => [v, "active"])) },
      });
      recurse(node.right);
    }
  };

  recurse(treeRoot);
  return records;
}
