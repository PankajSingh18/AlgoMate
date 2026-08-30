"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";
import useVisualizerReset from "@/app/hooks/useVisualizerReset";
import { postfixGenerator } from "@/features/algorithms/stack/postfixLogic";
import { useAnimationEngine } from "@/lib/visualizer/useAnimationEngine";

/* ----------  tiny reusable animated bits  ---------- */
const AnimatedStackItem = ({ char, isTop }) => (
  <motion.div
    initial={{ y: -30, opacity: 0, scale: 0.8 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    exit={{ y: 30, opacity: 0, scale: 0.8 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`p-3 border-2 rounded text-center font-medium
      ${isTop ? "bg-blue-100 dark:bg-blue-900 border-[#c27cf7]" : "bg-white dark:bg-gray-700 border-gray-200"}`}
  >
    {char}
    {isTop && <div className="text-xs mt-1 text-gray-500">(Top)</div>}
  </motion.div>
);

const AnimatedOutputToken = ({ char }) => (
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 15 }}
    className="w-10 h-10 flex items-center justify-center rounded-md
               bg-green-100 dark:bg-green-500 border border-white
               text-green-800 dark:text-black font-mono font-bold"
  >
    {char}
  </motion.div>
);

/* ----------  main component  ---------- */
const InfixToPostfixVisualizer = () => {
  const [infix, setInfix] = useState("(A+B)*C");
  const [postfix, setPostfix] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("Enter an infix expression and click Convert");
  
  const [steps, setSteps] = useState([]);
  const [visualState, setVisualState] = useState({
    stack: [], output: [], operation: null, message: "Enter an infix expression and click Convert"
  });

  const onStep = useCallback((step) => {
    setVisualState({
      stack: step.stack,
      output: step.output,
      operation: step.action,
      message: step.description
    });
  }, []);

  const engine = useAnimationEngine({ steps, onStep, initialSpeed: 1000 });
  const currentStepData = steps[engine.currentStep];

  const reset = useCallback(() => {
    engine.reset();
    setPostfix("");
    setSteps([]);
    setMessage("Enter an infix expression and click Convert");
    setVisualState({ stack: [], output: [], operation: null, message: "Enter an infix expression and click Convert" });
    setIsProcessing(false);
  }, [engine]);

  const convertInfixToPostfix = () => {
    if (!infix.trim()) { setMessage("Please enter an infix expression"); return; }
    setIsProcessing(true);
    reset();
    const conversionSteps = Array.from(postfixGenerator(infix));
    const finalPostfix = conversionSteps.length > 0 ? conversionSteps[conversionSteps.length - 1].output.join(" ") : "";
    setSteps(conversionSteps);
    setPostfix(finalPostfix);
    setIsProcessing(false);
    setTimeout(() => {
      engine.play();
    }, 50);
  };

  const statusRef = useRef();
  
  useVisualizerReset(() => {
    setInfix("(A+B)*C");
    reset();
  });

  useEffect(() => {
    if (statusRef.current) gsap.fromTo(statusRef.current, { scale: 0.95, opacity: 0.7 }, { scale: 1, opacity: 1, duration: 0.3 });
  }, [visualState.message]);

  useVisualizerKeyboard({
    onStart: undefined,
    onReset: reset,
    onSpeedChange: (s) => engine.setSpeed(s * 1000),
    onTogglePlayPause: engine.isPlaying ? engine.pause : engine.play,
    speed: engine.speed / 500,
    sorting: engine.isPlaying,
    sorted: engine.currentStep === steps.length - 1 && steps.length > 0,
    enabled: true,
  });

  /* ----------  UI  ---------- */
  return (
    <main className="container mx-auto">
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-8">Visualize the conversion from infix to postfix notation</p>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Infix Expression
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={infix}
                onChange={e => setInfix(e.target.value)}
                placeholder="Enter infix expression (e.g., (A+B)*C)"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:border-[#a435f0] focus:outline-none focus:ring-2 focus:ring-[#a435f0]/30 transition duration-300"
                disabled={isProcessing || engine.isPlaying || (steps.length > 0 && engine.currentStep < steps.length - 1)}
              />
              <button
                onClick={convertInfixToPostfix}
                disabled={isProcessing || engine.isPlaying || (steps.length > 0 && engine.currentStep < steps.length - 1)}
                className="px-6 py-2 font-bold bg-[#a435f0] text-white rounded-lg hover:bg-[#8f2cd6] transition-all duration-200"
              >
                {isProcessing ? "Converting..." : "Convert"}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={reset}
              className="flex-1 border-2 border-[#1a1a1a] dark:border-[#f7f9fa] text-[#1a1a1a] dark:text-[#f7f9fa] font-bold py-[10px] rounded-lg hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1a1a] disabled:opacity-50 transition-all duration-200"
            >
              Reset
            </button>
          </div>

          {steps.length > 0 && (
            <div className="mt-6">
              <PlaybackControls
                isPlaying={engine.isPlaying}
                onTogglePlayPause={engine.isPlaying ? engine.pause : engine.play}
                speed={engine.speed / 500}
                onSpeedChange={(s) => engine.setSpeed(s * 500)}
                disabled={steps.length === 0}
                showShortcuts={true}
                onStepForward={engine.stepForward}
                onStepBackward={engine.stepBackward}
                onReset={reset}
                progressText={`Step ${engine.currentStep + 1} of ${steps.length}`}
              />
            </div>
          )}
        </div>

        <div ref={statusRef} className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Conversion Status</h2>
          {visualState.operation && (
            <div className="mb-4 p-3 rounded-lg bg-[#a435f0]/10 dark:bg-[#a435f0]/20 text-[#a435f0] border border-[#a435f0]/20">
              <span className="font-semibold uppercase text-xs tracking-wider mr-2">Status:</span>
              {visualState.operation}
            </div>
          )}
          {visualState.message && (
            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-primary-dark dark:text-blue-200">
              <p className="font-medium text-center">{visualState.message}</p>
            </div>
          )}
          {postfix && engine.currentStep === steps.length - 1 && (
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 200 }} className="mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 text-center">
              <div className="font-bold uppercase text-xs tracking-widest mb-1">Final Postfix Result</div>
              <div className="text-3xl font-bold font-mono">{postfix}</div>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Stack (Operators)
            </h2>
            <div className="flex flex-col items-center min-h-[300px]">
              <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">{visualState.stack.length > 0 ? "↑ Top" : ""}</div>
              <div className="w-32 relative">
                <AnimatePresence>
                  {visualState.stack.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl italic">
                      Stack is empty
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {visualState.stack.map((item, i) => (
                        <AnimatedStackItem key={`${i}-${item}`} char={item} isTop={i === visualState.stack.length - 1} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{visualState.stack.length > 0 ? "↓ Bottom" : ""}</div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
              Output
            </h2>
            <div className="min-h-[300px] p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="flex flex-wrap gap-3 justify-center">
                <AnimatePresence>
                  {visualState.output.length === 0 ? (
                    <div className="text-gray-400 italic w-full text-center py-12">Output will appear here</div>
                  ) : (
                    visualState.output.map((c, i) => <AnimatedOutputToken key={`${i}-${c}`} char={c} />)
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {steps.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-neutral-950 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-6">
            <h2 className="text-xl font-semibold mb-4">Conversion Steps</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-neutral-950"><tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Step</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Character</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                </tr></thead>
                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {steps.map((step, idx) => (
                    <motion.tr key={idx} onClick={() => { engine.pause(); while(engine.currentStep !== idx) { if (engine.currentStep < idx) engine.stepForward(); else engine.stepBackward(); } }} className={`cursor-pointer ${engine.currentStep === idx ? "bg-blue-50 dark:bg-neutral-950" : "hover:bg-gray-50 dark:hover:bg-neutral-950"}`}
                               whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{idx + 1}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{step.action}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-mono">{step.char || "-"}</td>
                      <td className="px-4 py-2 text-sm">{step.description}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default InfixToPostfixVisualizer;
