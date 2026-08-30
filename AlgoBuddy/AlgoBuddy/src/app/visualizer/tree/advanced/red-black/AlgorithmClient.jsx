import RedBlackAnimation from "@/app/visualizer/tree/advanced/red-black/animation";
import RedBlackContent from "@/app/visualizer/tree/advanced/red-black/content";
import RedBlackCode from "@/app/visualizer/tree/advanced/red-black/codeBlock";
import RedBlackQuiz from "@/app/visualizer/tree/advanced/red-black/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function RedBlackPage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Red-Black Tree")}
      title="Red-Black Tree"
      animation={<RedBlackAnimation />}
      content={<RedBlackContent />}
      code={<RedBlackCode />}
      quiz={<RedBlackQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.redBlackTree}
          description="Mark Red-Black Tree as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Advanced Trees"
          links={[
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
