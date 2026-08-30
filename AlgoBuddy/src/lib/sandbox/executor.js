const ivm = require("isolated-vm");
const { EXECUTION_STATUS } = require("./errorCodes");
const { MAX_TIMEOUT_MS, MAX_MEMORY_MB, MAX_OUTPUT_LENGTH } = require("./sandbox.config");

// Sanitize error messages to prevent information leakage
function sanitizeError(err) {
  let message = err.message ?? String(err);
  
  // Remove file paths from error messages
  message = message.replace(/[a-zA-Z]:\\[^\\]*/g, "[path]");
  message = message.replace(/\/[^\/]*/g, "[path]");
  
  // Remove internal implementation details
  message = message.replace(/vm:\d+:\d+/g, "[internal]");
  message = message.replace(/internal\/[^)]*/g, "[internal]");
  message = message.replace(/node:[^)]*/g, "[internal]");
  message = message.replace(/isolated-vm:[^)]*/g, "[internal]");
  
  // Remove absolute paths
  message = message.replace(/c:\\[^\\]*/gi, "[path]");
  message = message.replace(/\/usr\/[^)]*/g, "[path]");
  message = message.replace(/home\/[^)]*/g, "[path]");
  
  return message;
}

// Producer-consumer pool for V8 isolates with proper synchronization
const MAX_ISOLATES = 4;
const pool = [];
const waitQueue = [];
let isShuttingDown = false;

function createIsolate() {
  return new ivm.Isolate({ memoryLimit: MAX_MEMORY_MB });
}

async function acquireIsolate() {
  while (pool.length === 0) {
    if (!isShuttingDown && pool.length < MAX_ISOLATES) {
      const isolate = createIsolate();
      pool.push(isolate);
    } else if (isShuttingDown) {
      throw new Error("Sandbox is shutting down");
    } else {
      await new Promise((resolve) => waitQueue.push(resolve));
    }
  }
  return pool.shift();
}

function releaseIsolate(isolate) {
  if (waitQueue.length > 0) {
    waitQueue.shift()(isolate);
  } else {
    pool.push(isolate);
  }
}

async function executeCode(code) {
  const startTime = Date.now();
  const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  let isolate = null;
  let context = null;
  let isolateCorrupted = false;

  try {
    // Audit log: execution started
    console.log(`[sandbox:audit] Execution started: ${executionId}, codeLength: ${code.length}, isolation: isolated-vm`);

    // Acquire an isolate from the pool
    isolate = await acquireIsolate();

    // Create a context within the isolate
    context = await isolate.createContext();

    // Create a copy of the code that wraps console.log to capture output
    const wrappedCode = `
      (function() {
        const outputLines = [];
        const console = {
          log: (...args) => {
            outputLines.push(args.map(String).join(" "));
          },
          warn: (...args) => {
            outputLines.push("[warn] " + args.map(String).join(" "));
          },
          error: (...args) => {
            outputLines.push("[error] " + args.map(String).join(" "));
          },
          info: (...args) => {
            outputLines.push("[info] " + args.map(String).join(" "));
          },
        };
        
        ${code}
        
        return outputLines.join("\\n");
      })()
    `;

    // Compile and run the code
    const script = await isolate.compileScript(wrappedCode, {
      filename: "user-code.js",
    });

    const result = await script.run(context, {
      timeout: MAX_TIMEOUT_MS,
    });

    // Get the captured output
    const rawOutput = result ? result.toString() : "";
    const output = rawOutput.length > MAX_OUTPUT_LENGTH
      ? rawOutput.slice(0, MAX_OUTPUT_LENGTH) + "\n… (output truncated)"
      : rawOutput;

    const executionTime = Date.now() - startTime;

    // Audit log: execution completed successfully
    console.log(`[sandbox:audit] Execution completed: ${executionId}, status: SUCCESS, time: ${executionTime}ms, isolation: isolated-vm`);

    return {
      status: EXECUTION_STATUS.SUCCESS,
      output,
      executionTime,
      memoryUsed: 0, // isolated-vm doesn't provide memory usage in the same way
    };

  } catch (err) {
    const elapsed = Date.now() - startTime;
    const sanitizedMessage = sanitizeError(err);
    isolateCorrupted = true;

    // Audit log: execution failed
    console.log(`[sandbox:audit] Execution failed: ${executionId}, status: ${err.code || 'ERROR'}, time: ${elapsed}ms, error: ${sanitizedMessage}, isolation: isolated-vm`);

    if (err.code === "ISOLATED_VM_SCRIPT_TIMEOUT" || err.message?.includes("timed out")) {
      return {
        status: EXECUTION_STATUS.TLE,
        output: "",
        error: `Your code exceeded the ${MAX_TIMEOUT_MS}ms time limit.`,
        executionTime: elapsed,
        memoryUsed: 0,
      };
    }

    if (err.code === "ISOLATED_VM_MEMORY_LIMIT_EXCEEDED" || err.message?.includes("memory")) {
      return {
        status: EXECUTION_STATUS.MLE,
        output: "",
        error: `Your code used too much memory (exceeded ${MAX_MEMORY_MB} MB).`,
        executionTime: elapsed,
        memoryUsed: 0,
      };
    }

    let errorMessage = sanitizedMessage;
    if (err.name && err.name !== "Error" && !errorMessage.startsWith(err.name)) {
      errorMessage = `${err.name}: ${errorMessage}`;
    }
    return {
      status: EXECUTION_STATUS.RUNTIME_ERROR,
      output: "",
      error: errorMessage,
      executionTime: elapsed,
      memoryUsed: 0,
    };
  } finally {
    // Clean up context
    if (context) {
      try {
        context.release();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    // Dispose corrupted isolates; return healthy ones to pool
    if (isolate) {
      if (isolateCorrupted) {
        try {
          isolate.dispose();
        } catch (e) {
          // Ignore cleanup errors
        }
        // Replace with a fresh isolate
        releaseIsolate(createIsolate());
      } else {
        releaseIsolate(isolate);
      }
    }
  }
}

// Clean up function for graceful shutdown
async function cleanup() {
  isShuttingDown = true;
  // Drain wait queue so waiting acquireIsolate calls throw
  waitQueue.splice(0).forEach(resolve => resolve());
  for (const isolate of pool) {
    try {
      isolate.dispose();
    } catch (e) {
      // Ignore cleanup errors
    }
  }
  pool.length = 0;
}

module.exports = { executeCode, cleanup };