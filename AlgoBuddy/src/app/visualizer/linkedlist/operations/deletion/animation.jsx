"use client";
import React, { useMemo, useState } from "react";
import {
  VisualizerCard,
  VisualizerInteractiveLayout,
} from "@/app/visualizer/components/VisualizerInteractiveLayout";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { addNodeDeletionGen, deleteLastNodeGen,deleteFirstNodeGen,deleteAtPositionGen} from "@/features/algorithms/linkedlist/deletionLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

const LinkedListDeletion = () => {
  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState([]);
  const [pendingOp, setPendingOp] = useState(null); // { type: 'add' | 'delete', val?: string }
  const [positionInput, setPositionInput] = useState("");

  const frames = useMemo(() => {
    if (!pendingOp) return [];
    if (pendingOp.type === "add") {
      return Array.from(addNodeDeletionGen(list, pendingOp.val));
    }

    if (pendingOp.type === "delete") {
      return Array.from(deleteLastNodeGen(list));
    }

    if (pendingOp.type === "delete_first") {
      return Array.from(deleteFirstNodeGen(list));
    }

    if (pendingOp.type === "delete_position") {
      return Array.from(
        deleteAtPositionGen(list, pendingOp.position)
      );
    }

    return [];
  }, [list, pendingOp]);

  const engine = useAnimationEngine({ steps: frames, initialSpeed: 1000 });

  const addNode = () => {
    if (!inputValue || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'add', val: inputValue });
    engine.reset();
    engine.play();
  };

  const deleteNode = () => {
    if (list.length === 0 || engine.isPlaying || pendingOp) return;
    setPendingOp({ type: 'delete' });
    engine.reset();
    engine.play();
  };

  const deleteFirstNode = () => {
    if (list.length === 0 || engine.isPlaying || pendingOp) return;

    setPendingOp({ type: "delete_first" });
    engine.reset();
    engine.play();
  };
  
  const handleReset = () => {
    setInputValue("");
    setList([]);
    setPendingOp(null);
    engine.reset();
  };
  const deleteAtPosition = () => {
    const position = Number(positionInput);

    if (
      isNaN(position) ||
      position < 0 ||
      position >= list.length
    )
      return;

    setPendingOp({
      type: "delete_position",
      position,
    });

    engine.reset();
    engine.play();
  };

  useVisualizerReset(handleReset);

  const togglePlay = () => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0) {
      const finalFrame = frames[frames.length - 1];
      if (finalFrame && finalFrame.phase === 'complete') {
         setList(finalFrame.list);
      }
      setPendingOp(null);
      engine.reset();
    } else if (engine.isPlaying) {
      engine.pause();
    } else {
      engine.play();
    }
  };

  // When animation finishes naturally
  React.useEffect(() => {
    if (engine.currentStep === frames.length - 1 && frames.length > 0 && !engine.isPlaying) {
        const finalFrame = frames[frames.length - 1];
        if (finalFrame && finalFrame.phase === 'complete') {
            setList(finalFrame.list);
            setPendingOp(null);
            if (pendingOp?.type === 'add') setInputValue("");
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

  const currentFrame = frames.length > 0 && engine.currentStep >= 0
    ? frames[engine.currentStep]
    : {
        list: list,
        newNode: null,
        phase: 'idle',
        currentNodeIndex: -1,
        targetNodeIndex: -1,
        explanation: "Enter a value and click 'Add Node' to insert, or click 'Delete Last Node'."
      };

  return (
    <VisualizerInteractiveLayout>
      <p className="text-center text-lg text-[#6b7280] dark:text-[#9ca3af]">
        Visualize how deleting the tail node updates the final pointer in a linked list.
      </p>

      <VisualizerCard>
        <div className="flex flex-col gap-4">

          {/* Add Node */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-lg border bg-white p-3 dark:bg-gray-700"
              placeholder="Enter value"
              disabled={engine.isPlaying || pendingOp !== null}
            />

            <button
              onClick={addNode}
              disabled={engine.isPlaying || !inputValue || pendingOp !== null}
              className="w-full rounded-lg bg-primary px-6 py-3 text-white disabled:bg-gray-400 sm:w-auto"
            >
              {engine.isPlaying && pendingOp?.type === "add"
                ? "Adding..."
                : "Add Node"}
            </button>
          </div>

          {/* Delete Operations */}
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={deleteNode}
                disabled={
                  engine.isPlaying ||
                  list.length === 0 ||
                  pendingOp !== null
                }
                className="w-full rounded-lg border border-black px-6 py-3 text-black disabled:opacity-50 dark:border-white dark:text-white"
              >
                {engine.isPlaying && pendingOp?.type === "delete"
                  ? "Deleting..."
                  : "Delete Last Node"}
              </button>

              <button
                onClick={deleteFirstNode}
                disabled={
                  engine.isPlaying ||
                  list.length === 0 ||
                  pendingOp !== null
                }
                className="w-full rounded-lg border border-black px-6 py-3 text-black disabled:opacity-50 dark:border-white dark:text-white"
              >
                Delete First Node
              </button>

              <button
                onClick={handleReset}
                disabled={engine.isPlaying && pendingOp === null}
                className="w-full rounded-lg border border-black px-6 py-3 text-black dark:border-white dark:text-white"
              >
                Reset
              </button>
            </div>

            {/* Delete At Position */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="number"
                min="0"
                value={positionInput}
                onChange={(e) => setPositionInput(e.target.value)}
                placeholder="Position"
                disabled={engine.isPlaying || pendingOp !== null}
                className="flex-1 rounded-lg border bg-white p-3 dark:bg-gray-700"
              />

              <button
                onClick={deleteAtPosition}
                disabled={
                  engine.isPlaying ||
                  list.length === 0 ||
                  pendingOp !== null ||
                  positionInput === ""
                }
                className="w-full rounded-lg border border-black px-6 py-3 text-black whitespace-nowrap disabled:opacity-50 dark:border-white dark:text-white sm:w-auto"
              >
                Delete At Position
              </button>
            </div>

          </div>
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

      <div className="w-full mb-6 max-w-4xl mx-auto p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center">
         <p className="text-gray-800 dark:text-gray-200 font-medium">
             {currentFrame.explanation}
         </p>
      </div>

      <VisualizerCard>
        <div className="mb-6 flex justify-center gap-4 text-sm sm:gap-8 sm:text-base">
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
            <span>Data</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-rose-500"></div>
            <span>To Delete</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-4 w-4 rounded-full bg-[#c27cf7] dark:bg-primary"></div>
            <span>Next Pointer</span>
          </div>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-x-auto rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 dark:border-[#222] dark:bg-[#181818] min-h-[300px]">
          {/* New Node Floating */}
          {currentFrame.newNode && currentFrame.action === 'add' && (
            <div className={`mb-8 flex transition-all duration-500 ease-in-out ${currentFrame.phase === 'traverse' ? 'translate-x-1/2 opacity-80' : 'translate-x-0 opacity-100 scale-110'}`}>
               <div className="flex items-center flex-col">
                  <span className="text-xs font-mono text-blue-600 mb-1 font-bold">New Node: {currentFrame.newNode.address}</span>
                  <div className="flex shadow-lg shadow-blue-500/30">
                    <div className="w-16 rounded-l-lg bg-emerald-500 p-3 text-center text-base text-white sm:w-20 sm:p-4 sm:text-lg">
                      {currentFrame.newNode.value}
                    </div>
                    <div className="w-16 rounded-r-lg bg-emerald-400 p-3 text-center font-mono text-xs sm:w-20 sm:p-4 sm:text-base">
                      {currentFrame.newNode.next}
                    </div>
                  </div>
               </div>
            </div>
          )}
        
          {currentFrame.list.length === 0 ? (
            <div className="w-full py-16 text-center text-gray-500">
              No nodes added yet.
            </div>
          ) : (
            <div className="flex items-center space-x-4 sm:space-x-8">
              {currentFrame.list.map((node, index) => {
                  const isCurrent = currentFrame.currentNodeIndex === index;
                  const isTarget = currentFrame.targetNodeIndex === index;
                  const isInsertTraversal =
                    currentFrame.action === "insert_position" &&
                    currentFrame.currentNodeIndex === index;

                  const isDeleteFirst =
                    currentFrame.action === "delete_first" &&
                    currentFrame.targetNodeIndex === index;

                  const bgData =  isDeleteFirst ? "bg-rose-500": isInsertTraversal ? "bg-amber-500" : isTarget ? "bg-rose-500" : isCurrent ? "bg-amber-500" : "bg-primary";
                  const scaleClass = isTarget ? "scale-90 opacity-50 shadow-none" : isCurrent ? "scale-110 shadow-md z-10" : "scale-100";
                  
                  return (
                    <div key={node.id} className="flex items-center">
                      <div className={`node flex flex-col items-center transition-all duration-500 ${scaleClass}`}>
                        <span className="text-[10px] font-mono text-gray-500 mb-1">{node.address}</span>
                        <div className="flex">
                            <div className={`data-part w-16 rounded-l-lg ${bgData} p-3 text-center text-base text-white sm:w-20 sm:p-4 sm:text-lg transition-colors`}>
                            {node.value}
                            </div>
                            <div className="next-part w-16 rounded-r-lg bg-[#c27cf7] p-3 text-center font-mono text-xs dark:bg-primary sm:w-20 sm:p-4 sm:text-base">
                            {node.next}
                            </div>
                        </div>
                      </div>
                      {index < currentFrame.list.length - 1 && (
                        <div className="mx-1 text-2xl sm:mx-2 sm:text-3xl text-gray-400">&rarr;</div>
                      )}
                    </div>
                  );
              })}
            </div>
          )}
        </div>
      </VisualizerCard>
    </VisualizerInteractiveLayout>
  );
};

export default LinkedListDeletion;
