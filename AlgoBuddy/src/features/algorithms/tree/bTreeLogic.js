/**
 * Pure logic for B-Tree operations.
 */

export const T = 2; // Min degree (B-Tree of order 4)

let nodeIdCounter = 0;
export function makeNode(isLeaf = true) {
  return { id: `btn-${++nodeIdCounter}`, keys: [], children: [], isLeaf };
}

export function cloneTree(node) {
  if (!node) return null;
  return {
    id: node.id,
    keys: [...node.keys],
    children: node.children.map(cloneTree),
    isLeaf: node.isLeaf
  };
}

export class BTreeManager {
  constructor() {
    this.root = makeNode(true);
  }

  clone() {
    const mgr = new BTreeManager();
    mgr.root = cloneTree(this.root);
    return mgr;
  }

  // Uses generators to yield steps
  *insertGenerator(key) {
    yield {
      tree: cloneTree(this.root),
      highlighted: {},
      explanation: `Insert key ${key} into B-Tree (order ${2 * T}). Max keys per node: ${2 * T - 1}.`
    };

    if (this.root.keys.length === 2 * T - 1) {
      const newRoot = makeNode(false);
      newRoot.children.push(this.root);
      this.root = newRoot;

      yield {
        tree: cloneTree(this.root),
        highlighted: { [newRoot.id]: "visiting" },
        explanation: `Root is full (${2 * T - 1} keys). Create a new root and split the old root.`
      };

      yield* this._splitChildGenerator(this.root, 0);

      yield {
        tree: cloneTree(this.root),
        highlighted: { [this.root.id]: "active" },
        explanation: `Old root split. New root created. Tree height increased by 1.`
      };
    }

    yield* this._insertNonFullGenerator(this.root, key);

    yield {
      tree: cloneTree(this.root),
      highlighted: {},
      explanation: `✅ Key ${key} successfully inserted into the B-Tree!`
    };
  }

  *_insertNonFullGenerator(node, key) {
    let i = node.keys.length - 1;

    if (node.isLeaf) {
      node.keys.push(0);
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;

      yield {
        tree: cloneTree(this.root),
        highlighted: { [node.id]: "matched" },
        explanation: `Reached leaf node. Insert key ${key} in sorted position. Node now has ${node.keys.length} keys.`
      };
    } else {
      while (i >= 0 && key < node.keys[i]) i--;
      i++;

      yield {
        tree: cloneTree(this.root),
        highlighted: { [node.id]: "visiting" },
        explanation: `Internal node: key ${key} goes into child[${i}] (between ${node.keys[i - 1] ?? "−∞"} and ${node.keys[i] ?? "+∞"}). Navigate down.`
      };

      if (node.children[i] && node.children[i].keys.length === 2 * T - 1) {
        yield {
          tree: cloneTree(this.root),
          highlighted: { [node.children[i].id]: "error" },
          explanation: `Child[${i}] is full (${2 * T - 1} keys). Must split child before descending.`
        };
        yield* this._splitChildGenerator(node, i);
        if (key > node.keys[i]) i++;
      }

      yield* this._insertNonFullGenerator(node.children[i], key);
    }
  }

  *_splitChildGenerator(parent, i) {
    const t = T;
    const y = parent.children[i];
    const z = makeNode(y.isLeaf);

    z.keys = y.keys.splice(t, t - 1);
    if (!y.isLeaf) z.children = y.children.splice(t, t);

    const medianKey = y.keys.pop();

    parent.keys.splice(i, 0, medianKey);
    parent.children.splice(i + 1, 0, z);

    yield {
      tree: cloneTree(this.root),
      highlighted: { [y.id]: "active", [z.id]: "active", [parent.id]: "visiting" },
      explanation: `Split child: median key ${medianKey} promoted to parent. Left child: [${y.keys}], Right child: [${z.keys}].`
    };
  }

  *searchGenerator(key) {
    yield {
      tree: cloneTree(this.root),
      highlighted: {},
      explanation: `Search for key ${key} in B-Tree. Start at root.`
    };
    yield* this._searchDFSGenerator(this.root, key);
  }

  *_searchDFSGenerator(node, key) {
    if (!node) return;
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;

    if (i < node.keys.length && key === node.keys[i]) {
      yield {
        tree: cloneTree(this.root),
        highlighted: { [node.id]: "matched" },
        explanation: `✅ Found key ${key} in node [${node.keys.join(", ")}]!`
      };
      return;
    }

    if (node.isLeaf) {
      yield {
        tree: cloneTree(this.root),
        highlighted: { [node.id]: "error" },
        explanation: `Reached leaf node [${node.keys.join(", ")}]. Key ${key} not found in B-Tree.`
      };
      return;
    }

    yield {
      tree: cloneTree(this.root),
      highlighted: { [node.id]: "visiting" },
      explanation: `Key ${key} not in node [${node.keys.join(", ")}]. Descend into child[${i}].`
    };

    yield* this._searchDFSGenerator(node.children[i], key);
  }
}
