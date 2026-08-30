// __tests__/sandbox.test.js
//
// Run with:  npx jest __tests__/sandbox.test.js
//
// Prerequisites: npm i --save-dev jest  &&  npm i isolated-vm
//
// These tests verify the three contract guarantees of executor.js:
//   1. Valid code  → SUCCESS with captured output
//   2. Infinite loop → TLE within ~1100 ms
//   3. Memory bomb → MLE (or TLE if the OOM path is slow on this machine)

const { executeCode } = require("../src/lib/sandbox/executor");
const { EXECUTION_STATUS } = require("../src/lib/sandbox/errorCodes");

// isolated-vm can take a moment on first load — extend default timeout
jest.setTimeout(10_000);

describe("executeCode — sandbox guarantees", () => {
  // ── Happy path ────────────────────────────────────────────────────
  test("returns SUCCESS and captured output for valid code", async () => {
    const result = await executeCode(`
      console.log("hello world");
      console.log(1 + 1);
    `);

    expect(result.status).toBe(EXECUTION_STATUS.SUCCESS);
    expect(result.output).toContain("hello world");
    expect(result.output).toContain("2");
    expect(result.executionTime).toBeGreaterThanOrEqual(0);
    // Note: isolated-vm doesn't provide memory usage tracking like vm
    // expect(result.memoryUsed).toBeGreaterThan(0);
  });

  test("captures multi-line console output in order", async () => {
    const result = await executeCode(`
      for (let i = 1; i <= 3; i++) console.log(i);
    `);
    expect(result.status).toBe(EXECUTION_STATUS.SUCCESS);
    expect(result.output).toBe("1\n2\n3");
  });

  // ── Syntax error ──────────────────────────────────────────────────
  test("returns RUNTIME_ERROR for syntax errors (never reaches execution)", async () => {
    const result = await executeCode(`const x = (`); // unterminated
    expect(result.status).toBe(EXECUTION_STATUS.RUNTIME_ERROR);
    expect(result.error).toMatch(/SyntaxError/i);
  });

  // ── Runtime error ─────────────────────────────────────────────────
  test("returns RUNTIME_ERROR for thrown exceptions", async () => {
    const result = await executeCode(`
      throw new Error("user mistake");
    `);
    expect(result.status).toBe(EXECUTION_STATUS.RUNTIME_ERROR);
    expect(result.error).toContain("user mistake");
  });

  test("returns RUNTIME_ERROR for ReferenceError", async () => {
    const result = await executeCode(`console.log(undeclaredVariable);`);
    expect(result.status).toBe(EXECUTION_STATUS.RUNTIME_ERROR);
  });

  // ── Time Limit Exceeded ───────────────────────────────────────────
  test("returns TLE for infinite loop", async () => {
    const result = await executeCode(`while (true) {}`);
    expect(result.status).toBe(EXECUTION_STATUS.TLE);
    // executionTime should be ~MAX_TIMEOUT_MS, not far above it
    expect(result.executionTime).toBeLessThan(3000);
  });

  test("returns TLE for code that sleeps via busy-wait", async () => {
    const result = await executeCode(`
      const end = Date.now() + 5000;
      while (Date.now() < end) {}
    `);
    expect(result.status).toBe(EXECUTION_STATUS.TLE);
  });

  // ── Memory Limit Exceeded ─────────────────────────────────────────
  test("returns MLE or TLE for aggressive memory allocation", async () => {
    // Allocate large arrays until heap is exhausted.
    // Some machines hit TLE before MLE — both are acceptable.
    const result = await executeCode(`
      const arrays = [];
      while (true) {
        arrays.push(new Array(1_000_000).fill("x"));
      }
    `);
    expect([EXECUTION_STATUS.MLE, EXECUTION_STATUS.TLE]).toContain(result.status);
  });

  // ── Isolation: host globals must not be accessible ────────────────
  test("cannot access Node.js process global", async () => {
    const result = await executeCode(`
      if (typeof process !== "undefined") {
        console.log("EXPOSED:" + process.version);
      } else {
        console.log("SAFE");
      }
    `);
    // process must not exist inside the isolate
    expect(result.output).not.toContain("EXPOSED");
    expect(result.output).toContain("SAFE");
  });

  test("cannot require modules", async () => {
    const result = await executeCode(`
      try {
        require("fs");
        console.log("EXPOSED");
      } catch(e) {
        console.log("BLOCKED:" + e.message);
      }
    `);
    expect(result.output).not.toContain("EXPOSED");
    expect(result.output).toContain("BLOCKED");
  });

  // ── Output truncation ─────────────────────────────────────────────
  test("truncates output exceeding MAX_OUTPUT_LENGTH", async () => {
    // Produce ~16 000 chars of output (more than 8000 char limit)
    const result = await executeCode(`
      for (let i = 0; i < 1000; i++) console.log("A".repeat(20));
    `);
    expect(result.status).toBe(EXECUTION_STATUS.SUCCESS);
    expect(result.output.length).toBeLessThanOrEqual(8100); // small buffer for "… truncated"
    expect(result.output).toContain("truncated");
  });
});