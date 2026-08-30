"use client";
import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ALGORITHMS, REFERENCE_CURVES, generatePoints } from "@/features/algorithms/complexity/complexityVisualizerLogic";

const N_STEPS = 50;

export default function ComplexityVisualizer() {
  const [selectedAlgo, setSelectedAlgo] = useState("Bubble Sort");
  const [maxN, setMaxN] = useState(500);
  const [showReferences, setShowReferences] = useState(true);

  const nValues = useMemo(() => {
    return Array.from({ length: N_STEPS }, (_, i) =>
      Math.round(((i + 1) / N_STEPS) * maxN)
    );
  }, [maxN]);

  const algo = ALGORITHMS[selectedAlgo];

  const chartData = useMemo(() => {
    return nValues.map((n) => {
      const point = { n };
      point[selectedAlgo] = Math.round(algo.getOps(n));
      if (showReferences) {
        REFERENCE_CURVES.forEach((ref) => {
          point[ref.label] = Math.round(ref.getOps(n));
        });
      }
      return point;
    });
  }, [nValues, selectedAlgo, algo, showReferences]);

  return (
    <div className="bg-gray-900 rounded-2xl p-6 space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-400">Algorithm</label>
          <select
            value={selectedAlgo}
            onChange={(e) => setSelectedAlgo(e.target.value)}
            className="bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.keys(ALGORITHMS).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-48">
          <label className="text-sm text-gray-400">
            Input size n = <span className="text-white font-semibold">{maxN}</span>
          </label>
          <input
            type="range"
            min={50} max={5000} step={50}
            value={maxN}
            onChange={(e) => setMaxN(Number(e.target.value))}
            className="accent-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="refs"
            checked={showReferences}
            onChange={(e) => setShowReferences(e.target.checked)}
            className="accent-indigo-500 w-4 h-4"
          />
          <label htmlFor="refs" className="text-sm text-gray-400">
            Show reference curves
          </label>
        </div>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-3">
        <span className="text-gray-300 font-medium">{selectedAlgo}</span>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: algo.color + "33", color: algo.color, border: `1px solid ${algo.color}` }}
        >
          {algo.complexity}
        </span>
        <span className="text-gray-400 text-sm">
          at n={maxN}: ~{Math.round(algo.getOps(maxN)).toLocaleString()} ops
        </span>
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="n"
              stroke="#9ca3af"
              label={{ value: "Input size (n)", position: "insideBottom", offset: -2, fill: "#9ca3af" }}
            />
            <YAxis
              stroke="#9ca3af"
              tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
              labelStyle={{ color: "#e5e7eb" }}
              formatter={(val, name) => [val.toLocaleString() + " ops", name]}
              labelFormatter={(n) => `n = ${n}`}
            />
            <Legend wrapperStyle={{ paddingTop: "16px" }} />

            {/* Selected algorithm — thick line */}
            <Line
              type="monotone"
              dataKey={selectedAlgo}
              stroke={algo.color}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />

            {/* Reference curves — thin dashed */}
            {showReferences && REFERENCE_CURVES.map((ref) => (
              <Line
                key={ref.label}
                type="monotone"
                dataKey={ref.label}
                stroke={ref.color}
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
                opacity={0.5}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}