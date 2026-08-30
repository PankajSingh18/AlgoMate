import Animation from "@/app/visualizer/queue/operations/enqueue-dequeue/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/operations/enqueue-dequeue/content";
import Quiz from "@/app/visualizer/queue/operations/enqueue-dequeue/quiz";
import Code from "@/app/visualizer/queue/operations/enqueue-dequeue/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Enqueue & Dequeue")}
      title="Enqueue & Dequeue"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.enqueueDequeue}
          description="Mark queue : enqueue & dequeue as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Peek Front", url: "./peek-front" },
            { text: "Is Empty", url: "./isempty" },
            { text: "Is Full", url: "./isfull" },
          ]}
        />
      }
    />
  );
}
