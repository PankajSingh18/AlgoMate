/**
 * Pure generator logic for finding the Diameter of a Tree.
 * Decoupled from React UI.
 * @returns {Array} sequence of state events for visualization
 */
export function generateDiameterSteps() {
  const seq = [
    {
      msg: "Computing heights of leaves (F, G, I, C)...",
      nodes: ["F", "G", "I", "C"],
      heights: { F: 1, G: 1, I: 1, C: 1 },
      maxD: 0,
    },
    {
      msg: "Computing heights of H and D...",
      nodes: ["H", "D"],
      heights: { F: 1, G: 1, I: 1, C: 1, H: 2, D: 2 },
      maxD: 2,
    },
    {
      msg: "Computing height of E...",
      nodes: ["E"],
      heights: { F: 1, G: 1, I: 1, C: 1, H: 2, D: 2, E: 3 },
      maxD: 2,
    },
    {
      msg: "Computing height of B... updating Max Diameter!",
      nodes: ["B"],
      heights: { F: 1, G: 1, I: 1, C: 1, H: 2, D: 2, E: 3, B: 4 },
      maxD: 5,
    },
    {
      msg: "Computing height of Root A...",
      nodes: ["A"],
      heights: { F: 1, G: 1, I: 1, C: 1, H: 2, D: 2, E: 3, B: 4, A: 5 },
      maxD: 5,
    },
  ];

  const finalMaxDiameter = 5;
  const finalDiameterNodes = ["F", "D", "B", "E", "H", "I"];
  const finalDiameterEdges = ["D-F", "B-D", "B-E", "E-H", "H-I"];

  const newSteps = [];

  for (const curr of seq) {
    newSteps.push({
      activeNodes: curr.nodes,
      calculatedHeights: curr.heights,
      maxDiameter: curr.maxD,
      message: curr.msg,
      diameterPathEdges: [],
      diameterPathNodes: [],
    });
  }

  newSteps.push({
    activeNodes: [],
    calculatedHeights: seq[seq.length - 1].heights,
    maxDiameter: finalMaxDiameter,
    message: `Complete! The maximum diameter is ${finalMaxDiameter}. (Highlighted path)`,
    diameterPathEdges: finalDiameterEdges,
    diameterPathNodes: finalDiameterNodes,
  });

  return newSteps;
}
