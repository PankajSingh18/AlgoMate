"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Animation() {
  const [input, setInput] = useState("flower, flow, flight");

  const { words, prefix } = useMemo(() => {
    const arr = input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (arr.length === 0) {
      return { words: [], prefix: "" };
    }

    let common = arr[0];

    for (let i = 1; i < arr.length; i++) {
      while (!arr[i].startsWith(common) && common.length > 0) {
        common = common.slice(0, -1);
      }

      if (common === "") break;
    }

    return {
      words: arr,
      prefix: common,
    };
  }, [input]);

  return (
    <div className="space-y-6">

      <div>
        <label className="text-sm font-semibold">
          Enter strings (comma separated)
        </label>

        <input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="flower, flow, flight"
  className="
    mt-2 w-full rounded-lg border p-3 outline-none
    bg-white text-black border-gray-300
    placeholder:text-gray-400
    focus:ring-2 focus:ring-pink-500

    dark:bg-gray-800
    dark:text-white
    dark:border-gray-600
    dark:placeholder:text-gray-400
  "
/>
      </div>

      <div className="space-y-4">
        {words.map((word, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-wrap gap-2"
          >
            {word.split("").map((char, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.05,
                }}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold border
                ${
                  index < prefix.length
                    ? "bg-pink-500 text-white border-pink-500"
                    : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                }`}
              >
                {char}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      <motion.div
        layout
        className="rounded-xl border bg-pink-50 dark:bg-pink-950 p-6"
      >
        <h3 className="text-lg font-bold text-pink-600">
          Longest Common Prefix
        </h3>

        <div className="mt-3 text-3xl font-black">
          {prefix ? (
            <span className="text-pink-600">"{prefix}"</span>
          ) : (
            <span className="text-red-500">
              No Common Prefix
            </span>
          )}
        </div>

        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Length: <strong>{prefix.length}</strong>
        </p>
      </motion.div>

    </div>
  );
}