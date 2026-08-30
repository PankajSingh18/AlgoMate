import Animation from "@/app/visualizer/ai/alpha-beta-pruning/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/ai/alpha-beta-pruning/codeBlock";
import Quiz from "@/app/visualizer/ai/alpha-beta-pruning/quiz";
import Content from "@/app/visualizer/ai/alpha-beta-pruning/content";
import TrackVisit from "@/app/components/ui/TrackVisit";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <>
    <TrackVisit
        name="Alpha Beta Pruning"
        path="/visualizer/ai/alphabeta"
        category="AI Algorithms"
      />
    <VisualizerPageLayout
      paths={createVisualizerPaths("AI Algorithms", "Alpha Beta Pruning")}
      title="Alpha Beta Pruning"
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.alphaBeta}
          description="Mark alpha beta pruning as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other topics"
          links={[{ text: "Min Max Algorithm", url: "/visualizer/ai/minmax" }]}
        />
      }
    />
    </>
  );
}
