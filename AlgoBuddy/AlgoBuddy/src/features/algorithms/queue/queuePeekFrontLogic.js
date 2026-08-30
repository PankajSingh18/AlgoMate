export function* peekFrontGenerator(queue) {
  if (queue.length === 0) {
    yield { type: 'error', message: 'Queue is empty!', isFull: false };
    return;
  }

  const peekedNode = queue[0];
  yield { 
      phase: 'start', 
      action: 'peek',
      queue: [...queue],
      peekedNode: peekedNode,
      explanation: `Peeking at front element... We look at index 0.` 
  };
  
  yield { 
    phase: 'complete', 
    action: 'peek',
    queue: [...queue],
    peekedNode: peekedNode,
    explanation: `The front element is "${peekedNode.value}".` 
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
