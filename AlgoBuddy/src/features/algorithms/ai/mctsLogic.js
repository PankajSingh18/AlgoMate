export const makeInitialTree = () => {
  return new Array(15).fill(null).map((_, i) => ({
    id: i,
    visits: 0,
    wins: 0,
    children: i <= 6 ? [2 * i + 1, 2 * i + 2] : [],
  }));
};

const randOutcome = () => (Math.random() < 0.5 ? 1 : 0);

export const uct = (node, parentVisits, c = 1.4) => {
  if (node.visits === 0) return Infinity;
  const exploitation = node.wins / node.visits;
  const exploration = c * Math.sqrt(Math.log(parentVisits) / node.visits);
  return exploitation + exploration;
};

const select = (nodes, exploreC) => {
  let path = [0];
  let cur = nodes[0];
  while (cur.children && cur.children.length > 0) {
    const parentVisits = cur.visits || 1;
    const childNodes = cur.children.map((id) => nodes[id]);
    let best = childNodes[0];
    for (const ch of childNodes) {
      if (uct(ch, parentVisits, exploreC) > uct(best, parentVisits, exploreC)) {
        best = ch;
      }
    }
    path.push(best.id);
    cur = best;
  }
  return path;
};

export function* mctsGenerator(initialTree, exploreC, simSize, totalSteps = 100) {
  let tree = initialTree.map(n => ({ ...n }));
  
  for (let count = 1; count <= totalSteps; count++) {
    const nodes = tree.map((n) => ({ ...n }));
    let lastPath = [];
    
    for (let s = 0; s < simSize; s++) {
      const path = select(nodes, exploreC);
      const outcome = randOutcome();
      // Backpropagate
      for (const id of path) {
        nodes[id].visits += 1;
        nodes[id].wins += outcome;
      }
      lastPath = path;
    }
    
    tree = nodes;
    
    yield {
      tree: tree.map(n => ({ ...n })),
      highlightPath: lastPath,
      stepCount: count,
      stepExplanation: `Iteration #${count}: Performed ${simSize} simulations. The last path selected via UCT was: ${lastPath.join(" → ")}.`
    };
  }
}
