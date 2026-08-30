"use client";

import { useState } from "react";

const LANGUAGES = {
  javascript: {
    label: "JavaScript",
    template: `// JavaScript - Bubble Sort
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));`,
  },
  python: {
    label: "Python",
    template: `# Python - Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
  },
  java: {
    label: "Java",
    template: `// Java - Bubble Sort
public class Main {
    public static void main(String[] args) {
        int[] arr = {64, 34, 25, 12, 22, 11, 90};
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        for (int x : arr) System.out.print(x + " ");
    }
}`,
  },
  cpp: {
    label: "C++",
    template: `// C++ - Bubble Sort
#include <iostream>
using namespace std;

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
    for (int x : arr) cout << x << " ";
    return 0;
}`,
  },
};

export default function InteractiveCodeEditor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(LANGUAGES.javascript.template);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(LANGUAGES[lang].template);
    setOutput("");
    setStatus(null);
  };

  const handleReset = () => {
    setCode(LANGUAGES[language].template);
    setOutput("");
    setStatus(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setStatus(null);

    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: language === "cpp" ? "c++" : language,
          version: "*",
          files: [{ content: code }],
        }),
      });

      const data = await res.json();
      const out = data.run?.stdout || data.run?.stderr || "No output";
      setOutput(out);
      setStatus(data.run?.stderr ? "error" : "success");
    } catch (err) {
      setOutput("Error: Could not connect to execution server.");
      setStatus("error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Language Selector */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(LANGUAGES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleLanguageChange(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              language === key
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Code Editor */}
      <div className="rounded-xl border border-white/10 bg-[#1a1625] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <span className="text-xs text-white/40 font-mono">{LANGUAGES[language].label}</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="text-xs text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
            >
              Copy
            </button>
            <button
              onClick={handleReset}
              className="text-xs text-white/50 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition"
            >
              Reset
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={16}
          spellCheck={false}
          className="w-full resize-none bg-transparent text-sm text-purple-100 font-mono p-4 focus:outline-none"
        />
      </div>

      {/* Run Button */}
      <button
        onClick={runCode}
        disabled={isRunning}
        className={`self-start px-6 py-2 rounded-lg font-medium text-sm transition-all ${
          isRunning
            ? "bg-purple-700/40 text-purple-400 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-500 text-white"
        }`}
      >
        {isRunning ? "⏳ Running..." : "▶ Run Code"}
      </button>

      {/* Output */}
      {output && (
        <div className={`rounded-xl border p-4 ${
          status === "error"
            ? "border-red-500/30 bg-red-500/10"
            : "border-green-500/30 bg-green-500/10"
        }`}>
          <p className="text-xs text-white/40 mb-2 uppercase tracking-wide">
            {status === "error" ? "❌ Error" : "✅ Output"}
          </p>
          <pre className="text-sm font-mono text-white whitespace-pre-wrap break-words">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}