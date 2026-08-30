"use client";
import React from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

export default function LinearMemoryControls({
  inputValue,
  setInputValue,
  placeholder = "Enter value...",
  isAnimating = false,
  operation = null,
  message = null,
  speed = 1,
  onSpeedChange,
  actions = [],
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isAnimating) {
      const primaryAction = actions.find(a => a.needsInput);
      if (primaryAction && !primaryAction.disabled) {
        primaryAction.onClick();
      }
    }
  };

  useVisualizerKeyboard({
    onReset: actions.find((a) => a.label?.toLowerCase() === "reset")?.onClick,
    onSpeedChange: onSpeedChange,
    speed: speed,
    sorting: isAnimating,
    sorted: false,
    enabled: true,
  });

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-4 md:p-5 rounded-2xl flex flex-col xl:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20 w-full mb-8 max-w-6xl mx-auto">
      {/* 1. Input and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto items-center">
        {setInputValue && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="w-full sm:w-32 px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#a435f0] transition-colors"
            disabled={isAnimating}
            onKeyDown={handleKeyDown}
          />
        )}
        
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center">
          {actions.map((action, idx) => {
            const isPrimary = action.variant === "primary" || !action.variant;
            const isSecondary = action.variant === "secondary";
            const isDanger = action.variant === "danger";

            let baseClasses = "px-3.5 py-2 text-xs font-bold rounded-xl transition-all border flex items-center justify-center gap-1.5 ";
            if (isPrimary) {
              baseClasses += "bg-[#a435f0] hover:bg-[#8f2cd6] border-[#8f2cd6] text-white";
            } else if (isDanger) {
              baseClasses += "bg-rose-950/40 hover:bg-rose-900/60 border-rose-900/50 text-rose-500";
            } else if (isSecondary) {
              baseClasses += "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300";
            } else {
              baseClasses += "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300";
            }

            if (isAnimating || action.disabled) {
              baseClasses += " opacity-50 cursor-not-allowed";
            }

            return (
              <button
                key={idx}
                onClick={action.onClick}
                disabled={isAnimating || action.disabled}
                className={baseClasses}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Status and Message Banner */}
      <div className="flex flex-col gap-2 w-full xl:flex-1 items-center xl:items-start min-h-[40px] justify-center px-2">
        {operation && (
          <div className="text-xs font-semibold text-[#a435f0] flex items-center gap-1.5 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>{operation}</span>
          </div>
        )}
        {message && !operation && (
          <div className="text-xs font-medium text-slate-400 text-center xl:text-left leading-relaxed">
            {message}
          </div>
        )}
      </div>

      {/* 3. Playback Controls */}
      <div className="w-full xl:w-auto flex justify-center xl:justify-end">
        <PlaybackControls 
          showPlayPause={false}
          speed={speed}
          onSpeedChange={onSpeedChange}
          onIncreaseSpeed={() => onSpeedChange(Math.min(speed + 0.5, 5))}
          onDecreaseSpeed={() => onSpeedChange(Math.max(speed - 0.5, 0.5))}
          disabled={isAnimating}
        />
      </div>
    </div>
  );
}
