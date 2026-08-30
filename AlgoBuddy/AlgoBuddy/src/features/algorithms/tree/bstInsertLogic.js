/**
 * Pure function to generate step-by-step frames for BST Insertion.
 * Decoupled from React UI.
 */
export function generateInsertSteps(treeRoot, val) {
  const records = [];
  const path = [];

  const recurse = (node) => {
    // Line 2: if (root == null)
    if (!node) {
      records.push({
        currentNode: null,
        visited: [...path],
        explanation: `Reached empty pointer spot. Creating new Node ${val}.`,
        codeLine: 1,
        highlightedNodes: Object.fromEntries(path.map((v) => [v, "active"])),
        isNodeCreated: true,
      });
      // Line 3: return new Node(key)
      records.push({
        currentNode: val,
        visited: [...path, val],
        explanation: `Successfully inserted Node ${val} at its leaf position!`,
        codeLine: 2,
        highlightedNodes: { ...Object.fromEntries(path.map((v) => [v, "active"])), [val]: "inserted" },
        isNodeCreated: true,
      });
      return;
    }

    path.push(node.value);

    records.push({
      currentNode: node.value,
      visited: [...path],
      explanation: `Comparing insert key ${val} with current node ${node.value}.`,
      codeLine: 1,
      highlightedNodes: {
        ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
        [node.value]: "visiting",
      },
    });

    if (val < node.value) {
      // Line 4: if (key < root.key) -> true
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Since insert key ${val} < current node ${node.value}, traverse left.`,
        codeLine: 3,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "visiting",
        },
      });
      // Line 5: root.left = insert(root.left, key)
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Recursively insert into left child.`,
        codeLine: 4,
        highlightedNodes: { ...Object.fromEntries(path.map((v) => [v, "active"])) },
      });
      recurse(node.left);
    } else {
      // Line 6: else if (key > root.key) -> true
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Since insert key ${val} > current node ${node.value}, traverse right.`,
        codeLine: 5,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "visiting",
        },
      });
      // Line 7: root.right = insert(root.right, key)
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Recursively insert into right child.`,
        codeLine: 6,
        highlightedNodes: { ...Object.fromEntries(path.map((v) => [v, "active"])) },
      });
      recurse(node.right);
    }
  };

  recurse(treeRoot);
  return records;
}
