"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { AnimatePresence, motion } from "framer-motion";
import { insertGenerator } from "@/features/algorithms/hashmap/hashmapInsertLogic";
import { searchGenerator } from "@/features/algorithms/hashmap/hashmapSearchLogic";
import { deleteGenerator } from "@/features/algorithms/hashmap/hashmapDeleteLogic";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

const TABLE_SIZE = 8;
const makeTable = () => Array.from({ length: TABLE_SIZE }, () => []);

const HashMapChainingVisualizer = ({ mode = "insert" }) => {
  const [baseHashMap, setBaseHashMap] = useState(makeTable());
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");
  const [insertKey, setInsertKey] = useState("");
  const [insertValue, setInsertValue] = useState("");
  
  const [frames, setFrames] = useState([]);

  // Clear frames when mode changes
  useEffect(() => {
    setFrames([]);
  }, [mode]);

  useVisualizerReset(() => {
    setBaseHashMap(makeTable());
    setKeyInput("");
    setValueInput("");
    setInsertKey("");
    setInsertValue("");
    setFrames([]);
  });

  const hashFunction = (key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
      hash = (hash + key.charCodeAt(i)) % TABLE_SIZE;
    }
    return hash;
  };

  const generateFrames = (generator) => {
    const rawSteps = Array.from(generator);
    const newFrames = [];
    
    let currentMap = baseHashMap;
    let highlightIndex = null;
    let collisionIndex = null;
    let activeNode = { bucket: null, index: null };
    let operation = null;
    let toast = null;

    for (const step of rawSteps) {
      // Reset toast from previous frame
      toast = null;
      
      if (step.type === 'hash') {
        highlightIndex = step.index;
        operation = step.operation;
      } else if (step.type === 'collision') {
        collisionIndex = step.index;
        operation = step.operation;
        toast = { message: step.message, type: "collision" };
      } else if (step.type === 'resolve') {
        operation = step.operation;
      } else if (step.type === 'traverse') {
        activeNode = step.activeNode;
        operation = step.operation;
      } else if (step.type === 'complete') {
        if (step.hashMap) {
          currentMap = step.hashMap;
        }
        if (step.activeNode) {
          activeNode = step.activeNode;
        } else {
          // If searching/deleting and it wasn't found or activeNode wasn't updated
          activeNode = { bucket: null, index: null };
        }
        operation = step.operation;
      }

      newFrames.push({
        hashMap: currentMap,
        highlightIndex,
        collisionIndex,
        activeNode,
        operation,
        toast,
        isComplete: step.type === 'complete'
      });
    }

    return newFrames;
  };

  const handleSequenceFinish = useCallback((stepIndex, currentFrames) => {
    if (currentFrames.length > 0 && stepIndex === currentFrames.length - 1) {
      const lastFrame = currentFrames[stepIndex];
      if (lastFrame && lastFrame.isComplete) {
        setBaseHashMap(lastFrame.hashMap);
      }
    }
  }, []);

  const engine = useAnimationEngine({ 
    steps: frames, 
    initialSpeed: 1000,
    onStep: (stepIdx) => {
      // We could trigger handleSequenceFinish here, but we also want it to apply 
      // if the user scrubs to the end. The effect below handles it better.
    }
  });

  // When animation finishes entirely (or user steps to the end manually), 
  // lock in the state so subsequent operations start from the new state.
  useEffect(() => {
    if (frames.length > 0 && engine.currentStep === frames.length - 1) {
      handleSequenceFinish(engine.currentStep, frames);
    }
  }, [engine.currentStep, frames, handleSequenceFinish]);

  const applyInsert = (rawKey, rawValue) => {
    const key = rawKey.trim();
    const value = rawValue.trim();
    if (!key || !value || engine.isPlaying) return;

    // Use the current baseHashMap to generate the next sequence
    const gen = insertGenerator(baseHashMap, key, value, TABLE_SIZE, hashFunction);
    const newFrames = generateFrames(gen);
    setFrames(newFrames);
    engine.reset();
    engine.play();
  };

  const handleInsert = () => {
    applyInsert(keyInput, valueInput);
    setKeyInput("");
    setValueInput("");
  };

  const handleAuxInsert = () => {
    applyInsert(insertKey, insertValue);
    setInsertKey("");
    setInsertValue("");
  };

  const handleSearch = () => {
    const key = keyInput.trim();
    if (!key || engine.isPlaying) return;

    const gen = searchGenerator(baseHashMap, key, TABLE_SIZE, hashFunction);
    const newFrames = generateFrames(gen);
    setFrames(newFrames);
    engine.reset();
    engine.play();
    setKeyInput("");
  };

  const handleDelete = () => {
    const key = keyInput.trim();
    if (!key || engine.isPlaying) return;

    const gen = deleteGenerator(baseHashMap, key, TABLE_SIZE, hashFunction);
    const newFrames = generateFrames(gen);
    setFrames(newFrames);
    engine.reset();
    engine.play();
    setKeyInput("");
  };

  const handleClear = () => {
    setBaseHashMap(makeTable());
    setFrames([]);
    setKeyInput("");
    setValueInput("");
    setInsertKey("");
    setInsertValue("");
    engine.reset();
  };

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      engine.reset();
      setTimeout(() => engine.play(), 50);
    } else if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
  };

  useVisualizerKeyboard({
    onStart: togglePlay,
    onTogglePlayPause: togglePlay,
    sorting: engine.isPlaying,
    onReset: engine.reset,
    speed: engine.speed / 1000,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
  });

  // Render State
  const currentFrame = frames.length > 0 ? frames[engine.currentStep] : null;
  const renderHashMap = currentFrame ? currentFrame.hashMap : baseHashMap;
  const renderHighlight = currentFrame ? currentFrame.highlightIndex : null;
  const renderCollision = currentFrame ? currentFrame.collisionIndex : null;
  const renderActiveNode = currentFrame ? currentFrame.activeNode : { bucket: null, index: null };
  const renderOperation = currentFrame ? currentFrame.operation : null;
  const renderToast = currentFrame ? currentFrame.toast : null;

  const totalCollisions = useMemo(
    () => renderHashMap.reduce((sum, bucket) => sum + Math.max(0, bucket.length - 1), 0),
    [renderHashMap]
  );

  return (
    <main className="container mx-auto px-6 pb-8">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8 mt-6">
        Visual hash buckets with separate chaining collision handling
      </p>

      <div className="max-w-5xl mx-auto">
        {mode === "insert" ? (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <input
                type="text"
                placeholder="Key"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-36"
              />
              <input
                type="text"
                placeholder="Value"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-36"
              />
              <button
                onClick={handleInsert}
                disabled={engine.isPlaying}
                className="bg-[#a435f0] text-white px-4 py-2 rounded hover:bg-[#8710d8] disabled:opacity-50"
              >
                Insert
              </button>
              <button
                onClick={handleClear}
                className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Clear Map
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-4">
              <p className="text-sm text-gray-500 mb-3 font-medium">Add entries first:</p>
              <div className="flex flex-wrap gap-3 items-center justify-center">
                <input
                  type="text"
                  placeholder="Key"
                  value={insertKey}
                  onChange={(e) => setInsertKey(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-32"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={insertValue}
                  onChange={(e) => setInsertValue(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-32"
                />
                <button
                  onClick={handleAuxInsert}
                  disabled={engine.isPlaying}
                  className="bg-[#a435f0] text-white px-4 py-2 rounded hover:bg-[#8710d8] disabled:opacity-50"
                >
                  Insert
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
              <p className="text-sm text-gray-500 mb-3 font-medium">
                {mode === "search" ? "Search by key:" : "Delete by key:"}
              </p>
              <div className="flex flex-wrap gap-3 items-center justify-center">
                <input
                  type="text"
                  placeholder={mode === "search" ? "Key to search" : "Key to delete"}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-40"
                />
                <button
                  onClick={mode === "search" ? handleSearch : handleDelete}
                  disabled={engine.isPlaying}
                  className={`text-white px-4 py-2 rounded disabled:opacity-50 ${
                    mode === "search" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {mode === "search" ? "Search" : "Delete"}
                </button>
                <button
                  onClick={handleClear}
                  className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Clear Map
                </button>
              </div>
            </div>
          </>
        )}

        {renderOperation && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg text-center border ${
              renderCollision !== null
                ? "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200"
                : "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-primary-dark dark:text-blue-200"
            }`}
          >
            {renderOperation}
          </motion.div>
        )}
        <AnimatePresence>
          {renderToast && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg border shadow-lg ${
                renderToast.type === "collision"
                  ? "bg-orange-100 dark:bg-orange-900/90 border-orange-300 dark:border-orange-700 text-orange-900 dark:text-orange-200"
                  : "bg-blue-100 dark:bg-blue-900/90 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200"
              }`}
            >
              {renderToast.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <h2 className="text-xl font-semibold">Hash Table (Size: {TABLE_SIZE})</h2>
            <div className="text-sm px-3 py-1 rounded-full bg-[#faf5ff] dark:bg-[#1a0a2e] border border-[#e9d5ff] dark:border-[#3b1a6e]">
              Collisions: <span className="font-semibold text-[#a435f0]">{totalCollisions}</span>
            </div>
          </div>

          <div className="space-y-2">
            {renderHashMap.map((bucket, index) => {
              const bucketCollisions = Math.max(0, bucket.length - 1);
              const highlighted = renderHighlight === index;
              const collisionGlow = renderCollision === index;
              return (
                <motion.div
                  key={index}
                  layout
                  initial={false}
                  animate={{
                    boxShadow: collisionGlow
                      ? "0 0 0 1px rgba(249,115,22,0.8), 0 0 24px rgba(249,115,22,0.35)"
                      : highlighted
                      ? "0 0 0 1px rgba(168,85,247,0.7), 0 0 16px rgba(168,85,247,0.22)"
                      : "0 0 0 0px rgba(0,0,0,0)",
                  }}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    collisionGlow
                      ? "border-orange-400 bg-orange-50 dark:bg-orange-950/20"
                      : highlighted
                      ? "border-[#a435f0] bg-[#faf5ff] dark:bg-[#1a0a2e]"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#a435f0] text-white rounded font-bold text-sm shrink-0 mt-1">
                    {index}
                  </div>

                  <div className="flex-1 min-h-12">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">bucket[{index}]</span>
                      {bucketCollisions > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                          +{bucketCollisions} collision{bucketCollisions > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {bucket.length === 0 ? (
                        <span className="text-gray-400 text-sm">empty</span>
                      ) : (
                        <AnimatePresence>
                          {bucket.map((pair, i) => {
                            const isActive = renderActiveNode.bucket === index && renderActiveNode.index === i;
                            return (
                              <React.Fragment key={pair.id || `${pair.key}-${i}`}>
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                  animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    boxShadow: isActive
                                      ? "0 0 0 1px rgba(59,130,246,0.65), 0 0 14px rgba(59,130,246,0.3)"
                                      : "0 0 0 0px rgba(0,0,0,0)",
                                  }}
                                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                  transition={{ duration: 0.22 }}
                                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border ${
                                    isActive
                                      ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700"
                                      : "bg-[#f3f4f6] dark:bg-[#222] border-transparent"
                                  }`}
                                >
                                  <span className="font-medium text-[#a435f0]">{pair.key}</span>
                                  <span className="text-gray-500">:</span>
                                  <span>{pair.value}</span>
                                </motion.div>
                                {i < bucket.length - 1 && (
                                  <motion.span
                                    initial={{ opacity: 0.3, x: -2 }}
                                    animate={{ opacity: 1, x: 2 }}
                                    transition={{
                                      duration: 0.55,
                                      repeat: Infinity,
                                      repeatType: "reverse",
                                      ease: "easeInOut",
                                    }}
                                    className="text-orange-500 dark:text-orange-300 text-base font-semibold select-none"
                                  >
                                    →
                                  </motion.span>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </AnimatePresence>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-[#faf5ff] dark:bg-[#1a0a2e] rounded-lg border border-[#e9d5ff] dark:border-[#3b1a6e] text-sm text-gray-600 dark:text-gray-400">
            Hash Function: sum of char codes % {TABLE_SIZE}. Collision handling: Separate Chaining.
          </div>
        </div>

        {/* Playback Controls Wrapper */}
        <div className="mt-6">
          <PlaybackControls
            isPlaying={engine.isPlaying}
            onPlayPause={togglePlay}
            speed={engine.speed / 1000}
            onSpeedChange={(s) => engine.setSpeed(s * 1000)}
            onStepForward={engine.stepForward}
            onStepBackward={engine.stepBackward}
            onReset={engine.reset}
            progressText={frames.length > 0 ? `${engine.currentStep + 1} / ${frames.length}` : "0 / 0"}
            disabled={frames.length === 0}
          />
        </div>
      </div>
    </main>
  );
};

export default HashMapChainingVisualizer;
