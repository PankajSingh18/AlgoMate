const wrap = (idx, maxSize) => (idx + maxSize) % maxSize;

export function* enqueueCircularGenerator(queue, front, rear, count, maxSize, inputValue) {
  if (!inputValue || (typeof inputValue === 'string' && !inputValue.trim())) {
    yield { type: 'error', message: 'Please enter a value' };
    return;
  }
  if (count === maxSize) {
    yield { type: 'error', message: 'Circular queue is full!' };
    return;
  }
  
  yield { 
      phase: 'start', 
      action: 'enqueue',
      queue: [...queue],
      front,
      rear,
      count,
      newValue: inputValue,
      explanation: `Enqueuing "${inputValue}" at rear...` 
  };
  
  const newRear = count === 0 ? front : wrap(rear + 1, maxSize);
  const newQ = [...queue];
  newQ[newRear] = inputValue;
  
  yield { 
    phase: 'complete', 
    action: 'enqueue',
    queue: newQ, 
    front,
    rear: newRear, 
    count: count + 1, 
    newValue: null,
    explanation: `"${inputValue}" added at index ${newRear}.` 
  };
}

export function* dequeueCircularGenerator(queue, front, rear, count, maxSize) {
  if (count === 0) {
    yield { type: 'error', message: 'Circular queue is empty!' };
    return;
  }

  const item = queue[front];
  yield { 
      phase: 'start', 
      action: 'dequeue',
      queue: [...queue],
      front,
      rear,
      count,
      dequeuedItem: item,
      explanation: `Dequeuing "${item}" from front (index ${front})...` 
  };

  const newQ = [...queue];
  newQ[front] = null;
  const newFront = count === 1 ? front : wrap(front + 1, maxSize);
  
  yield { 
    phase: 'complete', 
    action: 'dequeue',
    queue: newQ, 
    front: newFront, 
    rear,
    count: count - 1, 
    dequeuedItem: null,
    explanation: `"${item}" removed. Front moved to index ${newFront}.` 
  };
}
