import Animation from "@/app/visualizer/queue/operations/isfull/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/queue/operations/isfull/content";
import Quiz from "@/app/visualizer/queue/operations/isfull/quiz";
import Code from "@/app/visualizer/queue/operations/isfull/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Queue", "Is Full")}
      title="IsFull"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.queueIsFull}
          description="Mark queue : isFull as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore Other Operations"
          links={[
            { text: "Peek Front", url: "./peek-front" },
            { text: "Enqueue & Dequeue", url: "./enqueue-dequeue" },
            { text: "Is Empty", url: "./isempty" },
          ]}
        />
      }
    />
  );
}
