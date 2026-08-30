export function* enqueueFrontGenerator(currentDeque, value) {
  if (!value) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }
  yield { 
      phase: 'start', 
      action: 'enqueue_front', 
      deque: [...currentDeque],
      newValue: value,
      explanation: `Enqueuing "${value}" at the front of the deque...` 
  };
  
  yield { 
      phase: 'complete', 
      action: 'enqueue_front', 
      deque: [{ id: Date.now(), value: value }, ...currentDeque], 
      newValue: null,
      explanation: `"${value}" added to the front.` 
  };
}

export function* enqueueRearGenerator(currentDeque, value) {
  if (!value) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }
  yield { 
      phase: 'start', 
      action: 'enqueue_rear', 
      deque: [...currentDeque],
      newValue: value,
      explanation: `Enqueuing "${value}" at the rear of the deque...` 
  };
  
  yield { 
      phase: 'complete', 
      action: 'enqueue_rear', 
      deque: [...currentDeque, { id: Date.now(), value: value }], 
      newValue: null,
      explanation: `"${value}" added to the rear.` 
  };
}

export function* dequeueFrontGenerator(currentDeque) {
  if (currentDeque.length === 0) {
    yield { type: 'error', message: 'Deque is empty!' };
    return;
  }
  const frontNode = currentDeque[0];
  yield { 
      phase: 'start', 
      action: 'dequeue_front', 
      deque: [...currentDeque],
      dequeuedNode: frontNode,
      explanation: `Dequeuing "${frontNode.value}" from the front...` 
  };
  
  yield { 
      phase: 'complete', 
      action: 'dequeue_front', 
      deque: currentDeque.slice(1), 
      dequeuedNode: null,
      explanation: `"${frontNode.value}" removed from the front.` 
  };
}

export function* dequeueRearGenerator(currentDeque) {
  if (currentDeque.length === 0) {
    yield { type: 'error', message: 'Deque is empty!' };
    return;
  }
  const rearNode = currentDeque[currentDeque.length - 1];
  yield { 
      phase: 'start', 
      action: 'dequeue_rear', 
      deque: [...currentDeque],
      dequeuedNode: rearNode,
      explanation: `Dequeuing "${rearNode.value}" from the rear...` 
  };
  
  yield { 
      phase: 'complete', 
      action: 'dequeue_rear', 
      deque: currentDeque.slice(0, -1), 
      dequeuedNode: null,
      explanation: `"${rearNode.value}" removed from the rear.` 
  };
}
