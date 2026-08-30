export const lruCacheSteps = (capacity, operations) => {
  const steps = [];
  const cache = new Map();

  const getState = () => ({
    cache: [...cache.entries()].map(([key, value]) => ({ key, value })),
    size: cache.size,
    capacity,
  });

  operations.forEach(({ type, key, value }) => {
    if (type === "get") {
      if (cache.has(key)) {
        const val = cache.get(key);
        cache.delete(key);
        cache.set(key, val);
        steps.push({
          operation: `GET(${key})`,
          result: val,
          hit: true,
          state: getState(),
          message: `Cache HIT! Key ${key} found = ${val}. Moved to front.`,
        });
      } else {
        steps.push({
          operation: `GET(${key})`,
          result: -1,
          hit: false,
          state: getState(),
          message: `Cache MISS! Key ${key} not found. Return -1.`,
        });
      }
    } else if (type === "put") {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= capacity) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
        steps.push({
          operation: `PUT(${key}, ${value})`,
          result: null,
          evicted: firstKey,
          state: getState(),
          message: `Cache FULL! Evicted LRU key ${firstKey}. Added key ${key} = ${value}.`,
        });
        cache.set(key, value);
        return;
      }
      cache.set(key, value);
      steps.push({
        operation: `PUT(${key}, ${value})`,
        result: null,
        evicted: null,
        state: getState(),
        message: `Added key ${key} = ${value} to cache.`,
      });
    }
  });

  return steps;
};