/**
 * Pure generator functions for Stack data structure operations.
 * Yields frames representing the state of the operation.
 */

export function* pushGenerator(currentStack, value, limit) {
  if (limit && currentStack.length >= limit) {
    yield { type: 'error', message: `Stack Overflow! Cannot push. top (${currentStack.length - 1}) >= size - 1 (${limit - 1})` };
    return;
  }
  if (!value || (typeof value === 'string' && !value.trim())) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  yield { type: 'start', operation: `Pushing "${value}"...` };
  
  const nextStack = [value, ...currentStack];
  
  yield { type: 'complete', stack: nextStack, message: `"${value}" pushed to stack` };
}

export function* popGenerator(currentStack) {
  if (currentStack.length === 0) {
    yield { type: 'error', message: 'Stack is empty!' };
    return;
  }

  const poppedValue = currentStack[0];
  yield { type: 'start', operation: `Popping "${poppedValue}"...` };

  const nextStack = currentStack.slice(1);
  
  yield { type: 'complete', stack: nextStack, message: `"${poppedValue}" popped from stack` };
}

export function* peekGenerator(currentStack) {
  if (currentStack.length === 0) {
    yield { type: 'error', message: 'Stack is empty!' };
    return;
  }

  const topValue = currentStack[0];
  yield { type: 'start', operation: `Peeking at "${topValue}"` };

  yield { type: 'complete', stack: currentStack, message: `Top element is "${topValue}"` };
}
