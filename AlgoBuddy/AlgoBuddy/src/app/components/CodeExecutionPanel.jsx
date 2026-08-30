"use client";

import { useState, useEffect, useMemo } from "react";
import PlaybackTimeline from "./PlaybackTimeline";

const codeExamples = {
  JavaScript: [
    "function linearSearch(arr, target) {",
    "  for(let i = 0; i < arr.length; i++) {",
    "    if(arr[i] === target) return i;",
    "  }",
    "  return -1;",
    "}",
  ],
  Python: [
    "def linear_search(arr, target):",
    "    for i in range(len(arr)):",
    "        if arr[i] == target:",
    "            return i",
    "    return -1",
  ],
};

// Maps each language's algorithm phase to its matching source line index
const lineMap = {
  JavaScript: { loop: 1, check: 2, found: 2, notFound: 4 },
  Python: { loop: 1, check: 2, found: 3, notFound: 4 },
};

const demoArray = [5, 3, 8, 4, 9, 1];
const target = 4;

function generateTrace(arr, target, lang) {
  const map = lineMap[lang];
  const trace = [];

  for (let i = 0; i < arr.length; i++) {
    trace.push({ line: map.loop, index: i, status: "checking" });

    if (arr[i] === target) {
      trace.push({ line: map.found, index: i, status: "found" });
      return trace;
    }

    trace.push({ line: map.check, index: i, status: "compare" });
  }

  trace.push({ line: map.notFound, index: -1, status: "notfound" });
  return trace;
}

export default function CodeExecutionPanel() {
  const [language, setLanguage] = useState("JavaScript");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const trace = useMemo(
    () => generateTrace(demoArray, target, language),
    [language]
  );

  const totalSteps = trace.length - 1;
  const safeStep = Math.min(currentStep, totalSteps);
  const { line: currentLine, index: activeIndex, status } = trace[safeStep];

  // Autoplay logic
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= totalSteps) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps]);

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="p-5">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Code Side */}
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="flex justify-between mb-3">
            <h2 className="font-bold">Source Code</h2>

            <select
              className="text-black rounded px-2"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                reset();
              }}
            >
              <option>JavaScript</option>
              <option>Python</option>
            </select>
          </div>

          <pre>
            {codeExamples[language].map((line, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded ${
                  index === currentLine ? "bg-yellow-500 text-black" : ""
                }`}
              >
                {index + 1}. {line}
              </div>
            ))}
          </pre>
        </div>

        {/* Visualization Side */}
        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg">
          <h2 className="font-bold mb-3">Algorithm Visualization</h2>

          <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
            Searching for <strong>{target}</strong> in the array
          </p>

          <div className="flex gap-2 justify-center flex-wrap">
            {demoArray.map((value, index) => {
              let boxColor = "bg-gray-300 dark:bg-gray-600";

              if (index === activeIndex && status === "found") {
                boxColor = "bg-green-500 text-white";
              } else if (index === activeIndex) {
                boxColor = "bg-yellow-400 text-black";
              } else if (index < activeIndex) {
                boxColor = "bg-red-200 dark:bg-red-800";
              }

              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded font-semibold ${boxColor}`}
                  >
                    {value}
                  </div>
                  <span className="text-xs mt-1 text-gray-500">{index}</span>
                </div>
              );
            })}
          </div>

          {status === "found" && (
            <p className="text-center mt-4 text-green-600 font-medium">
              ✅ Found {target} at index {activeIndex}!
            </p>
          )}
          {status === "notfound" && (
            <p className="text-center mt-4 text-red-600 font-medium">
              ❌ {target} not found in array.
            </p>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <PlaybackTimeline
        currentStep={safeStep}
        totalSteps={totalSteps}
        setCurrentStep={setCurrentStep}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}