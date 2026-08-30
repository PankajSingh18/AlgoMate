/**
 * Pure generator logic for Hash Map Chaining Search.
 */

export function* searchGenerator(hashMap, key, tableSize, hashFunction) {
  const index = hashFunction(key);
  yield { type: 'hash', index, operation: `Key "${key}" hashes to index ${index}` };

  const bucket = hashMap[index] || [];
  if (bucket.length === 0) {
    yield { 
      type: 'complete', 
      found: false, 
      operation: `Bucket ${index} is empty. Key "${key}" not found` 
    };
    return;
  }

  for (let i = 0; i < bucket.length; i += 1) {
    yield { 
      type: 'traverse', 
      activeNode: { bucket: index, index: i }, 
      operation: `Traversing chained bucket ${index}: checking "${bucket[i].key}"` 
    };
    
    if (bucket[i].key === key) {
      yield { 
        type: 'complete', 
        found: true, 
        operation: `Key "${key}" found at index ${index} with value "${bucket[i].value}"` 
      };
      return;
    }
  }

  yield { 
    type: 'complete', 
    found: false, 
    operation: `Traversal finished. Key "${key}" not found in bucket ${index}` 
  };
}
