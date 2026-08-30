// lib/sandbox/errorCodes.js
// Single source of truth for execution status strings.
// Both server (route.js) and client (CodeLabEditor) import from here
// so the strings never drift apart.

const EXECUTION_STATUS = {
  SUCCESS: "SUCCESS",

  // User code ran longer than MAX_TIMEOUT_MS
  TLE: "TLE", // Time Limit Exceeded

  // User code allocated more heap than MAX_MEMORY_MB
  MLE: "MLE", // Memory Limit Exceeded

  // User code threw a JS runtime error (ReferenceError, TypeError, etc.)
  RUNTIME_ERROR: "RUNTIME_ERROR",

  // Something went wrong inside the sandbox itself (not user code)
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

// Human-readable messages shown in the UI
const EXECUTION_MESSAGES = {
  [EXECUTION_STATUS.SUCCESS]: "Ran successfully",
  [EXECUTION_STATUS.TLE]: "Time Limit Exceeded — your code took longer than 1000 ms",
  [EXECUTION_STATUS.MLE]: "Memory Limit Exceeded — your code used more than 32 MB",
  [EXECUTION_STATUS.RUNTIME_ERROR]: "Runtime Error",
  [EXECUTION_STATUS.INTERNAL_ERROR]: "Internal sandbox error — please try again",
};

module.exports = { EXECUTION_STATUS, EXECUTION_MESSAGES };