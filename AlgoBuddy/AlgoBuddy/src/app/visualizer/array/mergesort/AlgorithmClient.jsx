import Animation from "@/app/visualizer/array/mergesort/animation";
import Content from "@/app/visualizer/array/mergesort/content";
import Code from "@/app/visualizer/array/mergesort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <>
      <TrackVisit name="Merge Sort" path="/visualizer/array/mergesort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Merge Sort")}
        title="Merge Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.mergeSort} description="Mark Merge Sort as done and track your progress" initialDone={false} />}
        exploreOther={<ExploreOther title="Explore Sorting Algorithms" links={[
          { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
          { text: "Selection Sort", url: "/visualizer/array/selectionsort" },
          { text: "Insertion Sort", url: "/visualizer/array/insertionsort" },
          { text: "Quick Sort", url: "/visualizer/array/quicksort" },
          { text: "Comparison Mode", url: "/visualizer/array/comparison" },
          { text: "Counting Sort", url: "/visualizer/array/countingsort" },
          { text: "Heap Sort", url: "/visualizer/array/heapsort" },
        ]} />}
      />
    </>
  );
}
