"use client";
import AuthGuard from "./AuthGuard";
import Animation from "./animation";
import ExploreOther from "@/app/components/ui/exploreOther";
import Code from "./codeBlock";
import Quiz from "./quiz";
import Content from "./content";
import ModuleCard from "@/app/components/ui/ModuleCard";
import VisualizerPageLayout, { createVisualizerPaths } from "@/app/visualizer/components/VisualizerPageLayout";
import { MODULE_MAPS } from "@/lib/modulesMap";

export default function ClientVisualizer() {
  return (
    <AuthGuard>
      <VisualizerPageLayout
        paths={createVisualizerPaths("AI Algorithms", "A* Search")}
        title="A* Search"
        animation={<Animation />}
        content={<Content />}
        code={<Code />}
        quiz={<Quiz />}
        moduleCard={
          <ModuleCard
            moduleId={MODULE_MAPS.astar}
            description="Mark A* Search as done and view it in your progress"
            initialDone={false}
          />
        }
        exploreOther={
          <ExploreOther
            title="Explore other topics"
            links={[{ text: "Monte Carlo Tree Search (MCTS)", url: "/visualizer/ai/mcts" }]}
          />
        }
      />
    </AuthGuard>
  );
}
