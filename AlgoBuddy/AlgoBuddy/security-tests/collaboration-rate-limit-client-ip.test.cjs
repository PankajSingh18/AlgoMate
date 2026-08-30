/**
 * Regression tests for client IP extraction used by collaboration rate limiting.
 *
 * Goal: ensure routes do not trust spoofable leftmost X-Forwarded-For values.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

const ipUrl = pathToFileURL(path.join(__dirname, "..", "src", "lib", "getClientIp.js")).href;

async function load() {
  return import(ipUrl);
}

test("getClientIp prefers x-real-ip over x-forwarded-for", async () => {
  const { getClientIp } = await load();
  const headers = new Headers({
    "x-real-ip": "203.0.113.10",
    "x-forwarded-for": "1.1.1.1, 2.2.2.2",
  });
  assert.equal(getClientIp(headers), "203.0.113.10");
});

test("getClientIp walks x-forwarded-for right-to-left skipping private ranges", async () => {
  const { getClientIp } = await load();
  const headers = new Headers({
    "x-forwarded-for": "10.0.0.1, 203.0.113.5, 192.168.1.9",
  });
  assert.equal(getClientIp(headers), "203.0.113.5");
});

test("getClientIp returns unknown when no IP headers exist", async () => {
  const { getClientIp } = await load();
  const headers = new Headers();
  assert.equal(getClientIp(headers), "unknown");
});

