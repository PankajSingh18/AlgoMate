// src/app/components/debugger/VisualDebugger.jsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

export function VisualDebugger({ code: initialCode = '', language = 'javascript' }) {
  const [code, setCode] = useState(initialCode);
  const [sessionId, setSessionId] = useState(null);
  const [currentLine, setCurrentLine] = useState(0);
  const [variables, setVariables] = useState({});
  const [callStack, setCallStack] = useState([]);
  const [isPaused, setIsPaused] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [executionTime, setExecutionTime] = useState(0);
  const [breakpoints, setBreakpoints] = useState([]);
  const [history, setHistory] = useState([]);
  const [visualization, setVisualization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const editorRef = useRef(null);
  const playInterval = useRef(null);

  // Start debugging
  const startDebugging = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, breakpoints }),
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.data.sessionId);
        updateState(data.data.state);
        await fetchVisualization(data.data.sessionId);
      }
    } catch (error) {
      console.error('Debug start error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step forward
  const stepForward = async () => {
    if (!sessionId || isComplete) return;

    const response = await fetch('/api/debug/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, direction: 'forward' }),
    });

    const data = await response.json();
    if (data.success) {
      updateState(data.data);
      await fetchVisualization(sessionId);
    }
  };

  // Step backward
  const stepBackward = async () => {
    if (!sessionId || history.length < 2) return;

    const response = await fetch('/api/debug/step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, direction: 'backward' }),
    });

    const data = await response.json();
    if (data.success) {
      updateState(data.data);
      await fetchVisualization(sessionId);
    }
  };

  // Fetch visualization
  const fetchVisualization = async (id) => {
    const response = await fetch(`/api/debug/visualize?sessionId=${id}`);
    const data = await response.json();
    if (data.success) {
      setVisualization(data.data);
    }
  };

  // Update state
  const updateState = (state) => {
    setCurrentLine(state.currentLine);
    setVariables(state.variables);
    setCallStack(state.callStack);
    setIsPaused(state.isPaused);
    setIsComplete(state.isComplete);
    setExecutionTime(state.executionTime);
    setBreakpoints(state.breakpoints);
    setHistory(state.history || []);
  };

  // Toggle play
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playInterval.current) {
        clearInterval(playInterval.current);
        playInterval.current = null;
      }
    } else {
      setIsPlaying(true);
      playInterval.current = setInterval(() => {
        stepForward();
      }, 500 / speed);
    }
  };

  // Update speed
  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
    if (isPlaying) {
      if (playInterval.current) {
        clearInterval(playInterval.current);
      }
      playInterval.current = setInterval(() => {
        stepForward();
      }, 500 / newSpeed);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (playInterval.current) {
        clearInterval(playInterval.current);
      }
    };
  }, []);

  // Render visualization
  const renderVisualization = () => {
    if (!visualization) {
      return <div className="text-gray-500 text-center py-8">No data to visualize yet</div>;
    }

    switch (visualization.type) {
      case 'array':
        return (
          <div className="flex flex-wrap gap-2 p-4">
            {visualization.data.map((item, index) => (
              <div
                key={index}
                className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-3 min-w-[60px] text-center"
              >
                <div className="text-xs text-gray-400">{index}</div>
                <div className="font-mono text-sm">{String(item)}</div>
              </div>
            ))}
          </div>
        );
      
      case 'object':
        return (
          <div className="space-y-2 p-4">
            {Object.entries(visualization.variables || {}).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-medium text-blue-400">{key}:</span>
                <span className="font-mono text-sm">{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div className="text-gray-500">Unknown visualization type</div>;
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Controls */}
      <div className="flex items-center gap-2 p-4 bg-gray-800 rounded-lg">
        <button
          onClick={startDebugging}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Starting...' : '🐛 Start Debugging'}
        </button>

        <button
          onClick={stepForward}
          disabled={!sessionId || isComplete || isPlaying}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          ▶ Step Forward
        </button>

        <button
          onClick={stepBackward}
          disabled={!sessionId || history.length < 2 || isPlaying}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          ◀ Step Backward
        </button>

        <button
          onClick={togglePlay}
          disabled={!sessionId || isComplete}
          className={`px-4 py-2 rounded text-white ${
            isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-purple-500 hover:bg-purple-600'
          } disabled:opacity-50`}
        >
          {isPlaying ? '⏹ Stop' : '▶ Play'}
        </button>

        <div className="flex items-center gap-2 ml-4">
          <span className="text-sm text-gray-400">Speed:</span>
          <input
            type="range"
            min="1"
            max="5"
            value={speed}
            onChange={handleSpeedChange}
            className="w-24"
          />
          <span className="text-sm text-gray-400">{speed}x</span>
        </div>

        {executionTime > 0 && (
          <span className="text-sm text-gray-400 ml-4">
            Time: {executionTime}ms
          </span>
        )}
      </div>

      {/* Main area */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-[400px]">
        {/* Code Editor */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
            }}
          />
        </div>

        {/* Visualization Panel */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-sm font-semibold">Visualization</h3>
            </div>
            <div className="flex-1 overflow-auto">
              {renderVisualization()}
            </div>
          </div>
        </div>
      </div>

      {/* Variables and Call Stack */}
      <div className="grid grid-cols-2 gap-4">
        {/* Variables Panel */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Variables</h3>
          <div className="space-y-1">
            {Object.entries(variables).map(([name, data]) => (
              <div key={name} className="flex items-center gap-2 text-sm">
                <span className="text-blue-400">{name}</span>
                <span className="text-gray-500">=</span>
                <span className="font-mono text-green-400">
                  {data.value !== undefined ? String(data.value) : 'undefined'}
                </span>
                <span className="text-xs text-gray-500">({data.type || 'unknown'})</span>
              </div>
            ))}
            {Object.keys(variables).length === 0 && (
              <div className="text-sm text-gray-500">No variables</div>
            )}
          </div>
        </div>

        {/* Call Stack */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Call Stack</h3>
          <div className="space-y-1">
            {callStack.map((frame, index) => (
              <div key={index} className="text-sm text-gray-400">
                {frame}
              </div>
            ))}
            {callStack.length === 0 && (
              <div className="text-sm text-gray-500">Call stack is empty</div>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-gray-800 rounded-lg p-2 text-sm text-gray-400 flex justify-between">
        <span>
          {isComplete ? '✅ Execution complete' : isPaused ? '⏸ Paused' : '▶ Running'}
        </span>
        <span>Line: {currentLine}</span>
        <span>Breakpoints: {breakpoints.length}</span>
        <span>Steps: {history.length}</span>
      </div>
    </div>
  );
}