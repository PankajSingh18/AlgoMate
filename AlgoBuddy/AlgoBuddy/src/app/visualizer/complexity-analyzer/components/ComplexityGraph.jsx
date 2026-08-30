"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  "O(1)": "#22c55e",
  "O(log n)": "#06b6d4",
  "O(n)": "#3b82f6",
  "O(n log n)": "#a855f7",
  "O(n²)": "#f97316",
  "O(n³)": "#ef4444",
  "O(2ⁿ)": "#ec4899",
};

export default function ComplexityGraph({
  data,
  selectedComplexities,
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
      
      <div className="mb-5">
        <h2 className="text-xl font-black text-neutral-900 dark:text-white">
          Complexity Growth Curves
        </h2>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
          Compare how algorithm efficiency changes as input size grows.
        </p>
      </div>

      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#404040"
              opacity={0.15}
            />

            <XAxis
              dataKey="n"
              stroke="#737373"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#737373"
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                border: "1px solid #404040",
                borderRadius: "16px",
                color: "#ffffff",
              }}
            />

            {selectedComplexities.map((complexity) => (
              <Line
                key={complexity}
                type="monotone"
                dataKey={complexity}
                stroke={COLORS[complexity]}
                strokeWidth={3}
                dot={false}
              />
            ))}

          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}