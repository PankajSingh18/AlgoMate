import Animation from "./animation";
import Content from "./content";
import CodeBlock from "./codeBlock";
import Quiz from "./quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function HeapPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Applications", "Heap")}
      title="Heap Visualizer"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.heapVisualizer}
          description="Mark Heap Visualizer as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Applications"
          links={[
            { text: "Heap Sort", description: "Use heap structure to sort arrays efficiently.", url: "/visualizer/tree/applications/heapsort" },
            { text: "Huffman Coding", description: "Tree-based lossless compression strategy.", url: "/visualizer/tree/applications/huffman" },
            { text: "Decision Trees", description: "Decision boundaries and classification logic.", url: "/visualizer/tree/applications/decision-trees" },
          ]}
          columns="3"
        />
      }
    />
  );
}
