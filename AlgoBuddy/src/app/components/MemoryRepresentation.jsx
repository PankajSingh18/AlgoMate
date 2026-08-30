"use client";

import { useState } from "react";

const structures = {
  Array: ["10", "20", "30", "40", "50"],

  "Linked List": ["Node 1", "Node 2", "Node 3"],

  Stack: ["Top", "30", "20", "10"],

  Queue: ["Front", "10", "20", "30", "Rear"],

  Tree: ["Root", "Left Child", "Right Child"],

  HashMap: [
    "Bucket 0 → Empty",
    "Bucket 1 → Key: A",
    "Bucket 2 → Key: B",
    "Bucket 3 → Empty",
  ],
};

export default function MemoryRepresentation() {
  const [selected, setSelected] = useState("Array");

  return (
    <div className="p-6">
      
      <h1 className="text-3xl font-bold text-center mb-6">
        Data Structure Memory Representation
      </h1>

      {/* Structure Selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {Object.keys(structures).map((item) => (
          <button
            key={item}
            onClick={() => setSelected(item)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selected === item
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Memory Visualization */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-lg">

        <h2 className="text-xl font-semibold mb-4">
          {selected} Memory Layout
        </h2>

        <div className="flex flex-wrap gap-4 justify-center">
          {structures[selected].map((value, index) => (
            <div
              key={index}
              className="
                min-w-[100px]
                p-4
                border-2
                border-blue-500
                rounded-lg
                bg-white
                dark:bg-gray-900
                text-center
                shadow-md
                hover:scale-105
                transition
              "
            >
              <p className="text-sm text-gray-500">
                Address {index}
              </p>

              <p className="font-bold mt-2">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2">
            Memory Explanation
          </h3>

          <p>
            This view demonstrates how the {selected} data structure stores
            data internally in memory. The representation updates dynamically
            when a different data structure is selected.
          </p>
        </div>

      </div>
    </div>
  );
}