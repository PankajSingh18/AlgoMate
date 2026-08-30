/**
 * Pure generator logic for finding the Lowest Common Ancestor (LCA).
 * Decoupled from React UI.
 * @param {string} rootId - ID of the root node
 * @param {string} p - ID of the first target node
 * @param {string} q - ID of the second target node
 * @param {Array} edges - Array of edge objects { parent, child }
 * @returns {Array} sequence of state events for visualization
 */
export function generateLcaSequence(rootId, p, q, edges) {
  const sequence = [];

  const dfs = (nodeId) => {
    if (!nodeId) return null;

    sequence.push({ type: "VISIT", node: nodeId });

    if (nodeId === p || nodeId === q) {
      sequence.push({ type: "FOUND_TARGET", node: nodeId });
      sequence.push({ type: "BACKTRACK", node: nodeId, returnValue: nodeId });
      return nodeId;
    }

    const children = edges.filter((e) => e.parent === nodeId).map((e) => e.child);
    const leftChild = children[0] || null;
    const rightChild = children[1] || null;

    let leftResult = null;
    let rightResult = null;

    if (leftChild) {
      leftResult = dfs(leftChild);
      sequence.push({ type: "RETURN_LEFT", node: nodeId, child: leftChild, val: leftResult });
    }

    if (rightChild) {
      rightResult = dfs(rightChild);
      sequence.push({ type: "RETURN_RIGHT", node: nodeId, child: rightChild, val: rightResult });
    }

    if (leftResult && rightResult) {
      sequence.push({ type: "LCA_FOUND", node: nodeId });
      sequence.push({ type: "BACKTRACK", node: nodeId, returnValue: nodeId });
      return nodeId;
    }

    const ret = leftResult || rightResult;
    sequence.push({ type: "BACKTRACK", node: nodeId, returnValue: ret });
    return ret;
  };

  dfs(rootId);
  sequence.push({ type: "FINISH" });
  return sequence;
}
