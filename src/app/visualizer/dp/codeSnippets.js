export const dpCodeSnippets = {
  knapsack: {
    JavaScript: [
      "function knapsack(weights, values, W) {",
      "  let dp = Array(n+1).fill().map(() => Array(W+1).fill(0));",
      "  for (let i = 1; i <= n; i++) {",
      "    for (let w = 0; w <= W; w++) {",
      "      if (weights[i-1] <= w) {",
      "        dp[i][w] = Math.max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]]);",
      "      } else {",
      "        dp[i][w] = dp[i-1][w];",
      "      }",
      "    }",
      "  }",
      "  return dp[n][W];",
      "}",
    ],
    Python: [
      "def knapsack(weights, values, W):",
      "    dp = [[0]*(W+1) for _ in range(n+1)]",
      "    for i in range(1, n+1):",
      "        for w in range(W+1):",
      "            if weights[i-1] <= w:",
      "                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]])",
      "            else:",
      "                dp[i][w] = dp[i-1][w]",
      "    return dp[n][W]",
    ],
  },
  lcs: {
    JavaScript: [
      "function lcs(str1, str2) {",
      "  let dp = Array(m+1).fill().map(() => Array(n+1).fill(0));",
      "  for (let i = 1; i <= m; i++) {",
      "    for (let j = 1; j <= n; j++) {",
      "      if (str1[i-1] === str2[j-1]) {",
      "        dp[i][j] = dp[i-1][j-1] + 1;",
      "      } else {",
      "        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);",
      "      }",
      "    }",
      "  }",
      "  return dp[m][n];",
      "}",
    ],
    Python: [
      "def lcs(str1, str2):",
      "    dp = [[0]*(n+1) for _ in range(m+1)]",
      "    for i in range(1, m+1):",
      "        for j in range(1, n+1):",
      "            if str1[i-1] == str2[j-1]:",
      "                dp[i][j] = dp[i-1][j-1] + 1",
      "            else:",
      "                dp[i][j] = max(dp[i-1][j], dp[i][j-1])",
      "    return dp[m][n]",
    ],
  },
  "coin-change": {
    JavaScript: [
      "function coinChange(coins, amount) {",
      "  let dp = Array(amount+1).fill(Infinity);",
      "  dp[0] = 0;",
      "  for (let i = 1; i <= amount; i++) {",
      "    for (let coin of coins) {",
      "      if (coin <= i) {",
      "        dp[i] = Math.min(dp[i], dp[i-coin] + 1);",
      "      }",
      "    }",
      "  }",
      "  return dp[amount];",
      "}",
    ],
    Python: [
      "def coin_change(coins, amount):",
      "    dp = [float('inf')] * (amount+1)",
      "    dp[0] = 0",
      "    for i in range(1, amount+1):",
      "        for coin in coins:",
      "            if coin <= i:",
      "                dp[i] = min(dp[i], dp[i-coin] + 1)",
      "    return dp[amount]",
    ],
  },
};

// Given the current animation frame, figure out which code line to highlight
export function getHighlightLine(algorithm, frame) {
  if (!frame) return -1;
  if (algorithm === "knapsack") {
    if (frame.row === 0 || frame.col === 0) return 1; // base case row/col
    return 5; // inside recurrence
  }
  if (algorithm === "lcs") {
    if (frame.row === 0 || frame.col === 0) return 1;
    return 4; // comparison line
  }
  if (algorithm === "coin-change") {
    if (frame.index === 0) return 2; // base case
    return 5; // inner coin loop
  }
  return -1;
}