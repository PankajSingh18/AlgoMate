"use client";
import React, { useState } from "react";

const BellmanFordVisualizer = () => {
  const [source, setSource] = useState(0);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [hasNegativeCycle, setHasNegativeCycle] = useState(false);

  const nodes = 5;
  const edges = [
    { u: 0, v: 1, w: -1 },
    { u: 0, v: 2, w: 4 },
    { u: 1, v: 2, w: 3 },
    { u: 1, v: 3, w: 2 },
    { u: 1, v: 4, w: 2 },
    { u: 3, v: 2, w: 5 },
    { u: 3, v: 1, w: 1 },
    { u: 4, v: 3, w: -3 },
  ];

  const positions = [
    { x: 100, y: 180 },
    { x: 250, y: 80 },
    { x: 400, y: 180 },
    { x: 350, y: 300 },
    { x: 200, y: 300 },
  ];

  const bellmanFord = () => {
    const dist = new Array(nodes).fill(Infinity);
    dist[source] = 0;
    const allSteps = [{ dist: [...dist], edge: null }];

    for (let i = 0; i < nodes - 1; i++) {
      for (let edge of edges) {
        if (dist[edge.u] !== Infinity && dist[edge.u] + edge.w < dist[edge.v]) {
          dist[edge.v] = dist[edge.u] + edge.w;
          allSteps.push({ dist: [...dist], edge });
        }
      }
    }

    let negativeCycle = false;
    for (let edge of edges) {
      if (dist[edge.u] !== Infinity && dist[edge.u] + edge.w < dist[edge.v]) {
        negativeCycle = true;
        break;
      }
    }

    setHasNegativeCycle(negativeCycle);
    setSteps(allSteps);
    setCurrentStep(0);
  };

  const currentDist = currentStep >= 0 ? steps[currentStep]?.dist : null;
  const currentEdge = currentStep >= 0 ? steps[currentStep]?.edge : null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Bellman-Ford Algorithm</h1>
      <p className="text-gray-500 mb-6">Shortest Path with Negative Edge Weights</p>

      <div className="flex items-center gap-4 mb-6">
        <label className="font-medium">Source Node:</label>
        <select
          value={source}
          onChange={(e) => setSource(Number(e.target.value))}
          className="border rounded-lg px-3 py-1"
        >
          {Array.from({ length: nodes }, (_, i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6 border">
        <svg width="500" height="380">
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6"
              refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#888" />
            </marker>
            <marker id="arrow-active" markerWidth="6" markerHeight="6"
              refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#7c3aed" />
            </marker>
          </defs>

          {edges.map((edge, i) => {
            const isActive = currentEdge &&
              currentEdge.u === edge.u && currentEdge.v === edge.v;
            const mx = (positions[edge.u].x + positions[edge.v].x) / 2;
            const my = (positions[edge.u].y + positions[edge.v].y) / 2;
            return (
              <g key={i}>
                <line
                  x1={positions[edge.u].x} y1={positions[edge.u].y}
                  x2={positions[edge.v].x} y2={positions[edge.v].y}
                  stroke={isActive ? "#7c3aed" : "#888"}
                  strokeWidth={isActive ? 3 : 1.5}
                  markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
                />
                <text x={mx} y={my - 6} textAnchor="middle"
                  fontSize="12" fill={isActive ? "#7c3aed" : "#555"}
                  fontWeight={isActive ? "bold" : "normal"}>
                  {edge.w}
                </text>
              </g>
            );
          })}

          {positions.map((pos, i) => (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r="26"
                fill={i === source ? "#ede9fe" : "#f3f4f6"}
                stroke={i === source ? "#7c3aed" : "#9ca3af"}
                strokeWidth="2" />
              <text x={pos.x} y={pos.y - 4} textAnchor="middle"
                fontSize="13" fontWeight="bold" fill="#1f2937">{i}</text>
              <text x={pos.x} y={pos.y + 12} textAnchor="middle"
                fontSize="11" fill="#6d28d9">
                {currentDist ? (currentDist[i] === Infinity ? "∞" : currentDist[i]) : "∞"}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {hasNegativeCycle && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          ⚠️ Negative Cycle Detected!
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <button onClick={bellmanFord}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
          Run Bellman-Ford
        </button>
        {currentStep >= 0 && currentStep < steps.length - 1 && (
          <button onClick={() => setCurrentStep(s => s + 1)}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
            Next Step
          </button>
        )}
        <button onClick={() => { setSteps([]); setCurrentStep(-1); setHasNegativeCycle(false); }}
          className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500">
          Reset
        </button>
      </div>

      {currentDist && (
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold text-lg mb-3">Distance Table</h2>
          <div className="flex flex-wrap gap-3">
            {currentDist.map((d, i) => (
              <div key={i} className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-lg text-center">
                <div className="text-xs text-gray-500">Node {i}</div>
                <div className="font-bold text-purple-700">{d === Infinity ? "∞" : d}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BellmanFordVisualizer;