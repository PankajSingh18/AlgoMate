

import ClientVisualizer from "./ClientVisualizer";


export const metadata = {
  title: "A* Search | Step-by-Step Animation",
  description:
    "Visualize A* Search with heuristic-driven pathfinding, open and closed sets, and shortest-path reconstruction.",
  keywords: [
    "A* Search Visualizer",
    "A Star Search Visualization",
    "A* Pathfinding",
    "Heuristic Search",
    "Grid Pathfinding",
    "Optimal Path Search",
    "Admissible Heuristic",
    "AI Algorithms",
  ],
  robots: "index, follow",
};

export default function Page() {
  return <ClientVisualizer />;
}
