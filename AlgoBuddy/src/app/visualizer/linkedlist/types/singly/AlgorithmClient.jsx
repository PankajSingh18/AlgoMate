import Animation from "@/app/visualizer/linkedlist/types/singly/animation";
import Content from "@/app/visualizer/linkedlist/types/singly/content";
import Quiz from "@/app/visualizer/linkedlist/types/singly/quiz";
import CodeBlock from "@/app/visualizer/linkedlist/types/singly/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Singly Linked List")}
      title="Singly Linked List"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Doubly Linked List", url: "./doubly" },
            { text: "Circular Linked List", url: "./circular" },
          ]}
        />
      }
    />
  );
}
