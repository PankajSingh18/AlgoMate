import DsuAnimation from "@/app/visualizer/tree/advanced/dsu/animation";
import DsuContent from "@/app/visualizer/tree/advanced/dsu/content";
import DsuCode from "@/app/visualizer/tree/advanced/dsu/codeBlock";
import DsuQuiz from "@/app/visualizer/tree/advanced/dsu/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function DsuPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Disjoint Set Union (DSU)")}
      title="Disjoint Set Union (DSU / Union-Find)"
      animation={<DsuAnimation />}
      content={<DsuContent />}
      code={<DsuCode />}
      quiz={<DsuQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.dsu}
          description="Mark Disjoint Set Union (DSU) as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "Red-Black Trees", url: "./red-black" },
            { text: "B-Trees", url: "./b-trees" },
            { text: "Trie (Prefix Tree)", url: "./trie" },
            { text: "Segment Trees", url: "./segment" },
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
