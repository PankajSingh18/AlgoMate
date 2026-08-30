"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Settings2, BarChart3, Info, Play, RotateCcw } from "lucide-react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import { knapsackGenerator } from "@/features/algorithms/dp/knapsackLogic";
import { lcsGenerator } from "@/features/algorithms/dp/lcsLogic";
import { coinChangeGenerator } from "@/features/algorithms/dp/coinChangeLogic";
import { dpTopics } from "../data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DPVisualizer({ algorithm = "knapsack" }) {
  const topic = dpTopics[algorithm];
  
  const [isEditing, setIsEditing] = useState(true);

  // Inputs for Knapsack
  const [capacity, setCapacity] = useState(topic.defaultInput.capacity || 5);
  const [items, setItems] = useState(topic.defaultInput.items || []);
  
  // Inputs for LCS
  const [str1, setStr1] = useState(topic.defaultInput.str1 || "");
  const [str2, setStr2] = useState(topic.defaultInput.str2 || "");

  // Inputs for Coin Change
  const [amount, setAmount] = useState(topic.defaultInput.amount || 11);
  const [coins, setCoins] = useState(topic.defaultInput.coins || []);

  const frames = useMemo(() => {
    try {
      if (algorithm === "knapsack") {
        return Array.from(knapsackGenerator(items.map(i => i.weight), items.map(i => i.value), capacity));
      }
      if (algorithm === "lcs") {
        return Array.from(lcsGenerator(str1, str2));
      }
      if (algorithm === "coin-change") {
        return Array.from(coinChangeGenerator(coins, amount));
      }
    } catch (e) {
      console.error(e);
      return [];
    }
    return [];
  }, [algorithm, capacity, items, str1, str2, amount, coins]);

  const onStep = useCallback((step) => {}, []);
  const engine = useAnimationEngine({ steps: frames, onStep, initialSpeed: 1000 });

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      engine.reset();
      setTimeout(() => engine.play(), 50);
    } else if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
    setIsEditing(false);
  };

  const reset = () => {
    engine.reset();
    setIsEditing(true);
  };

  const stepForward = () => {
    engine.stepForward();
    setIsEditing(false);
  };

  const stepBackward = () => {
    engine.stepBackward();
    setIsEditing(false);
  };

  useVisualizerKeyboard({
    onStart: togglePlay,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: reset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const currentFrame = frames[engine.currentStep] || {};

  // Rendering logic for grids
  const renderKnapsackGrid = () => {
    if (!currentFrame.dp) return null;
    const dp = currentFrame.dp;
    return (
      <div className="overflow-auto rounded-lg bg-surface-50 p-4 dark:bg-surface-950 shadow-inner">
        <table className="w-full border-collapse text-center font-mono text-sm">
          <thead>
            <tr>
              <th className="p-2 border border-surface-200 dark:border-surface-800 text-surface-500">Item \ Cap</th>
              {Array.from({ length: capacity + 1 }).map((_, w) => (
                <th key={w} className={`p-2 border border-surface-200 dark:border-surface-800 ${currentFrame.col === w ? 'text-primary' : 'text-surface-600 dark:text-surface-300'}`}>
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((rowArr, i) => (
              <tr key={i}>
                <th className={`p-2 border border-surface-200 dark:border-surface-800 ${currentFrame.row === i ? 'text-primary' : 'text-surface-600 dark:text-surface-300'}`}>
                  {i === 0 ? "0" : `i=${i} (w:${items[i-1].weight}, v:${items[i-1].value})`}
                </th>
                {rowArr.map((val, w) => {
                  const isCurrent = currentFrame.row === i && currentFrame.col === w;
                  const isReferenced = !isCurrent && (
                    (currentFrame.row === i && currentFrame.row > 0 && currentFrame.col !== w) || 
                    false // Could highlight referenced cells if we add them to the frame state
                  );
                  return (
                    <td key={w} className={`p-2 border border-surface-200 dark:border-surface-800 transition-colors duration-300
                      ${isCurrent ? 'bg-primary text-white font-bold scale-110 shadow-md' : 'bg-white dark:bg-surface-900'}
                    `}>
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLCSGrid = () => {
    if (!currentFrame.dp) return null;
    const dp = currentFrame.dp;
    return (
      <div className="overflow-auto rounded-lg bg-surface-50 p-4 dark:bg-surface-950 shadow-inner">
        <table className="w-full border-collapse text-center font-mono text-sm">
          <thead>
            <tr>
              <th className="p-2 border border-surface-200 dark:border-surface-800 text-surface-500"></th>
              <th className="p-2 border border-surface-200 dark:border-surface-800 text-surface-500">""</th>
              {str2.split('').map((char, j) => (
                <th key={j} className={`p-2 border border-surface-200 dark:border-surface-800 ${currentFrame.col === j + 1 ? 'text-primary' : 'text-surface-600 dark:text-surface-300'}`}>
                  {char}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dp.map((rowArr, i) => (
              <tr key={i}>
                <th className={`p-2 border border-surface-200 dark:border-surface-800 ${currentFrame.row === i ? 'text-primary' : 'text-surface-600 dark:text-surface-300'}`}>
                  {i === 0 ? '""' : str1[i - 1]}
                </th>
                {rowArr.map((val, j) => {
                  const isCurrent = currentFrame.row === i && currentFrame.col === j;
                  return (
                    <td key={j} className={`p-2 border border-surface-200 dark:border-surface-800 transition-colors duration-300
                      ${isCurrent ? 'bg-primary text-white font-bold scale-110 shadow-md' : 'bg-white dark:bg-surface-900'}
                    `}>
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCoinChangeGrid = () => {
    if (!currentFrame.dp) return null;
    const dp = currentFrame.dp;
    return (
      <div className="overflow-auto rounded-lg bg-surface-50 p-4 dark:bg-surface-950 shadow-inner">
        <table className="w-full border-collapse text-center font-mono text-sm">
          <thead>
            <tr>
              <th className="p-2 border border-surface-200 dark:border-surface-800 text-surface-500">Amount</th>
              {dp.map((_, i) => (
                <th key={i} className={`p-2 border border-surface-200 dark:border-surface-800 ${currentFrame.index === i ? 'text-primary' : 'text-surface-600 dark:text-surface-300'}`}>
                  {i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="p-2 border border-surface-200 dark:border-surface-800 text-surface-500">Min Coins</th>
              {dp.map((val, i) => {
                const isCurrent = currentFrame.index === i;
                return (
                  <td key={i} className={`p-2 border border-surface-200 dark:border-surface-800 transition-colors duration-300
                    ${isCurrent ? 'bg-primary text-white font-bold scale-110 shadow-md' : 'bg-white dark:bg-surface-900'}
                  `}>
                    {val === Infinity || val === null ? "∞" : val}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isEditing 
                  ? "bg-primary text-white" 
                  : "bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300"
              }`}
            >
              <Settings2 className="h-4 w-4" />
              {isEditing ? "Editing Mode" : "Visualization Mode"}
            </button>

            {!isEditing && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-300">
                  <Info className="h-4 w-4 text-primary" />
                  {currentFrame.description || "Ready to start"}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button type="button" onClick={togglePlay} className="btn-base bg-primary text-white hover:bg-primary-dark">
              <Play className="h-4 w-4" /> {engine.isPlaying ? "Pause" : "Play"}
            </button>
            <button type="button" onClick={reset} className="btn-base border border-surface-300 dark:border-surface-700">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900">
            <h3 className="mb-4 text-sm font-bold">Problem Inputs</h3>
            {algorithm === "knapsack" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Knapsack Capacity (W)</label>
                  <input type="number" min="1" max="20" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value) || 0)} className="block mt-1 p-2 border rounded dark:bg-surface-800 dark:border-surface-700 w-32" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Items (Weight, Value)</label>
                  <textarea 
                    className="block mt-1 p-2 border rounded dark:bg-surface-800 dark:border-surface-700 w-full font-mono text-sm"
                    rows={4}
                    value={items.map(i => `${i.weight},${i.value}`).join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n');
                      const newItems = lines.map(l => {
                        const [w, v] = l.split(',').map(s => parseInt(s.trim()));
                        if (!isNaN(w) && !isNaN(v)) return { weight: w, value: v };
                        return null;
                      }).filter(Boolean);
                      setItems(newItems);
                    }}
                    placeholder="Format: weight,value (one per line)"
                  />
                  <p className="text-xs text-surface-500 mt-1">One item per line. Format: weight,value</p>
                </div>
              </div>
            )}

            {algorithm === "lcs" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">String 1</label>
                  <input type="text" maxLength={15} value={str1} onChange={(e) => setStr1(e.target.value.toUpperCase())} className="block mt-1 p-2 border rounded dark:bg-surface-800 dark:border-surface-700 w-full uppercase" />
                </div>
                <div>
                  <label className="text-sm font-semibold">String 2</label>
                  <input type="text" maxLength={15} value={str2} onChange={(e) => setStr2(e.target.value.toUpperCase())} className="block mt-1 p-2 border rounded dark:bg-surface-800 dark:border-surface-700 w-full uppercase" />
                </div>
              </div>
            )}

            {algorithm === "coin-change" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold">Target Amount</label>
                  <input type="number" min="1" max="50" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} className="block mt-1 p-2 border rounded dark:bg-surface-800 dark:border-surface-700 w-32" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Coins</label>
                  <input type="text" value={coins.join(', ')} onChange={(e) => {
                    const c = e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
                    setCoins(c);
                  }} className="block mt-1 p-2 border rounded dark:bg-surface-800 dark:border-surface-700 w-full" placeholder="e.g. 1, 2, 5" />
                  <p className="text-xs text-surface-500 mt-1">Comma separated positive integers</p>
                </div>
              </div>
            )}
          </div>
        )}

        {!isEditing && (
          <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-800 dark:bg-surface-900 min-h-[400px]">
             {algorithm === "knapsack" && renderKnapsackGrid()}
             {algorithm === "lcs" && renderLCSGrid()}
             {algorithm === "coin-change" && renderCoinChangeGrid()}
          </div>
        )}

        <PlaybackControls
          isPlaying={engine.isPlaying}
          onPlayPause={togglePlay}
          speed={engine.speed / 1000}
          onSpeedChange={(s) => engine.setSpeed(s * 1000)}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onReset={reset}
          progressText={`${engine.currentStep + 1} / ${frames.length || 1}`}
          disabled={frames.length === 0}
        />
      </div>
    </div>
  );
}
