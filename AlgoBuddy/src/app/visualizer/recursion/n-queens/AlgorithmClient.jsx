import NQueensAnimation from "@/app/visualizer/recursion/n-queens/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/n-queens/codeBlock";
import Quiz from "@/app/visualizer/recursion/n-queens/quiz";
import Content from "@/app/visualizer/recursion/n-queens/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Backtracking")}
      title="Backtracking"
      headerDescription="Visualize the classic N-Queens puzzle recursively. Watch the algorithm place queens on a chessboard, backtrack upon conflicts, and find all safe placements."
      headerActions={<ArticleActions />}
      animation={<NQueensAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionNQueens}
          description="Mark N-Queens Placement as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Print all Subsequences", url: "/visualizer/recursion/subsequences" },
            { text: "Fibonacci (Multiple Calls)", url: "/visualizer/recursion/fibonacci" },
            { text: "String Palindrome Check", url: "/visualizer/recursion/palindrome" }
          ]}
        />
      }
    />
  );
}
