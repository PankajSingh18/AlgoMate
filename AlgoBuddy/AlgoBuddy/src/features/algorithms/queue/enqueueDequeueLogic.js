export function* enqueueGenerator(currentQueue, value) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }

  yield { 
    phase: 'start', 
    action: 'enqueue',
    queue: [...currentQueue], 
    newValue: value,
    explanation: `Preparing to enqueue "${value}" to the rear of the queue...` 
  };
  
  const nextQueue = [...currentQueue, { id: Date.now(), value }];
  
  yield { 
    phase: 'complete', 
    action: 'enqueue',
    queue: nextQueue, 
    newValue: null,
    explanation: `Successfully added "${value}" to the rear.` 
  };
}

export function* dequeueGenerator(currentQueue) {
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
    explanation: `Preparing to dequeue "${dequeuedNode.value}" from the front...` 
  };

  const nextQueue = currentQueue.slice(1);
  
  yield { 
    phase: 'complete', 
    action: 'dequeue',
    queue: nextQueue, 
    dequeuedNode: null,
    explanation: `Successfully removed "${dequeuedNode.value}" from the front.` 
  };
}
