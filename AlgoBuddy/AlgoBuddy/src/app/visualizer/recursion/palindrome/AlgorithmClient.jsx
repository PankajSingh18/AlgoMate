import PalindromeAnimation from "@/app/visualizer/recursion/palindrome/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/palindrome/codeBlock";
import Quiz from "@/app/visualizer/recursion/palindrome/quiz";
import Content from "@/app/visualizer/recursion/palindrome/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Functional & Parameterized Recursion")}
      title="Functional & Parameterized Recursion"
      headerDescription="Observe how recursion checks if a string is a palindrome by comparing characters from outside inward."
      headerActions={<ArticleActions />}
      animation={<PalindromeAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionPalindrome}
          description="Mark Palindrome Check as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Reverse an Array", url: "/visualizer/recursion/reverse-array" },
            { text: "Print 1 to N", url: "/visualizer/recursion/print-1-to-n" },
            { text: "Print all Subsequences", url: "/visualizer/recursion/subsequences" }
          ]}
        />
      }
    />
  );
}
