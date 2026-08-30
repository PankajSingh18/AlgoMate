export function* reverseGenerator(list) {
  if (list.length === 0) return;

  const nodes = list.map((node) => ({ ...node }));
  let prevIndex = -1;
  let currentIndex = 0;
  let nextIndex = currentIndex < nodes.length - 1 ? currentIndex + 1 : -1;

  yield {
    phase: 'start',
    prevIndex,
    currentIndex,
    nextIndex,
    list: [...nodes],
    explanation: 'Starting reversal. Pointers initialized: prev = NULL, current = head, next = head.next.'
  };

  while (currentIndex !== -1) {
    yield {
      phase: 'step_pointers',
      prevIndex,
      currentIndex,
      nextIndex,
      list: [...nodes],
      explanation: `Current node is ${nodes[currentIndex].value}. We will change its next pointer to point to the previous node.`
    };

    const nextAddress = prevIndex === -1 ? "NULL" : nodes[prevIndex].address;
    nodes[currentIndex] = { ...nodes[currentIndex], next: nextAddress };

    yield {
      phase: 'step_update_link',
      prevIndex,
      currentIndex,
      nextIndex,
      list: [...nodes],
      explanation: `Updated ${nodes[currentIndex].value}'s next pointer to ${nextAddress}.`
    };

    prevIndex = currentIndex;
    currentIndex = nextIndex;
    nextIndex = currentIndex !== -1 && currentIndex < nodes.length - 1 ? currentIndex + 1 : -1;
    
    if (currentIndex !== -1) {
        yield {
          phase: 'advance',
          prevIndex,
          currentIndex,
          nextIndex,
          list: [...nodes],
          explanation: `Advanced pointers. Prev is now ${nodes[prevIndex].value}, Current is ${nodes[currentIndex].value}.`
        };
    }
  }

  // Reverse the physical array to show the new head
  const reversedNodes = [...nodes].reverse();

  yield {
    phase: 'complete',
    prevIndex: -1,
    currentIndex: -1,
    nextIndex: -1,
    list: reversedNodes,
    explanation: 'Reversal complete! The list has been successfully reversed.'
  };
}
