export function* lcsGenerator(str1, str2) {
  const n = str1.length;
  const m = str2.length;
  const dp = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));

  yield {
    dp: dp.map(row => [...row]),
    row: -1, col: -1,
    description: `Initialize DP table of size ${n+1} x ${m+1} with 0s. dp[i][j] = LCS length of str1[0..i-1] and str2[0..j-1].`
  };

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      let description = `Comparing str1[${i-1}]='${str1[i-1]}' and str2[${j-1}]='${str2[j-1]}'. `;
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        description += `Match! dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i][j]}.`;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        description += `Mismatch. dp[${i}][${j}] = Max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = ${dp[i][j]}.`;
      }
      
      yield {
        dp: dp.map(row => [...row]),
        row: i,
        col: j,
        description,
        char1: str1[i-1],
        char2: str2[j-1]
      };
    }
  }

  yield {
    dp: dp.map(row => [...row]),
    row: n,
    col: m,
    description: `Done! The length of LCS is dp[${n}][${m}] = ${dp[n][m]}.`,
    isComplete: true
  };
}
