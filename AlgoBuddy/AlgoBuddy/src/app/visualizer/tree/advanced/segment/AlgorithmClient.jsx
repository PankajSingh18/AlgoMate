import SegmentAnimation from "@/app/visualizer/tree/advanced/segment/animation";
import SegmentContent from "@/app/visualizer/tree/advanced/segment/content";
import SegmentCode from "@/app/visualizer/tree/advanced/segment/codeBlock";
import SegmentQuiz from "@/app/visualizer/tree/advanced/segment/quiz";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function SegmentTreePage() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Advanced Trees", "Segment Trees")}
      title="Segment Trees"
      animation={<SegmentAnimation />}
      content={<SegmentContent />}
      code={<SegmentCode />}
      quiz={<SegmentQuiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.segmentTree}
          description="Mark Segment Tree as done and track your progress"
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
            { text: "Fenwick Trees", url: "./fenwick" }
          ]}
        />
      }
    />
  );
}
