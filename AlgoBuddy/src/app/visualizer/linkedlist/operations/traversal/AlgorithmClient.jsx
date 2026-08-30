import Animation from "@/app/visualizer/linkedlist/operations/traversal/animation";
import Content from "@/app/visualizer/linkedlist/operations/traversal/content";
import Quiz from "@/app/visualizer/linkedlist/operations/traversal/quiz";
import CodeBlock from "@/app/visualizer/linkedlist/operations/traversal/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Traversal")}
      title="Traversal"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Insertion", url: "./insertion" },
            { text: "Deletion", url: "./deletion" },
            { text: "Compare", url: "./comparison" },
            { text: "Merge", url: "./merge" },
            { text: "Searching", url: "./search" },
            { text: "Reverse", url: "./reverse" },
          ]}
        />
      }
    />
  );
}
