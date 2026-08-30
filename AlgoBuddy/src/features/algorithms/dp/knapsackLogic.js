export function* knapsackGenerator(weights, values, capacity) {
  const n = weights.length;
  // Initialize DP table: dp[i][w]
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  
  yield {
    dp: dp.map(row => [...row]),
    row: -1,
    col: -1,
    description: `Initialize a DP table of size ${(n + 1)} x ${(capacity + 1)} with 0s. dp[i][w] will store the maximum value for first i items with weight limit w.`,
  };

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const currentWeight = weights[i - 1];
      const currentValue = values[i - 1];
      
      let description = `Evaluating item ${i} (Weight: ${currentWeight}, Value: ${currentValue}) for capacity ${w}. `;
      
      if (currentWeight <= w) {
        const includeValue = currentValue + dp[i - 1][w - currentWeight];
        const excludeValue = dp[i - 1][w];
        
        dp[i][w] = Math.max(includeValue, excludeValue);
        
        description += `We can include it. Max(exclude: ${excludeValue}, include: ${currentValue} + dp[${i-1}][${w - currentWeight}]) = ${dp[i][w]}.`;
      } else {
        dp[i][w] = dp[i - 1][w];
        description += `Weight ${currentWeight} > capacity ${w}. Cannot include. Copy from above: dp[${i}][${w}] = ${dp[i][w]}.`;
      }
      
      yield {
        dp: dp.map(row => [...row]),
        row: i,
        col: w,
        description,
        currentItem: i,
        currentCap: w
      };
    }
  }

  yield {
    dp: dp.map(row => [...row]),
    row: n,
    col: capacity,
    description: `Done! The maximum value is dp[${n}][${capacity}] = ${dp[n][capacity]}.`,
    isComplete: true
  };
}
