export class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.balanceFactor = 0;
  }
}

export const getHeight = (node) => (node ? node.height : 0);

export const getBalanceFactor = (node) => {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
};

export const updateHeightAndBF = (node) => {
  if (!node) return node;
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  node.balanceFactor = getBalanceFactor(node);
  return node;
};

export const rotateRight = (y) => {
  if (!y || !y.left) return y;
  const x = y.left;
  const t2 = x.right;

  x.right = y;
  y.left = t2;

  updateHeightAndBF(y);
  updateHeightAndBF(x);
  return x;
};

export const rotateLeft = (x) => {
  if (!x || !x.right) return x;
  const y = x.right;
  const t2 = y.left;

  y.left = x;
  x.right = t2;

  updateHeightAndBF(x);
  updateHeightAndBF(y);
  return y;
};

const cloneTree = (node) => {
  if (!node) return null;
  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
    height: node.height,
    balanceFactor: node.balanceFactor,
  };
};

const recordStep = (steps, root, step) => {
  steps.push({
    ...step,
    treeSnapshot: cloneTree(root),
  });
};

const buildPathHighlights = (path, currentValue, state) => {
  const highlightedNodes = {};
  path.slice(0, -1).forEach((value) => {
    highlightedNodes[value] = "active";
  });
  if (currentValue !== undefined && currentValue !== null) {
    highlightedNodes[currentValue] = state;
  }
  return highlightedNodes;
};

const getInsertRotationInfo = (node, value) => {
  if (node.balanceFactor > 1 && node.left && value < node.left.value) {
    return {
      caseName: "Left-Left (LL)",
      detectedText: `Imbalance at node ${node.value}  Left-Left (LL) case`,
      rotationText: `Performed right rotation at node ${node.value}. New subtree root is ${node.left.value}.`,
      rotatedNode: rotateRight(node),
      rotationType: "right",
    };
  }

  if (node.balanceFactor < -1 && node.right && value > node.right.value) {
    return {
      caseName: "Right-Right (RR)",
      detectedText: `Imbalance at node ${node.value}  Right-Right (RR) case`,
      rotationText: `Performed left rotation at node ${node.value}. New subtree root is ${node.right.value}.`,
      rotatedNode: rotateLeft(node),
      rotationType: "left",
    };
  }

  if (node.balanceFactor > 1 && node.left && value > node.left.value) {
    const leftChildValue = node.left.value;
    node.left = rotateLeft(node.left);
    updateHeightAndBF(node);
    const rotatedNode = rotateRight(node);
    return {
      caseName: "Left-Right (LR)",
      detectedText: `Imbalance at node ${node.value}  Left-Right (LR) case`,
      rotationText: `Performed left rotation on node ${leftChildValue}, then right rotation at node ${node.value}. New subtree root is ${rotatedNode.value}.`,
      rotatedNode,
      rotationType: "left-right",
    };
  }

  if (node.balanceFactor < -1 && node.right && value < node.right.value) {
    const rightChildValue = node.right.value;
    node.right = rotateRight(node.right);
    updateHeightAndBF(node);
    const rotatedNode = rotateLeft(node);
    return {
      caseName: "Right-Left (RL)",
      detectedText: `Imbalance at node ${node.value}  Right-Left (RL) case`,
      rotationText: `Performed right rotation on node ${rightChildValue}, then left rotation at node ${node.value}. New subtree root is ${rotatedNode.value}.`,
      rotatedNode,
      rotationType: "right-left",
    };
  }

  return null;
};

const getDeleteRotationInfo = (node) => {
  if (node.balanceFactor > 1 && getBalanceFactor(node.left) >= 0) {
    return {
      caseName: "Left-Left (LL)",
      detectedText: `Imbalance at node ${node.value}  Left-Left (LL) case`,
      rotationText: `Performed right rotation at node ${node.value}. New subtree root is ${node.left.value}.`,
      rotatedNode: rotateRight(node),
      rotationType: "right",
    };
  }

  if (node.balanceFactor > 1 && getBalanceFactor(node.left) < 0) {
    const leftChildValue = node.left.value;
    node.left = rotateLeft(node.left);
    updateHeightAndBF(node);
    const rotatedNode = rotateRight(node);
    return {
      caseName: "Left-Right (LR)",
      detectedText: `Imbalance at node ${node.value}  Left-Right (LR) case`,
      rotationText: `Performed left rotation on node ${leftChildValue}, then right rotation at node ${node.value}. New subtree root is ${rotatedNode.value}.`,
      rotatedNode,
      rotationType: "left-right",
    };
  }

  if (node.balanceFactor < -1 && getBalanceFactor(node.right) <= 0) {
    return {
      caseName: "Right-Right (RR)",
      detectedText: `Imbalance at node ${node.value}  Right-Right (RR) case`,
      rotationText: `Performed left rotation at node ${node.value}. New subtree root is ${node.right.value}.`,
      rotatedNode: rotateLeft(node),
      rotationType: "left",
    };
  }

  if (node.balanceFactor < -1 && getBalanceFactor(node.right) > 0) {
    const rightChildValue = node.right.value;
    node.right = rotateRight(node.right);
    updateHeightAndBF(node);
    const rotatedNode = rotateLeft(node);
    return {
      caseName: "Right-Left (RL)",
      detectedText: `Imbalance at node ${node.value}  Right-Left (RL) case`,
      rotationText: `Performed right rotation on node ${rightChildValue}, then left rotation at node ${node.value}. New subtree root is ${rotatedNode.value}.`,
      rotatedNode,
      rotationType: "right-left",
    };
  }

  return null;
};

export const insertAVL = (root, value, steps = []) => {
  const rootRef = { root };

  const insertRec = (node, path = []) => {
    if (!node) {
      const newNode = new AVLNode(value);
      return {
        node: newNode,
        pendingSteps: [
          {
            currentNode: value,
            visited: [...path, value],
            explanation: `Inserted Node ${value} at the empty position.`,
            codeLine: 2,
            stepType: "insert-node",
            highlightedNodes: buildPathHighlights([...path, value], value, "inserted"),
          },
        ],
      };
    }

    const currentPath = [...path, node.value];
    recordStep(steps, rootRef.root, {
      currentNode: node.value,
      visited: currentPath,
      explanation: `Comparing key ${value} with current node ${node.value}.`,
      codeLine: 1,
      stepType: "compare",
      highlightedNodes: buildPathHighlights(currentPath, node.value, "visiting"),
    });

    let childResult = { node: null, pendingSteps: [] };
    if (value < node.value) {
      childResult = insertRec(node.left, currentPath);
      node.left = childResult.node;
    } else if (value > node.value) {
      childResult = insertRec(node.right, currentPath);
      node.right = childResult.node;
    } else {
      return { node, pendingSteps: [] };
    }

    updateHeightAndBF(node);
    childResult.pendingSteps.forEach((step) => recordStep(steps, rootRef.root, step));
    const rotationInfo = getInsertRotationInfo(node, value);
    if (rotationInfo) {
      recordStep(steps, rootRef.root, {
        currentNode: node.value,
        visited: currentPath,
        explanation: rotationInfo.detectedText,
        codeLine: 4,
        stepType: "imbalance-detected",
        highlightedNodes: buildPathHighlights(currentPath, node.value, "deleted"),
      });

      const rotatedNode = rotationInfo.rotatedNode;
      updateHeightAndBF(rotatedNode);
      return {
        node: rotatedNode,
        pendingSteps: [
          {
            currentNode: rotatedNode.value,
            visited: currentPath,
            explanation: rotationInfo.rotationText,
            codeLine: 5,
            stepType: "rotation-complete",
            highlightedNodes: buildPathHighlights(currentPath, rotatedNode.value, "inserted"),
          },
        ],
      };
    }

    return { node, pendingSteps: [] };
  };

  const result = insertRec(root, []);
  rootRef.root = result.node;
  result.pendingSteps.forEach((step) => recordStep(steps, rootRef.root, step));
  return { root: rootRef.root, steps };
};

export const deleteAVL = (root, value, steps = []) => {
  const rootRef = { root };

  const deleteRec = (node, path = []) => {
    if (!node) {
      return { node: null, pendingSteps: [] };
    }

    const currentPath = [...path, node.value];
    recordStep(steps, rootRef.root, {
      currentNode: node.value,
      visited: currentPath,
      explanation: `Comparing delete key ${value} with current node ${node.value}.`,
      codeLine: 1,
      stepType: "delete-compare",
      highlightedNodes: buildPathHighlights(currentPath, node.value, "visiting"),
    });

    if (value < node.value) {
      const childResult = deleteRec(node.left, currentPath);
      node.left = childResult.node;
      updateHeightAndBF(node);
      childResult.pendingSteps.forEach((step) => recordStep(steps, rootRef.root, step));
    } else if (value > node.value) {
      const childResult = deleteRec(node.right, currentPath);
      node.right = childResult.node;
      updateHeightAndBF(node);
      childResult.pendingSteps.forEach((step) => recordStep(steps, rootRef.root, step));
    } else {
      recordStep(steps, rootRef.root, {
        currentNode: node.value,
        visited: currentPath,
        explanation: `Found Node ${value} to delete! Evaluating children cases.`,
        codeLine: 4,
        stepType: "delete-found",
        highlightedNodes: buildPathHighlights(currentPath, node.value, "found"),
      });

      if (!node.left && !node.right) {
        return {
          node: null,
          pendingSteps: [
            {
              currentNode: node.value,
              visited: currentPath,
              explanation: `Node ${value} is a leaf. Delete it.`,
              codeLine: 5,
              stepType: "delete-leaf",
              highlightedNodes: buildPathHighlights(currentPath, node.value, "deleted"),
            },
          ],
        };
      }

      if (!node.left || !node.right) {
        const replacement = node.left || node.right;
        return {
          node: replacement,
          pendingSteps: [
            {
              currentNode: node.value,
              visited: currentPath,
              explanation: `Node ${value} has one child. Replace it with its child.`,
              codeLine: 6,
              stepType: "delete-one-child",
              highlightedNodes: buildPathHighlights(currentPath, node.value, "deleted"),
            },
          ],
        };
      }

      recordStep(steps, rootRef.root, {
        currentNode: node.value,
        visited: currentPath,
        explanation: `Node ${node.value} has two children. Finding its inorder successor: leftmost node in right subtree.`,
        codeLine: 7,
        stepType: "find-successor",
        highlightedNodes: buildPathHighlights(currentPath, node.value, "found"),
      });

      const successorPath = [...currentPath];
      let successor = node.right;
      while (successor && successor.left) {
        successorPath.push(successor.value);
        recordStep(steps, rootRef.root, {
          currentNode: node.value,
          visited: currentPath,
          explanation: `Traversing successor search path: Node ${successor.value}.`,
          codeLine: 7,
          stepType: "find-successor",
          highlightedNodes: {
            ...buildPathHighlights(currentPath, node.value, "found"),
            ...Object.fromEntries(successorPath.slice(0, -1).map((v) => [v, "active-succ"])),
            [successor.value]: "visiting-succ",
          },
        });
        successor = successor.left;
      }

      if (successor) {
        recordStep(steps, rootRef.root, {
          currentNode: node.value,
          visited: currentPath,
          explanation: `Inorder successor located: Node ${successor.value} (smallest value in right subtree).`,
          codeLine: 7,
          stepType: "highlight-successor",
          highlightedNodes: {
            ...buildPathHighlights(currentPath, node.value, "found"),
            ...Object.fromEntries(successorPath.slice(0, -1).map((v) => [v, "active-succ"])),
            [successor.value]: "predecessor",
          },
        });
      }

      const targetValue = node.value;
      const successorValue = successor ? successor.value : node.value;
      node.value = successorValue;

      recordStep(steps, rootRef.root, {
        currentNode: node.value,
        visited: currentPath,
        explanation: `Swap the value of Node ${targetValue} with successor Node ${successorValue}.`,
        codeLine: 8,
        stepType: "swap-values",
        swapValues: {
          targetValue,
          successorValue,
        },
        highlightedNodes: {
          ...buildPathHighlights(currentPath, node.value, "inserted"),
          [successorValue]: "predecessor",
        },
      });

      if (node.right) {
        const successorDelete = deleteRec(node.right, [...currentPath, node.value]);
        node.right = successorDelete.node;
        updateHeightAndBF(node);
        successorDelete.pendingSteps.forEach((step) => recordStep(steps, rootRef.root, step));
      }

      return {
        node,
        pendingSteps: [
          {
            currentNode: node.value,
            visited: currentPath,
            explanation: `Delete the old successor leaf Node ${successorValue} from the right subtree.`,
            codeLine: 9,
            stepType: "delete-successor",
            swapValues: {
              targetValue,
              successorValue,
            },
            highlightedNodes: {
              ...buildPathHighlights(currentPath, node.value, "active"),
              [successorValue]: "deleted",
            },
          },
        ],
      };
    }

    updateHeightAndBF(node);
    const rotationInfo = getDeleteRotationInfo(node);
    if (rotationInfo) {
      return {
        node: rotationInfo.rotatedNode,
        pendingSteps: [
          {
            currentNode: node.value,
            visited: currentPath,
            explanation: rotationInfo.detectedText,
            codeLine: 10,
            stepType: "imbalance-detected",
            highlightedNodes: buildPathHighlights(currentPath, node.value, "deleted"),
          },
          {
            currentNode: rotationInfo.rotatedNode.value,
            visited: currentPath,
            explanation: rotationInfo.rotationText,
            codeLine: 11,
            stepType: "rotation-complete",
            highlightedNodes: buildPathHighlights(currentPath, rotationInfo.rotatedNode.value, "inserted"),
          },
        ],
      };
    }

    return { node, pendingSteps: [] };
  };

  const result = deleteRec(root, []);
  rootRef.root = result.node;
  result.pendingSteps.forEach((step) => recordStep(steps, rootRef.root, step));
  return { root: rootRef.root, steps };
};
