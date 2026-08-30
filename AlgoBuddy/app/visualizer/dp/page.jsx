"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── DP Algorithms ─────────────────────────────────────────────────────────────

// Fibonacci
function fibSteps(n) {
  const dp = new Array(n + 1).fill(0);
  const steps = [];
  dp[0] = 0; dp[1] = 1;
  steps.push({ dp: [...dp], current: 0 });
  steps.push({ dp: [...dp], current: 1 });
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    steps.push({ dp: [...dp], current: i, deps: [i - 1, i - 2] });
  }
  return steps;
}

// LIS
function lisSteps(arr) {
  const n = arr.length;
  const dp = new Array(n).fill(1);
  const steps = [];
  steps.push({ dp: [...dp], current: 0, deps: [] });
  for (let i = 1; i < n; i++) {
    const deps = [];
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        if (dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
        deps.push(j);
      }
    }
    steps.push({ dp: [...dp], current: i, deps });
  }
  return steps;
}

// 0/1 Knapsack
function knapsackSteps(weights, values, W) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  const steps = [];
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
      steps.push({ dp: dp.map(r => [...r]), current: [i, w] });
    }
  }
  return steps;
}

// LCS
function lcsSteps(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const steps = [];
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      steps.push({ dp: dp.map(r => [...r]), current: [i, j], match: s1[i - 1] === s2[j - 1] });
    }
  }
  return steps;
}

// ─── Color helpers ─────────────────────────────────────────────────────────────
function cellColor(val, max, isCurrent, isDep) {
  if (isCurrent) return { bg: "#6366f1", text: "#fff" };
  if (isDep) return { bg: "#f59e0b", text: "#fff" };
  if (val === 0) return { bg: "#1e293b", text: "#475569" };
  const ratio = max > 0 ? val / max : 0;
  const g = Math.round(100 + ratio * 100);
  return { bg: `rgb(22,${g},74)`, text: "#fff" };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FibViz({ steps, stepIdx }) {
  const s = steps[Math.min(stepIdx, steps.length - 1)];
  if (!s) return null;
  const max = Math.max(...s.dp.filter(Boolean));
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 mt-4 flex-wrap">
        {s.dp.map((val, i) => {
          const isCurrent = i === s.current;
          const isDep = s.deps?.includes(i);
          const { bg, text } = cellColor(val, max, isCurrent, isDep);
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-1">F({i})</div>
              <div className="w-14 h-14 rounded-lg flex items-center justify-center text-sm font-mono font-bold border border-slate-700 transition-all duration-300"
                style={{ backgroundColor: bg, color: text }}>
                {val}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-sm text-slate-400 font-mono">
        {s.current >= 2
          ? `F(${s.current}) = F(${s.current - 1}) + F(${s.current - 2}) = ${s.dp[s.current - 1]} + ${s.dp[s.current - 2]} = ${s.dp[s.current]}`
          : `F(${s.current}) = ${s.dp[s.current]} (base case)`}
      </div>
    </div>
  );
}

function LISViz({ steps, stepIdx, arr }) {
  const s = steps[Math.min(stepIdx, steps.length - 1)];
  if (!s) return null;
  const max = Math.max(...s.dp);
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 mt-4">
        {arr.map((val, i) => {
          const isCurrent = i === s.current;
          const isDep = s.deps?.includes(i);
          const { bg, text } = cellColor(s.dp[i], max, isCurrent, isDep);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-mono font-bold border border-slate-700 transition-all duration-300"
                style={{ backgroundColor: bg, color: text }}>
                {val}
              </div>
              <div className="text-xs text-slate-400">LIS:{s.dp[i]}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 text-sm text-slate-400 font-mono">
        dp[{s.current}] = {s.dp[s.current]} — arr[{s.current}]={arr[s.current]}
      </div>
    </div>
  );
}

function KnapsackViz({ steps, stepIdx, weights, values, W }) {
  const s = steps[Math.min(stepIdx, steps.length - 1)];
  if (!s) return null;
  const [ci, cw] = s.current;
  const maxVal = Math.max(...s.dp.flat());
  return (
    <div className="overflow-x-auto">
      <table className="mt-4 border-collapse text-xs font-mono">
        <thead>
          <tr>
            <th className="px-2 py-1 text-slate-500">i\w</th>
            {Array.from({ length: W + 1 }, (_, w) => (
              <th key={w} className="px-2 py-1 text-slate-500">{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {s.dp.map((row, i) => (
            <tr key={i}>
              <td className="px-2 py-1 text-slate-400">
                {i === 0 ? "—" : `i${i}(w${weights[i - 1]},v${values[i - 1]})`}
              </td>
              {row.map((val, w) => {
                const isCurrent = i === ci && w === cw;
                const { bg, text } = cellColor(val, maxVal, isCurrent, false);
                return (
                  <td key={w} className="px-1 py-1">
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
        dp[{ci}][{cw}] = {s.dp[ci][cw]}
      </div>
    </div>
  );
}

function LCSViz({ steps, stepIdx, s1, s2 }) {
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
                const isMatch = isCurrent && s.match;
                const { bg, text } = cellColor(val, maxVal, isCurrent, isMatch);
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
      <div className="mt-2 text-sm font-mono">
        {s.match
          ? <span className="text-emerald-400">s1[{ci - 1}]='{s1[ci - 1]}' matches s2[{cj - 1}]='{s2[cj - 1]}' → dp[{ci}][{cj}] = {s.dp[ci][cj]}</span>
          : <span className="text-slate-400">No match → dp[{ci}][{cj}] = max(dp[{ci - 1}][{cj}], dp[{ci}][{cj - 1}]) = {s.dp[ci][cj]}</span>
        }
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const PROBLEMS = ["Fibonacci", "LIS", "0/1 Knapsack", "LCS"];

const COMPLEXITY = {
  "Fibonacci":    { time: "O(N)", space: "O(N)" },
  "LIS":          { time: "O(N²)", space: "O(N)" },
  "0/1 Knapsack": { time: "O(N×W)", space: "O(N×W)" },
  "LCS":          { time: "O(M×N)", space: "O(M×N)" },
};

const PSEUDOCODE = {
  "Fibonacci": `dp[0] = 0, dp[1] = 1
for i from 2 to n:
  dp[i] = dp[i-1] + dp[i-2]
return dp[n]`,
  "LIS": `for i from 0 to n-1:
  dp[i] = 1
  for j from 0 to i-1:
    if arr[j] < arr[i]:
      dp[i] = max(dp[i], dp[j]+1)
return max(dp)`,
  "0/1 Knapsack": `for i from 1 to n:
  for w from 0 to W:
    if weight[i] <= w:
      dp[i][w] = max(dp[i-1][w],
        val[i] + dp[i-1][w-wt[i]])
    else:
      dp[i][w] = dp[i-1][w]`,
  "LCS": `for i from 1 to m:
  for j from 1 to n:
    if s1[i] == s2[j]:
      dp[i][j] = dp[i-1][j-1] + 1
    else:
      dp[i][j] = max(dp[i-1][j],
                     dp[i][j-1])`,
};

export default function DPVisualizer() {
  const [problem, setProblem] = useState("Fibonacci");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const intervalRef = useRef(null);

  const [fibN, setFibN] = useState(8);
  const [lisArr, setLisArr] = useState("3,1,4,1,5,9,2,6");
  const [ksWeights, setKsWeights] = useState("2,3,4,5");
  const [ksValues, setKsValues] = useState("3,4,5,6");
  const [ksW, setKsW] = useState(5);
  const [lcsS1, setLcsS1] = useState("ABCBDAB");
  const [lcsS2, setLcsS2] = useState("BDCAB");

  const lisArrParsed = lisArr.split(",").map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
  const ksWtParsed = ksWeights.split(",").map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));
  const ksValParsed = ksValues.split(",").map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v));

  const buildSteps = useCallback(() => {
    let s = [];
    if (problem === "Fibonacci") s = fibSteps(Math.min(fibN, 15));
    else if (problem === "LIS") s = lisSteps(lisArrParsed.slice(0, 10));
    else if (problem === "0/1 Knapsack") s = knapsackSteps(ksWtParsed.slice(0, 6), ksValParsed.slice(0, 6), Math.min(ksW, 10));
    else if (problem === "LCS") s = lcsSteps(lcsS1.slice(0, 8), lcsS2.slice(0, 8));
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
  }, [problem, fibN, lisArr, ksWeights, ksValues, ksW, lcsS1, lcsS2]);

  useEffect(() => { buildSteps(); }, [problem]);

  useEffect(() => {
    if (!playing) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
        if (prev >= steps.length - 1) { setPlaying(false); return prev; }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [playing, steps, speed]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Dynamic Programming Visualizer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Step-by-step DP table animation — understand how subproblems build the final answer
        </p>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-72 border-r border-slate-800 p-5 flex flex-col gap-5 shrink-0">

          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              1. Choose Problem
            </h2>
            <div className="flex flex-col gap-2">
              {PROBLEMS.map(p => (
                <button key={p}
                  onClick={() => setProblem(p)}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${problem === p ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white border border-slate-700"}`}>
                  {p}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-slate-800" />

          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              2. Set Input
            </h2>

            {problem === "Fibonacci" && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">N (max 15)</label>
                <input type="number" min={2} max={15} value={fibN}
                  onChange={e => setFibN(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
              </div>
            )}

            {problem === "LIS" && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Array (comma separated, max 10)</label>
                <input value={lisArr} onChange={e => setLisArr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
              </div>
            )}

            {problem === "0/1 Knapsack" && (
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Weights (max 6 items)</label>
                  <input value={ksWeights} onChange={e => setKsWeights(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Values</label>
                  <input value={ksValues} onChange={e => setKsValues(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Capacity W (max 10)</label>
                  <input type="number" min={1} max={10} value={ksW}
                    onChange={e => setKsW(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
              </div>
            )}

            {problem === "LCS" && (
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">String 1 (max 8 chars)</label>
                  <input value={lcsS1} onChange={e => setLcsS1(e.target.value.slice(0, 8).toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">String 2 (max 8 chars)</label>
                  <input value={lcsS2} onChange={e => setLcsS2(e.target.value.slice(0, 8).toUpperCase())}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
              </div>
            )}

            <button onClick={buildSteps}
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-md transition-colors">
              Build DP Table
            </button>
          </section>

          <hr className="border-slate-800" />

          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              3. Animate
            </h2>
            <div className="mb-3">
              <label className="text-xs text-slate-400 block mb-1">
                Speed: {speed === 300 ? "Fast" : speed === 600 ? "Medium" : "Slow"}
              </label>
              <div className="flex gap-2">
                {[["Slow", 1000], ["Medium", 600], ["Fast", 300]].map(([label, val]) => (
                  <button key={label}
                    onClick={() => setSpeed(val)}
                    className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${speed === val ? "bg-slate-600 border-slate-500 text-white" : "border-slate-700 text-slate-400 hover:text-white bg-slate-900"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button onClick={() => { if (stepIdx < steps.length - 1) { setPlaying(false); setStepIdx(0); } setTimeout(() => setPlaying(true), 10); }}
                disabled={steps.length === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md transition-colors font-medium">
                ▶ Play
              </button>
              <button onClick={() => setPlaying(false)} disabled={!playing}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md transition-colors font-medium">
                ⏸ Pause
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setPlaying(false); setStepIdx(p => Math.max(0, p - 1)); }}
                disabled={stepIdx === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md transition-colors font-medium">
                ◀ Prev
              </button>
              <button onClick={() => { setPlaying(false); setStepIdx(p => Math.min(steps.length - 1, p + 1)); }}
                disabled={stepIdx >= steps.length - 1}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md transition-colors font-medium">
                Next ▶
              </button>
            </div>
            {steps.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Step {stepIdx + 1} / {steps.length}</span>
                  <span>{Math.round(((stepIdx + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }} />
                </div>
              </div>
            )}
          </section>

          <hr className="border-slate-800" />

          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Legend</h2>
            {[
              { color: "#6366f1", label: "Current cell" },
              { color: "#f59e0b", label: "Dependency" },
              { color: "#166044", label: "Computed value" },
              { color: "#1e293b", label: "Zero / unvisited" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </section>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="flex gap-3 mb-6">
            {[
              { label: "Time", val: COMPLEXITY[problem].time },
              { label: "Space", val: COMPLEXITY[problem].space },
              { label: "Steps", val: steps.length },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-center min-w-[80px]">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-mono font-bold text-indigo-400 mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-white mb-1">{problem} — DP Table</h2>
            <p className="text-xs text-slate-500 mb-3">
              {problem === "Fibonacci" && "Each cell = sum of previous two"}
              {problem === "LIS" && "Each cell = length of LIS ending at that index"}
              {problem === "0/1 Knapsack" && "Each cell = max value for given capacity"}
              {problem === "LCS" && "Each cell = LCS length of prefixes — green = character match"}
            </p>
            {problem === "Fibonacci" && <FibViz steps={steps} stepIdx={stepIdx} />}
            {problem === "LIS" && <LISViz steps={steps} stepIdx={stepIdx} arr={lisArrParsed.slice(0, 10)} />}
            {problem === "0/1 Knapsack" && <KnapsackViz steps={steps} stepIdx={stepIdx} weights={ksWtParsed.slice(0, 6)} values={ksValParsed.slice(0, 6)} W={Math.min(ksW, 10)} />}
            {problem === "LCS" && <LCSViz steps={steps} stepIdx={stepIdx} s1={lcsS1.slice(0, 8)} s2={lcsS2.slice(0, 8)} />}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Pseudocode</h2>
            <pre className="text-xs text-emerald-400 font-mono whitespace-pre-wrap leading-relaxed">
              {PSEUDOCODE[problem]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}