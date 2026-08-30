export function* minmaxGenerator(initialNodes) {
  let nodes = initialNodes.map(n => ({ ...n }));
  let currentNodeClass = {};
  
  function* evaluate(nodeIndex, depth, isMax) {
    if (depth === 3) {
      currentNodeClass[nodeIndex] = "bg-green-500 text-white border-green-700";
      yield {
        treeNodes: nodes.map(n => ({ ...n })),
        currentNodeClass: { ...currentNodeClass },
        stepExplanation: `Evaluating leaf node at distance ${nodeIndex - 7}, value: ${nodes[nodeIndex].val}`
      };
      return nodes[nodeIndex].val;
    }
    
    currentNodeClass[nodeIndex] = "bg-yellow-300 text-black border-yellow-500";
    yield {
      treeNodes: nodes.map(n => ({ ...n })),
      currentNodeClass: { ...currentNodeClass },
      stepExplanation: `Visiting ${isMax ? "Max" : "Min"} node.`
    };
    
    const leftChild = 2 * nodeIndex + 1;
    const rightChild = 2 * nodeIndex + 2;
    
    const leftVal = yield* evaluate(leftChild, depth + 1, !isMax);
    const rightVal = yield* evaluate(rightChild, depth + 1, !isMax);
    
    const bestVal = isMax ? Math.max(leftVal, rightVal) : Math.min(leftVal, rightVal);
    
    nodes[nodeIndex].val = bestVal;
    
    currentNodeClass[leftChild] = "bg-gray-300 text-black border-gray-400";
    currentNodeClass[rightChild] = "bg-gray-300 text-black border-gray-400";
    currentNodeClass[nodeIndex] = "bg-blue-500 text-white border-blue-700";
    
    yield {
      treeNodes: nodes.map(n => ({ ...n })),
      currentNodeClass: { ...currentNodeClass },
      stepExplanation: `${isMax ? "Max" : "Min"} node completed. Chose ${bestVal} from (${leftVal}, ${rightVal}).`
    };
    
    return bestVal;
  }
  
  const rootVal = yield* evaluate(0, 0, true);
  
  yield {
    treeNodes: nodes.map(n => ({ ...n })),
    currentNodeClass: { ...currentNodeClass },
    stepExplanation: `Algorithm finished. Optimal value is ${rootVal}.`,
    message: `Finished! Optimal value: ${rootVal}`
  };
}
