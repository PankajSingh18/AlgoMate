import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const srcDir = path.join(repoRoot, "src");
const sqlPath = path.join(repoRoot, "supabase_setup.sql");

const sql = fs.readFileSync(sqlPath, "utf8");

function getSqlFunctionParams(fnName) {
  const re = new RegExp(
    `CREATE\\s+(?:OR\\s+REPLACE\\s+)?FUNCTION\\s+${fnName}\\s*\\(([\\s\\S]*?)\\)\\s+(?:RETURNS|LANGUAGE|AS)\\b`,
    "i"
  );
  const m = sql.match(re);
  if (!m) return null;
  const params = new Set();
  const argRe = /(\w+)\s+[a-z_]\w*\b/gi;
  let am;
  while ((am = argRe.exec(m[1])) !== null) {
    params.add(am[1]);
  }
  return params;
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      out.push(...walk(p));
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

const rpcCallRe = /\.rpc\s*\(\s*['"]([a-zA-Z_][a-zA-Z0-9_]*)['"]\s*,\s*\{([\s\S]*?)\}/g;

const errors = [];
let fileCount = 0;
let callCount = 0;

for (const file of walk(srcDir)) {
  fileCount++;
  const code = fs.readFileSync(file, "utf8");
  let m;
  rpcCallRe.lastIndex = 0;
  while ((m = rpcCallRe.exec(code)) !== null) {
    callCount++;
    const fnName = m[1];
    const argsBlock = m[2];
    const params = getSqlFunctionParams(fnName);
    if (!params) {
      errors.push(
        `${path.relative(repoRoot, file)}: rpc('${fnName}') has no matching CREATE FUNCTION in supabase_setup.sql`
      );
      continue;
    }
    const argNameRe = /(\w+)\s*:/g;
    let am;
    while ((am = argNameRe.exec(argsBlock)) !== null) {
      if (!params.has(am[1])) {
        errors.push(
          `${path.relative(repoRoot, file)}: rpc('${fnName}') passes unknown argument '${am[1]}' (function expects: ${[...params].join(", ")})`
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error(`RPC signature check failed (${errors.length} error(s)):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`RPC signature check passed: scanned ${fileCount} files, ${callCount} supabase.rpc() calls.`);
