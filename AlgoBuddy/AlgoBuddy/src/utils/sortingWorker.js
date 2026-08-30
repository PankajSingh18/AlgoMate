import {
  bubbleSortGen,
  selectionSortGen,
  insertionSortGen,
  mergeSortGen,
  quickSortGen,
  heapSortGen,
} from "./sortingGenerators";

const ALGORITHMS = {
  bubble: bubbleSortGen,
  selection: selectionSortGen,
  insertion: insertionSortGen,
  merge: mergeSortGen,
  quick: quickSortGen,
  heap: heapSortGen,
};

self.onmessage = function (e) {
  const { algo, array, id } = e.data;
  
  if (!ALGORITHMS[algo]) {
    self.postMessage({ id, error: `Algorithm ${algo} not found` });
    return;
  }
  
  const genFunc = ALGORITHMS[algo];
  const gen = genFunc([...array]);
  
  const frames = [];
  let steps = 0;
  
  // We can just iterate the generator to completion
  let res = gen.next();
  while (!res.done) {
    frames.push(res.value);
    steps++;
    res = gen.next();
  }
  
  self.postMessage({ id, frames, steps });
};
