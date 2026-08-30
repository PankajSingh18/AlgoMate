// lib/sandbox/sandbox.config.js
// Central config for all resource limits.
// Tweak here — nothing else needs changing.

const SANDBOX_CONFIG = {
  // Hard kill after this many milliseconds (maps to isolated-vm timeout)
  MAX_TIMEOUT_MS: 1000,

  // V8 isolate heap ceiling in megabytes
  MAX_MEMORY_MB: 32,

  // Truncate stdout/stderr to this many characters before returning
  MAX_OUTPUT_LENGTH: 8000,

  // Maximum number of code-run requests per window per identity
  RATE_LIMIT_MAX_REQUESTS: 10,

  // Sliding-window length in seconds
  RATE_LIMIT_WINDOW_SEC: 60,
};

module.exports = SANDBOX_CONFIG;