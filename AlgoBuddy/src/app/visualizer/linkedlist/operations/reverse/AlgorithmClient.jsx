import Animation from "@/app/visualizer/linkedlist/operations/reverse/animation";
import Content from "@/app/visualizer/linkedlist/operations/reverse/content";
import Quiz from "@/app/visualizer/linkedlist/operations/reverse/quiz";
import CodeBlock from "@/app/visualizer/linkedlist/operations/reverse/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Reverse")}
      title="Reverse"
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
          ]}
        />
      }
    />
  );
}
