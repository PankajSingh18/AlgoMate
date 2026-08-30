"use client";

export default function ControlPanel({
  onPrev,
  onNext,
  onPlay,
  onPause,
  onReset,
  isPlaying,
  canNext,
  canPrev,
}) {
  return (
    <div className="flex items-center gap-3 mt-4">
      <button
        onClick={onPrev}
        disabled={!canPrev}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-lg font-mono text-sm"
      >
        ⬅ Prev
      </button>

      {isPlaying ? (
        <button
          onClick={onPause}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-mono text-sm"
        >
          ⏸ Pause
        </button>
      ) : (
        <button
          onClick={onPlay}
          disabled={!canNext}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white rounded-lg font-mono text-sm"
        >
          ▶ Play
        </button>
      )}

      <button
        onClick={onNext}
        disabled={!canNext}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-lg font-mono text-sm"
      >
        Next ➡
      </button>

      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-mono text-sm"
      >
        ↺ Reset
      </button>
    </div>
  );
}