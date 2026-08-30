export function* enqueueRearGenerator(currentQueue, value) {
  const val = typeof value === 'string' ? value.trim() : value;
  if (!val) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  yield { 
      phase: 'start', 
      action: 'enqueue',
      queue: [...currentQueue],
      newValue: val,
      explanation: `Enqueuing "${val}" at rear...` 
  };
  
  const nextQueue = [...currentQueue, { id: Date.now(), value: val }];
  
  yield { 
      phase: 'complete', 
      action: 'enqueue',
      queue: nextQueue, 
      newValue: null,
      explanation: `"${val}" added to rear.` 
  };
}

export function* dequeueFrontGenerator(currentQueue) {
  if (currentQueue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!' };
    return;
  }

  const dequeuedNode = currentQueue[0];
  yield { 
      phase: 'start', 
      action: 'dequeue',
      queue: [...currentQueue],
      dequeuedNode: dequeuedNode,
      explanation: `Dequeuing "${dequeuedNode.value}" from front...` 
  };

  const nextQueue = currentQueue.slice(1);
  
  yield { 
      phase: 'complete', 
      action: 'dequeue',
      queue: nextQueue, 
      dequeuedNode: null,
      explanation: `"${dequeuedNode.value}" removed from front.` 
  };
}

export function* peekFrontGenerator(queue) {
  if (queue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!' };
    return;
  }

  const peekedNode = queue[0];
  yield { 
      phase: 'start', 
      action: 'peek_front',
      queue: [...queue],
      peekedNode: peekedNode,
      explanation: `Peeking at front element...` 
  };
  
  yield { 
      phase: 'complete', 
      action: 'peek_front',
      queue: [...queue],
      peekedNode: null,
      explanation: `Front element: "${peekedNode.value}"` 
  };
}

export function* peekRearGenerator(queue) {
  if (queue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!' };
    return;
  }

  const peekedNode = queue[queue.length - 1];
  yield { 
      phase: 'start', 
      action: 'peek_rear',
      queue: [...queue],
      peekedNode: peekedNode,
      explanation: `Peeking at rear element...` 
  };
  
  yield { 
      phase: 'complete', 
      action: 'peek_rear',
      queue: [...queue],
      peekedNode: null,
      explanation: `Rear element: "${peekedNode.value}"` 
  };
}
