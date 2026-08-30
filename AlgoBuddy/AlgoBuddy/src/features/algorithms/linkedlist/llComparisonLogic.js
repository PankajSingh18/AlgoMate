export function* compareListsGenerator(list1, list2) {
  if (list1.length === 0 || list2.length === 0) {
    yield { type: 'error', message: 'Both lists must be generated.' };
    return;
  }

  yield {
      phase: 'start',
      list1Index: -1,
      list2Index: -1,
      explanation: "Starting comparison. We will traverse both lists simultaneously."
  };

  const maxLength = Math.max(list1.length, list2.length);
  let areSame = true;

  for (let i = 0; i < maxLength; i++) {
    const node1 = list1[i];
    const node2 = list2[i];

    // Yield the current pointers for highlighting
    yield {
      phase: 'compare',
      list1Index: node1 ? i : -1,
      list2Index: node2 ? i : -1,
      explanation: `Comparing nodes at index ${i}...`
    };

    if (!node1 || !node2 || node1.value !== node2.value) {
      areSame = false;
      let reason = "";
      if (!node1) reason = "List 1 is shorter than List 2.";
      else if (!node2) reason = "List 2 is shorter than List 1.";
      else reason = `Value "${node1.value}" does not match "${node2.value}".`;

      yield {
        phase: 'complete',
        match: false,
        list1Index: node1 ? i : -1,
        list2Index: node2 ? i : -1,
        explanation: `Mismatch found at index ${i}! ${reason}`
      };
      return;
    }
    
    yield {
      phase: 'matched',
      list1Index: i,
      list2Index: i,
      explanation: `Nodes at index ${i} match (value: "${node1.value}"). Moving to the next nodes.`
    };
  }

  if (areSame) {
    yield {
        phase: 'complete',
        match: true,
        list1Index: -1,
        list2Index: -1,
        explanation: "All nodes match. The linked lists are identical!"
    };
  }
}
