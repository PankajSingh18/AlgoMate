/**
 * Pure generator function for Doubly Linked List operations.
 * Yields frames representing the operation state.
 */

export function generateMemoryAddress() {
  return '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0');
}

export function* insertDoublyGenerator(currentList, inputValue, generateId) {
  if (!inputValue) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  yield { type: 'start' };

  const newNode = {
    value: inputValue,
    id: generateId(),
    address: generateMemoryAddress(),
    next: null,
    prev: currentList.length > 0 ? currentList[currentList.length - 1].address : null
  };

  let nextList;
  if (currentList.length > 0) {
    nextList = [...currentList];
    nextList[nextList.length - 1].next = newNode.address;
    nextList.push(newNode);
  } else {
    nextList = [newNode];
  }

  yield { type: 'complete', list: nextList, newNode };
}
