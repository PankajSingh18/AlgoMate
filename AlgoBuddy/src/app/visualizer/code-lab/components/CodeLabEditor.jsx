// app/visualizer/code-lab/components/CodeLabEditor.jsx
//
// WHAT CHANGED FROM THE ORIGINAL
// ─────────────────────────────────────────────────────────────────────
// 1. "Run" button is disabled while a request is in flight (prevents spam).
// 2. Response now reads the structured { status, output, error, ... } shape
//    returned by the new route.js.
// 3. TLE, MLE, RUNTIME_ERROR, and 429 each get a distinct UI badge.
// 4. Execution stats (time + memory) are displayed when available.
//
// Everything else (editor, theme, layout) is left as-is to match the
// existing AlgoBuddy purple design system.
//
// NOTE: This component is written as a drop-in replacement. If the original
// file is named differently (e.g. CodeEditor.jsx), rename accordingly.

"use client";

import { useState, useCallback } from "react";
import { EXECUTION_STATUS, EXECUTION_MESSAGES } from "@/lib/sandbox/errorCodes";
import { api } from "@/lib/apiClient";

// ── Status badge config ───────────────────────────────────────────────
// Maps each execution status to a Tailwind colour class and icon label.
const STATUS_UI = {
  [EXECUTION_STATUS.SUCCESS]: {
    className: "bg-green-500/10 text-green-400 border-green-500/30",
    label: "✓ Success",
  },
  [EXECUTION_STATUS.RUNTIME_ERROR]: {
    className: "bg-red-500/10 text-red-400 border-red-500/30",
    label: "✗ Runtime Error",
  },
  [EXECUTION_STATUS.TLE]: {
    className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
    label: "⏱ Time Limit Exceeded",
  },
  [EXECUTION_STATUS.MLE]: {
    className: "bg-orange-500/10 text-orange-300 border-orange-500/30",
    label: "🧠 Memory Limit Exceeded",
  },
  [EXECUTION_STATUS.INTERNAL_ERROR]: {
    className: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    label: "⚠ Internal Error",
  },
};

// ── Helper: format bytes to KB/MB ────────────────────────────────────
function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CodeLabEditor() {
  const [code, setCode] = useState(`// Write your JavaScript here\nconsole.log("Hello, AlgoBuddy!");`);
  const [result, setResult] = useState(null);   // ExecutionResult | null
  const [isRunning, setIsRunning] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null); // { retryAfter } | null

  const runCode = useCallback(async () => {
    if (isRunning) return; // guard against double-clicks

    setIsRunning(true);
    setResult(null);
    setRateLimitInfo(null);

    try {
      const data = await api.request("/api/code-lab", {
        method: "POST",
        body: { code },
      });
      setResult(data);
    } catch (error) {
      if (error.status === 429) {
        setRateLimitInfo({
          retryAfter: 60,
          message: error.message ?? "Too many requests. Please wait before running again.",
        });
      } else {
        setResult({
          status: EXECUTION_STATUS.INTERNAL_ERROR,
          message: "Could not reach the server. Check your connection.",
          output: "",
          error: error.message,
          executionTime: 0,
          memoryUsed: 0,
        });
      }
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning]);

  const statusUi = result ? (STATUS_UI[result.status] ?? STATUS_UI[EXECUTION_STATUS.INTERNAL_ERROR]) : null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Code Editor ────────────────────────────────────────────── */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#1a1625]">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={14}
          spellCheck={false}
          className="w-full resize-none bg-transparent text-sm text-purple-100 font-mono p-4 focus:outline-none"
          placeholder="Write your JavaScript here..."
        />
      </div>

      {/* ── Run Button ─────────────────────────────────────────────── */}
      <button
        onClick={runCode}
        disabled={isRunning}
        className={`
          self-start px-6 py-2 rounded-lg font-medium text-sm transition-all
          ${isRunning
            ? "bg-purple-700/40 text-purple-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-500 text-white cursor-pointer"
          }
        `}
      >
        {isRunning ? (
          <span className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
            Running…
          </span>
        ) : (
          "▶ Run"
        )}
      </button>

      {/* ── Rate Limit Warning ─────────────────────────────────────── */}
      {rateLimitInfo && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
          <span className="font-medium">⏳ Rate limit reached — </span>
          {rateLimitInfo.message}
          {rateLimitInfo.retryAfter && (
            <span className="ml-1 font-mono">
              (try again in {rateLimitInfo.retryAfter}s)
            </span>
          )}
        </div>
      )}

      {/* ── Execution Result ───────────────────────────────────────── */}
      {result && (
        <div className="rounded-xl border border-white/10 bg-[#1a1625] overflow-hidden">
          {/* Status bar */}
          <div className={`flex items-center gap-3 px-4 py-2 border-b border-white/10 ${statusUi?.className} border rounded-none`}>
            <span className="font-medium text-sm">{statusUi?.label}</span>
            {/* Execution stats */}
            {result.executionTime > 0 && (
              <span className="ml-auto text-xs opacity-70 font-mono">
                {result.executionTime} ms · {formatBytes(result.memoryUsed)}
              </span>
            )}
          </div>

          {/* Output */}
          {result.output && (
            <div className="px-4 py-3">
              <p className="text-xs text-white/40 mb-1 uppercase tracking-wide">Output</p>
              <pre className="text-sm text-purple-100 font-mono whitespace-pre-wrap break-words">
                {result.output}
              </pre>
            </div>
          )}

          {/* Error message */}
          {result.error && (
            <div className="px-4 py-3 border-t border-white/5">
              <p className="text-xs text-white/40 mb-1 uppercase tracking-wide">
                {result.status === EXECUTION_STATUS.TLE
                  ? "Details"
                  : result.status === EXECUTION_STATUS.MLE
                  ? "Details"
                  : "Error"}
              </p>
              <pre className="text-sm text-red-300 font-mono whitespace-pre-wrap break-words">
                {result.error}
              </pre>
            </div>
          )}

          {/* Human-readable message for TLE / MLE */}
          {(result.status === EXECUTION_STATUS.TLE ||
            result.status === EXECUTION_STATUS.MLE) && (
            <div className="px-4 py-2 border-t border-white/5 text-xs text-white/50">
              {EXECUTION_MESSAGES[result.status]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}