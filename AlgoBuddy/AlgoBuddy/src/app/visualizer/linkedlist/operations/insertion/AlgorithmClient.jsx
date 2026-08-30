import Animation from "@/app/visualizer/linkedlist/operations/insertion/animation";
import Content from "@/app/visualizer/linkedlist/operations/insertion/content";
import Quiz from "@/app/visualizer/linkedlist/operations/insertion/quiz";
import CodeBlock from "@/app/visualizer/linkedlist/operations/insertion/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Insertion")}
      title="Insertion"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Traversal", url: "./traversal" },
            { text: "Deletion", url: "./deletion" },
            { text: "Searching", url: "./search" },
            { text: "Merging", url: "./merge" },
            { text: "Comparison", url: "./comparison" },
            { text: "Reverse", url: "./reverse" },
          ]}
        />
      }
    />
  );
}
