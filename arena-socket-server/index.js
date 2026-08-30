require("dotenv").config({ path: '../.env.local' });
const express = require("express");
const http = require("http");
const crypto = require("crypto");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const jwksClient = require('jwks-rsa');
const redisUrl = process.env.REDIS_URL;
const Redis = redisUrl ? require("ioredis") : require("ioredis-mock");
const { createAdapter } = require("@socket.io/redis-adapter");

class BoundedMap {
  constructor(maxSize = 10000) {
    this.maxSize = maxSize;
    this._map = new Map();
  }
  get(key) {
    const value = this._map.get(key);
    if (value !== undefined) {
      this._map.delete(key);
      this._map.set(key, value);
    }
    return value;
  }
  set(key, value) {
    if (this._map.has(key)) {
      this._map.delete(key);
    } else if (this._map.size >= this.maxSize) {
      const oldest = this._map.keys().next().value;
      if (oldest !== undefined) this._map.delete(oldest);
    }
    this._map.set(key, value);
  }
  delete(key) {
    return this._map.delete(key);
  }
  entries() {
    return this._map.entries();
  }
  get size() {
    return this._map.size;
  }
}

const app = express();
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://algobuddy.vercel.app",
  "https://www.algobuddy.me",
  "https://algobuddy.me"
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

// Only used outside production, and only for an exact host:port a
// developer opts into via LAN_DEV_ORIGIN — never a whole /16 CIDR range.
const LAN_DEV_ORIGIN = process.env.LAN_DEV_ORIGIN || null;
const isProduction = process.env.NODE_ENV === "production";

function isOriginAllowed(origin, callback) {
  // Allow requests with no origin (Render health checks, server-to-server)
  if (!origin) return callback(null, true);

  if (
    ALLOWED_ORIGINS.includes(origin) ||
    isAllowedVercelOrigin(origin) ||
    (typeof origin === 'string' && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
  ) {
    return callback(null, true);
  }

  // SECURITY: the previous `origin.startsWith("http://192.168.")` check
  // trusted the ENTIRE private 192.168.0.0/16 range (65k+ hosts) as a
  // valid Socket.IO origin in production — any page hosted by another
  // device on a shared network (coffee shop, campus, office Wi-Fi) would
  // be treated as trusted, enabling cross-site WebSocket hijacking. LAN
  // testing is now opt-in, non-production only, and pinned to one exact
  // origin via LAN_DEV_ORIGIN instead of a whole CIDR block.
  if (!isProduction && LAN_DEV_ORIGIN && origin === LAN_DEV_ORIGIN) {
    return callback(null, true);
  }

  callback(new Error("Not allowed by CORS"));
}

// Strict variant for Socket.IO — does NOT allow falsy origins,
// preventing WebSocket origin validation bypass.
function isSocketOriginAllowed(origin, callback) {
  if (!origin) {
    return callback(new Error("Not allowed by CORS"));
  }
  return isOriginAllowed(origin, callback);
}

app.use(cors({
  origin: isOriginAllowed,
  methods: ["GET", "POST"],
}));

const server = http.createServer(app);

// Redis setup
const pubClient = redisUrl ? new Redis(redisUrl) : new Redis();
const subClient = pubClient.duplicate();
const redisClient = pubClient.duplicate();

// Phase 1: Atomically pop an opponent from the queue WITHOUT creating match state
const ATOMIC_POP_OPPONENT_SCRIPT = `
  local cjson = require("cjson")
  local queueKey = KEYS[1]
  local socketKey = KEYS[2]
  local entry = ARGV[1]
  local userId = ARGV[2]
  local socketId = ARGV[3]
  local maxAttempts = tonumber(ARGV[4]) or 5

  local existingQueueKey = redis.call('HGET', socketKey, 'queueKey')
  if existingQueueKey then
    local elements = redis.call('LRANGE', existingQueueKey, 0, -1)
    if elements and #elements > 0 then
      for i = 1, #elements do
        local el = cjson.decode(elements[i])
        if el.socketId == socketId or el.userId == userId then
          redis.call('LREM', existingQueueKey, 0, elements[i])
        end
      end
    end
  end

  local skipList = {}
  for attempt = 1, maxAttempts do
    local opponentStr = redis.call('LPOP', queueKey)
    if not opponentStr then
      break
    end

    local opp = cjson.decode(opponentStr)
    if opp.userId == userId then
      table.insert(skipList, opponentStr)
    else
      for i = #skipList, 1, -1 do
        redis.call('RPUSH', queueKey, skipList[i])
      end
      redis.call('HSET', socketKey, 'queueKey', queueKey)
      return cjson.encode({
        status = "MATCH_FOUND",
        opponent = {
          userId = opp.userId,
          socketId = opp.socketId,
          name = opp.name or "Player",
          rating = tonumber(opp.rating) or 1200,
          level = tonumber(opp.level) or 1
        }
      })
    end
  end

  for i = #skipList, 1, -1 do
    redis.call('RPUSH', queueKey, skipList[i])
  end

  local elements = redis.call('LRANGE', queueKey, 0, -1)
  if elements and #elements > 0 then
    for i = 1, #elements do
      local el = cjson.decode(elements[i])
      if el.socketId == socketId or el.userId == userId then
        redis.call('LREM', queueKey, 0, elements[i])
      end
    end
  end
  redis.call('RPUSH', queueKey, entry)
  redis.call('HSET', socketKey, 'queueKey', queueKey)
  return cjson.encode({ status = "QUEUED" })
`;

      // Phase 2: Atomically create match state (only called after JS confirms liveness)
      const ATOMIC_CREATE_MATCH_SCRIPT = `
  local matchKey = KEYS[1]
  local socketKey = KEYS[2]
  local oppKey = KEYS[3]
  local matchDetails = ARGV[1]

  local created = redis.call('SET', matchKey, matchDetails, 'NX', 'EX', 3600)
  if created then
    redis.call('HSET', socketKey, 'matchId', matchKey)
    redis.call('HSET', oppKey, 'matchId', matchKey)
    redis.call('HDEL', socketKey, 'queueKey')
    redis.call('HDEL', oppKey, 'queueKey')
    return '{"status":"CREATED"}'
  end
  return '{"status":"FAILED"}'
`;

const ATOMIC_LEAVE_MATCHMAKING_SCRIPT = `
  local cjson = require("cjson")
  local socketKey = KEYS[1]
  local userId = ARGV[1]
  local socketId = ARGV[2]

  local existingQueueKey = redis.call('HGET', socketKey, 'queueKey')
  if existingQueueKey then
    local elements = redis.call('LRANGE', existingQueueKey, 0, -1)
    if elements and #elements > 0 then
      for i = 1, #elements do
        local el = cjson.decode(elements[i])
        if el.socketId == socketId or el.userId == userId then
          redis.call('LREM', existingQueueKey, 0, elements[i])
        end
      end
    end
    redis.call('HDEL', socketKey, 'queueKey')
  end
  return 1
`;

// Unified atomic match update script — handles both "complete" and "disconnect"
// without race conditions. Using a single script eliminates the TOCTOU gap
// between separate disconnect and complete scripts.
const ATOMIC_MATCH_UPDATE_SCRIPT = `
  local cjson = require("cjson")
  local matchKey = KEYS[1]
  local action = ARGV[1]
  local actorUserId = ARGV[2]

  local matchStr = redis.call('GET', matchKey)
  if not matchStr then return cjson.encode({ status = "not_found" }) end

  local match = cjson.decode(matchStr)

  -- Check if the match is already finalized
  if match.status == "completed" then
    return cjson.encode({ status = "already_completed" })
  end
  if action == "disconnect" and match.status == "disconnected" then
    return cjson.encode({ status = "already_disconnected" })
  end

  if action == "complete" then
    match.status = "completed"
    match.winnerId = actorUserId
    redis.call('SET', matchKey, cjson.encode(match), 'EX', 3600)
    -- Extract opponent socketId for notification
    local opponentSocketId = ''
    if match.players then
      for _, p in ipairs(match.players) do
        if p.userId ~= actorUserId then
          opponentSocketId = p.socketId
        end
      end
    end
    return cjson.encode({ status = "completed", winnerId = actorUserId, opponentSocketId = opponentSocketId })

  elseif action == "disconnect" then
    match.status = "disconnected"
    -- Award win to the remaining player
    if match.players then
      for _, p in ipairs(match.players) do
        if p.userId ~= actorUserId then
          match.winnerId = p.userId
        end
      end
    end
    redis.call('SET', matchKey, cjson.encode(match), 'EX', 3600)
    -- Extract opponent info
    local opponentSocketId = ''
    local opponentUserId = ''
    if match.players then
      for _, p in ipairs(match.players) do
        if p.userId ~= actorUserId then
          opponentUserId = p.userId
          opponentSocketId = p.socketId
        end
      end
    end
    return cjson.encode({ status = "disconnected", opponentSocketId = opponentSocketId, opponentUserId = opponentUserId })
  end
  return cjson.encode({ status = "unknown_action" })
`;

const io = new Server(server, {
  cors: {
    origin: isSocketOriginAllowed,
    methods: ["GET", "POST"],
  },
  adapter: createAdapter(pubClient, subClient)
});

io.use((socket, next) => {
  const headers = socket.handshake.headers || {};
  const realIp = headers["x-real-ip"];
  const ip = (realIp && typeof realIp === "string") ? realIp.trim() : socket.handshake.address;
  if (isConnectionRateLimited(ip)) {
    return next(new Error("Rate limited"));
  }
  next();
});

const PORT = process.env.PORT || 4000;

// JWT Authentication
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

const client = jwksClient({
  jwksUri: `${SUPABASE_URL}/auth/v1/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err, null);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Supabase JWTs are signed with the auth endpoint as the issuer and
// `authenticated` as the audience. Validating both (plus `role`) is what
// distinguishes real user sessions from the public anon key (role `anon`)
// or a service-role key (role `service_role`).
const SUPABASE_ISSUER = `${(SUPABASE_URL || "").replace(/\/+$/, "")}/auth/v1`;

function verifyAuthToken(token) {
  return new Promise((resolve) => {
    if (!token || !SUPABASE_URL) {
      resolve(null);
      return;
    }
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ["ES256", "RS256"],
        issuer: SUPABASE_ISSUER,
        audience: "authenticated"
      },
      function (err, decoded) {
        if (err) {
          resolve(null);
        } else if (
          !decoded ||
          typeof decoded.sub !== "string" ||
          decoded.sub.length === 0 ||
          decoded.role !== "authenticated"
        ) {
          resolve(null);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}

// Fixed, server-controlled base URL used for server-side code verification.
// This must NEVER be derived from the client handshake `origin` — a scripted
// socket.io client controls that header and would redirect the server to an
// attacker-chosen host (SSRF). Configure it in production (e.g. CODE_LAB_BASE_URL
// in the Render dashboard / env). Falls back to localhost for local dev only.
const CODE_LAB_BASE_URL = (process.env.CODE_LAB_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");

// Only the JavaScript sandbox can be executed server-side today, so only
// `javascript`/`js` submissions can receive a server-side verdict. Every other
// language (Python, C++, Java, ...) fails closed: a win can never be claimed
// without server-side evidence the code passed.
const VERIFIABLE_LANGUAGES = new Set(["javascript", "js"]);
const VERIFIED_TOPICS = new Set(["Arrays", "Strings"]);

function buildVerificationCode(code, topic) {
  let verificationCode = typeof code === "string" ? code : "";
  if (topic === "Arrays") {
    verificationCode += `\n;
if (typeof twoSum !== 'function' || JSON.stringify(twoSum([2,7,11,15], 9)) !== '[0,1]' || JSON.stringify(twoSum([3,2,4], 6)) !== '[1,2]') {
  throw new Error("Validation test cases failed!");
}`;
  } else if (topic === "Strings") {
    verificationCode += `\n;
if (typeof isAnagram !== 'function' || isAnagram("anagram", "nagaram") !== true || isAnagram("rat", "car") !== false) {
  throw new Error("Validation test cases failed!");
}`;
  }
  return verificationCode;
}

async function verifyCodeServerSide(code, language, topic, token) {
  const lang = (language || "javascript").toLowerCase();
  if (!VERIFIABLE_LANGUAGES.has(lang)) {
    return { success: false, status: "UNSUPPORTED_LANGUAGE" };
  }
  if (!VERIFIED_TOPICS.has(topic)) {
    return { success: false, status: "UNSUPPORTED_TOPIC" };
  }
  const verificationCode = buildVerificationCode(code, topic);
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`${CODE_LAB_BASE_URL}/api/code-lab`, {
      method: "POST",
      headers,
      body: JSON.stringify({ code: verificationCode })
    });

    if (!res.ok) {
      return { success: false, status: "VERIFICATION_FAILED" };
    }

    const resData = await res.json();
    const isSuccess = resData.status === 3 || resData.status === "SUCCESS";
    return { success: isSuccess, status: isSuccess ? "SUCCESS" : "FAILED" };
  } catch (verErr) {
    console.error("[arena] Code verification request failed:", verErr);
    return { success: false, status: "VERIFICATION_UNAVAILABLE" };
  }
}

// Connection rate limiting to prevent JWT brute-forcing
const connectionAttempts = new BoundedMap(10000);
const MAX_CONNECTION_ATTEMPTS = 5;
const CONNECTION_ATTEMPT_WINDOW_MS = 60000;

function isConnectionRateLimited(ip) {
  const now = Date.now();
  const entry = connectionAttempts.get(ip);
  if (!entry || now > entry.resetTime) {
    connectionAttempts.set(ip, { count: 1, resetTime: now + CONNECTION_ATTEMPT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_CONNECTION_ATTEMPTS;
}

// Periodic queue health checker to remove stale entries from matchmaking queues
const INSTANCE_ID = crypto.randomUUID();
setInterval(async () => {
  try {
    const lockAcquired = await redisClient.set('{arena}:health:lock', INSTANCE_ID, 'PX', 25000, 'NX');
    if (!lockAcquired) return;

    const queueKeys = [];
    let cursor = '0';
    do {
      const result = await redisClient.scan(cursor, 'MATCH', '{arena}:queue:*', 'COUNT', 100);
      cursor = result[0];
      for (const key of result[1]) {
        const elements = await redisClient.lrange(key, 0, -1);
        let changed = false;
        let remainingCount = elements.length;
        for (const el of elements) {
          let parsed;
          try {
            parsed = JSON.parse(el);
          } catch (parseErr) {
            console.error('[queue-health] Corrupted queue entry, removing:', el.slice(0, 100));
            await redisClient.lrem(key, 0, el);
            changed = true;
            remainingCount--;
            continue;
          }
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            await redisClient.lrem(key, 0, el);
            changed = true;
            remainingCount--;
            continue;
          }
          const socket = io.sockets.sockets.get(parsed.socketId);
          if (!socket || !socket.connected) {
            await redisClient.lrem(key, 0, el);
            changed = true;
            remainingCount--;
          }
        }
        if (changed && remainingCount === 0) {
          await redisClient.expire(key, 60);
        }
      }
    } while (cursor !== '0');
  } catch (err) {
    console.error('[queue-health] Error cleaning stale entries:', err.message);
  }
}, 30000);

// Rate Limiting Config (Redis-backed token bucket)
const MAX_TOKENS = 10;
const REFILL_RATE_MS = 200;

async function isRateLimited(userId) {
  const key = `{arena}:ratelimit:${userId}`;
  const now = Date.now();

  const script = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local max_tokens = tonumber(ARGV[2])
    local refill_rate = tonumber(ARGV[3])
    
    local data = redis.call('HMGET', key, 'tokens', 'lastRequestTime')
    local tokens = tonumber(data[1])
    local lastRequestTime = tonumber(data[2])
    
    if not tokens then
      redis.call('HMSET', key, 'tokens', max_tokens - 1, 'lastRequestTime', now)
      redis.call('EXPIRE', key, 60)
      return 0
    end
    
    local timePassed = now - lastRequestTime
    local tokensToAdd = math.floor(timePassed / refill_rate)
    
    if tokensToAdd > 0 then
      tokens = math.min(max_tokens, tokens + tokensToAdd)
      lastRequestTime = now
    end
    
    if tokens > 0 then
      redis.call('HMSET', key, 'tokens', tokens - 1, 'lastRequestTime', lastRequestTime)
      redis.call('EXPIRE', key, 60)
      return 0
    end
    return 1
  `;

  const result = await redisClient.eval(script, 1, key, now, MAX_TOKENS, REFILL_RATE_MS);
  return result === 1;
}

// Spectator rate limiting to prevent chat spam
const spectatorRateLimit = new BoundedMap(5000);

function isSpectatorRateLimited(userId) {
  const key = `chat:${userId}`;
  const entry = spectatorRateLimit.get(key);
  if (!entry || Date.now() > entry.resetTime) {
    spectatorRateLimit.set(key, { count: 1, resetTime: Date.now() + 10000 });
    return false;
  }
  entry.count++;
  return entry.count > 5;
}

io.on("connection", async (socket) => {
  // Verify Supabase JWT from handshake auth using JWKS
  const token = socket.handshake.auth?.token;
  const authPayload = await verifyAuthToken(token);
  
  if (!authPayload) {
    socket.data.userId = `spectator_${crypto.randomUUID()}`;
    socket.data.isSpectator = true;
    console.log(`Spectator connected: ${socket.id}`);
  } else {
    // Store verified userId from the JWT payload
    socket.data.userId = authPayload.sub || authPayload.id;
    socket.data.token = token;
    console.log(`Authenticated user connected: ${socket.id}, userId: ${socket.data.userId}`);
  }

  await redisClient.hset(`{arena}:socket:${socket.id}`, 'connected', '1');

  socket.on("join_matchmaking", async (data) => {
    if (socket.data.isSpectator) return;
    let opponent = null;
    let targetTopic = data.topic || "Arrays";
    let targetDifficulty = data.difficulty || "Easy";
    let queueKey = `{arena}:queue:${targetTopic}:${targetDifficulty}`;
    try {
      if (await isRateLimited(socket.data.userId)) return;

      console.log(`User joined matchmaking: userId=${socket.data.userId}`);
      const matchId = `match-${Date.now()}-${crypto.randomUUID().split('-')[0]}`;
      const matchKey = `{arena}:match:${matchId}`;

      const queueEntry = JSON.stringify({
        ...data,
        userId: socket.data.userId,
        topic: targetTopic,
        difficulty: targetDifficulty,
        socketId: socket.id,
      });

      // Phase 1: Atomically pop opponent from queue (no match state created yet)
      const resultStr = await redisClient.eval(
        ATOMIC_POP_OPPONENT_SCRIPT,
        2,
        queueKey,
        `{arena}:socket:${socket.id}`,
        queueEntry,
        socket.data.userId,
        socket.id,
        5,
      );

      const result = JSON.parse(resultStr);

      if (result.status === 'MATCH_FOUND') {
        opponent = result.opponent;

        // Phase 2: Cross-instance liveness check via Redis
        const opponentAlive = await redisClient.exists(`{arena}:socket:${opponent.socketId}`);
        if (!opponentAlive) {
          const opponentEntry = JSON.stringify({
            userId: opponent.userId,
            socketId: opponent.socketId,
            name: opponent.name || "Player",
            rating: opponent.rating || 1200,
            level: opponent.level || 1,
            topic: targetTopic,
            difficulty: targetDifficulty,
          });
          await redisClient.rpush(queueKey, opponentEntry);
          console.log(`Opponent disconnected, re-queued opponent: ${opponent.userId}`);

          // Re-queue the requesting player so they can be matched next cycle
          const reQueueEntry = JSON.stringify({
            userId: socket.data.userId,
            socketId: socket.id,
            name: socket.data.name || "Player",
            rating: socket.data.rating || 1200,
            level: socket.data.level || 1,
            topic: targetTopic,
            difficulty: targetDifficulty,
          });
          await redisClient.rpush(queueKey, reQueueEntry);
          await redisClient.hset(`{arena}:socket:${socket.id}`, 'queueKey', queueKey);

          socket.emit("matchmaking_retry", { message: "Opponent unavailable, searching for another..." });
          return;
        }

        // Phase 3: Create match atomically (only if opponent is alive)
        const fullMatchDetails = JSON.stringify({
          matchId,
          topic: targetTopic,
          difficulty: targetDifficulty,
          status: "in-progress",
          players: [
            { userId: opponent.userId, name: opponent.name, socketId: opponent.socketId },
            { userId: socket.data.userId, name: data.name || "Player", socketId: socket.id },
          ],
        });

        const createResult = await redisClient.eval(
          ATOMIC_CREATE_MATCH_SCRIPT,
          3,
          matchKey,
          `{arena}:socket:${socket.id}`,
          `{arena}:socket:${opponent.socketId}`,
          fullMatchDetails,
        );

        const createParsed = JSON.parse(createResult);

        if (createParsed.status === 'CREATED') {
          const fullMatch = JSON.parse(fullMatchDetails);
          io.to(opponent.socketId).emit("match_found", fullMatch);
          io.to(socket.id).emit("match_found", fullMatch);

          socket.join(matchId);
          io.in(opponent.socketId).socketsJoin(matchId);

          console.log(`Match found: ${opponent.userId} vs ${socket.data.userId}`);
        } else {
          const opponentEntry = JSON.stringify({
            userId: opponent.userId,
            socketId: opponent.socketId,
            name: opponent.name || "Player",
            rating: opponent.rating || 1200,
            level: opponent.level || 1,
            topic: targetTopic,
            difficulty: targetDifficulty,
          });
          await redisClient.rpush(queueKey, opponentEntry);
          console.log(`Match creation failed (status: ${createParsed.status}), re-queued opponent: ${opponent.userId}`);
          socket.emit("matchmaking_error", { message: "Could not create match. Please try again." });
        }
      } else {
        console.log(`Added to queue ${queueKey}`);
      }
    } catch (error) {
      console.error(`[join_matchmaking] Error for user ${socket.data.userId}:`, error);
      if (opponent) {
        const opponentEntry = JSON.stringify({
          userId: opponent.userId,
          socketId: opponent.socketId,
          name: opponent.name || "Player",
          rating: opponent.rating || 1200,
          level: opponent.level || 1,
          topic: targetTopic,
          difficulty: targetDifficulty,
        });
        await redisClient.rpush(queueKey, opponentEntry);
        console.log(`Error during matchmaking, re-queued opponent: ${opponent.userId}`);
      }
      socket.emit("error", { message: "Matchmaking error. Please try again." });
    }
  });

  socket.on("leave_matchmaking", async () => {
    if (socket.data.isSpectator) return;
    try {
      if (await isRateLimited(socket.data.userId)) return;
      await redisClient.eval(
        ATOMIC_LEAVE_MATCHMAKING_SCRIPT,
        1,
        `{arena}:socket:${socket.id}`,
        socket.data.userId,
        socket.id,
      );
    } catch (error) {
      console.error(`[leave_matchmaking] Error for user ${socket.data.userId}:`, error);
      socket.emit("error", { message: "Error leaving matchmaking. Please try again." });
    }
  });

  socket.on("join_match", async (data) => {
    if (socket.data.isSpectator) return;
    try {
      if (!data.matchId) return;
      const userMatchId = await redisClient.hget(`{arena}:socket:${socket.id}`, "matchId");
      if (!userMatchId || userMatchId !== data.matchId) return;
      const matchStr = await redisClient.get(`{arena}:match:${data.matchId}`);
      if (!matchStr) return;
      const match = JSON.parse(matchStr);
      const isParticipant = match.players && match.players.some(p => p.userId === socket.data.userId);
      if (!isParticipant) return;
      
      socket.join(data.matchId);
      await redisClient.hset(`{arena}:socket:${socket.id}`, "matchId", data.matchId);
      console.log(`Player ${socket.data.userId} re-joined match ${data.matchId}`);
    } catch (error) {
      console.error(`[join_match] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("join_spectator", async (data) => {
    try {
      if (!data.matchId) return;
      const matchStr = await redisClient.get(`{arena}:match:${data.matchId}`);
      if (!matchStr) return;
      
      const room = `${data.matchId}-spectators`;
      socket.join(room);
      const sockets = await io.in(room).fetchSockets();
      io.in(room).emit("spectator_count", { count: sockets.length });
      console.log(`Spectator ${socket.data.userId} joined match ${data.matchId}`);
    } catch (error) {
      console.error(`[join_spectator] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("leave_spectator", async (data) => {
    if (!data.matchId) return;
    const room = `${data.matchId}-spectators`;
    socket.leave(room);
    const sockets = await io.in(room).fetchSockets();
    io.in(room).emit("spectator_count", { count: sockets.length });
  });

  // Duel Room Events
  socket.on("typing_status", async (data) => {
    if (socket.data.isSpectator) return;
    try {
      if (await isRateLimited(socket.data.userId)) return;
      const matchId = await redisClient.hget(`{arena}:socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) {
        console.log(`Player ${socket.data.userId} failed typing_status because matchId doesn't match: expected ${data.matchId}, got ${matchId}`);
        return;
      }

      console.log(`Player ${socket.data.userId} emitted typing_status to room ${data.matchId}`);
      socket.to(data.matchId).emit("opponent_typing_status", {
        isTyping: data.isTyping,
        userId: socket.data.userId,
        linesCoded: data.linesCoded,
        cpm: data.cpm || 0,
        language: data.language
      });
    } catch (error) {
      console.error(`[typing_status] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("test_submit", async (data) => {
    if (socket.data.isSpectator) return;
    try {
      if (await isRateLimited(socket.data.userId)) return;
      const matchId = await redisClient.hget(`{arena}:socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;

      socket.to(data.matchId).emit("opponent_test_submit", { 
        userId: socket.data.userId,
        failedAttempts: data.failedAttempts
      });
    } catch (error) {
      console.error(`[test_submit] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("test_result", async (data) => {
    if (socket.data.isSpectator) return;
    try {
      if (await isRateLimited(socket.data.userId)) return;

      const matchId = await redisClient.hget(`{arena}:socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;

      // The client's self-reported `passed` value is never authoritative.
      // Verify the code server-side and store ONLY the server verdict.
      if (!data.code || typeof data.code !== "string") {
        return socket.emit("error", { message: "Code is required to record a test result" });
      }

      const initialMatchStr = await redisClient.get(`{arena}:match:${matchId}`);
      if (!initialMatchStr) {
        return socket.emit("error", { message: "Cannot record test result: match not found" });
      }
      const match = JSON.parse(initialMatchStr);
      const topic = match.topic || "Arrays";

      const verdict = await verifyCodeServerSide(data.code, data.language, topic, socket.data.token);
      const serverPassed = verdict.success ? 1 : 0;

      await redisClient.hset(
        `{arena}:match:${matchId}:testResults`,
        socket.data.userId,
        JSON.stringify({ passed: serverPassed, total: 1, status: verdict.status, failedAttempts: data.failedAttempts, timestamp: Date.now() })
      );

      socket.to(data.matchId).emit("opponent_test_result", {
        userId: socket.data.userId,
        passed: serverPassed,
        total: 1,
        status: verdict.status,
        failedAttempts: data.failedAttempts
      });
    } catch (error) {
      console.error(`[test_result] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room.endsWith("-spectators")) {
        const roomAdapter = io.sockets.adapter.rooms.get(room);
        if (roomAdapter) {
          const count = Math.max(0, roomAdapter.size - 1);
          io.in(room).emit("spectator_count", { count });
        }
      }
    }
  });

  socket.on("spectator_chat", (data) => {
    if (!data.matchId || !data.message) return;
    if (isSpectatorRateLimited(socket.data.userId)) return;
    if (/<[^>]*>/.test(data.message)) return;
    if (data.message.length > 500) return;
    const safeUsername = `Spectator_${socket.id.slice(0, 6)}`;
    socket.to(data.matchId).emit("spectator_chat", {
      userId: socket.data.userId,
      username: safeUsername,
      message: data.message.slice(0, 500),
      timestamp: Date.now()
    });
  });

  const ALLOWED_EMOTES = new Set(['clap', 'laugh', 'cheer', 'boo', 'wave', 'popcorn', 'cry', 'heart', 'fire', 'thumbsup']);

  socket.on("spectator_emote", (data) => {
    if (!data.matchId || !data.emote) return;
    if (isSpectatorRateLimited(socket.data.userId)) return;
    if (typeof data.emote !== 'string') return;
    if (data.emote.length > 50) return;
    if (/<[^>]*>/.test(data.emote)) return;
    const normalized = data.emote.toLowerCase().trim();
    if (!ALLOWED_EMOTES.has(normalized)) return;
    socket.to(data.matchId).emit("spectator_emote", {
      userId: socket.data.userId,
      emote: data.emote.slice(0, 50),
      timestamp: Date.now()
    });
  });

  socket.on("match_complete", async (data) => {
    if (socket.data.isSpectator) return;
    try {
      if (await isRateLimited(socket.data.userId)) return;

      const matchId = await redisClient.hget(`{arena}:socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;

      try {
        const testResultsStr = await redisClient.hget(
          `{arena}:match:${matchId}:testResults`,
          socket.data.userId
        );

        if (!testResultsStr) {
          return socket.emit("error", { message: "Cannot complete match: no test results recorded" });
        }

        const testResults = JSON.parse(testResultsStr);
        if (!testResults.passed || testResults.passed < 1) {
          return socket.emit("error", { message: "Cannot complete match: insufficient test results" });
        }

        // Server-side verification to prevent client spoofing
        const initialMatchStr = await redisClient.get(`{arena}:match:${matchId}`);
        if (!initialMatchStr) {
          return socket.emit("error", { message: "Cannot complete match: match not found" });
        }
        const match = JSON.parse(initialMatchStr);
        const topic = match.topic || "Arrays";

        // Re-verify the submitted code against a fixed, server-controlled base
        // URL. The handshake `origin` is attacker-controlled (SSRF) and must
        // never be used to build the verification URL. Non-JS languages and
        // unverified topics fail closed — no server verdict means no win.
        const verdict = await verifyCodeServerSide(data.code, data.language, topic, socket.data.token);
        if (!verdict.success) {
          const message = verdict.status === "UNSUPPORTED_LANGUAGE"
            ? "This language does not support server-side verification yet. Please use JavaScript."
            : verdict.status === "UNSUPPORTED_TOPIC"
              ? `Match topic "${topic}" does not support server-side verification yet.`
              : "Your code failed server-side verification test cases!";
          return socket.emit("error", { message });
        }

        const resultStr = await redisClient.eval(
          ATOMIC_MATCH_UPDATE_SCRIPT,
          1,
          `{arena}:match:${matchId}`,
          "complete",
          socket.data.userId
        );

        const result = JSON.parse(resultStr);
        if (result.status === "already_completed") return;
        if (result.status === "not_found") return;

        io.in(matchId).emit("match_ended", { winnerId: socket.data.userId });

        // Clean up socket matchId references
        const matchStr = await redisClient.get(`{arena}:match:${matchId}`);
        if (matchStr) {
          const match = JSON.parse(matchStr);
          for (const p of match.players) {
            await redisClient.hdel(`{arena}:socket:${p.socketId}`, "matchId");
          }
        }
        await redisClient.expire(`{arena}:match:${matchId}`, 60 * 60);
        await redisClient.del(`{arena}:match:${matchId}:testResults`);
      } catch (err) {
        console.error(`[match_complete] Error for user ${socket.data.userId}:`, err);
      }
    } catch (error) {
      console.error(`[match_complete] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("disconnect", async () => {
    if (socket.data.isSpectator) {
      await redisClient.del(`{arena}:socket:${socket.id}`);
      return;
    }

    try {
      // First, clean up queue entries and socket key
      const existingQueueKey = await redisClient.hget(`{arena}:socket:${socket.id}`, 'queueKey');
      if (existingQueueKey) {
        const elements = await redisClient.lrange(existingQueueKey, 0, -1);
        if (elements && elements.length > 0) {
          for (const el of elements) {
            const parsed = JSON.parse(el);
            if (parsed.socketId === socket.id || parsed.userId === socket.data.userId) {
              await redisClient.lrem(existingQueueKey, 0, el);
            }
          }
        }
        await redisClient.hdel(`{arena}:socket:${socket.id}`, 'queueKey');
      }

      // Update match state atomically via unified script
      const matchId = await redisClient.hget(`{arena}:socket:${socket.id}`, "matchId");
      if (matchId) {
        const resultStr = await redisClient.eval(
          ATOMIC_MATCH_UPDATE_SCRIPT,
          1,
          `{arena}:match:${matchId}`,
          "disconnect",
          socket.data.userId
        );

        const result = JSON.parse(resultStr);

        // Only emit opponent_disconnected if the match was actually set to disconnected
        // (i.e., not if it was already completed)
        if (result.status === "disconnected" && result.opponentSocketId && result.opponentUserId) {
          io.to(result.opponentSocketId).emit("opponent_disconnected", { winnerId: result.opponentUserId });
        }

        // Clean up socket matchId references
        for (const sId of [socket.id, result.opponentSocketId].filter(Boolean)) {
          await redisClient.hdel(`{arena}:socket:${sId}`, 'matchId');
        }
      }

      // Clean up socket key (rate limit key expires naturally via TTL)
      await redisClient.del(`{arena}:socket:${socket.id}`);

      console.log(`User disconnected: ${socket.id}`);
    } catch (error) {
      console.error(`[disconnect] Error for user ${socket.id}:`, error);
    }
  });
});

async function scanRedisKeys(pattern) {
  let cursor = '0';
  const keys = [];
  do {
    const result = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = result[0];
    keys.push(...result[1]);
  } while (cursor !== '0');
  return keys;
}

async function getRedisAggregateStats() {
  let totalKeys = 0;
  let stringCount = 0;
  let listCount = 0;
  let hashCount = 0;
  let otherCount = 0;

  let cursor = '0';
  do {
    const result = await redisClient.scan(cursor, 'MATCH', '*', 'COUNT', 100);
    cursor = result[0];
    for (const key of result[1]) {
      totalKeys++;
      const type = await redisClient.type(key);
      if (type === 'string') stringCount++;
      else if (type === 'list') listCount++;
      else if (type === 'hash') hashCount++;
      else otherCount++;
    }
  } while (cursor !== '0');

  return { totalKeys, stringCount, listCount, hashCount, otherCount };
}

// Rate limiter for debug endpoint to prevent brute-force discovery of debug key
const debugRequestCounts = new BoundedMap(10000);

function isDebugRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60000;
  const maxRequests = 5;
  const entry = debugRequestCounts.get(ip);
  if (!entry || now > entry.resetTime) {
    debugRequestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > maxRequests;
}

app.get("/debug", async (req, res) => {
  try {
    const debugEnabled = process.env.DEBUG_ENABLED === 'true';
    if (!debugEnabled) {
      return res.status(404).json({ error: "Not found" });
    }

    const debugKey = process.env.DEBUG_KEY;
    const providedKey = req.headers['x-debug-key'];
    if (!debugKey || providedKey !== debugKey) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const headers = req.headers || {};
    const realIp = headers["x-real-ip"];
    const clientIp = (realIp && typeof realIp === "string") ? realIp.trim() : (req.ip || req.connection.remoteAddress);
    if (isDebugRateLimited(clientIp)) {
      return res.status(429).json({ error: "Too many requests" });
    }

    const stats = await getRedisAggregateStats();

    res.json({
      status: "debug info",
      redis: stats,
      activeConnections: io.engine.clientsCount,
      uptime: process.uptime(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/verify-match/:matchId/:userId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await verifyAuthToken(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const { matchId, userId } = req.params;
    if (decoded.sub !== userId) {
      return res.status(403).json({ error: "userId does not match authenticated user" });
    }
    const matchKey = `{arena}:match:${matchId}`;
    const matchStr = await redisClient.get(matchKey);
    if (!matchStr) {
      return res.json({ verified: false });
    }
    const match = JSON.parse(matchStr);
    const players = match.players || [];
    const isPlayer = players.some(p => p.userId === userId);
    if (!isPlayer) {
      return res.json({ verified: false });
    }
    const opponent = players.find(p => p.userId !== userId);
    res.json({
      verified: true,
      opponentId: opponent ? opponent.userId : null
    });
  } catch (err) {
    console.error("[verify-match] Error:", err.message);
    res.status(500).json({ verified: false, error: err.message });
  }
});

app.get("/api/verify-match-result/:matchId/:userId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await verifyAuthToken(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const { matchId, userId } = req.params;
    if (decoded.sub !== userId) {
      return res.status(403).json({ error: "userId does not match authenticated user" });
    }
    const matchKey = `{arena}:match:${matchId}`;

    const matchStr = await redisClient.get(matchKey);
    if (!matchStr) {
      return res.status(404).json({ error: "Match not found" });
    }

    const match = JSON.parse(matchStr);
    const players = match.players || [];
    const isPlayer = players.some(p => p.userId === userId);
    if (!isPlayer) {
      return res.status(403).json({ error: "Not a participant" });
    }

    // Return actual winner from match state — idempotent, no claim race
    return res.json({
      verified: true,
      winnerId: match.winnerId || null,
      isWinner: match.winnerId === userId
    });
  } catch (err) {
    console.error("[verify-match-result] Error:", err.message);
    res.status(500).json({ verified: false, error: err.message });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "Arena Socket Server is running with Redis!" });
});

app.get("/api/matches/active", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await verifyAuthToken(token);
    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const matchKeys = await scanRedisKeys("{arena}:match:*");
    const activeMatches = [];
    for (const key of matchKeys) {
      if (key.endsWith(":completed")) continue;
      const matchStr = await redisClient.get(key);
      if (matchStr) {
        const match = JSON.parse(matchStr);
        if (match.status === "in-progress") {
          const isParticipant = match.players?.some(p => p.userId === decoded.sub);
          if (isParticipant) {
            activeMatches.push(match);
          }
        }
      }
    }
    res.json({ matches: activeMatches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Arena Socket Server running on port ${PORT}`);
});
