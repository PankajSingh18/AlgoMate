import Animation from "@/app/visualizer/tree/advanced/trie/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/tree/advanced/trie/content";
import Quiz from "@/app/visualizer/tree/advanced/trie/quiz";
import Code from "@/app/visualizer/tree/advanced/trie/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Trie (Prefix Tree)")}
      title="Trie (Prefix Tree)"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz mode="insertion" />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.trie}
          description="Mark Trie : Prefix Tree as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other Trees"
          links={[
            { text: "Binary Search Tree", url: "/visualizer/tree/bst/insertion" },
            { text: "Red Black Tree", url: "/visualizer/tree/advanced/red-black" },
          ]}
        />
      }
    />
  );
}
