const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

// Helper to resolve paths
const authHelperPath = path.resolve(__dirname, "..", "src", "lib", "auth.js");

// We use dynamic imports to load the auth helper under ESM
test("Authentication Helper - Configuration & Status Logic", async (t) => {
  const { getSupabaseConfig, getAuthenticatedUser, setMockDependencies } = await import(`file://${authHelperPath}`);

  await t.test("getSupabaseConfig returns null if URL is invalid or variables are missing", () => {
    const originalEnv = { ...process.env };
    
    // Test 1: Complete missing config
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    assert.equal(getSupabaseConfig(), null);

    // Test 2: URL not valid protocol
    process.env.NEXT_PUBLIC_SUPABASE_URL = "invalid-url";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-key";
    assert.equal(getSupabaseConfig(), null);

    // Test 3: Valid configuration with SUPABASE_SERVICE_ROLE_KEY
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const config1 = getSupabaseConfig();
    assert.ok(config1);
    assert.equal(config1.supabaseUrl, "https://example.supabase.co");
    assert.equal(config1.supabaseAnonKey, "anon-key");
    assert.equal(config1.supabaseServiceKey, "service-role-key");

    // Test 4: Valid configuration with SUPABASE_SERVICE_KEY (fallback)
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.SUPABASE_SERVICE_KEY = "service-key-alternate";
    const config2 = getSupabaseConfig();
    assert.ok(config2);
    assert.equal(config2.supabaseServiceKey, "service-key-alternate");

    process.env = originalEnv;
  });

  await t.test("getAuthenticatedUser returns CONFIG_ERROR when configuration is missing", async () => {
    const originalEnv = { ...process.env };
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const result = await getAuthenticatedUser();
    assert.equal(result.success, false);
    assert.equal(result.type, "CONFIG_ERROR");

    process.env = originalEnv;
  });

  await t.test("getAuthenticatedUser returns UNAUTHENTICATED when token/user is not found", async () => {
    const originalEnv = { ...process.env };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPABASE_SERVICE_KEY = "service-key";

    // Setup mocks
    const mockCookies = () => ({
      getAll: () => [],
      set: () => {},
    });

    const mockCreateServerClient = () => ({
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    });

    setMockDependencies(mockCookies, mockCreateServerClient);

    const result = await getAuthenticatedUser();
    assert.equal(result.success, false);
    assert.equal(result.type, "UNAUTHENTICATED");

    // Clean mocks
    setMockDependencies(null, null);
    process.env = originalEnv;
  });

  await t.test("getAuthenticatedUser returns AUTH_PROVIDER_ERROR when getUser fails", async () => {
    const originalEnv = { ...process.env };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPABASE_SERVICE_KEY = "service-key";

    // Setup mocks
    const mockCookies = () => ({
      getAll: () => [],
      set: () => {},
    });

    const mockCreateServerClient = () => ({
      auth: {
        getUser: async () => ({ data: null, error: new Error("Network error") }),
      },
    });

    setMockDependencies(mockCookies, mockCreateServerClient);

    const result = await getAuthenticatedUser();
    assert.equal(result.success, false);
    assert.equal(result.type, "AUTH_PROVIDER_ERROR");

    // Clean mocks
    setMockDependencies(null, null);
    process.env = originalEnv;
  });

  await t.test("getAuthenticatedUser returns success: true when user is present", async () => {
    const originalEnv = { ...process.env };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.SUPABASE_SERVICE_KEY = "service-key";

    // Setup mocks
    const mockCookies = () => ({
      getAll: () => [],
      set: () => {},
    });

    const mockCreateServerClient = () => ({
      auth: {
        getUser: async () => ({ data: { user: { id: "user-123", email: "test@example.com" } }, error: null }),
      },
    });

    setMockDependencies(mockCookies, mockCreateServerClient);

    const result = await getAuthenticatedUser();
    assert.equal(result.success, true);
    assert.ok(result.user);
    assert.equal(result.user.id, "user-123");

    // Clean mocks
    setMockDependencies(null, null);
    process.env = originalEnv;
  });
});

test("Static Security Audit - Protected Routes fail-closed", () => {
  const routes = [
    "src/app/api/complexity-estimator/route.js"
  ];

  for (const route of routes) {
    const fullPath = path.resolve(__dirname, "..", route);
    const content = fs.readFileSync(fullPath, "utf8");

    // 1. Must import getAuthenticatedUser from '@/lib/auth'
    assert.match(
      content,
      /import\s+\{\s*getAuthenticatedUser\s*\}\s+from\s+["']@\/lib\/auth["']/,
      `${route} must import getAuthenticatedUser from auth library`
    );

    // 2. Must not contain the old configured/user bypass pattern: configured && !user
    assert.doesNotMatch(
      content,
      /configured\s*&&\s*!user/,
      `${route} must not use fail-open (configured && !user) pattern`
    );

    // 3. Must check authResult.type for CONFIG_ERROR
    assert.match(
      content,
      /CONFIG_ERROR/,
      `${route} must explicitly handle CONFIG_ERROR`
    );

    // 4. Must check authResult.type for AUTH_PROVIDER_ERROR
    assert.match(
      content,
      /AUTH_PROVIDER_ERROR/,
      `${route} must explicitly handle AUTH_PROVIDER_ERROR`
    );

    // 5. Must return 401 for unauthenticated
    assert.match(
      content,
      /401/,
      `${route} must reject unauthenticated requests with a 401 response`
    );

    // 6. Must return 500 for configuration errors
    assert.match(
      content,
      /500/,
      `${route} must return 500 when configuration or provider error occurs`
    );
  }
});
