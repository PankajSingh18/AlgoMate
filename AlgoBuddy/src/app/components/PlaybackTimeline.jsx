"use client";

import React from "react";

const PlaybackTimeline = ({
  currentStep,
  totalSteps,
  setCurrentStep,
  onPlay,
  onPause,
}) => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 mt-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Playback Timeline
      </h2>

      {/* Step Information */}
      <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-300">
        <span>
          Current Step: <strong>{currentStep}</strong>
        </span>
        <span>
          Total Steps: <strong>{totalSteps}</strong>
        </span>
      </div>

      {/* Timeline Slider */}
      <input
        type="range"
        min="0"
        max={totalSteps}
        value={currentStep}
        onChange={(e) => setCurrentStep(Number(e.target.value))}
        className="w-full cursor-pointer"
      />

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-3 mt-5">
        <button
          onClick={() =>
            setCurrentStep((prev) => Math.max(prev - 1, 0))
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:opacity-80"
        >
          ⏮ Previous
        </button>

        <button
          onClick={onPlay}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-80"
        >
          ▶ Play
        </button>

        <button
          onClick={onPause}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-80"
        >
          ⏸ Pause
        </button>

        <button
          onClick={() =>
            setCurrentStep((prev) =>
              Math.min(prev + 1, totalSteps)
            )
          }
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:opacity-80"
        >
          ⏭ Next
        </button>
      </div>

      {/* Important Step Markers */}
      <div className="mt-5">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Important Operations
        </p>

        <div className="flex gap-3 mt-2 text-xs">
          <span className="bg-yellow-200 text-yellow-900 px-2 py-1 rounded">
            Comparison
          </span>

          <span className="bg-green-200 text-green-900 px-2 py-1 rounded">
            Swap
          </span>

          <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded">
            Insertion
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaybackTimeline;