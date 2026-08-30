"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, Check } from "lucide-react";

const INPUT_PARSERS = {
  array: {
    label: "Enter comma-separated numbers",
    placeholder: "e.g., 64, 34, 25, 12, 22, 11, 90",
    parse: (text) => {
      const nums = text.split(",").map((s) => {
        const trimmed = s.trim();
        if (!trimmed) throw new Error("Empty values are not allowed");
        const val = Number(trimmed);
        if (isNaN(val)) throw new Error(`"${trimmed}" is not a valid number`);
        return val;
      });
      if (nums.length < 2) throw new Error("Please enter at least 2 numbers");
      if (nums.length > 50) throw new Error("Maximum 50 numbers allowed");
      return nums;
    },
  },
  graph: {
    label: "Enter edges (source,target,weight)",
    placeholder: "e.g., 0,1,4; 1,2,3; 2,0,2",
    parse: (text) => {
      const edges = text.split(";").map((e) => {
        const parts = e.trim().split(",");
        if (parts.length < 2) throw new Error("Each edge needs at least source and target (e.g. 0,1)");
        const source = parts[0].trim();
        const target = parts[1].trim();
        if (!source || !target) throw new Error("Source and target cannot be empty");
        return {
          source: Number(source),
          target: Number(target),
          weight: parts[2] ? Number(parts[2].trim()) : 1,
        };
      });
      if (edges.length === 0) throw new Error("Please enter at least one edge");
      return edges;
    },
  },
  string: {
    label: "Enter a string",
    placeholder: "e.g., hello",
    parse: (text) => {
      const str = text.trim();
      if (!str) throw new Error("String cannot be empty");
      if (str.length > 100) throw new Error("Maximum 100 characters allowed");
      return str;
    },
  },
};

export function CustomInputPanel({ inputType, onApply, currentData }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const parser = INPUT_PARSERS[inputType] || INPUT_PARSERS.array;

  function handleApply() {
    try {
      setError("");
      setSuccess(false);
      const parsed = parser.parse(value);
      onApply(parsed);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleReset() {
    setValue("");
    setError("");
    setSuccess(false);
    onApply(null); // signal to restore default data
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-6 bg-[#a435f0] rounded-full" />
        <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Custom Input
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {parser.label}
          </label>
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder={parser.placeholder}
            rows={3}
            className="w-full p-3 bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-950 dark:text-white"
            aria-label={parser.label}
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200 dark:border-red-900/30" role="alert">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={handleApply}
            disabled={!value.trim()}
            className="flex-1 flex items-center justify-center gap-2 h-10 px-4 bg-[#a435f0] hover:bg-[#8f2cd6] disabled:opacity-40 disabled:hover:bg-[#a435f0] text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-98"
          >
            {success ? (
              <>
                <Check size={16} /> Applied
              </>
            ) : (
              "Apply"
            )}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 h-10 px-4 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl text-sm font-semibold transition-all active:scale-98"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
