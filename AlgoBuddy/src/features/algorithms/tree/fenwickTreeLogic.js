/**
 * Pure generator logic for Fenwick Tree (Binary Indexed Tree) operations.
 */

export function buildBIT(arr) {
  const n = arr.length - 1;
  const bit = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    let j = i;
    while (j <= n) {
      bit[j] += arr[i];
      j += j & -j;
    }
  }
  return bit;
}

export function* updateGenerator(idx, delta, baseArray, bit, n) {
  if (idx < 1 || idx > n || isNaN(delta)) {
    yield { type: 'error', message: `⚠️ Please enter a valid index (1-${n}) and a numeric delta value.` };
    return;
  }

  const newBase = [...baseArray];
  newBase[idx] += delta;
  
  // Calculate new BIT manually for final state, though we also mutate tempBit
  const newBit = buildBIT(newBase.slice(1).reduce((acc, v, i) => { acc[i + 1] = v; return acc; }, [0, ...newBase.slice(1)]));

  let i = idx;
  const tempBit = [...bit];

  yield {
    type: 'step',
    highlightedBIT: { [idx]: "visiting" },
    highlightedBase: { [idx]: "visiting" },
    explanation: `Point Update: Add delta=${delta} to index ${idx}. Binary: ${idx.toString(2).padStart(4, '0')}. Start updating BIT[${idx}].`,
    result: undefined
  };

  while (i <= n) {
    const lsb = i & -i;
    tempBit[i] += delta;

    yield {
      type: 'step',
      highlightedBIT: { [i]: "active" },
      highlightedBase: { [idx]: "active" },
      explanation: `BIT[${i}] (binary: ${i.toString(2).padStart(4,'0')}) += ${delta}. LSB(${i}) = ${lsb}. New BIT[${i}] = ${tempBit[i]}. Next: i = ${i} + ${lsb} = ${i + lsb}.`,
      result: undefined
    };

    i += lsb;
    if (i <= n) {
      yield {
        type: 'step',
        highlightedBIT: { [i]: "visiting" },
        highlightedBase: { [idx]: "active" },
        explanation: `Move to BIT[${i}] (binary: ${i.toString(2).padStart(4, '0')}). LSB propagates up the implicit tree.`,
        result: undefined
      };
    }
  }

  yield {
    type: 'complete',
    highlightedBIT: {},
    highlightedBase: { [idx]: "matched" },
    explanation: `✅ Point Update complete! Index ${idx} in the source array now has value ${newBase[idx]} (was ${baseArray[idx]}). All affected BIT nodes updated.`,
    result: `Updated index ${idx}: ${baseArray[idx]} → ${newBase[idx]}`,
    newBase,
    newBit
  };
}

export function* queryGenerator(l, r, bit, n) {
  if (isNaN(l) || isNaN(r) || l < 1 || r > n || l > r) {
    yield { type: 'error', message: `⚠️ Please enter a valid range (1 ≤ L ≤ R ≤ ${n}).` };
    return;
  }

  const prefixSum = (endIdx) => {
    let sum = 0;
    let i = endIdx;
    const trace = [];
    while (i > 0) {
      trace.push({ i, val: bit[i], lsb: i & -i });
      sum += bit[i];
      i -= i & -i;
    }
    return { sum, trace };
  };

  const { sum: sumR, trace: traceR } = prefixSum(r);
  const { sum: sumL1, trace: traceL1 } = prefixSum(l - 1);
  const result = sumR - sumL1;

  yield {
    type: 'step',
    highlightedBIT: {},
    highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "visiting"])),
    explanation: `Range Sum Query [${l}, ${r}]: Compute prefix(${r}) - prefix(${l - 1}). Two prefix sums are needed.`,
    result: undefined
  };

  // Trace prefix(r)
  for (const { i, val, lsb } of traceR) {
    yield {
      type: 'step',
      highlightedBIT: { [i]: "active" },
      highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, k) => [l + k, "active"])),
      explanation: `prefix(${r}) step: BIT[${i}] = ${val}. LSB(${i}) = ${lsb}. Binary: ${i.toString(2).padStart(4, '0')}. Accumulate → next: i = ${i} - ${lsb} = ${i - lsb}.`,
      result: undefined
    };
  }

  yield {
    type: 'step',
    highlightedBIT: {},
    highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "active"])),
    explanation: `prefix(${r}) = ${sumR}. Now compute prefix(${l - 1}) to subtract.`,
    result: undefined
  };

  if (l - 1 > 0) {
    for (const { i, val, lsb } of traceL1) {
      yield {
        type: 'step',
        highlightedBIT: { [i]: "visiting" },
        highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, k) => [l + k, "active"])),
        explanation: `prefix(${l - 1}) step: BIT[${i}] = ${val}. LSB(${i}) = ${lsb}. Binary: ${i.toString(2).padStart(4, '0')}. Accumulate → next: i = ${i} - ${lsb} = ${i - lsb}.`,
        result: undefined
      };
    }
  }

  yield {
    type: 'complete',
    highlightedBIT: {},
    highlightedBase: Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, "matched"])),
    explanation: `✅ Range Sum [${l}, ${r}] = prefix(${r}) - prefix(${l - 1}) = ${sumR} - ${sumL1} = ${result}.`,
    result: `Sum[${l}..${r}] = ${result}`
  };
}
