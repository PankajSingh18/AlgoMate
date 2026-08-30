$content = Get-Content app\visualizer\dp\page.jsx -Raw

# 1. Add state variables after lcsS2
$content = $content -replace '(const \[lcsS2, setLcsS2\] = useState\("BDCAB"\);)', "`$1`r`n  const [edS1, setEdS1] = useState(`"SUNDAY`");`r`n  const [edS2, setEdS2] = useState(`"SATURDAY`");"

# 2. Add to buildSteps logic
$content = $content -replace '(else if \(problem === "LCS"\) s = lcsSteps\(lcsS1\.slice\(0, 8\), lcsS2\.slice\(0, 8\)\);)', "`$1`r`n    else if (problem === `"Edit Distance`") s = editDistanceSteps(edS1.slice(0, 8), edS2.slice(0, 8));"

# 3. Update useCallback dependency array
$content = $content -replace '(\}, \[problem, fibN, lisArr, ksWeights, ksValues, ksW, lcsS1, lcsS2\]\);)', '}, [problem, fibN, lisArr, ksWeights, ksValues, ksW, lcsS1, lcsS2, edS1, edS2]);'

# 4. Add input UI block after LCS input block
$newInput = @'
            )}

            {problem === "Edit Distance" && (
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">String 1 (max 8 chars)</label>
                  <input value={edS1} onChange={e => setEdS1(e.target.value.slice(0,8).toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">String 2 (max 8 chars)</label>
                  <input value={edS2} onChange={e => setEdS2(e.target.value.slice(0,8).toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
              </div>
            )}

            <button onClick={buildSteps}
'@
$content = $content -replace '(\s*\)\}\s*\r?\n\s*<button onClick=\{buildSteps\}\r?\n)', "`r`n$newInput`r`n"

# 5. Add description text
$content = $content -replace '(\{problem === "LCS" && "Each cell = LCS length of prefixes — green = character match"\})', "`$1`r`n              {problem === `"Edit Distance`" && `"Each cell = minimum edits to convert prefix of s1 into prefix of s2`"}"

# 6. Add render call for EditDistanceViz
$content = $content -replace '(\{problem === "LCS" && <LCSViz steps=\{steps\} stepIdx=\{stepIdx\} s1=\{lcsS1\.slice\(0, 8\)\} s2=\{lcsS2\.slice\(0, 8\)\} />\})', "`$1`r`n            {problem === `"Edit Distance`" && <EditDistanceViz steps={steps} stepIdx={stepIdx} s1={edS1.slice(0, 8)} s2={edS2.slice(0, 8)} />}"

Set-Content app\visualizer\dp\page.jsx -Value $content