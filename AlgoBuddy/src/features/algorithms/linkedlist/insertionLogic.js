export function generateAddress() {
  return `0x${Math.floor(Math.random() * 0x10000)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0")}`;
}

export function* insertionGenerator(currentList, inputValue) {
  if (!inputValue) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  const newNode = {
    value: inputValue,
    id: Date.now(),
    address: generateAddress(),
    next: "NULL",
  };

  // Step 1: Create new node
  yield {
    list: [...currentList],
    newNode: newNode,
    phase: 'create',
    explanation: `Created a new node with value "${inputValue}".`
  };

  // Step 2: Traverse to the end (if list is not empty)
  if (currentList.length > 0) {
    for (let i = 0; i < currentList.length; i++) {
      yield {
        list: [...currentList],
        newNode: newNode,
        phase: 'traverse',
        currentNodeIndex: i,
        explanation: `Traversing... currently at node with value "${currentList[i].value}".`
      };
    }
  }

  // Step 3: Link and append
  let nextList;
  if (currentList.length > 0) {
    nextList = [...currentList];
    nextList[nextList.length - 1] = { ...nextList[nextList.length - 1], next: newNode.address };
    yield {
      list: [...nextList],
      newNode: newNode,
      phase: 'link',
      currentNodeIndex: nextList.length - 1,
      explanation: `Updated the "next" pointer of the last node to point to the new node's address (${newNode.address}).`
    };
    nextList.push(newNode);
  } else {
    nextList = [newNode];
  }

  // Step 4: Final state
  yield {
    list: nextList,
    newNode: null,
    phase: 'complete',
    currentNodeIndex: -1,
    explanation: `Successfully appended node with value "${inputValue}" to the linked list.`
  };
}
