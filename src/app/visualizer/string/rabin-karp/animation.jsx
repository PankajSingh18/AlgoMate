"use client";

import { useState } from "react";

export default function Animation() {
  const [text, setText] = useState("ABABDABACDABABCABAB");
  const [pattern, setPattern] = useState("ABABCABAB");
  const [index, setIndex] = useState(-1);
  const [error, setError] = useState("");

  const runDemo = () => {
    if (!pattern.trim()) {
      setIndex(-1);
      setError("Please enter a non-empty pattern.");
      return;
    }

    setError("");
    const found = text.indexOf(pattern);
    setIndex(found);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1b1b1b] p-6">
      <h2 className="text-2xl font-bold mb-6">
        Rabin-Karp Algorithm Visualization
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block mb-2 font-semibold">Text</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 dark:bg-[#111]"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Pattern</label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full rounded-lg border px-4 py-2 dark:bg-[#111]"
          />
        </div>

        <button
          onClick={runDemo}
          className="px-6 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold"
        >
          Search Pattern
        </button>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
          <p className="font-semibold">Text</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {text.split("").map((ch, i) => {
              const highlight =
                index !== -1 &&
                i >= index &&
                i < index + pattern.length;

              return (
                <span
                  key={i}
                  className={`w-8 h-8 rounded flex items-center justify-center font-bold ${
                    highlight
                      ? "bg-pink-600 text-white"
                      : "bg-white dark:bg-slate-700"
                  }`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-4">
          {error ? (
            <p className="font-semibold text-red-600">{error}</p>
          ) : index === -1 ? (
            <p>No match found.</p>
          ) : (
            <p className="font-semibold text-green-600">
              Pattern found at index {index}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
