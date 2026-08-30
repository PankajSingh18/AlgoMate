import Animation from "@/app/visualizer/queue/operations/peek-front/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/operations/peek-front/content";
import Quiz from "@/app/visualizer/queue/operations/peek-front/quiz";
import Code from "@/app/visualizer/queue/operations/peek-front/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Peek Front")}
      title="Peek Front"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.peekFront}
          description="Mark queue : Peek Front as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Enqueue & Dequeue", url: "./enqueue-dequeue" },
            { text: "Is Full", url: "./isfull" },
            { text: "Is Empty", url: "./isempty" },
          ]}
        />
      }
    />
  );
}
