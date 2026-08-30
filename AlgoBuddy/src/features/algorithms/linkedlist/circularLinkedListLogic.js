/**
 * Pure generator logic for Circular Linked List operations.
 */

// Generate random memory addresses
const generateMemoryAddress = () => {
  return '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
};

export function* addNodeGenerator(currentList, inputValue, nodeIdCounter) {
  if (!inputValue) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  yield { type: 'start' };

  const newNode = {
    value: inputValue,
    id: nodeIdCounter,
    address: generateMemoryAddress(),
  };

  let nextList;
  if (currentList.length === 0) {
    newNode.next = newNode.address;
    nextList = [newNode];
  } else {
    const updatedList = [...currentList];
    newNode.next = updatedList[0].address;
    updatedList[updatedList.length - 1].next = newNode.address;
    nextList = [...updatedList, newNode];
  }

  yield { type: 'complete', list: nextList, newNodeId: newNode.id };
}
