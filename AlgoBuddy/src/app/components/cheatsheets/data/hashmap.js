export const hashMapCheatsheets = [
  {
    id: "hash-map",
    title: "Hash Map",
    category: "hashmap",
    difficulty: "beginner",
    timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `// Map (ES6)
const map = new Map();
map.set('key', 'value');
map.get('key');   // 'value'
map.has('key');   // true
map.delete('key');
map.size;         // 0

// Object (alternative)
const obj = {};
obj.key = 'value';
obj['key'];       // 'value'
'key' in obj;     // true
delete obj.key;

// Set (unique values)
const set = new Set([1, 2, 3, 1]);
set.has(1);       // true
set.size;         // 3 (duplicates removed)`,
      python: `# Dictionary (hash map)
d = {}
d['key'] = 'value'
d.get('key')       # 'value'
'key' in d         # True
del d['key']
len(d)             # 0

# Set (unique values)
s = {1, 2, 3, 1}
1 in s             # True
len(s)             # 3
s.add(4)
s.remove(1)`
    },
    steps: [
      "Hash function computes an index from the key",
      "Key-value pair is stored at that index (bucket)",
      "On collision, separate chaining or open addressing resolves it",
      "Average O(1) for get, set, delete with a good hash function"
    ],
    whenToUse: "Fast lookups by key; counting frequencies; caching; deduplication",
    pitfalls: "Worst-case O(n) if hash collisions are many; unordered; more memory overhead than arrays"
  }
];
