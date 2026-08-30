export function* alphaBetaGenerator(initialNodes) {
  let nodes = initialNodes.map(n => ({ ...n }));
  let currentNodeClass = {};
  let prunedNodes = {};
  
  function* evaluate(nodeIndex, depth, alpha, beta, isMax) {
    if (depth === 3) {
      currentNodeClass[nodeIndex] = "bg-green-500 text-white border-green-700";
      yield {
        treeNodes: nodes.map(n => ({ ...n })),
        currentNodeClass: { ...currentNodeClass },
        prunedNodes: { ...prunedNodes },
        stepExplanation: `Evaluating leaf node: ${nodes[nodeIndex].val}`
      };
      return nodes[nodeIndex].val;
    }
    
    currentNodeClass[nodeIndex] = "bg-yellow-300 text-black border-yellow-500 scale-110";
    nodes[nodeIndex].alpha = alpha;
    nodes[nodeIndex].beta = beta;
    yield {
      treeNodes: nodes.map(n => ({ ...n })),
      currentNodeClass: { ...currentNodeClass },
      prunedNodes: { ...prunedNodes },
      stepExplanation: `Visiting ${isMax ? "Max" : "Min"} node. α=${alpha === -Infinity ? "-∞" : alpha}, β=${beta === Infinity ? "∞" : beta}`
    };
    
    const leftChild = 2 * nodeIndex + 1;
    const rightChild = 2 * nodeIndex + 2;
    
    let bestVal = isMax ? -Infinity : Infinity;
    
    // Left Child
    const leftVal = yield* evaluate(leftChild, depth + 1, alpha, beta, !isMax);
    if (isMax) {
      bestVal = Math.max(bestVal, leftVal);
      alpha = Math.max(alpha, bestVal);
    } else {
      bestVal = Math.min(bestVal, leftVal);
      beta = Math.min(beta, bestVal);
    }
    
    nodes[nodeIndex].val = bestVal;
    nodes[nodeIndex].alpha = alpha;
    nodes[nodeIndex].beta = beta;
    yield {
      treeNodes: nodes.map(n => ({ ...n })),
      currentNodeClass: { ...currentNodeClass },
      prunedNodes: { ...prunedNodes },
      stepExplanation: `Back at ${isMax ? "Max" : "Min"} node. Updated ${isMax ? "α" : "β"} to ${isMax ? alpha : beta}. Check α=${alpha === -Infinity ? "-∞" : alpha} ≥ β=${beta === Infinity ? "∞" : beta}?`
    };
    
    // Pruning check
    if (beta <= alpha) {
      prunedNodes[rightChild] = true;
      const markPruned = (idx) => {
        if (idx > 14) return;
        prunedNodes[idx] = true;
        markPruned(2 * idx + 1);
        markPruned(2 * idx + 2);
      };
      markPruned(rightChild);
      
      yield {
        treeNodes: nodes.map(n => ({ ...n })),
        currentNodeClass: { ...currentNodeClass },
        prunedNodes: { ...prunedNodes },
        stepExplanation: `PRUNED! Since ${isMax ? "β (" + beta + ") <= α (" + alpha + ")" : "α (" + alpha + ") >= β (" + beta + ")"}. Ignoring right child.`
      };
    } else {
      // Right Child
      const rightVal = yield* evaluate(rightChild, depth + 1, alpha, beta, !isMax);
      if (isMax) {
        bestVal = Math.max(bestVal, rightVal);
        alpha = Math.max(alpha, bestVal);
      } else {
        bestVal = Math.min(bestVal, rightVal);
        beta = Math.min(beta, bestVal);
      }
      nodes[nodeIndex].val = bestVal;
      nodes[nodeIndex].alpha = alpha;
      nodes[nodeIndex].beta = beta;
    }
    
    currentNodeClass[nodeIndex] = "bg-blue-500 text-white border-blue-700 scale-100";
    yield {
      treeNodes: nodes.map(n => ({ ...n })),
      currentNodeClass: { ...currentNodeClass },
      prunedNodes: { ...prunedNodes },
      stepExplanation: `Node ${nodeIndex} completed. Value: ${bestVal}`
    };
    
    return bestVal;
  }
  
  const rootVal = yield* evaluate(0, 0, -Infinity, Infinity, true);
  
  yield {
    treeNodes: nodes.map(n => ({ ...n })),
    currentNodeClass: { ...currentNodeClass },
    prunedNodes: { ...prunedNodes },
    stepExplanation: `Algorithm finished. Optimal value: ${rootVal}`,
    message: `Finished! Optimal value: ${rootVal}`
  };
}
