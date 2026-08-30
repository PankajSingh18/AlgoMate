import Animation from "@/app/visualizer/stack/push-pop/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/push-pop/content";
import Quiz from "@/app/visualizer/stack/push-pop/quiz";
import Code from "@/app/visualizer/stack/push-pop/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Push & Pop")}
      title="Push & Pop"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.pushPop}
          description="Mark Stack : Push & Pop as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Peek", url: "/visualizer/stack/peek" },
            { text: "Is Empty", url: "/visualizer/stack/isempty" },
            { text: "Is Full", url: "/visualizer/stack/isfull" },
          ]}
        />
      }
    />
  );
}
