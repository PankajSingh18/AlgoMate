// lib/ai/performance-tester.js

import { CodeExecutor } from '../sandbox/executor.js';

export class PerformanceTester {
  constructor() {
    this.executor = new CodeExecutor();
  }

  /**
   * Run performance tests with varying input sizes
   */
  async testPerformance(code, functionName, language = 'javascript', maxInputSize = 10000) {
    const results = [];
    const testSizes = [10, 50, 100, 500, 1000, 5000, 10000];
    const validSizes = testSizes.filter(size => size <= maxInputSize);

    for (const size of validSizes) {
      try {
        const result = await this.runTest(code, functionName, size, language);
        results.push({
          inputSize: size,
          time: result.executionTime,
          memory: result.memoryUsed || 0,
          output: result.output,
        });
      } catch (error) {
        console.error(`Test failed for size ${size}:`, error);
        // Skip this size
        continue;
      }
    }

    return {
      testSizes: results.map(r => r.inputSize),
      times: results.map(r => r.time),
      memory: results.map(r => r.memory),
      allResults: results,
      estimatedComplexity: this.estimateComplexity(results),
    };
  }

  /**
   * Run a single test
   */
  async runTest(code, functionName, inputSize, language) {
    const testCode = this.wrapCodeForTest(code, functionName, inputSize, language);
    return await this.executor.executeCode(testCode, language);
  }

  /**
   * Wrap code for performance testing
   */
  wrapCodeForTest(code, functionName, inputSize, language) {
    switch (language) {
      case 'javascript':
        return `
${code}

// Generate test data
function generateTestData(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 1000));
  }
  return arr;
}

// Run test
const start = performance.now();
const data = generateTestData(${inputSize});
const result = ${functionName}(data);
const end = performance.now();

console.log(JSON.stringify({
  executionTime: end - start,
  output: result,
  memoryUsed: 0,
}));
`;

      case 'python':
        return `
import time
import json
import random

${code}

def generate_test_data(n):
    return [random.randint(0, 1000) for _ in range(n)]

start = time.time()
data = generate_test_data(${inputSize})
result = ${functionName}(data)
end = time.time()

print(json.dumps({
    "executionTime": (end - start) * 1000,
    "output": result,
    "memoryUsed": 0
}))
`;

      default:
        return code;
    }
  }

  /**
   * Estimate complexity from test results
   */
  estimateComplexity(results) {
    if (results.length < 2) {
      return 'O(n)';
    }

    const ns = results.map(r => r.inputSize);
    const ts = results.map(r => r.time);

    // Calculate growth rates
    const ratios = [];
    for (let i = 1; i < ns.length; i++) {
      const nRatio = ns[i] / ns[i-1];
      const tRatio = ts[i] / ts[i-1];
      ratios.push(tRatio / nRatio);
    }

    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

    // Determine complexity based on ratio
    if (avgRatio < 0.5) return 'O(log n)';
    if (avgRatio < 1.1) return 'O(n)';
    if (avgRatio < 1.5) return 'O(n log n)';
    if (avgRatio < 2.5) return 'O(n²)';
    if (avgRatio < 4.0) return 'O(n³)';
    return 'O(2ⁿ)';
  }

  /**
   * Generate complexity chart data
   */
  generateChartData(results, estimatedComplexity) {
    const complexityMap = {
      'O(1)': (n) => 1,
      'O(log n)': (n) => Math.log2(n + 1),
      'O(n)': (n) => n,
      'O(n log n)': (n) => n * Math.log2(n + 1),
      'O(n²)': (n) => n * n / 1000,
      'O(n³)': (n) => n * n * n / 1000000,
      'O(2ⁿ)': (n) => Math.pow(2, n / 10),
    };

    const fn = complexityMap[estimatedComplexity] || complexityMap['O(n)'];
    const ns = results.map(r => r.inputSize);
    const maxN = ns[ns.length - 1] || 1000;

    return {
      actual: results,
      estimated: ns.map(n => ({
        inputSize: n,
        time: fn(n),
      })),
      complexity: estimatedComplexity,
    };
  }
}