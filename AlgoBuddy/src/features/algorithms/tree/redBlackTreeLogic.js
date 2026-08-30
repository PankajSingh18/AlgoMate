/**
 * Pure generator logic for Red-Black Tree operations.
 */

export const RED = "RED";
export const BLACK = "BLACK";

export class RBNode {
  constructor(value) {
    this.value = value;
    this.color = RED;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.id = `node-${value}-${Date.now()}`;
  }
}

export class RBTree {
  constructor() {
    this.NIL = new RBNode(null);
    this.NIL.color = BLACK;
    this.NIL.id = "NIL";
    this.root = this.NIL;
  }

  clone() {
    const cloneNode = (node, parent = null) => {
      if (node === this.NIL) return newTree.NIL;
      const n = new RBNode(node.value);
      n.color = node.color;
      n.id = node.id;
      n.parent = parent;
      n.left = cloneNode(node.left, n);
      n.right = cloneNode(node.right, n);
      return n;
    };
    const newTree = new RBTree();
    newTree.root = cloneNode(this.root);
    return newTree;
  }

  *insertGenerator(value) {
    const newNode = new RBNode(value);
    newNode.left = this.NIL;
    newNode.right = this.NIL;

    yield { tree: this.clone(), highlighted: {}, explanation: `Insert value ${value}. Color it RED (all new nodes start as RED).` };

    // BST Insert
    let y = null;
    let x = this.root;

    while (x !== this.NIL) {
      y = x;
      if (newNode.value < x.value) x = x.left;
      else x = x.right;
    }

    newNode.parent = y;
    if (y === null) this.root = newNode;
    else if (newNode.value < y.value) y.left = newNode;
    else y.right = newNode;

    yield { tree: this.clone(), highlighted: { [newNode.id]: "visiting" }, explanation: `BST Insert: Placed ${value} in the correct position. Now fix RB violations.` };

    // Fix violations
    yield* this._fixInsertGenerator(newNode);

    this.root.color = BLACK;
    yield { tree: this.clone(), highlighted: { [this.root.id]: "matched" }, explanation: `Root is always BLACK. Recolor root to BLACK. Insertion of ${value} complete!` };
  }

  *_fixInsertGenerator(node) {
    let z = node;

    while (z.parent && z.parent.color === RED) {
      if (z.parent === z.parent.parent?.left) {
        const uncle = z.parent.parent.right;

        if (uncle && uncle !== this.NIL && uncle.color === RED) {
          // Case 1: Uncle is RED - Recolor
          z.parent.color = BLACK;
          uncle.color = BLACK;
          z.parent.parent.color = RED;
          yield {
            tree: this.clone(),
            highlighted: { [z.id]: "visiting", [z.parent.id]: "active", [uncle.id]: "active", [z.parent.parent.id]: "active" },
            explanation: `Case 1: Uncle is RED. Recolor parent and uncle to BLACK, grandparent to RED. Move z up to grandparent.`
          };
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            // Case 2: z is a right child
            z = z.parent;
            yield {
              tree: this.clone(),
              highlighted: { [z.id]: "visiting" },
              explanation: `Case 2: Node is a right child. Move z to its parent, then LEFT ROTATE parent to move into Case 3.`
            };
            this._leftRotate(z);
            yield { tree: this.clone(), highlighted: { [z.id]: "active" }, explanation: `Left rotation applied at node ${z.value}.` };
          }
          // Case 3: z is a left child
          z.parent.color = BLACK;
          z.parent.parent.color = RED;
          yield {
            tree: this.clone(),
            highlighted: { [z.id]: "visiting", [z.parent?.id]: "active" },
            explanation: `Case 3: Recolor parent to BLACK, grandparent to RED. Then RIGHT ROTATE grandparent.`
          };
          this._rightRotate(z.parent?.parent);
          yield { tree: this.clone(), highlighted: { [z.id]: "matched" }, explanation: `Right rotation applied. RB violation resolved!` };
        }
      } else {
        // Mirror cases
        const uncle = z.parent.parent?.left;

        if (uncle && uncle !== this.NIL && uncle.color === RED) {
          z.parent.color = BLACK;
          uncle.color = BLACK;
          z.parent.parent.color = RED;
          yield {
            tree: this.clone(),
            highlighted: { [z.id]: "visiting", [z.parent.id]: "active", [uncle.id]: "active", [z.parent.parent.id]: "active" },
            explanation: `Case 1 (mirror): Uncle is RED. Recolor parent and uncle to BLACK, grandparent to RED.`
          };
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            yield {
              tree: this.clone(),
              highlighted: { [z.id]: "visiting" },
              explanation: `Case 2 (mirror): Node is a left child. RIGHT ROTATE parent.`
            };
            this._rightRotate(z);
          }
          z.parent.color = BLACK;
          z.parent.parent.color = RED;
          yield {
            tree: this.clone(),
            highlighted: { [z.id]: "visiting", [z.parent?.id]: "active" },
            explanation: `Case 3 (mirror): Recolor, then LEFT ROTATE grandparent.`
          };
          this._leftRotate(z.parent?.parent);
          yield { tree: this.clone(), highlighted: { [z.id]: "matched" }, explanation: `Left rotation applied. RB violation resolved!` };
        }
      }
      if (!z.parent) break;
    }

    this.root.color = BLACK;
  }

  _leftRotate(x) {
    if (!x || !x.right || x.right === this.NIL) return;
    const y = x.right;
    x.right = y.left;
    if (y.left !== this.NIL) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  }

  _rightRotate(x) {
    if (!x || !x.left || x.left === this.NIL) return;
    const y = x.left;
    x.left = y.right;
    if (y.right !== this.NIL) y.right.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.right) x.parent.right = y;
    else x.parent.left = y;
    y.right = x;
    x.parent = y;
  }
}
