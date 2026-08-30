import Animation from "@/app/visualizer/queue/types/deque/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/types/deque/content";
import Quiz from "@/app/visualizer/queue/types/deque/quiz";
import Code from "@/app/visualizer/queue/types/deque/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Double Ended")}
      title="Double Ended"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.doubleEnded}
          description="Mark Double Ended Queue as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Types"
          links={[
            { text: "Single Ended Queue", url: "./singleEnded" },
            { text: "Circular Queue", url: "./circular" },
            { text: "Multiple Queue", url: "./multiple" },
            { text: "Priority Queue", url: "./priority" },
          ]}
        />
      }
    />
  );
}
