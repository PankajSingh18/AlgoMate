/**
 * Pure generator functions for Stack IsFull operation.
 * Yields frames representing the state of the operation.
 */

export function* checkFullGenerator(stack, capacity) {
  if (capacity === null) {
    yield { type: 'error', message: 'Please set a capacity first!' };
    return;
  }
  
  yield { type: 'start', operation: 'Checking if stack is full…' };
  
  const full = stack.length >= capacity;
  
  yield { 
    type: 'complete', 
    isFull: full, 
    message: full ? 'Stack is full!' : 'Stack is not full' 
  };
}

export function* pushGenerator(currentStack, value, capacity) {
  if (capacity && currentStack.length >= capacity) {
    yield { type: 'error', message: `Stack Overflow! Cannot push. top (${currentStack.length - 1}) >= size - 1 (${capacity - 1})` };
    return;
  }
  
  const val = typeof value === 'string' ? value.trim() : value;
  if (!val) {
    yield { type: 'error', message: 'Please enter a value to push' };
    return;
  }

  yield { type: 'start', operation: `Pushing "${val}"…` };
  
  const nextStack = [val, ...currentStack];
  
  yield { type: 'complete', stack: nextStack, message: `"${val}" pushed to stack!` };
}

export function* popGenerator(currentStack) {
  if (currentStack.length === 0) {
    yield { type: 'error', message: 'Stack is empty!', isFull: false };
    return;
  }

  const val = currentStack[0];
  yield { type: 'start', operation: `Popping "${val}"…` };

  const nextStack = currentStack.slice(1);
  
  yield { type: 'complete', stack: nextStack, message: `"${val}" popped from stack!` };
}

export function* peekGenerator(currentStack) {
  if (currentStack.length === 0) {
    yield { type: 'error', message: 'Stack is empty!', isFull: false };
    return;
  }

  const val = currentStack[0];
  yield { type: 'start', operation: 'Peeking at top element…', peekedItem: val };
  
  yield { type: 'complete', message: `Top element is "${val}"` };
}
