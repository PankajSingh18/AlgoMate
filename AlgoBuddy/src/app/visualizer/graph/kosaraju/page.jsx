"use client";
import React, { useState } from "react";

const KosarajuVisualizer = () => {
  const [nodes, setNodes] = useState(6);
  const [edges, setEdges] = useState([
    [0, 1], [1, 2], [2, 0], [1, 3], [3, 4], [4, 5], [5, 3]
  ]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [sccs, setSccs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const kosaraju = () => {
    const visited = new Array(nodes).fill(false);
    const stack = [];
    const result = [];

    const dfs1 = (v) => {
      visited[v] = true;
      for (let [u, w] of edges) {
        if (u === v && !visited[w]) dfs1(w);
      }
      stack.push(v);
    };

    const dfs2 = (v, component, transposed) => {
      visited[v] = true;
      component.push(v);
      for (let [u, w] of transposed) {
        if (u === v && !visited[w]) dfs2(w, component, transposed);
      }
    };

    for (let i = 0; i < nodes; i++) {
      if (!visited[i]) dfs1(i);
    }

    const transposed = edges.map(([u, v]) => [v, u]);
    visited.fill(false);
    const newSteps = [];

    while (stack.length) {
      const v = stack.pop();
      if (!visited[v]) {
        const component = [];
        dfs2(v, component, transposed);
        result.push(component);
        newSteps.push([...component]);
      }
    }

    setSccs(result);
    setSteps(newSteps);
    setCurrentStep(0);
  };

  const colors = [
    "bg-purple-200", "bg-teal-200", "bg-pink-200",
    "bg-yellow-200", "bg-blue-200", "bg-green-200"
  ];

  const getNodeColor = () => {
    if (currentStep < 0) return {};
    const colorMap = {};
    sccs.slice(0, currentStep + 1).forEach((scc, i) => {
      scc.forEach(node => { colorMap[node] = colors[i % colors.length]; });
    });
    return colorMap;
  };

  const nodeColors = getNodeColor();

  const positions = [
    { x: 200, y: 80 }, { x: 350, y: 80 }, { x: 275, y: 200 },
    { x: 500, y: 80 }, { x: 575, y: 200 }, { x: 500, y: 300 }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Kosaraju's Algorithm</h1>
      <p className="text-gray-500 mb-6">Strongly Connected Components Visualizer</p>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border">
        <svg width="700" height="350">
          {edges.map(([u, v], i) => (
            <g key={i}>
              <defs>
                <marker id={`arrow-${i}`} markerWidth="6" markerHeight="6"
                  refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill="#888" />
                </marker>
              </defs>
              <line
                x1={positions[u].x} y1={positions[u].y}
                x2={positions[v].x} y2={positions[v].y}
                stroke="#888" strokeWidth="2"
                markerEnd={`url(#arrow-${i})`}
              />
            </g>
          ))}
          {positions.map((pos, i) => (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r="24"
                fill={nodeColors[i] ? nodeColors[i].replace("bg-", "").replace("-200", "") : "#e5e7eb"}
                stroke="#6d28d9" strokeWidth="2" />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle"
                fontSize="14" fontWeight="bold" fill="#1f2937">{i}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex gap-3 mb-6">
        <button onClick={kosaraju}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
          Run Kosaraju
        </button>
        {currentStep >= 0 && currentStep < steps.length - 1 && (
          <button onClick={() => setCurrentStep(s => s + 1)}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
            Next SCC
          </button>
        )}
        <button onClick={() => { setSteps([]); setCurrentStep(-1); setSccs([]); }}
          className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500">
          Reset
        </button>
      </div>

      {sccs.length > 0 && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold text-lg mb-3">Strongly Connected Components</h2>
          <div className="flex flex-wrap gap-3">
            {sccs.slice(0, currentStep + 1).map((scc, i) => (
              <div key={i} className={`${colors[i % colors.length]} px-4 py-2 rounded-lg`}>
                <span className="font-medium">SCC {i + 1}:</span> {"{" + scc.join(", ") + "}"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KosarajuVisualizer;