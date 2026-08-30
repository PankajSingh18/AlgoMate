import LinearSearchAnimation from "@/app/visualizer/array/linearsearch/animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "@/app/visualizer/array/linearsearch/codeBlock";
import Content from "@/app/visualizer/array/linearsearch/content";
import ArticleActions from "@/app/components/ui/ArticleActions";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, {
  createVisualizerPaths,
} from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";



export default function Page() {
  return (
    <VisualizerPageLayout
      paths={createVisualizerPaths("Array", "Linear Search")}
      title="Linear Search"
      headerActions={<ArticleActions />}
      animation={<LinearSearchAnimation />}
      content={<Content />}
      code={<Code />}
      moduleCard={
        <ModuleCard
          moduleId={MODULE_MAPS.linearSearch}
          description="Mark linear search as done and track your progress"
          initialDone={false}
        />
      }
      exploreOther={
        <ExploreOther
          title="Explore other operations"
          links={[{ text: "Binary Search", url: "./binarysearch" }]}
        />
      }
    />
  );
}
