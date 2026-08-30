$content = Get-Content app\visualizer\dp\page.jsx -Raw

# 1. Add editDistanceSteps function before EditDistanceViz
$func = @'
function editDistanceSteps(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  const steps = [];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      steps.push({ dp: dp.map(r => [...r]), current: [i, j], match: s1[i - 1] === s2[j - 1] });
    }
  }
  return steps;
}

function EditDistanceViz(
'@
$content = $content -replace 'function EditDistanceViz\(', $func

# 2. Add COMPLEXITY entry
$content = $content -replace '("LCS":\s*\{ time: "O\(MÃ—N\)", space: "O\(MÃ—N\)" \},\s*\r?\n\};)', "`"LCS`":          { time: `"O(MxN)`", space: `"O(MxN)`" },`r`n  `"Edit Distance`": { time: `"O(MxN)`", space: `"O(MxN)`" },`r`n};"

Set-Content app\visualizer\dp\page.jsx -Value $contents