import Animation from "./animation";
import Code from "./codeblock";
import Quiz from "./quiz";
import Content from "./content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Two Pointers")}
      title="Two Pointers Technique"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.twoPointers}
          description="Mark Two Pointers as done and view it in your progress"
          initialDone={false}
        />
      }
    />
  );
}
