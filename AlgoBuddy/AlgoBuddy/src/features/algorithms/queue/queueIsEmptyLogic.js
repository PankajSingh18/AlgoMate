export function* checkEmptyGenerator(queue) {
  yield { 
      phase: 'start', 
      action: 'check',
      queue: [...queue],
      explanation: 'Checking if queue is empty... We evaluate if the length of the queue is 0.' 
  };
  
  const empty = queue.length === 0;
  
  yield { 
    phase: 'complete', 
    action: 'check',
    queue: [...queue],
    isEmpty: empty, 
    explanation: empty ? 'Length is 0. The Queue is empty!' : `Length is ${queue.length}. The Queue is NOT empty.` 
  };
}

export function* enqueueGenerator(currentQueue, value) {
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
    yield { type: 'error', message: 'Queue is empty!', isEmpty: true };
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
