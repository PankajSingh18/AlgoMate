export const recursionCheatsheets = [
  {
    id: "factorial",
    title: "Factorial",
    category: "recursion",
    difficulty: "beginner",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
      python: `def factorial(n):
    if n <= 1: return 1
    return n * factorial(n - 1)`
    },
    steps: [
      "Base case: factorial(0) = factorial(1) = 1",
      "Recursive case: n! = n × (n-1)!",
      "Each call reduces n by 1 until base case is reached"
    ],
    whenToUse: "Problems that can be broken into identical subproblems of decreasing size",
    pitfalls: "Stack overflow for large n (try iterative for n > 1000)"
  },
  {
    id: "fibonacci",
    title: "Fibonacci (with memoization)",
    category: "recursion",
    difficulty: "beginner",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(n)",
    code: {
      javascript: `function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}`,
      python: `def fib(n, memo=None):
    if memo is None: memo = {}
    if n <= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]`
    },
    steps: [
      "Base case: fib(0) = 0, fib(1) = 1",
      "Recursive case: fib(n) = fib(n-1) + fib(n-2)",
      "Memoization stores computed values to avoid exponential blowup"
    ],
    whenToUse: "Problems with overlapping subproblems (DP), sequence generation",
    pitfalls: "Without memoization, O(2ⁿ) time; stack overflow for very large n"
  },
  {
    id: "tree-traversal",
    title: "Tree Traversals (Recursive)",
    category: "recursion",
    difficulty: "intermediate",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(h)",
    code: {
      javascript: `// In-order (left, root, right)
function inOrder(node) {
  if (!node) return [];
  return [...inOrder(node.left), node.val, ...inOrder(node.right)];
}
// Pre-order (root, left, right)
function preOrder(node) {
  if (!node) return [];
  return [node.val, ...preOrder(node.left), ...preOrder(node.right)];
}
// Post-order (left, right, root)
function postOrder(node) {
  if (!node) return [];
  return [...postOrder(node.left), ...postOrder(node.right), node.val];
}`,
      python: `def in_order(node):
    if not node: return []
    return in_order(node.left) + [node.val] + in_order(node.right)

def pre_order(node):
    if not node: return []
    return [node.val] + pre_order(node.left) + pre_order(node.right)

def post_order(node):
    if not node: return []
    return post_order(node.left) + post_order(node.right) + [node.val]`
    },
    steps: [
      "In-order: left subtree → root → right subtree (sorted order in BST)",
      "Pre-order: root → left → right (copy tree structure)",
      "Post-order: left → right → root (delete tree)"
    ],
    whenToUse: "Tree operations; expression evaluation; serialization",
    pitfalls: "Recursive depth equals tree height; may overflow for skewed trees"
  }
];
