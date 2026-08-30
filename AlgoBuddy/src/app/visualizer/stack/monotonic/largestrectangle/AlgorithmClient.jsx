import Animation from "@/app/visualizer/stack/monotonic/largestrectangle/animation";
import ArticleActions from "@/app/components/ui/ArticleActions";
import Content from "@/app/visualizer/stack/monotonic/largestrectangle/content";
import Quiz from "@/app/visualizer/stack/monotonic/largestrectangle/quiz";
import Code from "@/app/visualizer/stack/monotonic/largestrectangle/codeBlock";
import ExploreOther from "@/app/components/ui/exploreOther";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Stack", "Largest Rectangle in Histogram")}
      title="Largest Rectangle in Histogram"
      headerActions={<ArticleActions />}
      animation={<Animation />}
      content={<Content />}
      code={<Code />}
      quiz={<Quiz />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.monotonicStack}
          description="Mark Largest Rectangle in Histogram as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[
            { text: "Push & Pop", url: "/visualizer/stack/push-pop" },
            { text: "Peek", url: "/visualizer/stack/peek" },
            { text: "Is Empty", url: "/visualizer/stack/isempty" },
          ]}
        />
      }
    />
  );
}
