/**
 * Pure function to generate step-by-step frames for BST Deletion.
 * Decoupled from React UI.
 */
export function generateDeleteSteps(treeRoot, val) {
  const records = [];
  const path = [];

  const recurse = (node) => {
    if (!node) return;

    path.push(node.value);

    // Line 2: if (root == null) -> false
    records.push({
      currentNode: node.value,
      visited: [...path],
      explanation: `Searching for node to delete: comparing key ${val} with Node ${node.value}.`,
      codeLine: 1,
      highlightedNodes: {
        ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
        [node.value]: "visiting",
      },
    });

    if (val < node.value) {
      // Line 3: if (key < root.key)
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Since delete key ${val} < current node ${node.value}, delete in left subtree.`,
        codeLine: 2,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "visiting",
        },
      });
      recurse(node.left);
    } else if (val > node.value) {
      // Line 4: else if (key > root.key)
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Since delete key ${val} > current node ${node.value}, delete in right subtree.`,
        codeLine: 3,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "visiting",
        },
      });
      recurse(node.right);
    } else {
      // Line 5: else { Node found!
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Found Node ${val} to delete! Evaluating children cases.`,
        codeLine: 4,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "found",
        },
      });

      // Case 1: No left child (includes Leaf node case)
      if (!node.left) {
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Left child is null. Replace target Node ${node.value} with its right child: Node ${
            node.right?.value || "null"
          }.`,
          codeLine: 5,
          highlightedNodes: {
            ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
            [node.value]: "deleted",
          },
        });
        return;
      }

      // Case 2: No right child
      if (!node.right) {
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Right child is null. Replace target Node ${node.value} with its left child: Node ${node.left.value}.`,
          codeLine: 6,
          highlightedNodes: {
            ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
            [node.value]: "deleted",
          },
        });
        return;
      }

      // Case 3: Two children. Find inorder successor (min value in right subtree)
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Node ${node.value} has two children. Finding its inorder successor: leftmost node in right subtree.`,
        codeLine: 7,
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "found",
        },
      });

      const succPath = [];
      let succ = node.right;
      while (succ) {
        succPath.push(succ.value);
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Traversing successor search path: Node ${succ.value}.`,
          codeLine: 7,
          stepType: "find-successor",
          highlightedNodes: {
            ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
            [node.value]: "found",
            ...Object.fromEntries(succPath.slice(0, -1).map((v) => [v, "active-succ"])),
            [succ.value]: "visiting-succ",
          },
        });
        succ = succ.left;
      }

      // Leftmost found
      let minSucc = node.right;
      const finalSuccPath = [];
      while (minSucc.left) {
        finalSuccPath.push(minSucc.value);
        minSucc = minSucc.left;
      }
      finalSuccPath.push(minSucc.value);

      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Inorder successor located: Node ${minSucc.value} (smallest value in right subtree).`,
        codeLine: 7,
        stepType: "highlight-successor",
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "found",
          ...Object.fromEntries(finalSuccPath.slice(0, -1).map((v) => [v, "active-succ"])),
          [minSucc.value]: "predecessor",
        },
      });

      // Copy successor value to current node
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Swap the value of Node ${node.value} with successor Node ${minSucc.value}.`,
        codeLine: 8,
        stepType: "swap-values",
        swapValues: {
          targetValue: node.value,
          successorValue: minSucc.value,
        },
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "inserted",
          [minSucc.value]: "predecessor",
        },
      });

      // Recursively delete successor
      records.push({
        currentNode: minSucc.value,
        visited: [...path],
        explanation: `Delete the old successor leaf Node ${minSucc.value} from the right subtree.`,
        codeLine: 9,
        stepType: "delete-successor",
        swapValues: {
          targetValue: node.value,
          successorValue: minSucc.value,
        },
        highlightedNodes: {
          ...Object.fromEntries(path.slice(0, -1).map((v) => [v, "active"])),
          [node.value]: "active",
          [minSucc.value]: "deleted",
        },
      });
    }
  };

  recurse(treeRoot);
  return records;
}
