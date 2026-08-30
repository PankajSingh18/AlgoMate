import Animation from "@/app/visualizer/linkedlist/operations/sorting/animation";
import Content from "@/app/visualizer/linkedlist/operations/sorting/content";
import Quiz from "@/app/visualizer/linkedlist/operations/sorting/quiz";
import CodeBlock from "@/app/visualizer/linkedlist/operations/sorting/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Sorting")}
      title="Sorting"
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
            { text: "Traversal", url: "./traversal" },
            { text: "Comparison", url: "./comparison" },
            { text: "Searching", url: "./search" },
            { text: "Merging", url: "./merge" },
            { text: "Reverse", url: "./reverse" },
          ]}
        />
      }
    />
  );
}