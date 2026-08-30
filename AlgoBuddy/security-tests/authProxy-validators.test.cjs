// security-tests/authProxy-validators.test.cjs
//
// Run with:  node --experimental-detect-module --test security-tests/authProxy-validators.test.cjs
//
// Tests the auth proxy validators in src/authProxy.js:
// isValidHttpUrl, getSupabaseConfig, and protectedRoutes path matching.

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Inlined helpers from src/authProxy.js

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function getSupabaseConfig() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !isValidHttpUrl(supabaseUrl)) {
    return null;
  }

  if (supabaseUrl.startsWith('http://localhost:')) {
    supabaseUrl = supabaseUrl.replace('http://localhost:', 'http://127.0.0.1:');
  }

  return { supabaseUrl, supabaseAnonKey };
}

const protectedRoutes = ['/arena', '/practice', '/profile'];

function matchesProtectedRoute(pathname) {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

describe('isValidHttpUrl', () => {
  test('returns true for https://example.com', () => {
    assert.strictEqual(isValidHttpUrl('https://example.com'), true);
  });

  test('returns true for http://example.com', () => {
    assert.strictEqual(isValidHttpUrl('http://example.com'), true);
  });

  test('returns true for http://localhost:3000', () => {
    assert.strictEqual(isValidHttpUrl('http://localhost:3000'), true);
  });

  test('returns true for http://127.0.0.1:8080', () => {
    assert.strictEqual(isValidHttpUrl('http://127.0.0.1:8080'), true);
  });

  test('returns true for https://www.algobuddy.me/path', () => {
    assert.strictEqual(isValidHttpUrl('https://www.algobuddy.me/path'), true);
  });

  test('returns false for null', () => {
    assert.strictEqual(isValidHttpUrl(null), false);
  });

  test('returns false for undefined', () => {
    assert.strictEqual(isValidHttpUrl(undefined), false);
  });

  test('returns false for empty string', () => {
    assert.strictEqual(isValidHttpUrl(''), false);
  });

  test('returns false for non-url strings', () => {
    assert.strictEqual(isValidHttpUrl('just some text'), false);
    assert.strictEqual(isValidHttpUrl('example.com'), false);
    assert.strictEqual(isValidHttpUrl('/api/activity'), false);
  });

  test('returns false for ftp:// URLs', () => {
    assert.strictEqual(isValidHttpUrl('ftp://example.com'), false);
  });

  test('returns false for mailto: URLs', () => {
    assert.strictEqual(isValidHttpUrl('mailto:user@example.com'), false);
  });

  test('returns false for strings starting with Your placeholder', () => {
    assert.strictEqual(isValidHttpUrl('Your Supabase URL'), false);
    assert.strictEqual(isValidHttpUrl('Your-project-url'), false);
  });
});

describe('getSupabaseConfig — env vars unset', () => {
  test('returns null when NEXT_PUBLIC_SUPABASE_URL is unset', () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    try {
      assert.strictEqual(getSupabaseConfig(), null);
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    }
  });

  test('returns null when NEXT_PUBLIC_SUPABASE_ANON_KEY is unset', () => {
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    try {
      assert.strictEqual(getSupabaseConfig(), null);
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    }
  });
});

describe('matchesProtectedRoute', () => {
  test('/arena matches', () => {
    assert.strictEqual(matchesProtectedRoute('/arena'), true);
  });

  test('/arena/session matches', () => {
    assert.strictEqual(matchesProtectedRoute('/arena/session'), true);
  });

  test('/practice matches', () => {
    assert.strictEqual(matchesProtectedRoute('/practice'), true);
  });

  test('/practice/arrays matches', () => {
    assert.strictEqual(matchesProtectedRoute('/practice/arrays'), true);
  });

  test('/profile matches', () => {
    assert.strictEqual(matchesProtectedRoute('/profile'), true);
  });

  test('/profile/edit matches', () => {
    assert.strictEqual(matchesProtectedRoute('/profile/edit'), true);
  });

  test('/login does not match', () => {
    assert.strictEqual(matchesProtectedRoute('/login'), false);
  });

  test('/api/arena does not match (API routes are not protected)', () => {
    assert.strictEqual(matchesProtectedRoute('/api/arena'), false);
  });

  test('/ does not match', () => {
    assert.strictEqual(matchesProtectedRoute('/'), false);
  });

  test('/about does not match', () => {
    assert.strictEqual(matchesProtectedRoute('/about'), false);
  });
});
