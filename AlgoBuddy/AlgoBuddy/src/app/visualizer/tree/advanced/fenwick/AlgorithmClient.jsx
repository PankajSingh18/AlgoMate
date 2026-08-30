import FenwickAnimation from "@/app/visualizer/tree/advanced/fenwick/animation";
import FenwickContent from "@/app/visualizer/tree/advanced/fenwick/content";
import FenwickCode from "@/app/visualizer/tree/advanced/fenwick/codeBlock";
import FenwickQuiz from "@/app/visualizer/tree/advanced/fenwick/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function FenwickTreePage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Fenwick Trees")}
      title="Fenwick Trees"
      animation={<FenwickAnimation />}
      content={<FenwickContent />}
      code={<FenwickCode />}
      quiz={<FenwickQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.fenwickTree}
          description="Mark Fenwick Tree as done and track your progress"
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
            { text: "Segment Trees", url: "./segment" }
          ]}
        />
      }
    />
  );
}
