import Animation from "@/app/visualizer/linkedlist/types/circular/animation";
import Content from "@/app/visualizer/linkedlist/types/circular/content";
import Quiz from "@/app/visualizer/linkedlist/types/circular/quiz";
import CodeBlock from "@/app/visualizer/linkedlist/types/circular/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Linked List", "Circular Linked List")}
      title="Circular Linked List"
      animation={<Animation />}
      content={<Content />}
      code={<CodeBlock />}
      quiz={<Quiz />}
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Singly Linked List", url: "./singly" },
            { text: "Doubly Linked List", url: "./doubly" },
          ]}
        />
      }
    />
  );
}
