export function* insertGenerator(currentPq, value, priorityStr) {
  if (!value || priorityStr === "") {
    yield { type: 'error', message: 'Please enter both value and priority' };
    return;
  }
  const pri = Number(priorityStr);
  if (isNaN(pri)) {
    yield { type: 'error', message: 'Priority must be a number' };
    return;
  }

  yield { 
      phase: 'start', 
      action: 'insert', 
      pq: [...currentPq],
      newValue: value,
      newPri: pri,
      explanation: `Inserting "${value}" with priority ${pri}...` 
  };
  
  const newEl = { id: Date.now(), val: value, pri };
  // Visualizing the insertion and sorting process step-by-step
  let newPq = [...currentPq, newEl];
  
  yield {
      phase: 'append',
      action: 'insert',
      pq: [...newPq],
      newValue: value,
      newPri: pri,
      explanation: `Appended to the array. Now we need to sort based on priority.`
  };

  newPq.sort((a, b) => a.pri - b.pri);
  
  yield { 
      phase: 'complete', 
      action: 'insert',
      pq: newPq, 
      newValue: null,
      explanation: `"${value}" inserted and queue sorted by priority.` 
  };
}

export function* extractMinGenerator(currentPq) {
  if (currentPq.length === 0) {
    yield { type: 'error', message: 'Priority queue is empty!' };
    return;
  }
  
  const minEl = currentPq[0];
  yield { 
      phase: 'start', 
      action: 'extract_min', 
      pq: [...currentPq],
      extractedNode: minEl,
      explanation: `Extracting min element "${minEl.val}" (priority ${minEl.pri}) from the front...` 
  };
  
  yield { 
      phase: 'complete', 
      action: 'extract_min', 
      pq: currentPq.slice(1), 
      extractedNode: null,
      explanation: `"${minEl.val}" removed.` 
  };
}
