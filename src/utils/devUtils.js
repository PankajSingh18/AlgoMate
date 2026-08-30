const LOG_PREFIX = "[AlgoBuddy]";

export function devLog(...args) {
  if (process.env.NODE_ENV === "production") return;
  console.log(LOG_PREFIX, ...args);
}

export function devWarn(...args) {
  if (process.env.NODE_ENV === "production") return;
  console.warn(LOG_PREFIX, ...args);
}

export function devError(...args) {
  console.error(LOG_PREFIX, ...args);
}

export function measurePerformance(label) {
  if (process.env.NODE_ENV === "production") return { end: () => {} };
  const start = performance.now();
  return {
    end: () => {
      const duration = performance.now() - start;
      if (duration > 16) {
        devWarn(`[Perf] ${label} took ${duration.toFixed(1)}ms`);
      }
    },
  };
}

export function debounce(fn, delay = 250) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

export function throttle(fn, limit = 100) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => Object.is(objA[key], objB[key]));
}

export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str || "";
  return str.slice(0, maxLength).trimEnd() + "...";
}

export function formatError(error) {
  if (!error) return "Unknown error";
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}

export function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

export function noop() {}

export function isClient() {
  return typeof window !== "undefined";
}

export function isServer() {
  return typeof window === "undefined";
}
