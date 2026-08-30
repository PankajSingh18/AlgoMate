import Animation from "@/app/visualizer/array/quicksort/animation";
import Content from "@/app/visualizer/array/quicksort/content";
import Code from "@/app/visualizer/array/quicksort/codeBlock";
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
      <TrackVisit name="Quick Sort" path="/visualizer/array/quicksort" category="Sorting" />
      <VisualizerPageLayout
        paths={createVisualizerPaths("Array", "Quick Sort")}
        title="Quick Sort"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        moduleCard={<ModuleCard moduleId={MODULE_MAPS.quickSort} description="Mark Quick Sort as done and track your progress" initialDone={false} />}
        exploreOther={
          <ExploreOther
            title="Explore Sorting Algorithms"
            links={[
              { text: "Bubble Sort", url: "/visualizer/array/bubblesort" },
              { text: "Selection Sort", url: "/visualizer/array/selectionsort" },
              { text: "Insertion Sort", url: "/visualizer/array/insertionsort" },
              { text: "Merge Sort", url: "/visualizer/array/mergesort" },
              { text: "Comparison Mode", url: "/visualizer/array/comparison" },
              { text: "Counting Sort", url: "/visualizer/array/countingsort" },
              { text: "Heap Sort", url: "/visualizer/array/heapsort" },
            ]}
          />
        }
      />
    </>
  );
}