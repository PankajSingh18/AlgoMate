// src/app/components/websocket/WebSocketExecutor.jsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { ExecutionClient } from '@/lib/websocket/execution-client';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
];

const DEFAULT_CODE = {
  javascript: 'console.log("Hello, World!");',
  python: 'print("Hello, World!")',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}',
};

export function WebSocketExecutor({ token }) {
  const [client, setClient] = useState(null);
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [language, setLanguage] = useState('javascript');
  const [isConnected, setIsConnected] = useState(false);
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionId, setExecutionId] = useState(null);
  const [input, setInput] = useState('');
  const [waitingForInput, setWaitingForInput] = useState(false);
  const outputEndRef = useRef(null);

  useEffect(() => {
    const executionClient = new ExecutionClient();
    setClient(executionClient);

    executionClient.connect(token)
      .then(() => {
        setIsConnected(true);
        console.log('✅ Connected to execution server');
      })
      .catch((error) => {
        console.error('Failed to connect:', error);
        setIsConnected(false);
      });

    // Setup event handlers
    executionClient.on('output', (data) => {
      setOutput(prev => [...prev, {
        type: data.type || 'stdout',
        content: data.content,
        timestamp: data.timestamp,
      }]);
      scrollToBottom();
    });

    executionClient.on('input-required', (data) => {
      setWaitingForInput(true);
      setOutput(prev => [...prev, {
        type: 'input-prompt',
        content: data.prompt,
        timestamp: data.timestamp,
      }]);
      scrollToBottom();
    });

    executionClient.on('execution-completed', (data) => {
      setIsRunning(false);
      setOutput(prev => [...prev, {
        type: 'system',
        content: `✅ Execution completed (${data.executionTime}ms)`,
        timestamp: data.timestamp,
      }]);
      scrollToBottom();
    });

    executionClient.on('error', (data) => {
      setIsRunning(false);
      setOutput(prev => [...prev, {
        type: 'error',
        content: `❌ ${data.message}`,
        timestamp: data.timestamp,
      }]);
      scrollToBottom();
    });

    return () => {
      executionClient.disconnect();
    };
  }, [token]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (outputEndRef.current) {
        outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleExecute = async () => {
    if (!client || !isConnected) return;

    setIsRunning(true);
    setOutput([]);

    try {
      const result = await client.execute(code, language);
      setExecutionId(result.executionId);
    } catch (error) {
      setOutput(prev => [...prev, {
        type: 'error',
        content: `❌ Failed to start execution: ${error.message}`,
      }]);
      setIsRunning(false);
    }
  };

  const handleSendInput = () => {
    if (!client || !executionId || !input.trim()) return;

    client.sendInput(executionId, input);
    setOutput(prev => [...prev, {
      type: 'input',
      content: `⌨️ ${input}`,
      timestamp: new Date().toISOString(),
    }]);
    setInput('');
    setWaitingForInput(false);
    scrollToBottom();
  };

  const handleStop = () => {
    if (!client || !executionId) return;
    client.stop(executionId);
    setOutput(prev => [...prev, {
      type: 'system',
      content: '⏹️ Execution stopped by user',
      timestamp: new Date().toISOString(),
    }]);
    setIsRunning(false);
    scrollToBottom();
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput([]);
  };

  const clearOutput = () => {
    setOutput([]);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearOutput}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear Output
            </button>
            {isRunning && (
              <button
                onClick={handleStop}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                ⏹ Stop
              </button>
            )}
          </div>
        </div>

        {/* Editor Controls */}
        <div className="flex gap-4 mb-4">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 border rounded-md"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleExecute}
            disabled={!isConnected || isRunning}
            className={`px-4 py-2 rounded text-white ${
              isConnected && !isRunning
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isRunning ? '⏳ Running...' : '▶ Run Code'}
          </button>
        </div>

        {/* Code Editor */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-48 p-3 font-mono text-sm border rounded-md resize-none"
          spellCheck={false}
          disabled={isRunning}
        />

        {/* Output Terminal */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">📟 Terminal Output</h3>
          <div className="bg-gray-900 rounded-md p-3 h-64 overflow-y-auto font-mono text-sm">
            {output.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                Run your code to see output
              </div>
            ) : (
              output.map((line, idx) => (
                <div
                  key={idx}
                  className={`py-0.5 ${
                    line.type === 'error' ? 'text-red-400' :
                    line.type === 'input-prompt' ? 'text-yellow-400' :
                    line.type === 'system' ? 'text-blue-400' :
                    line.type === 'input' ? 'text-green-400' :
                    'text-gray-200'
                  }`}
                >
                  {line.type === 'input' ? (
                    <span className="text-gray-500 mr-2">⌨️</span>
                  ) : line.type === 'input-prompt' ? (
                    <span className="text-gray-500 mr-2">❓</span>
                  ) : null}
                  {line.content}
                </div>
              ))
            )}
            <div ref={outputEndRef} />
          </div>
        </div>

        {/* Input Section */}
        {(waitingForInput || (isRunning && output.some(o => o.type === 'input-prompt'))) && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendInput()}
              placeholder="Enter input..."
              className="flex-1 px-3 py-2 border rounded-md"
              autoFocus
            />
            <button
              onClick={handleSendInput}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}