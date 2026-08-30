const { describe, it } = require("node:test");
const assert = require("node:assert");
const http = require("http");
const express = require("express");
const cors = require("cors");

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://algobuddy.vercel.app",
  "https://www.algobuddy.me",
  "https://algobuddy.me",
];

function isAllowedVercelOrigin(origin) {
  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();
    return hostname === 'algobuddy.vercel.app' ||
           hostname.endsWith('.algobuddy.vercel.app');
  } catch {
    return false;
  }
}

function createTestApp() {
  const app = express();
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(new Error("Not allowed by CORS"));
      }
      if (ALLOWED_ORIGINS.includes(origin) || isAllowedVercelOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  }));
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  return app;
}

function makeRequest(origin) {
  return new Promise((resolve, reject) => {
    const app = createTestApp();
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.request({
        hostname: "127.0.0.1",
        port,
        path: "/health",
        method: "GET",
        headers: origin ? { origin } : {},
      }, (res) => {
        let body = "";
        res.on("data", (c) => body += c);
        res.on("end", () => {
          server.close();
          resolve({ status: res.statusCode, headers: res.headers, body });
        });
      });
      req.on("error", (err) => {
        server.close();
        reject(err);
      });
      req.end();
    });
  });
}

describe("CORS origin validation", () => {
  for (const origin of ALLOWED_ORIGINS) {
    it(`allows requests from ${origin}`, async () => {
      const result = await makeRequest(origin);
      assert.strictEqual(result.status, 200);
      assert.strictEqual(result.headers["access-control-allow-origin"], origin);
    });
  }

  it("rejects requests with no Origin header", async () => {
    const result = await makeRequest(null);
    assert.strictEqual(result.status, 500);
  });

  it("rejects requests from disallowed origins", async () => {
    const result = await makeRequest("https://evil.com");
    assert.strictEqual(result.status, 500);
  });

  it("allows requests from algobuddy.vercel.app subdomains", async () => {
    const result = await makeRequest("https://my-branch.algobuddy.vercel.app");
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.headers["access-control-allow-origin"], "https://my-branch.algobuddy.vercel.app");
  });

  it("allows requests from nested algobuddy.vercel.app subdomains", async () => {
    const result = await makeRequest("https://preview.my-branch.algobuddy.vercel.app");
    assert.strictEqual(result.status, 200);
    assert.strictEqual(result.headers["access-control-allow-origin"], "https://preview.my-branch.algobuddy.vercel.app");
  });

  it("rejects requests from arbitrary vercel.app subdomains", async () => {
    const result = await makeRequest("https://evil.vercel.app");
    assert.strictEqual(result.status, 500);
  });

  it("rejects requests from unrelated vercel.app subdomains", async () => {
    const result = await makeRequest("https://attacker-deployment.vercel.app");
    assert.strictEqual(result.status, 500);
  });
});
