import React from "react";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import ComparisonClient from "./ComparisonClient";
import ExploreOther from "@/app/components/ui/exploreOther";



export default function ComparisonPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Comparison Mode")}
      title="Sorting Comparison Mode"
      headerDescription="Select two sorting algorithms to run synchronously side-by-side on the identical dataset, and inspect their performance characteristics in real time."
      animation={<ComparisonClient />}
      exploreOther={
        <ExploreOther
          title="Explore Individual Sorting Algorithms"
          links={[
            { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
            { text: "Selection Sort", url: "/visualizer/array/selectionsort" },
            { text: "Insertion Sort", url: "/visualizer/array/insertionsort" },
            { text: "Merge Sort", url: "/visualizer/array/mergesort" },
            { text: "Quick Sort", url: "/visualizer/array/quicksort" },
            { text: "Heap Sort", url: "/visualizer/array/heapsort" },
          ]}
        />
      }
    />
  );
}
