/**
 * Pure generator logic for Tree Serialization and Deserialization
 * Decoupled from React UI.
 * @param {Array} sequence - The flat representation sequence of the tree
 * @returns {Object} object containing serializeSteps and deserializeSteps
 */

export function generateSerializationSteps(sequence) {
  const newSteps = [];
  
  for (let step = 0; step < sequence.length; step++) {
    let msg = "";
    if (sequence[step].type === "node") {
      msg = `Visiting Node ${sequence[step].val}. Appending to string.`;
    } else {
      msg = `Visiting Null child of Node ${sequence[step].parent}. Appending 'N'.`;
    }
    
    newSteps.push({
      activeStep: step,
      message: msg,
      serializedArray: sequence.slice(0, step + 1).map(s => s.val || "N"),
      builtNodes: [],
      builtEdges: []
    });
  }
  
  newSteps.push({
    activeStep: -1,
    message: "Serialization Complete! Click 'Deserialize' to reconstruct the tree from the string.",
    serializedArray: sequence.map(s => s.val || "N"),
    builtNodes: [],
    builtEdges: []
  });

  return newSteps;
}

export function generateDeserializationSteps(sequence) {
  const newSteps = [];
  let bNodes = [];
  let bEdges = [];

  for (let step = 0; step < sequence.length; step++) {
    let msg = "";
    if (sequence[step].type === "node") {
      msg = `Reading '${sequence[step].val}'. Creating Node ${sequence[step].val}.`;
      bNodes = [...bNodes, sequence[step].id];
      if (sequence[step].parent) {
        bEdges = [...bEdges, `${sequence[step].parent}-${sequence[step].id}`];
      }
    } else {
      msg = `Reading 'N'. Returning null to parent ${sequence[step].parent}.`;
    }

    newSteps.push({
      activeStep: step,
      message: msg,
      serializedArray: sequence.map(s => s.val || "N"), 
      builtNodes: [...bNodes],
      builtEdges: [...bEdges]
    });
  }

  newSteps.push({
    activeStep: -1,
    message: "Deserialization Complete! The tree has been reconstructed.",
    serializedArray: sequence.map(s => s.val || "N"),
    builtNodes: [...bNodes],
    builtEdges: [...bEdges]
  });

  return newSteps;
}
