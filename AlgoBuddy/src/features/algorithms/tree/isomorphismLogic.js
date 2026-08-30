/**
 * Pure generator logic for Tree Isomorphism.
 * Decoupled from React UI.
 * @returns {Array} sequence of state frames
 */
export function generateIsomorphismSteps() {
  const seq = [
    { msg: "Comparing Root Nodes (1, 1). They match.", pair: ["1-1", "2-1"], status: "match" },
    { msg: "Comparing Left(1) with Left(2): (2, 3). Mismatch. Trying swapped...", pair: ["1-2", "2-3"], status: "mismatch" },
    { msg: "Comparing Left(1) with Right(2): (2, 2). Match! Swapped children confirmed.", pair: ["1-2", "2-2"], status: "match" },
    { msg: "Comparing Right(1) with Left(2): (3, 3). Match!", pair: ["1-3", "2-3"], status: "match" },
    { msg: "Comparing Left(2) with Left(5): (4, 5). Mismatch. Trying swapped...", pair: ["1-4", "2-5"], status: "mismatch" },
    { msg: "Comparing Left(2) with Right(4): (4, 4). Match! Swapped children confirmed.", pair: ["1-4", "2-4"], status: "match" },
    { msg: "Comparing Right(2) with Left(5): (5, 5). Match!", pair: ["1-5", "2-5"], status: "match" },
  ];

  const newSteps = [];
  let currentMatchStatus = {};

  for (const curr of seq) {
    currentMatchStatus = { ...currentMatchStatus, [`${curr.pair[0]}_${curr.pair[1]}`]: curr.status };
    newSteps.push({
      activePairs: curr.pair,
      matchStatus: currentMatchStatus,
      message: curr.msg,
      isomorphicResult: null
    });
  }
  
  // Add completion step
  newSteps.push({
    activePairs: [],
    matchStatus: currentMatchStatus,
    message: "Complete! The trees are isomorphic.",
    isomorphicResult: true
  });

  return newSteps;
}
