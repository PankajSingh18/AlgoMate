import BTreeAnimation from "@/app/visualizer/tree/advanced/b-trees/animation";
import BTreeContent from "@/app/visualizer/tree/advanced/b-trees/content";
import BTreeCode from "@/app/visualizer/tree/advanced/b-trees/codeBlock";
import BTreeQuiz from "@/app/visualizer/tree/advanced/b-trees/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function BTreePage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "B-Tree")}
      title="B-Tree"
      animation={<BTreeAnimation />}
      content={<BTreeContent />}
      code={<BTreeCode />}
      quiz={<BTreeQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.bTree}
          description="Mark B-Tree as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
            { text: "Red-Black Trees", url: "./red-black" },
            { text: "Trie (Prefix Tree)", url: "./trie" },
            { text: "Segment Trees", url: "./segment" },
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
