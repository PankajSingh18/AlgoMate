import Print1ToNAnimation from "@/app/visualizer/recursion/print-1-to-n/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/recursion/print-1-to-n/codeBlock";
import Quiz from "@/app/visualizer/recursion/print-1-to-n/quiz";
import Content from "@/app/visualizer/recursion/print-1-to-n/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Recursion", "Basic Recursion")}
      title="Basic Recursion"
      headerDescription="Understand the absolute basics of recursion by pushing frames onto the stack to count up from 1 to N."
      headerActions={<ArticleActions />}
      animation={<Print1ToNAnimation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.recursionPrint1ToN}
          description="Mark Print 1 to N as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[
            { text: "Print N to 1", url: "/visualizer/recursion/print-n-to-1" },
            { text: "Sum of First N Numbers", url: "/visualizer/recursion/sum-of-n" },
            { text: "Factorial of N", url: "/visualizer/recursion/factorial" }
          ]}
        />
      }
    />
  );
}
