$content = Get-Content app\visualizer\dp\page.jsx -Raw

# 1. Add to PROBLEMS list
$content = $content -replace '(const PROBLEMS = \["Fibonacci", "LIS", "0/1 Knapsack", "LCS"\];)', 'const PROBLEMS = ["Fibonacci", "LIS", "0/1 Knapsack", "LCS", "Edit Distance"];'

# 2. Add to COMPLEXITY
$content = $content -replace '("LCS":\s*\{ time: "O\(MÃ—N\)", space: "O\(MÃ—N\)" \},)', "`$1`r`n  `"Edit Distance`": { time: `"O(MxN)`", space: `"O(MxN)`" },"

# 3. Add to PSEUDOCODE
$content = $content -replace '(  "LCS": `for i from 1 to m:[\s\S]*?dp\(i\)\(j-1\)\)`,)', "`$1`r`n  `"Edit Distance`": ``edit(i,j):`r`n  if s1[i]==s2[j]:`r`n    dp[i][j]=dp[i-1][j-1]`r`n  else:`r`n    dp[i][j]=1+min(`r`n      dp[i-1][j],   // delete`r`n      dp[i][j-1],   // insert`r`n      dp[i-1][j-1]) // replace``,"

Set-Content app\visualizer\dp\page.jsx -Value $content