export function* checkFullGenerator(queue, capacity) {
  yield { 
      phase: 'start', 
      action: 'check',
      queue: [...queue],
      explanation: `Checking if queue is full... We compare length (${queue.length}) with capacity (${capacity}).` 
  };
  
  const full = queue.length >= capacity;
  
  yield { 
    phase: 'complete', 
    action: 'check',
    queue: [...queue],
    isFull: full, 
    explanation: full ? `Length is ${queue.length} >= ${capacity}. The Queue is FULL.` : `Length is ${queue.length} < ${capacity}. The Queue is NOT full.` 
  };
}

export function* enqueueGenerator(currentQueue, value, capacity) {
  if (currentQueue.length >= capacity) {
    yield { type: 'error', message: 'Queue is full!' };
    return;
  }

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
      explanation: `Enqueuing "${val}"...` 
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

export function* dequeueGenerator(currentQueue) {
  if (currentQueue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!', isFull: false };
    return;
  }

  const dequeuedNode = currentQueue[0];
  yield { 
      phase: 'start', 
      action: 'dequeue',
      queue: [...currentQueue],
      dequeuedNode: dequeuedNode,
      explanation: `Dequeuing "${dequeuedNode.value}" from the front...` 
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
