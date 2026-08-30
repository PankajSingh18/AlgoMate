/**
 * Pure generator logic for Singly Linked List operations.
 */

const generateMemoryAddress = () => {
  return '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
};

export function* addNodeGenerator(currentList, inputValue, nodeIdCounter) {
  if (!inputValue) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  // Step 0
  yield { type: 'step', step: 0, message: 'Creating a new node in memory.' };
  
  // Step 1
  yield { type: 'step', step: 1, message: 'Storing the input value in the node.' };
  
  // Step 2
  yield { type: 'step', step: 2, message: 'Linking the previous node to the new node.' };

  // Step 3 (Complete)
  const newNode = {
    value: inputValue,
    id: nodeIdCounter,
    address: generateMemoryAddress(),
    next: null
  };

  let nextList;
  if (currentList.length > 0) {
    const updatedList = [...currentList];
    updatedList[updatedList.length - 1].next = newNode.address;
    nextList = [...updatedList, newNode];
  } else {
    nextList = [newNode];
  }

  yield { 
    type: 'complete', 
    step: 3, 
    message: 'Node added successfully.', 
    list: nextList,
    newNodeId: newNode.id
  };
}
