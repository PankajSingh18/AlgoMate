import Content from "./content";
import CodeBlock from "./codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Tree", "Structure & Properties")}
      title="Binary Tree Structure & Properties"
      content={<Content />}
      code={<CodeBlock />}
      exploreOther={
        <ExploreOther
          title="Explore other tree modules"
          links={[
            { text: "Types of Binary Trees", url: "/visualizer/tree/binaryTree/types" },
            { text: "BST Insertion", url: "/visualizer/tree/bst/insertion" },
            { text: "In-order Traversal", url: "/visualizer/tree/traversing/in-order" },
            { text: "Morris Traversal", url: "/visualizer/tree/traversing/morris" },
          ]}
        />
      }
    />
  );
}
