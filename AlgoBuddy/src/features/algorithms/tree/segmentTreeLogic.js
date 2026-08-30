/**
 * Pure generator logic for Segment Tree operations.
 */

// Build segment tree (sum) over arr (0-indexed)
// Returns tree array (1-indexed), tree[1] = root
export function buildSegTree(arr) {
  const n = arr.length;
  const tree = new Array(4 * n).fill(0);
  function build(node, start, end) {
    if (start === end) {
      tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      build(2 * node, start, mid);
      build(2 * node + 1, mid + 1, end);
      tree[node] = tree[2 * node] + tree[2 * node + 1];
    }
  }
  build(1, 0, n - 1);
  return tree;
}

// Collect tree nodes with positions for rendering
export function collectNodes(tree, n) {
  const nodes = [];
  function dfs(node, start, end, depth, xMin, xMax) {
    if (start > end || node >= tree.length) return;
    const x = (xMin + xMax) / 2;
    const y = 50 + depth * 90;
    nodes.push({ node, start, end, x, y, value: tree[node] });
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      dfs(2 * node, start, mid, depth + 1, xMin, (xMin + xMax) / 2);
      dfs(2 * node + 1, mid + 1, end, depth + 1, (xMin + xMax) / 2, xMax);
    }
  }
  dfs(1, 0, n - 1, 0, 60, 740);
  return nodes;
}

export function* queryGenerator(l, r, tree, n) {
  if (isNaN(l) || isNaN(r) || l < 0 || r >= n || l > r) {
    yield { type: 'error', message: `⚠️ Enter a valid range (0 ≤ L ≤ R ≤ ${n - 1}).` };
    return;
  }

  let totalSum = 0;

  function* queryDFS(node, start, end, qL, qR) {
    if (qR < start || end < qL) {
      yield {
        type: 'step',
        highlightedNodes: { [node]: "error" },
        highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
        explanation: `Node [${start}..${end}] is completely outside query [${qL}..${qR}]. Return 0. (Out-of-range node)`,
        result: undefined
      };
      return 0;
    }
    if (qL <= start && end <= qR) {
      totalSum += tree[node];
      yield {
        type: 'step',
        highlightedNodes: { [node]: "matched" },
        highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
        explanation: `Node [${start}..${end}] is completely inside query [${qL}..${qR}]. Include BIT[${node}] = ${tree[node]}.`,
        result: undefined
      };
      return tree[node];
    }
    
    yield {
      type: 'step',
      highlightedNodes: { [node]: "visiting" },
      highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
      explanation: `Node [${start}..${end}] partially overlaps [${qL}..${qR}]. Recurse into both children.`,
      result: undefined
    };
    
    const mid = Math.floor((start + end) / 2);
    const leftVal = yield* queryDFS(2 * node, start, mid, qL, qR);
    const rightVal = yield* queryDFS(2 * node + 1, mid + 1, end, qL, qR);
    return leftVal + rightVal;
  }

  const result = yield* queryDFS(1, 0, n - 1, l, r);

  yield {
    type: 'complete',
    highlightedNodes: {},
    highlightedArray: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "matched"])),
    explanation: `✅ Range Sum Query [${l}, ${r}] complete. Result = ${result}.`,
    result: `Sum[${l}..${r}] = ${result}`
  };
}

export function* updateGenerator(idx, newVal, arr, n) {
  if (isNaN(idx) || isNaN(newVal) || idx < 0 || idx >= n) {
    yield { type: 'error', message: `⚠️ Enter a valid index (0-${n - 1}) and new value.` };
    return;
  }

  const newArr = [...arr];
  const oldVal = newArr[idx];
  newArr[idx] = newVal;
  const newTree = buildSegTree(newArr);

  const delta = newVal - oldVal;

  function* updateDFS(node, start, end, target, delta) {
    yield {
      type: 'step',
      highlightedNodes: { [node]: start === end ? "matched" : "visiting" },
      highlightedArray: { [target]: start === end ? "matched" : "active" },
      explanation: start === end
        ? `Leaf node [${start}]: Update value from ${oldVal} to ${newVal}. Delta = ${delta > 0 ? "+" : ""}${delta}.`
        : `Internal node [${start}..${end}]: Recurse ${target <= Math.floor((start + end) / 2) ? "left" : "right"} toward index ${target}.`,
      result: undefined
    };

    if (start === end) return;
    const mid = Math.floor((start + end) / 2);
    if (target <= mid) yield* updateDFS(2 * node, start, mid, target, delta);
    else yield* updateDFS(2 * node + 1, mid + 1, end, target, delta);
  }

  yield* updateDFS(1, 0, n - 1, idx, delta);

  yield {
    type: 'complete',
    highlightedNodes: {},
    highlightedArray: { [idx]: "matched" },
    explanation: `✅ Point Update complete. arr[${idx}] = ${oldVal} → ${newVal}. All ancestor nodes updated with delta=${delta}.`,
    result: `Updated arr[${idx}]: ${oldVal} → ${newVal}`,
    newArr,
    newTree
  };
}
