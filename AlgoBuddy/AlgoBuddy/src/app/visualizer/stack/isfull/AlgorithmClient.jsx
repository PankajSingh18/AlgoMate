import Animation from "@/app/visualizer/stack/isfull/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/isfull/content";
import Quiz from "@/app/visualizer/stack/isfull/quiz";
import Code from "@/app/visualizer/stack/isfull/codeBlock";
import ModuleCard from "@/app/components/ui/ModuleCard";
import ExploreOther from "@/app/components/ui/exploreOther";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Is Full")}
      title="IsFull Operation"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.isFull}
          description="Mark Stack : isFull as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Peek", url: "/visualizer/stack/peek" },
            { text: "Is Empty", url: "/visualizer/stack/isempty" },
            { text: "Push Pop", url: "/visualizer/stack/push-pop" },
          ]}
        />
      }
    />
  );
}
