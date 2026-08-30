"use client";
import { useState, useEffect, useRef } from "react";

// ─── N-Queens ──────────────────────────────────────────────────────────────────
function nQueensSteps(n) {
  const steps = [];
  const board = Array.from({ length: n }, () => new Array(n).fill(0));

  function isSafe(row, col) {
    for (let i = 0; i < row; i++) if (board[i][col] === 1) return false;
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--)
      if (board[i][j] === 1) return false;
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++)
      if (board[i][j] === 1) return false;
    return true;
  }

  function solve(row) {
    if (row === n) {
      steps.push({ board: board.map(r => [...r]), type: "solution", row: -1, col: -1 });
      return true;
    }
    for (let col = 0; col < n; col++) {
      const safe = isSafe(row, col);
      board[row][col] = safe ? 1 : 0;
      steps.push({ board: board.map(r => [...r]), type: safe ? "place" : "conflict", row, col });
      if (safe) {
        board[row][col] = 1;
        if (solve(row + 1)) return true;
        board[row][col] = 0;
        steps.push({ board: board.map(r => [...r]), type: "backtrack", row, col });
      }
    }
    return false;
  }

  solve(0);
  return steps;
}

// ─── Rat in a Maze ─────────────────────────────────────────────────────────────
function ratMazeSteps(maze) {
  const n = maze.length;
  const steps = [];
  const sol = Array.from({ length: n }, () => new Array(n).fill(0));

  function isSafe(x, y) {
    return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 1;
  }

  function solve(x, y) {
    if (x === n - 1 && y === n - 1) {
      sol[x][y] = 1;
      steps.push({ sol: sol.map(r => [...r]), type: "solution", x, y });
      return true;
    }
    if (isSafe(x, y)) {
      sol[x][y] = 1;
      steps.push({ sol: sol.map(r => [...r]), type: "visit", x, y });
      if (solve(x + 1, y) || solve(x, y + 1)) return true;
      sol[x][y] = 0;
      steps.push({ sol: sol.map(r => [...r]), type: "backtrack", x, y });
    }
    return false;
  }

  solve(0, 0);
  return steps;
}

// ─── Subset Sum ────────────────────────────────────────────────────────────────
function subsetSumSteps(arr, target) {
  const steps = [];

  function solve(idx, current, path) {
    steps.push({ idx, current, path: [...path], target, type: current === target ? "solution" : current > target ? "prune" : "explore" });
    if (current === target) return;
    if (current > target || idx >= arr.length) return;
    path.push(arr[idx]);
    solve(idx + 1, current + arr[idx], path);
    path.pop();
    steps.push({ idx, current, path: [...path], target, type: "backtrack" });
    solve(idx + 1, current, path);
  }

  solve(0, 0, []);
  return steps;
}

// ─── Sudoku ────────────────────────────────────────────────────────────────────
function sudokuSteps(inputBoard) {
  const steps = [];
  const board = inputBoard.map(r => [...r]);

  function isValid(row, col, num) {
    for (let j = 0; j < 9; j++) if (board[row][j] === num) return false;
    for (let i = 0; i < 9; i++) if (board[i][col] === num) return false;
    const sr = Math.floor(row / 3) * 3, sc = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (board[sr + i][sc + j] === num) return false;
    return true;
  }

  function solve() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(row, col, num)) {
              board[row][col] = num;
              steps.push({ board: board.map(r => [...r]), type: "place", row, col, num });
              if (solve()) return true;
              board[row][col] = 0;
              steps.push({ board: board.map(r => [...r]), type: "backtrack", row, col });
            } else {
              steps.push({ board: board.map(r => [...r]), type: "conflict", row, col, num });
            }
          }
          return false;
        }
      }
    }
    steps.push({ board: board.map(r => [...r]), type: "solution", row: -1, col: -1 });
    return true;
  }

  solve();
  return steps;
}

// ─── Default Data ───────────────────────────────────────────────────────────────
const DEFAULT_SUDOKU = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9],
];

const DEFAULT_MAZE = [
  [1,0,0,0],
  [1,1,0,1],
  [0,1,0,0],
  [1,1,1,1],
];

// ─── Color Helper ───────────────────────────────────────────────────────────────
function getCellStyle(type) {
  switch (type) {
    case "place":     return { bg: "#16a34a", text: "#fff" };
    case "conflict":  return { bg: "#dc2626", text: "#fff" };
    case "backtrack": return { bg: "#ea580c", text: "#fff" };
    case "solution":  return { bg: "#2563eb", text: "#fff" };
    case "visit":     return { bg: "#16a34a", text: "#fff" };
    case "explore":   return { bg: "#7c3aed", text: "#fff" };
    case "prune":     return { bg: "#dc2626", text: "#fff" };
    default:          return { bg: "#1e293b", text: "#475569" };
  }
}

// ─── N-Queens Board ─────────────────────────────────────────────────────────────
function NQueensViz({ steps, stepIdx }) {
  const s = steps[Math.min(stepIdx, steps.length - 1)];
  if (!s) return null;
  const n = s.board.length;
  return (
    <div>
      <div className="inline-grid gap-1 mt-4" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {s.board.map((row, i) =>
          row.map((cell, j) => {
            const isCurrent = i === s.row && j === s.col;
            const isQueen = cell === 1;
            let bg = (i + j) % 2 === 0 ? "#1e293b" : "#0f172a";
            let text = "#475569";
            if (isCurrent) { bg = getCellStyle(s.type).bg; text = "#fff"; }
            else if (isQueen) { bg = "#16a34a"; text = "#fff"; }
            return (
              <div key={`${i}-${j}`}
                className="w-10 h-10 flex items-center justify-center text-lg rounded transition-all duration-200 border border-slate-800"
                style={{ backgroundColor: bg, color: text }}>
                {isQueen ? "♛" : ""}
              </div>
            );
          })
        )}
      </div>
      <p className="mt-3 text-sm font-mono text-slate-400">
        Step type: <span className="font-bold" style={{ color: getCellStyle(s.type).bg }}>{s.type}</span>
        {s.row >= 0 && ` — Row ${s.row}, Col ${s.col}`}
      </p>
    </div>
  );
}

// ─── Rat in a Maze ──────────────────────────────────────────────────────────────
function RatMazeViz({ steps, stepIdx, maze }) {
  const s = steps[Math.min(stepIdx, steps.length - 1)];
  if (!s) return null;
  const n = maze.length;
  return (
    <div>
      <div className="inline-grid gap-1 mt-4" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
        {maze.map((row, i) =>
          row.map((cell, j) => {
            const isCurrent = i === s.x && j === s.y;
            const inPath = s.sol[i][j] === 1;
            const isBlocked = cell === 0;
            let bg = isBlocked ? "#0f172a" : "#1e293b";
            let text = isBlocked ? "#ef4444" : "#475569";
            if (isCurrent) { bg = getCellStyle(s.type).bg; text = "#fff"; }
            else if (inPath && !isBlocked) { bg = "#15803d"; text = "#fff"; }
            return (
              <div key={`${i}-${j}`}
                className="w-12 h-12 flex items-center justify-center text-lg rounded transition-all duration-200 border border-slate-800"
                style={{ backgroundColor: bg, color: text }}>
                {i === 0 && j === 0 ? "🐀" : i === n - 1 && j === n - 1 ? "🏁" : isBlocked ? "✕" : inPath ? "•" : ""}
              </div>
            );
          })
        )}
      </div>
      <p className="mt-3 text-sm font-mono text-slate-400">
        Step type: <span className="font-bold" style={{ color: getCellStyle(s.type).bg }}>{s.type}</span>
        {` — Position (${s.x}, ${s.y})`}
      </p>
    </div>
  );
}

// ─── Subset Sum ─────────────────────────────────────────────────────────────────
function SubsetSumViz({ steps, stepIdx, arr }) {
  const s = steps[Math.min(stepIdx, steps.length - 1)];
  if (!s) return null;
  const { bg, text } = getCellStyle(s.type);
  return (
    <div className="mt-4">
      <div className="flex gap-2 flex-wrap mb-4">
        {arr.map((v, i) => {
          const inPath = s.path.includes(v) && s.idx > i;
          const isCurrent = i === s.idx;
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-mono font-bold border border-slate-700 transition-all duration-200"
                style={{
                  backgroundColor: isCurrent ? bg : inPath ? "#16a34a" : "#1e293b",
                  color: isCurrent ? text : inPath ? "#fff" : "#475569"
                }}>
                {v}
              </div>
              <span className="text-xs text-slate-500 mt-1">[{i}]</span>
            </div>
          );
        })}
      </div>
      <div className="bg-slate-800 rounded-lg p-3 font-mono text-sm">
        <p className="text-slate-400">Current Sum: <span className="text-white font-bold">{s.current}</span></p>
        <p className="text-slate-400">Target: <span className="text-indigo-400 font-bold">{s.target}</span></p>
        <p className="text-slate-400">Path: <span className="text-emerald-400">[{s.path.join(", ")}]</span></p>
        <p className="mt-1">Status: <span className="font-bold" style={{ color: bg }}>{s.type}</span></p>
      </div>
    </div>
  );
}

// ─── Sudoku ─────────────────────────────────────────────────────────────────────
function SudokuViz({ steps, stepIdx, initial }) {
  const s = steps[Math.min(stepIdx, steps.length - 1)];
  if (!s) return null;
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid gap-0.5 mt-4" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}>
        {s.board.map((row, i) =>
          row.map((cell, j) => {
            const isCurrent = i === s.row && j === s.col;
            const isInitial = initial[i][j] !== 0;
            const borderR = (j + 1) % 3 === 0 && j < 8 ? "2px solid #475569" : "1px solid #1e293b";
            const borderB = (i + 1) % 3 === 0 && i < 8 ? "2px solid #475569" : "1px solid #1e293b";
            let bg = isInitial ? "#0f172a" : "#1e293b";
            let textC = isInitial ? "#94a3b8" : "#475569";
            if (isCurrent && !isInitial) { bg = getCellStyle(s.type).bg; textC = "#fff"; }
            return (
              <div key={`${i}-${j}`}
                className="w-8 h-8 flex items-center justify-center text-xs font-mono font-bold transition-all duration-150"
                style={{ backgroundColor: bg, color: textC, borderRight: borderR, borderBottom: borderB }}>
                {cell !== 0 ? cell : ""}
              </div>
            );
          })
        )}
      </div>
      <p className="mt-3 text-sm font-mono text-slate-400">
        Step: <span className="font-bold" style={{ color: getCellStyle(s.type).bg }}>{s.type}</span>
        {s.row >= 0 && ` — Cell (${s.row},${s.col})${s.num ? ` trying ${s.num}` : ""}`}
      </p>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
const PROBLEMS = ["N-Queens", "Rat in a Maze", "Subset Sum", "Sudoku"];

const COMPLEXITY = {
  "N-Queens":      { time: "O(N!)", space: "O(N²)" },
  "Rat in a Maze": { time: "O(2^(N²))", space: "O(N²)" },
  "Subset Sum":    { time: "O(2^N)", space: "O(N)" },
  "Sudoku":        { time: "O(9^M)", space: "O(1)" },
};

export default function BacktrackingVisualizer() {
  const [problem, setProblem] = useState("N-Queens");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const intervalRef = useRef(null);

  const [queensN, setQueensN] = useState(5);
  const [subsetArr, setSubsetArr] = useState("3,1,4,2,5");
  const [subsetTarget, setSubsetTarget] = useState(7);
  const [maze] = useState(DEFAULT_MAZE);

  const subsetArrParsed = subsetArr.split(",").map(v => parseInt(v.trim(), 10)).filter(v => !isNaN(v)).slice(0, 8);

  const buildSteps = () => {
    let s = [];
    if (problem === "N-Queens") s = nQueensSteps(Math.min(queensN, 7));
    else if (problem === "Rat in a Maze") s = ratMazeSteps(maze);
    else if (problem === "Subset Sum") s = subsetSumSteps(subsetArrParsed, subsetTarget);
    else if (problem === "Sudoku") s = sudokuSteps(DEFAULT_SUDOKU);
    setSteps(s);
    setStepIdx(0);
    setPlaying(false);
  };

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

  const totalBacktracks = steps.filter(s => s.type === "backtrack").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="border-b border-slate-800 px-6 py-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Backtracking Algorithm Visualizer
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore how backtracking searches, prunes, and finds solutions step by step
        </p>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-72 border-r border-slate-800 p-5 flex flex-col gap-5 shrink-0">

          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">1. Choose Problem</h2>
            <div className="flex flex-col gap-2">
              {PROBLEMS.map(p => (
                <button key={p} onClick={() => setProblem(p)}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${problem === p ? "bg-indigo-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white border border-slate-700"}`}>
                  {p}
                </button>
              ))}
            </div>
          </section>

          <hr className="border-slate-800" />

          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">2. Set Input</h2>

            {problem === "N-Queens" && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Board Size N (4–7)</label>
                <input type="number" min={4} max={7} value={queensN}
                  onChange={e => setQueensN(parseInt(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
              </div>
            )}

            {problem === "Subset Sum" && (
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Array (max 8 elements)</label>
                  <input value={subsetArr} onChange={e => setSubsetArr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Target Sum</label>
                  <input type="number" value={subsetTarget} onChange={e => setSubsetTarget(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono" />
                </div>
              </div>
            )}

            {problem === "Rat in a Maze" && (
              <p className="text-xs text-slate-500">Using default 4×4 maze. 1=open, 0=blocked.</p>
            )}
            {problem === "Sudoku" && (
              <p className="text-xs text-slate-500">Using a classic 9×9 Sudoku puzzle. 0 = empty cell.</p>
            )}

            <button onClick={buildSteps}
              className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-md transition-colors">
              Generate Steps
            </button>
          </section>

          <hr className="border-slate-800" />

          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">3. Animate</h2>
            <div className="mb-3">
              <label className="text-xs text-slate-400 block mb-1">
                Speed: {speed === 150 ? "Fast" : speed === 300 ? "Medium" : "Slow"}
              </label>
              <div className="flex gap-2">
                {[["Slow", 600], ["Medium", 300], ["Fast", 150]].map(([label, val]) => (
                  <button key={label} onClick={() => setSpeed(val)}
                    className={`flex-1 text-xs py-1.5 rounded-md border transition-colors ${speed === val ? "bg-slate-600 border-slate-500 text-white" : "border-slate-700 text-slate-400 hover:text-white bg-slate-900"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mb-2">
              <button onClick={() => { setStepIdx(0); setTimeout(() => setPlaying(true), 10); }}
                disabled={steps.length === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md font-medium">
                ▶ Play
              </button>
              <button onClick={() => setPlaying(false)} disabled={!playing}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md font-medium">
                ⏸ Pause
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setPlaying(false); setStepIdx(p => Math.max(0, p - 1)); }}
                disabled={stepIdx === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md font-medium">
                ◀ Prev
              </button>
              <button onClick={() => { setPlaying(false); setStepIdx(p => Math.min(steps.length - 1, p + 1)); }}
                disabled={stepIdx >= steps.length - 1}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-xs py-2 rounded-md font-medium">
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
              { color: "#16a34a", label: "Safe / Visit" },
              { color: "#dc2626", label: "Conflict / Prune" },
              { color: "#ea580c", label: "Backtrack" },
              { color: "#2563eb", label: "Final Solution" },
              { color: "#7c3aed", label: "Explore" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded inline-block" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            ))}
          </section>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <div className="flex gap-3 mb-6 flex-wrap">
            {[
              { label: "Time", val: COMPLEXITY[problem].time },
              { label: "Space", val: COMPLEXITY[problem].space },
              { label: "Total Steps", val: steps.length },
              { label: "Backtracks", val: totalBacktracks },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-center min-w-[80px]">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-mono font-bold text-indigo-400 mt-0.5">{val}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-white mb-1">{problem}</h2>
            <p className="text-xs text-slate-500 mb-2">
              {problem === "N-Queens" && "Place N queens so no two attack each other"}
              {problem === "Rat in a Maze" && "Find path from top-left to bottom-right"}
              {problem === "Subset Sum" && "Find subset that adds up to target"}
              {problem === "Sudoku" && "Fill 9×9 grid with digits 1–9 (no repeats in row/col/box)"}
            </p>
            {problem === "N-Queens" && <NQueensViz steps={steps} stepIdx={stepIdx} />}
            {problem === "Rat in a Maze" && <RatMazeViz steps={steps} stepIdx={stepIdx} maze={maze} />}
            {problem === "Subset Sum" && <SubsetSumViz steps={steps} stepIdx={stepIdx} arr={subsetArrParsed} />}
            {problem === "Sudoku" && <SudokuViz steps={steps} stepIdx={stepIdx} initial={DEFAULT_SUDOKU} />}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-3">How Backtracking Works</h2>
            <div className="text-xs text-slate-400 leading-relaxed space-y-2">
              <p>1. <span className="text-emerald-400 font-semibold">Choose</span> — Pick a candidate for the current position</p>
              <p>2. <span className="text-green-400 font-semibold">Constraint Check</span> — Is this choice valid?</p>
              <p>3. <span className="text-indigo-400 font-semibold">Explore</span> — If valid, recurse deeper</p>
              <p>4. <span className="text-orange-400 font-semibold">Backtrack</span> — If stuck, undo and try next option</p>
              <p>5. <span className="text-blue-400 font-semibold">Solution</span> — All positions filled validly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}