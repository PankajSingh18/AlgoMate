"use client";

import React, { useState, useMemo, useEffect } from "react";
import ResetButton from "@/app/components/ui/resetButton";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { addNodeGenerator } from "@/features/algorithms/linkedlist/singlyLinkedListLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const SinglyLinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [pendingOp, setPendingOp] = useState(null); // { type: 'add', value: string }
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    if (pendingOp.type === "add") {
      return Array.from(addNodeGenerator(list, pendingOp.value, nodeIdCounter));
    }
    return [];
  }, [list, pendingOp, nodeIdCounter]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 800 });

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
        setNodeIdCounter(finalFrame.newNodeId + 1);
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
        setNodeIdCounter(finalFrame.newNodeId + 1);
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

  // Display list is the current base list, plus the new node if it's generated in this frame step 
  // Wait, the logic yields `list` only at the end. So we use the base `list` state.
  const displayList = currentFrame.list || list;

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize Singly Linked List Operations
      </p>

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
            className={`w-full rounded-lg bg-primary px-6 py-3 text-white transition hover:bg-primary-dark disabled:bg-gray-400 sm:w-auto ${
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

      <div className="w-full mb-6 max-w-4xl mx-auto p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center min-h-[60px] flex items-center justify-center">
        <p className="text-gray-800 dark:text-gray-200 font-medium">
          {currentFrame.message}
        </p>
      </div>

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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Linked List Memory Representation
        </h2>

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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              No nodes in the list yet. Add your first node!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {displayList.map((node, index) => (
              <React.Fragment key={node.id}>
                <div className="w-full max-w-xs relative group">
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
                        {index === 0 ? "HEAD" : `Node ${index}`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="border-r border-gray-200 dark:border-gray-600 pr-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Data
                        </div>
                        <div className="font-medium text-base truncate">
                          {node.value}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Next Pointer
                        </div>
                        <div className="font-mono text-xs">
                          {node.next || (
                            <span className="text-red-500">0x0000 (NULL)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {node.next && (
                    <div className="flex justify-center mt-1 relative">
                      <div className="h-4 w-0.5 bg-gradient-to-b from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-600 relative">
                        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-3 border-l-transparent border-r-transparent border-t-blue-500 dark:border-t-blue-400"></div>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default SinglyLinkedListVisualizer;
