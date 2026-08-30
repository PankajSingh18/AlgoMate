"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import ResetButton from "@/app/components/ui/resetButton";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import { addNodeGenerator } from "@/features/algorithms/linkedlist/circularLinkedListLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";

const CircularLinkedListVisualizer = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [diagramSize, setDiagramSize] = useState({ width: 0, height: 0 });
  const [pendingOp, setPendingOp] = useState(null); // { type: 'add', value: string }
  const [nodeIdCounter, setNodeIdCounter] = useState(1);
  const stageRef = useRef(null);

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    if (pendingOp.type === "add") {
      let nextId = nodeIdCounter;
      // We pass the starting ID to the generator.
      return Array.from(addNodeGenerator(list, pendingOp.value, nextId));
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

  useEffect(() => {
    const updateDiagramSize = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDiagramSize({ width: rect.width, height: rect.height });
    };

    const rafId = window.requestAnimationFrame(updateDiagramSize);
    window.addEventListener("resize", updateDiagramSize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateDiagramSize);
    };
  }, [list]);

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
        Visualize Circular Linked List Operations
      </p>

      {/* Input Form */}
      <VisualizerCard className="mb-0">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm font-medium">
            Node Value
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter value"
            disabled={engine.isPlaying || pendingOp !== null}
            onKeyDown={(e) => e.key === "Enter" && addNode()}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={addNode}
            className={`flex-1 py-3 rounded-lg transition-all ${
              engine.isPlaying || !inputValue || pendingOp !== null
                ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                : "bg-primary hover:bg-primary-dark text-white"
            }`}
            disabled={engine.isPlaying || !inputValue || pendingOp !== null}
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

      {/* Visualization Area */}
      <VisualizerCard>
        <div className="relative max-w-4xl mx-auto">
          {displayList.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
              <div className="inline-block p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                Empty List
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Add nodes to visualize the circular linked list
              </p>
            </div>
          ) : (
            <div
              ref={stageRef}
              className="relative mx-auto"
              style={{ minHeight: "500px" }}
            >
              {/* Circular arrangement of nodes */}
              <div className="relative mx-auto" style={{ minHeight: "500px" }}>
                {displayList.length > 1 &&
                  diagramSize.width > 0 &&
                  diagramSize.height > 0 && (
                    <svg
                      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                      style={{ zIndex: 0 }}
                      viewBox={`0 0 ${diagramSize.width} ${diagramSize.height}`}
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <marker
                          id="circular-arrowhead"
                          viewBox="0 0 10 10"
                          refX="8"
                          refY="5"
                          markerWidth="6"
                          markerHeight="6"
                          orient="auto"
                          markerUnits="strokeWidth"
                        >
                          <path d="M0,0 L10,5 L0,10 z" fill="#3b82f6" />
                        </marker>
                      </defs>

                      {displayList.map((node, index) => {
                        const step = (Math.PI * 2) / displayList.length;
                        const startAngle = index * step;
                        const nextAngle = ((index + 1) % displayList.length) * step;
                        const adjustedNextAngle =
                          nextAngle <= startAngle
                            ? nextAngle + Math.PI * 2
                            : nextAngle;
                        const arcRadius =
                          Math.min(125, 95 + displayList.length * 8) + 72;
                        const centerX = diagramSize.width / 2;
                        const centerY = diagramSize.height / 2;

                        const startX = centerX + arcRadius * Math.cos(startAngle);
                        const startY = centerY + arcRadius * Math.sin(startAngle);
                        const endX =
                          centerX + arcRadius * Math.cos(adjustedNextAngle);
                        const endY =
                          centerY + arcRadius * Math.sin(adjustedNextAngle);
                        const largeArcFlag =
                          adjustedNextAngle - startAngle > Math.PI ? 1 : 0;

                        return (
                          <path
                            key={`connection-${node.id}`}
                            className="connection-arrow"
                            d={`M ${startX} ${startY} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            markerEnd="url(#circular-arrowhead)"
                            opacity="0.9"
                          />
                        );
                      })}
                    </svg>
                  )}

                {displayList.map((node, index) => {
                  const angle =
                    (index * (360 / displayList.length)) * (Math.PI / 180);
                  const radius = Math.min(125, 95 + displayList.length * 8);
                  const centerX = 0;
                  const centerY = 0;
                  const nodeX = centerX + radius * Math.cos(angle);
                  const nodeY = centerY + radius * Math.sin(angle);

                  return (
                    <div
                      key={node.id}
                      data-node-id={node.id}
                      className="absolute transition-all duration-300 z-10"
                      style={{
                        left: `calc(50% + ${nodeX}px)`,
                        top: `calc(50% + ${nodeY}px)`,
                        transform: "translate(-50%, -50%)",
                        width: "160px",
                      }}
                    >
                      <div
                        className={`flex flex-col border-2 ${
                          index === 0 ? "border-green-500" : "border-blue-500"
                        } rounded-xl p-4 bg-white dark:bg-gray-700 shadow-md`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
                            {node.address}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              index === 0
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {index === 0 ? "HEAD" : `Node ${index}`}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-2">
                          <div className="bg-gray-50 dark:bg-gray-600 p-2 rounded">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Data
                            </div>
                            <div className="font-bold text-center text-lg">
                              {node.value}
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-600 p-2 rounded">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Next
                            </div>
                            <div className="font-mono text-xs text-center truncate">
                              {node.next === node.address ? "self" : node.next}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default CircularLinkedListVisualizer;
