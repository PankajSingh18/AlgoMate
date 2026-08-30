const ALGORITHMS = new Map();

export function registerAlgorithm(name, fn) {
  ALGORITHMS.set(name, fn);
}

export async function* generateSteps(algorithmFn, input) {
  const queue = [input];
  while (queue.length > 0) {
    const state = queue.shift();
    const nextStates = algorithmFn(state);
    for (const next of nextStates) {
      yield next;
      queue.push(next);
    }
  }
}

export function createStepWorker(algorithmName) {
  const fn = ALGORITHMS.get(algorithmName);
  if (!fn) {
    throw new Error(`Unknown algorithm: "${algorithmName}". Register it with registerAlgorithm() first.`);
  }

  const fnBody = fn.toString();
  const workerCode = `
    const fn = ${fnBody};
    self.onmessage = function(e) {
      const { input } = e.data;
      const steps = [];
      const queue = [input];
      while (queue.length > 0) {
        const state = queue.shift();
        const nextStates = fn(state);
        for (const next of nextStates) {
          steps.push(next);
          queue.push(next);
        }
      }
      self.postMessage({ steps });
    };
  `;
  return new Worker(URL.createObjectURL(new Blob([workerCode], { type: "application/javascript" })));
}

export function buildStepRunner(stepGenerator) {
  return async () => {
    const steps = [];
    for await (const step of stepGenerator) {
      steps.push(step);
    }
    return steps;
  };
}

export function createSyncStepRunner(generatorFn) {
  return (input) => {
    const steps = [];
    const gen = generatorFn(input);
    for (const step of gen) {
      steps.push(step);
    }
    return steps;
  };
}
