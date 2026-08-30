export class TrieNode {
  constructor(char = "", id = "root") {
    this.id = id;
    this.char = char;
    this.children = {}; // char -> TrieNode
    this.isEndOfWord = false;
    this.x = 400;
    this.y = 60;
  }
}

export function cloneTrie(node) {
  if (!node) return null;
  const newNode = new TrieNode(node.char, node.id);
  newNode.isEndOfWord = node.isEndOfWord;
  newNode.x = node.x;
  newNode.y = node.y;
  for (const char in node.children) {
    newNode.children[char] = cloneTrie(node.children[char]);
  }
  return newNode;
}

export function* insertGenerator(root, word, startNodeIdCounter) {
  const newSteps = [];
  let tempRoot = cloneTrie(root);

  yield {
    tree: cloneTrie(tempRoot),
    highlightedNodes: { root: "visiting" },
    highlightedEdges: {},
    explanation: `Begin insertion of word "${word}". Start at the Root node.`
  };

  let node = tempRoot;
  let counter = startNodeIdCounter;

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const isLast = i === word.length - 1;

    const activeHighlights = {};
    const activeEdges = {};

    let traceNode = tempRoot;
    activeHighlights[traceNode.id] = "active";
    for (let j = 0; j < i; j++) {
      const nextNode = traceNode.children[word[j]];
      activeHighlights[nextNode.id] = "active";
      activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
      traceNode = nextNode;
    }

    if (node.children[char]) {
      const childNode = node.children[char];
      activeHighlights[childNode.id] = "visiting";
      activeEdges[`${node.id}->${childNode.id}`] = true;

      yield {
        tree: cloneTrie(tempRoot),
        highlightedNodes: { ...activeHighlights },
        highlightedEdges: { ...activeEdges },
        explanation: `Character '${char}' already exists under node '${node.char || "root"}'. Follow edge to character node '${char}'.`
      };

      node = childNode;
    } else {
      counter++;
      const newChild = new TrieNode(char, `node-${counter}`);
      node.children[char] = newChild;

      activeHighlights[newChild.id] = "visiting";
      activeEdges[`${node.id}->${newChild.id}`] = true;

      yield {
        tree: cloneTrie(tempRoot),
        highlightedNodes: { ...activeHighlights },
        highlightedEdges: { ...activeEdges },
        explanation: `Character '${char}' is missing under node '${node.char || "root"}'. Create a new node for '${char}' and link it.`
      };

      node = newChild;
    }

    if (isLast) {
      node.isEndOfWord = true;
      const finalHighlights = { ...activeHighlights };
      finalHighlights[node.id] = "matched";

      yield {
        tree: cloneTrie(tempRoot),
        highlightedNodes: finalHighlights,
        highlightedEdges: { ...activeEdges },
        explanation: `Word "${word}" insertion complete. Mark final character node '${char}' as End of Word (isEndOfWord = true).`,
        newNodeIdCounter: counter
      };
    }
  }
}

export function* searchGenerator(root, word) {
  yield {
    highlightedNodes: { root: "visiting" },
    highlightedEdges: {},
    explanation: `Search for word "${word}". Start matching characters at the Root node.`
  };

  let node = root;
  let found = true;

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const isLast = i === word.length - 1;

    const activeHighlights = {};
    const activeEdges = {};

    let traceNode = root;
    activeHighlights[traceNode.id] = "active";
    for (let j = 0; j < i; j++) {
      const nextNode = traceNode.children[word[j]];
      activeHighlights[nextNode.id] = "active";
      activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
      traceNode = nextNode;
    }

    if (node.children[char]) {
      const childNode = node.children[char];
      activeHighlights[childNode.id] = "visiting";
      activeEdges[`${node.id}->${childNode.id}`] = true;

      yield {
        highlightedNodes: { ...activeHighlights },
        highlightedEdges: { ...activeEdges },
        explanation: `Found letter '${char}' under node '${node.char || "root"}'. Matching prefix: "${word.slice(0, i + 1)}".`
      };

      node = childNode;
    } else {
      found = false;
      activeHighlights[node.id] = "error";
      yield {
        highlightedNodes: { ...activeHighlights },
        highlightedEdges: { ...activeEdges },
        explanation: `Letter '${char}' is missing under node '${node.char || "root"}'. Searching failed: "${word}" is not in the Trie.`
      };
      break;
    }

    if (isLast && found) {
      const finalHighlights = { ...activeHighlights };
      if (node.isEndOfWord) {
        finalHighlights[node.id] = "matched";
        yield {
          highlightedNodes: finalHighlights,
          highlightedEdges: { ...activeEdges },
          explanation: `Found letter '${char}' and isEndOfWord = true. Success: Word "${word}" exists in the Trie!`
        };
      } else {
        finalHighlights[node.id] = "error";
        yield {
          highlightedNodes: finalHighlights,
          highlightedEdges: { ...activeEdges },
          explanation: `Traversed all letters, but isEndOfWord = false. Word "${word}" is NOT in the Trie (Prefix match only).`
        };
      }
    }
  }
}

export function* prefixSearchGenerator(root, prefix) {
  yield {
    highlightedNodes: { root: "visiting" },
    highlightedEdges: {},
    explanation: `Check startsWith prefix "${prefix}". Start at the Root node.`
  };

  let node = root;
  let found = true;

  for (let i = 0; i < prefix.length; i++) {
    const char = prefix[i];
    const isLast = i === prefix.length - 1;

    const activeHighlights = {};
    const activeEdges = {};

    let traceNode = root;
    activeHighlights[traceNode.id] = "active";
    for (let j = 0; j < i; j++) {
      const nextNode = traceNode.children[prefix[j]];
      activeHighlights[nextNode.id] = "active";
      activeEdges[`${traceNode.id}->${nextNode.id}`] = true;
      traceNode = nextNode;
    }

    if (node.children[char]) {
      const childNode = node.children[char];
      activeHighlights[childNode.id] = "visiting";
      activeEdges[`${node.id}->${childNode.id}`] = true;

      yield {
        highlightedNodes: { ...activeHighlights },
        highlightedEdges: { ...activeEdges },
        explanation: `Letter '${char}' matches. Prefix path exists for: "${prefix.slice(0, i + 1)}".`
      };

      node = childNode;
    } else {
      found = false;
      activeHighlights[node.id] = "error";
      yield {
        highlightedNodes: { ...activeHighlights },
        highlightedEdges: { ...activeEdges },
        explanation: `Letter '${char}' missing under node '${node.char || "root"}'. Prefix check failed: "${prefix}" does not exist in the Trie.`
      };
      break;
    }

    if (isLast && found) {
      const finalHighlights = { ...activeHighlights };
      finalHighlights[node.id] = "matched";
      yield {
        highlightedNodes: finalHighlights,
        highlightedEdges: { ...activeEdges },
        explanation: `All letters in prefix "${prefix}" successfully traversed. Success: Prefix exists in the Trie!`
      };
    }
  }
}
