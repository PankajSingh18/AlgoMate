/**
 * Pure generator logic for Hash Map Chaining Insert.
 */

export function* insertGenerator(hashMap, key, value, tableSize, hashFunction) {
  const index = hashFunction(key);
  yield { type: 'hash', index, operation: `Key "${key}" hashes to index ${index}` };

  const bucketBefore = hashMap[index] || [];
  const existingIndex = bucketBefore.findIndex((pair) => pair.key === key);

  if (existingIndex === -1 && bucketBefore.length > 0) {
    yield { 
      type: 'collision', 
      index, 
      operation: `Collision Detected at bucket ${index}`,
      message: 'Collision Detected'
    };
    yield { 
      type: 'resolve', 
      operation: `Key inserted into existing bucket ${index} using separate chaining`
    };
  }

  let nextHashMap = hashMap.map((bucket) => [...bucket]);
  let activeNode;
  let finalOperation;

  if (existingIndex >= 0) {
    nextHashMap[index][existingIndex] = { ...nextHashMap[index][existingIndex], value };
    activeNode = { bucket: index, index: existingIndex };
    finalOperation = `Updated key "${key}" in bucket ${index}`;
  } else {
    nextHashMap[index].push({ key, value, id: `${key}-${Date.now()}` });
    activeNode = { bucket: index, index: bucketBefore.length };
    finalOperation = `Inserted "${key}: ${value}" at index ${index}`;
  }

  yield { 
    type: 'complete', 
    hashMap: nextHashMap,
    activeNode,
    operation: finalOperation
  };
}
