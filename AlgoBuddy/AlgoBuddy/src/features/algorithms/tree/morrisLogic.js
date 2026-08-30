/**
 * Pure function to generate step-by-step frames for Tree Morris Traversal.
 * Decoupled from React UI.
 */
export function generateMorrisSteps(treeRoot) {
  const records = [];
  const visited = [];
  let activeThreads = [];

  // Predecessor finder helper
  const findPredecessor = (currNode, leftSubtree) => {
    let pNode = leftSubtree;
    while (pNode.right && pNode.right.value !== currNode.value) {
      pNode = pNode.right;
    }
    return pNode;
  };

  if (!treeRoot) return records;

  let curr = treeRoot;

  records.push({
    currentNode: curr.value,
    visited: [],
    threads: [],
    explanation: `Initialize Morris Traversal. Set curr = root node (${curr.value}).`,
    codeLine: 1,
    stack: [],
    highlightedNodes: { [curr.value]: "visiting" },
  });

  while (curr !== null) {
    if (curr.left === null) {
      visited.push(curr.value);

      records.push({
        currentNode: curr.value,
        visited: [...visited],
        threads: [...activeThreads],
        explanation: `Node ${curr.value} has no left child. Visit node ${curr.value} and move to the right child.`,
        codeLine: 4,
        stack: [],
        highlightedNodes: { [curr.value]: "visiting" },
      });

      const nextNode = curr.right;
      curr = nextNode;

      if (curr) {
        records.push({
          currentNode: curr.value,
          visited: [...visited],
          threads: [...activeThreads],
          explanation: `Move curr to its right child pointer -> Node ${curr.value}.`,
          codeLine: 2,
          stack: [],
          highlightedNodes: { [curr.value]: "visiting" },
        });
      }
    } else {
      const pred = findPredecessor(curr, curr.left);

      records.push({
        currentNode: curr.value,
        predecessor: pred.value,
        visited: [...visited],
        threads: [...activeThreads],
        explanation: `Node ${curr.value} has a left child. Search for its inorder predecessor: rightmost node in left subtree -> Node ${pred.value}.`,
        codeLine: 6,
        stack: [],
        highlightedNodes: { [curr.value]: "active", [pred.value]: "predecessor" },
      });

      const threadIdx = activeThreads.findIndex(
        (t) => t.from === pred.value && t.to === curr.value
      );

      if (threadIdx === -1) {
        // Predecessor's right is null, establish thread
        activeThreads.push({ from: pred.value, to: curr.value });

        records.push({
          currentNode: curr.value,
          predecessor: pred.value,
          visited: [...visited],
          threads: [...activeThreads],
          explanation: `Predecessor ${pred.value}'s right is null. Establish a temporary Thread (link) from ${pred.value} back to current node ${curr.value} to remember the return path.`,
          codeLine: 8,
          stack: [],
          highlightedNodes: { [curr.value]: "active", [pred.value]: "predecessor" },
        });

        const nextNode = curr.left;

        records.push({
          currentNode: nextNode.value,
          predecessor: pred.value,
          visited: [...visited],
          threads: [...activeThreads],
          explanation: `Thread established. Now safe to move current pointer to left child: Node ${nextNode.value}.`,
          codeLine: 9,
          stack: [],
          highlightedNodes: { [nextNode.value]: "visiting", [pred.value]: "predecessor" },
        });

        curr = nextNode;
      } else {
        // Thread already exists, clear it and visit current
        activeThreads = activeThreads.filter(
          (t) => !(t.from === pred.value && t.to === curr.value)
        );

        records.push({
          currentNode: curr.value,
          predecessor: pred.value,
          visited: [...visited],
          threads: [...activeThreads],
          explanation: `Predecessor ${pred.value}'s right points to ${curr.value}. This indicates the left subtree was already traversed! Remove the temporary Thread to restore the tree.`,
          codeLine: 11,
          stack: [],
          highlightedNodes: { [curr.value]: "active", [pred.value]: "predecessor" },
        });

        visited.push(curr.value);

        records.push({
          currentNode: curr.value,
          predecessor: pred.value,
          visited: [...visited],
          threads: [...activeThreads],
          explanation: `Visit node ${curr.value}. Add it to the path: [${visited.join(", ")}].`,
          codeLine: 12,
          stack: [],
          highlightedNodes: { [curr.value]: "visiting" },
        });

        const nextNode = curr.right;
        curr = nextNode;

        if (curr) {
          records.push({
            currentNode: curr.value,
            visited: [...visited],
            threads: [...activeThreads],
            explanation: `Now move current pointer to its right child: Node ${curr.value}.`,
            codeLine: 12,
            stack: [],
            highlightedNodes: { [curr.value]: "visiting" },
          });
        }
      }
    }
  }

  records.push({
    currentNode: null,
    visited: [...visited],
    threads: [],
    explanation: `curr is null! Morris Traversal finished with O(1) extra space!`,
    codeLine: 15,
    stack: [],
    highlightedNodes: {},
  });

  return records;
}
