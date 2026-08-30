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



export default function DecisionTreesPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Applications", "Decision Trees")}
      title="Decision Trees"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.decisionTrees}
          description="Mark Decision Trees as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Tree Applications"
          links={[
            { text: "Heap Sort", description: "Efficient sorting algorithm based on binary heap.", url: "./heapsort" },
            { text: "Huffman Coding", description: "Data compression using Huffman Trees.", url: "./huffman" },
            { text: "Syntax Trees", description: "Abstract Syntax Trees in compilers.", url: "./syntax-trees" },
          ]}
          columns="3"
        />
      }
    />
  );
}
