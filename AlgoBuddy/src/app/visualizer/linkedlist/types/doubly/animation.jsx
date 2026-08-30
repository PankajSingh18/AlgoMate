"use client";

import React, { useState, useMemo, useEffect } from "react";
import ResetButton from "@/app/components/ui/resetButton";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { insertDoublyGenerator } from "@/features/algorithms/linkedlist/doublyLinkedListLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const DoublyLinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [pendingOp, setPendingOp] = useState(null); // { type: 'add', value: string }
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    if (pendingOp.type === "add") {
      let nextId = nodeIdCounter;
      return Array.from(insertDoublyGenerator(list, pendingOp.value, () => nextId++));
    }
    return [];
  }, [list, pendingOp, nodeIdCounter]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 800 });

  const PointerBridge = ({ direction, label, color, reversed = false }) => {
    const laneClass =
      direction === "next"
        ? "text-blue-600 dark:text-blue-400"
        : "text-purple-600 dark:text-purple-400";

    const markerId = `${direction}-bridge-arrow`;

    return (
      <div className={`flex flex-col items-center justify-center ${laneClass}`}>
        <svg viewBox="0 0 40 72" className="h-16 w-10 overflow-visible">
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L10,5 L0,10 z" fill={color} />
            </marker>
          </defs>
          <path
            d={reversed ? "M 20 66 V 12" : "M 20 6 V 60"}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={`url(#${markerId})`}
          />
        </svg>
        <span className="-mt-1 text-[11px] font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
    );
  };

  const addNode = () => {
    if (!inputValue || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: "add", value: inputValue });
    engine.reset();
    engine.play();
  };

  const handleReset = () => {
    setInputValue("");
    setList([]);
    setPendingOp(null);
    setNodeIdCounter(1);
    engine.reset();
  };

  useVisualizerReset(handleReset);

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.type === "complete") {
        setList(finalFrame.list);
        setNodeIdCounter((prev) => prev + 1);
      }
      setPendingOp(null);
      engine.reset();
    } else if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
  };

  // Auto-commit on completion
  useEffect(() => {
    if (
      engine.currentStep === frames.length - 1 &&
      frames.length > 0 &&
      !engine.isPlaying
    ) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.type === "complete") {
        setList(finalFrame.list);
        setNodeIdCounter((prev) => prev + 1);
        setPendingOp(null);
        setInputValue("");
        engine.reset();
      }
    }
  }, [engine.currentStep, frames, engine.isPlaying, engine, pendingOp]);

  useVisualizerKeyboard({
    onStart: togglePlay,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: handleReset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  const currentFrame =
    frames.length > 0 && engine.currentStep >= 0
      ? frames[engine.currentStep]
      : {
          type: "idle",
          list: list,
          message: 'Enter a value and click "Add Node" to start.',
        };

  // The generator only yields list at 'complete'. During 'start', use base list.
  const displayList = currentFrame.list || list;

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize Doubly Linked List Operations
      </p>

      {/* Input Form */}
      <VisualizerCard className="mb-0">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Node Value
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter value"
              disabled={engine.isPlaying || pendingOp !== null}
              onKeyDown={(e) => e.key === "Enter" && addNode()}
            />
            {inputValue && (
              <button
                onClick={() => setInputValue("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={addNode}
            disabled={engine.isPlaying || !inputValue || pendingOp !== null}
            className={`w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white transition hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 sm:w-auto ${
              engine.isPlaying ? "cursor-not-allowed" : ""
            }`}
          >
            {engine.isPlaying && pendingOp?.type === "add"
              ? "Adding Node..."
              : "Add Node"}
          </button>
          <ResetButton onReset={handleReset} isAnimating={engine.isPlaying && pendingOp === null} />
        </div>
        
        {frames.length > 0 && (
          <div className="mt-6">
            <PlaybackControls
              isPlaying={engine.isPlaying}
              onPlayPause={togglePlay}
              speed={engine.speed / 1000}
              onSpeedChange={(s) => engine.setSpeed(s * 1000)}
              onStepForward={engine.stepForward}
              onStepBackward={engine.stepBackward}
              onReset={() => {
                engine.reset();
              }}
              progressText={`${engine.currentStep + 1} / ${frames.length || 1}`}
              disabled={frames.length === 0}
            />
          </div>
        )}
      </VisualizerCard>

      {/* Linked List Visualization */}
      <VisualizerCard>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Doubly Linked List Representation
        </h2>

        <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-primary dark:text-[#c27cf7]">
            <span className="h-2.5 w-6 rounded-full bg-primary" />
            <span>next pointer</span>
          </div>
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <span className="h-2.5 w-6 rounded-full bg-purple-500" />
            <span>prev pointer</span>
          </div>
        </div>

        {displayList.length === 0 ? (
          <div className="text-center py-6 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-dashed border-gray-300 dark:border-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No nodes in the list yet. Add your first node!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            {displayList.map((node, index) => (
              <React.Fragment key={node.id}>
                <div className="w-full max-w-xs relative group z-10">
                  <div
                    className={`relative flex flex-col rounded-lg p-3 bg-white dark:bg-gray-700 border ${
                      index === 0 ? "border-green-500" : "border-primary"
                    } shadow-sm transition-all duration-200 overflow-hidden`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                        {node.address}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          index === 0
                            ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                            : "bg-blue-100 dark:bg-blue-900/50 text-primary-dark dark:text-blue-200"
                        }`}
                      >
                        {index === 0
                          ? "HEAD"
                          : index === displayList.length - 1
                          ? "TAIL"
                          : `Node ${index}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-1">
                      <div
                        data-port="prev"
                        className="border-r border-gray-200 dark:border-gray-600 pr-2 relative z-10"
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Prev
                        </div>
                        <div className="font-mono text-xs">
                          {node.prev || (
                            <span className="text-red-500">NULL</span>
                          )}
                        </div>
                      </div>

                      <div className="border-r border-gray-200 dark:border-gray-600 pr-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Data
                        </div>
                        <div className="font-medium text-sm truncate">
                          {node.value}
                        </div>
                      </div>

                      <div data-port="next" className="relative z-10">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Next
                        </div>
                        <div className="font-mono text-xs">
                          {node.next || (
                            <span className="text-red-500">NULL</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {index < displayList.length - 1 && (
                  <div className="w-full max-w-xs py-2">
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/80 px-4 py-3 dark:border-gray-600 dark:bg-gray-700/30">
                      <div className="mb-2 flex items-center justify-center gap-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <span>
                          node {index} to node {index + 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <PointerBridge
                          direction="next"
                          label="next"
                          color="#3b82f6"
                        />
                        <div className="flex-1 px-1">
                          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                        </div>
                        <PointerBridge
                          direction="prev"
                          label="prev"
                          color="#a855f7"
                          reversed
                        />
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default DoublyLinkedListVisualizer;
