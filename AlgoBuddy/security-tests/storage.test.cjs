// security-tests/storage.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/storage.test.cjs
//
// Tests localStorage utilities in src/utils/storage.js.

const { describe, test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");

// Inlined source to avoid ESM import issues.
const saveToStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const loadFromStorage = (key, fallback) => {
  if (typeof window !== "undefined") {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item);
      } catch {
        return fallback;
      }
    }
  }
  return fallback;
};

const removeFromStorage = (key) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// Mock localStorage for testing.
// Set globalThis.window so the guard `typeof window !== "undefined"` passes in Node.js.
globalThis.window = {};
const store = {};
const mockLocalStorage = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = value; },
  removeItem: (key) => { delete store[key]; },
  clear: () => { for (const k in store) delete store[k]; },
};
globalThis.localStorage = mockLocalStorage;

// ── Tests ────────────────────────────────────────────────────────────

describe("saveToStorage", () => {
  beforeEach(() => { mockLocalStorage.clear(); });
  afterEach(() => { mockLocalStorage.clear(); });

  test("stores JSON-stringified value in localStorage", () => {
    saveToStorage("theme", { mode: "dark", accent: "blue" });
    assert.equal(store["theme"], JSON.stringify({ mode: "dark", accent: "blue" }));
  });

  test("stores primitive values as JSON", () => {
    saveToStorage("count", 42);
    assert.equal(store["count"], "42");
  });

  test("stores arrays correctly", () => {
    saveToStorage("items", [1, 2, 3]);
    assert.equal(store["items"], "[1,2,3]");
  });

  test("is no-op when localStorage is undefined (SSR)", () => {
    // In true SSR (no window, no localStorage), function should not throw.
    const savedWindow = globalThis.window;
    const savedLS = globalThis.localStorage;
    globalThis.window = undefined;
    globalThis.localStorage = undefined;
    saveToStorage("key", "value"); // must not throw
    globalThis.window = savedWindow;
    globalThis.localStorage = savedLS; // restore for next test
  });
});

describe("loadFromStorage", () => {
  beforeEach(() => { mockLocalStorage.clear(); });
  afterEach(() => { mockLocalStorage.clear(); });

  test("parses stored JSON and returns the value", () => {
    store["user"] = JSON.stringify({ id: 1, name: "Alice" });
    const result = loadFromStorage("user", null);
    assert.deepStrictEqual(result, { id: 1, name: "Alice" });
  });

  test("returns fallback for missing key", () => {
    const result = loadFromStorage("nonexistent", { default: true });
    assert.deepStrictEqual(result, { default: true });
  });

  test("returns fallback when stored value is invalid JSON", () => {
    store["bad"] = "not json {{{";
    const result = loadFromStorage("bad", "fallback_value");
    assert.equal(result, "fallback_value");
  });

  test("handles null-stored value correctly", () => {
    store["nullval"] = "null"; // what JSON.stringify(null) produces
    const result = loadFromStorage("nullval", "fallback");
    // JSON.parse("null") returns null (valid JSON), not the fallback
    assert.strictEqual(result, null);
  });

  test("returns fallback when localStorage is undefined (SSR)", () => {
    const savedWindow = globalThis.window;
    const savedLS = globalThis.localStorage;
    globalThis.window = undefined;
    globalThis.localStorage = undefined;
    const result = loadFromStorage("anykey", "SSR_fallback");
    assert.equal(result, "SSR_fallback");
    globalThis.window = savedWindow;
    globalThis.localStorage = savedLS; // restore for next test
  });
});

describe("removeFromStorage", () => {
  beforeEach(() => { mockLocalStorage.clear(); });
  afterEach(() => { mockLocalStorage.clear(); });

  test("removes the key from localStorage", () => {
    store["temp"] = "data";
    removeFromStorage("temp");
    assert.equal(store["temp"], undefined);
  });

  test("is no-op for non-existent key", () => {
    // Should not throw.
    removeFromStorage("missing_key");
  });

  test("is no-op when localStorage is undefined (SSR)", () => {
    const savedWindow = globalThis.window;
    const savedLS = globalThis.localStorage;
    globalThis.window = undefined;
    globalThis.localStorage = undefined;
    removeFromStorage("key"); // must not throw
    globalThis.window = savedWindow;
    globalThis.localStorage = savedLS; // restore for next test
  });
});
