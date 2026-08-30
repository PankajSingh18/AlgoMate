$content = Get-Content app\visualizer\dp\page.jsx -Raw

$newViz = @'
function EditDistanceViz({ steps, stepIdx, s1, s2 }) {
  const s = steps[Math.min(stepIdx, steps.length - 1)];
  if (!s) return null;
  const [ci, cj] = s.current;
  const maxVal = Math.max(...s.dp.flat());
  return (
    <div className="overflow-x-auto">
      <table className="mt-4 border-collapse text-xs font-mono">
        <thead>
          <tr>
            <th className="px-2 py-1 text-slate-500"></th>
            <th className="px-2 py-1 text-slate-500">""</th>
            {s2.split("").map((c, j) => (
              <th key={j} className="px-2 py-1 text-indigo-400">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {s.dp.map((row, i) => (
            <tr key={i}>
              <td className="px-2 py-1 text-indigo-400">
                {i === 0 ? '""' : s1[i - 1]}
              </td>
              {row.map((val, j) => {
                const isCurrent = i === ci && j === cj;
                const { bg, text } = cellColor(val, maxVal, isCurrent, false);
                return (
                  <td key={j} className="px-1 py-1">
                    <div className="w-9 h-9 rounded flex items-center justify-center font-bold transition-all duration-200"
                      style={{ backgroundColor: bg, color: text }}>
                      {val}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-sm text-slate-400 font-mono">
        dp[{ci}][{cj}] = {s.dp[ci][cj]}
      </div>
    </div>
  );
}

// ─── Main Component
'@

$content = $content -replace '// ─── Main Component', $newViz
Set-Content app\visualizer\dp\page.jsx -Value $content