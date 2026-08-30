import Animation from "@/app/visualizer/array/heapsort/animation";
import Content from "@/app/visualizer/array/heapsort/content";
import Code from "@/app/visualizer/array/heapsort/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import TrackVisit from "@/app/components/ui/TrackVisit";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <>
      <TrackVisit name="Heap Sort" path="/visualizer/array/heapsort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Heap Sort")}
        title="Heap Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.heapSort} description="Mark Heap Sort as done and track your progress" initialDone={false} />}
        exploreOther={
          <ExploreOther
            title="Explore Sorting Algorithms"
            links={[
              { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
              { text: "Selection Sort", url: "/visualizer/array/selectionsort" },
              { text: "Insertion Sort", url: "/visualizer/array/insertionsort" },
              { text: "Merge Sort", url: "/visualizer/array/mergesort" },
              { text: "Quick Sort", url: "/visualizer/array/quicksort" },
              { text: "Counting Sort", url: "/visualizer/array/countingsort" },
              { text: "Comparison Mode", url: "/visualizer/array/comparison" },
            ]}
          />
        }
      />
    </>
  );
}