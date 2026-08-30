import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const trieMarkdown = `
# Trie (Prefix Tree)

A **Trie** (derived from re**trie**val), also known as a **Prefix Tree**, is a specialized tree-like data structure used primarily to store an associative array or dynamic set where the keys are usually strings.

Unlike a binary search tree, no node in the tree stores the key associated with that node; instead, its position in the tree defines the key with which it is associated. All the descendants of a node have a common prefix of the string associated with that node, and the root is associated with the empty string.

### Core Operations

1. **Insert**: Adds a word to the Trie. We start from the root and for every character in the word, we check if a child node exists. If it does, we move to it. If it doesn't, we create a new node. Once all characters are processed, we mark the final node as the end of the word (\`isEndOfWord = true\`).
2. **Search**: Checks if an exact word exists in the Trie. We traverse down the tree character by character. If we reach the end of the word and the final node's \`isEndOfWord\` flag is true, the word exists. If at any point the next character is missing, the word does not exist.
3. **Starts With (Prefix Search)**: Similar to search, but we only care if the path exists for the given prefix. We don't check the \`isEndOfWord\` flag at the end.

### Applications

- **Autocomplete**: Predictive text and search engines use Tries to quickly fetch all words starting with a given prefix.
- **Spell Checking**: Word processors use Tries to check if a word is correctly spelled.
- **IP Routing (Longest Prefix Matching)**: Routers use variations of Tries to determine the best route for an IP address.

### Complexity

Let **L** be the length of the word being inserted, searched, or prefixed, and **N** be the number of words in the Trie.

| Operation | Time Complexity | Space Complexity |
| --------- | --------------- | ---------------- |
| Insert    | O(L)            | O(L)             |
| Search    | O(L)            | O(1)             |
| Prefix    | O(L)            | O(1)             |

### Advantages over Hash Maps
While Hash Maps also provide O(1) or O(L) string lookups, Tries excel when you need to perform **prefix searches** or find all words with a common prefix. Hash maps cannot efficiently return "all words starting with 'app'". Furthermore, Tries can be more space-efficient than Hash Maps when storing many words sharing the same prefix.
`;

const Content = () => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{trieMarkdown}</ReactMarkdown>
    </div>
  );
};

export default Content;
