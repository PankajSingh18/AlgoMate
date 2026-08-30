import React from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Bot } from "lucide-react";

export default function PlaybackControls({
  isPaused: pausedProp,
  onTogglePlayPause: toggleProp, currentStep,
  totalSteps, onTimelineChange,
  isPlaying: playingProp,
  onPlayPause: playPauseProp,
  speed,
  onIncreaseSpeed,
  onDecreaseSpeed,
  onSpeedChange,
  disabled = false,
  showPlayPause = true,
  onStepForward,
  onStepBackward,
  onReset,
  onClear,
  clearLabel = "Clear",
  progressText,
  onExplainStep,
  stepAnnouncement = "",
}) {
  // Support both `isPaused`/`onTogglePlayPause` (new) and `isPlaying`/`onPlayPause` (legacy) prop conventions.
  const isPlaying = pausedProp !== undefined ? !pausedProp : (playingProp ?? false);
  const handlePlayPause = toggleProp || playPauseProp || (() => {});
  return (
    <div
      role="toolbar"
      aria-label="Visualization controls"
      className="flex flex-col sm:flex-row items-center justify-between w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-3 md:p-4 rounded-2xl shadow-lg shadow-black/20 gap-4"
    >
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {stepAnnouncement}
      </div>

      {/* Play/Pause Button & Frame Stepping */}
      {showPlayPause && (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center bg-slate-950/70 p-1.5 rounded-full border border-slate-800/80 shadow-inner">

          {onStepBackward && (
            <button
              type="button"
              onClick={onStepBackward}
              disabled={disabled}
              aria-label="Step backward one iteration"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:ring-offset-2 focus:ring-offset-slate-900"
              title="Previous Step"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            onClick={handlePlayPause}
            disabled={disabled}
            aria-label={isPlaying ? "Pause algorithm animation" : "Play algorithm animation"}
            aria-pressed={isPlaying}
            className="flex items-center justify-center bg-[#a435f0] text-white w-10 h-10 rounded-full hover:bg-[#8f2cd6] transition-all shadow-md shadow-[#a435f0]/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:ring-offset-2 focus:ring-offset-slate-900"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} className="fill-current" aria-hidden="true" /> : <Play size={20} className="fill-current ml-1" aria-hidden="true" />}
          </button>

          {onStepForward && (
            <button
              type="button"
              onClick={onStepForward}
              disabled={disabled}
              aria-label="Step forward one iteration"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:ring-offset-2 focus:ring-offset-slate-900"
              title="Next Step"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              aria-label="Reset visualization to initial state"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-1 focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:ring-offset-2 focus:ring-offset-slate-900"
              title="Reset"
            >
              <RotateCcw size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      )}

      {/* Clear Button */}
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          aria-label={clearLabel}
          className="px-3.5 py-2 text-xs font-bold text-rose-500 bg-rose-950/20 hover:bg-rose-950/40 rounded-xl transition-all border border-rose-900/30 flex items-center gap-1.5 w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <RotateCcw size={14} aria-hidden="true" /> {clearLabel}
        </button>
      )}

      {/* Explain Step Button */}
      {onExplainStep && (
        <button
          type="button"
          onClick={onExplainStep}
          disabled={disabled}
          aria-label="Explain this algorithm step using AI"
          className="px-3.5 py-2 text-xs font-bold text-[#c084fc] bg-[#3b0764]/40 hover:bg-[#3b0764]/70 rounded-xl transition-all border border-[#c084fc]/30 flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-md shadow-[#a435f0]/10 focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <Bot size={14} aria-hidden="true" /> Explain this step
        </button>
      )}

      {/* Speed Controls */}
      <div
        role="group"
        aria-label="Animation speed"
        className="flex items-center gap-3 bg-slate-950/70 px-5 py-2 rounded-full border border-slate-800/80 shadow-inner h-10"
      >
        <span
          className="text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest select-none"
          aria-hidden="true"
        >
          SPEED
        </span>

        {onSpeedChange ? (
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.5"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            aria-label={`Animation speed: ${speed}x`}
            aria-valuemin={0.5}
            aria-valuemax={5}
            aria-valuenow={speed}
            aria-valuetext={`${speed} times`}
            className="w-20 sm:w-24 accent-[#a435f0] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#a435f0] focus:ring-offset-1 focus:ring-offset-slate-900"
            disabled={disabled}
          />
        ) : null}

        <span
          className="text-[#c084fc] font-black text-xs sm:text-sm min-w-[28px] text-right select-none"
          aria-hidden="true"
        >
          {speed}x
        </span>
      </div>

      {progressText && (
        <div
          className="hidden lg:block text-right bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800"
          aria-label={`Progress: ${progressText}`}
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" aria-hidden="true">PROGRESS</div>
          <div className="text-sm font-bold text-slate-200" aria-hidden="true">
            {progressText}
          </div>
        </div>
      )}

      {/* Playback Timeline */}
      {totalSteps !== undefined && (
        <div className="w-full mt-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
          
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Step {currentStep}</span>
            <span>Total {totalSteps} Steps</span>
          </div>

          <input
            type="range"
            min="0"
            max={totalSteps}
            value={currentStep}
            onChange={(e) =>
              onTimelineChange &&
              onTimelineChange(Number(e.target.value))
            }
            className="w-full accent-[#a435f0] cursor-pointer"
          />

          <div className="flex justify-center gap-2 mt-3 text-xs">
            <span className="bg-yellow-600/30 text-yellow-300 px-2 py-1 rounded">
              Comparison
            </span>

            <span className="bg-green-600/30 text-green-300 px-2 py-1 rounded">
              Swap
            </span>

            <span className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
              Insert
            </span>
          </div>

        </div>
      )}

    </div>
  );
}
