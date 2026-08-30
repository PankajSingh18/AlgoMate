export function* editDistanceGenerator(str1, str2) {
  const n = str1.length;
  const m = str2.length;
  const dp = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));

  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;

  yield {
    dp: dp.map(row => [...row]),
    row: -1, col: -1,
    description: `Initialize DP table of size ${n + 1} x ${m + 1}. First row/column filled with insertion/deletion costs.`
  };

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      let description = `Comparing str1[${i - 1}]='${str1[i - 1]}' and str2[${j - 1}]='${str2[j - 1]}'. `;
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        description += `Characters match. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`;
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        );
        description += `Mismatch. dp[${i}][${j}] = 1 + Min(delete, insert, replace) = ${dp[i][j]}.`;
      }

      yield {
        dp: dp.map(row => [...row]),
        row: i,
        col: j,
        description,
        char1: str1[i - 1],
        char2: str2[j - 1]
      };
    }
  }

  yield {
    dp: dp.map(row => [...row]),
    row: n,
    col: m,
    description: `Done! Minimum edit distance is dp[${n}][${m}] = ${dp[n][m]}.`,
    isComplete: true
  };
}