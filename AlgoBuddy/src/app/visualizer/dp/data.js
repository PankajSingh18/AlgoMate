export const dpTopics = {
  knapsack: {
    key: "knapsack",
    title: "0/1 Knapsack Problem",
    category: "Dynamic Programming",
    description: "Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. You cannot break an item, either pick the complete item or don't pick it (0/1 property).",
    summary: [
      "Dynamic programming breaks this problem down by considering subproblems defined by a subset of items and a smaller knapsack capacity.",
      "A 2D DP matrix is constructed where dp[i][w] represents the maximum value that can be attained with the first i items and capacity w."
    ],
    steps: [
      "Initialize a DP table of size (n+1) x (W+1) with 0s.",
      "Iterate through each item from 1 to n.",
      "For each item, iterate through all capacities from 1 to W.",
      "If the current item's weight is less than or equal to the capacity w, we have two choices: include it or exclude it.",
      "Take the maximum of: the value of the item + dp[i-1][w-weight] OR dp[i-1][w] (excluding it).",
      "If the item's weight exceeds capacity, we just exclude it: dp[i][w] = dp[i-1][w]."
    ],
    defaultInput: {
      capacity: 5,
      items: [
        { weight: 1, value: 6 },
        { weight: 2, value: 10 },
        { weight: 3, value: 12 },
      ]
    },
    complexity: [
      { label: "Time", value: "O(n*W)" },
      { label: "Space", value: "O(n*W)" },
    ],
  },
  lcs: {
    key: "lcs",
    title: "Longest Common Subsequence",
    category: "Dynamic Programming",
    description: "Find the length of the longest subsequence present in both of the strings. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.",
    summary: [
      "LCS compares two strings character by character and builds a 2D matrix storing the length of the longest matching subsequence at each point.",
      "If the characters match, the length increases by 1 from the diagonal element. If they don't, we take the maximum from the adjacent cells (left or top)."
    ],
    steps: [
      "Initialize a DP table of size (n+1) x (m+1) with 0s.",
      "Iterate through the characters of the first string (i from 1 to n).",
      "Iterate through the characters of the second string (j from 1 to m).",
      "If str1[i-1] == str2[j-1], then dp[i][j] = dp[i-1][j-1] + 1.",
      "Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
      "The bottom-right cell contains the length of the longest common subsequence."
    ],
    defaultInput: {
      str1: "AGGTAB",
      str2: "GXTXAYB"
    },
    complexity: [
      { label: "Time", value: "O(n*m)" },
      { label: "Space", value: "O(n*m)" },
    ],
  },
  "coin-change": {
    key: "coin-change",
    title: "Coin Change",
    category: "Dynamic Programming",
    description: "Given an integer array of coins representing coins of different denominations and an integer amount representing a total amount of money, return the fewest number of coins that you need to make up that amount.",
    summary: [
      "The coin change problem builds a 1D DP array where dp[i] represents the minimum number of coins needed to make amount i.",
      "We iterate through all amounts from 1 to the target, checking if using each coin leads to a better minimal count."
    ],
    steps: [
      "Initialize a DP array of size amount + 1 with Infinity, except dp[0] = 0.",
      "Iterate through all sub-amounts i from 1 to amount.",
      "For each sub-amount, iterate through all available coins.",
      "If the coin value is less than or equal to i, check if we can improve our count: dp[i] = min(dp[i], dp[i - coin] + 1).",
      "If dp[amount] is still Infinity, it's impossible to form the amount. Otherwise, return dp[amount]."
    ],
    defaultInput: {
      amount: 11,
      coins: [1, 2, 5]
    },
    complexity: [
      { label: "Time", value: "O(amount * n)" },
      { label: "Space", value: "O(amount)" },
    ],
  }
};
