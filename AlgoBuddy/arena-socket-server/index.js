require("dotenv").config({ path: '../.env.local' });
const express = require("express");
const http = require("http");
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
    return this._map.get(key);
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

function isOriginAllowed(origin, callback) {
  // Allow requests with no origin (Render health checks, server-to-server)
  if (!origin) return callback(null, true);
  
  if (
    ALLOWED_ORIGINS.includes(origin) || 
    isAllowedVercelOrigin(origin) ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:") ||
    origin.startsWith("http://192.168.")
  ) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
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
        local el = elements[i]
        local p_socketId = string.match(el, '"socketId"%s*:%s*"([^"]+)"')
        local p_userId = string.match(el, '"userId"%s*:%s*"([^"]+)"')
        if p_socketId == socketId or p_userId == userId then
          redis.call('LREM', existingQueueKey, 0, el)
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

    local oppUserId = string.match(opponentStr, '"userId"%s*:%s*"([^"]+)"')
    local oppSocketId = string.match(opponentStr, '"socketId"%s*:%s*"([^"]+)"')
    local oppName = string.match(opponentStr, '"name"%s*:%s*"([^"]+)"') or 'Player'
    local oppRating = string.match(opponentStr, '"rating"%s*:%s*(%d+)') or '1200'
    local oppLevel = string.match(opponentStr, '"level"%s*:%s*(%d+)') or '1'

    if oppUserId == userId then
      table.insert(skipList, opponentStr)
    else
      for i = #skipList, 1, -1 do
        redis.call('RPUSH', queueKey, skipList[i])
      end
      redis.call('HSET', socketKey, 'queueKey', queueKey)
      return '{"status":"MATCH_FOUND","opponent":{"userId":"' .. oppUserId .. '","socketId":"' .. oppSocketId .. '","name":"' .. oppName .. '","rating":' .. oppRating .. ',"level":' .. oppLevel .. '}}'
    end
  end

  for i = #skipList, 1, -1 do
    redis.call('RPUSH', queueKey, skipList[i])
  end

  local elements = redis.call('LRANGE', queueKey, 0, -1)
  if elements and #elements > 0 then
    for i = 1, #elements do
      local el = elements[i]
      local p_socketId = string.match(el, '"socketId"%s*:%s*"([^"]+)"')
      local p_userId = string.match(el, '"userId"%s*:%s*"([^"]+)"')
      if p_socketId == socketId or p_userId == userId then
        redis.call('LREM', queueKey, 0, el)
      end
    end
  end
  redis.call('RPUSH', queueKey, entry)
  redis.call('HSET', socketKey, 'queueKey', queueKey)
  return '{"status":"QUEUED"}'
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
  local socketKey = KEYS[1]
  local userId = ARGV[1]
  local socketId = ARGV[2]

  local existingQueueKey = redis.call('HGET', socketKey, 'queueKey')
  if existingQueueKey then
    local elements = redis.call('LRANGE', existingQueueKey, 0, -1)
    if elements and #elements > 0 then
      for i = 1, #elements do
        local el = elements[i]
        local p_socketId = string.match(el, '"socketId"%s*:%s*"([^"]+)"')
        local p_userId = string.match(el, '"userId"%s*:%s*"([^"]+)"')
        if p_socketId == socketId or p_userId == userId then
          redis.call('LREM', existingQueueKey, 0, el)
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
  local matchKey = KEYS[1]
  local action = ARGV[1]
  local actorUserId = ARGV[2]

  local matchStr = redis.call('GET', matchKey)
  if not matchStr then return '{"status":"not_found"}' end

  -- Check if the match is already finalized
  if string.find(matchStr, '"status"%s*:%s*"completed"') then
    return '{"status":"already_completed"}'
  end
  if action == "disconnect" and string.find(matchStr, '"status"%s*:%s*"disconnected"') then
    return '{"status":"already_disconnected"}'
  end

  if action == "complete" then
    -- Mark as completed with winner
    local updated = string.gsub(matchStr, '"status"%s*:%s*"[^"]+"', '"status":"completed"')
    if string.find(updated, '"winnerId"') then
      updated = string.gsub(updated, '"winnerId"%s*:%s*"[^"]+"', '"winnerId":"' .. actorUserId .. '"')
    else
      updated = string.gsub(updated, '}%s*$', ',"winnerId":"' .. actorUserId .. '"}')
    end
    redis.call('SET', matchKey, updated, 'EX', 3600)
    -- Extract opponent socketId for notification (match userId, not socketId)
    local opponentSocketId = ''
    for uId, sId in string.gmatch(updated, '"userId"%s*:%s*"([^"]+)"[^}]+"socketId"%s*:%s*"([^"]+)"') do
      if uId ~= actorUserId then
        opponentSocketId = sId
      end
    end
    return '{"status":"completed","winnerId":"' .. actorUserId .. '","opponentSocketId":"' .. opponentSocketId .. '"}'

  elseif action == "disconnect" then
    -- Set disconnected — the remaining player claims win via match_complete
    local updated = string.gsub(matchStr, '"status"%s*:%s*"[^"]+"', '"status":"disconnected"')
    redis.call('SET', matchKey, updated, 'EX', 3600)
    -- Extract opponent info (match userId, not socketId)
    local opponentSocketId = ''
    local opponentUserId = ''
    for uId, sId in string.gmatch(matchStr, '"userId"%s*:%s*"([^"]+)"[^}]+"socketId"%s*:%s*"([^"]+)"') do
      if uId ~= actorUserId then
        opponentUserId = uId
        opponentSocketId = sId
      end
    end
    return '{"status":"disconnected","opponentSocketId":"' .. opponentSocketId .. '","opponentUserId":"' .. opponentUserId .. '"}'
  end
  return '{"status":"unknown_action"}'
`;

const io = new Server(server, {
  cors: {
    origin: isOriginAllowed,
    methods: ["GET", "POST"],
  },
  adapter: createAdapter(pubClient, subClient)
});

io.use((socket, next) => {
  const ip = socket.handshake.address;
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

function verifyAuthToken(token) {
  return new Promise((resolve) => {
    if (!token || !SUPABASE_URL) {
      resolve(null);
      return;
    }
    jwt.verify(token, getKey, { algorithms: ["ES256", "RS256"] }, function (err, decoded) {
      if (err) {
        resolve(null);
      } else {
        resolve(decoded);
      }
    });
  });
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
setInterval(async () => {
  try {
    const queueKeys = [];
    let cursor = '0';
    do {
      const result = await redisClient.scan(cursor, 'MATCH', '{arena}:queue:*', 'COUNT', 100);
      cursor = result[0];
      for (const key of result[1]) {
        const elements = await redisClient.lrange(key, 0, -1);
        let changed = false;
        for (const el of elements) {
          const parsed = JSON.parse(el);
          if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
            await redisClient.lrem(key, 0, el);
            changed = true;
            continue;
          }
          const socket = io.sockets.sockets.get(parsed.socketId);
          if (!socket || !socket.connected) {
            await redisClient.lrem(key, 0, el);
            changed = true;
          }
        }
        if (changed && elements.length === 0) {
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

io.on("connection", async (socket) => {
  // Connection-level rate limiting to prevent JWT brute-forcing
  const clientIp = socket.handshake.address;
  if (isConnectionRateLimited(clientIp)) {
    socket.emit("error", { message: "Too many connection attempts. Please try again later." });
    socket.disconnect(true);
    return;
  }

  // Verify Supabase JWT from handshake auth using JWKS
  const token = socket.handshake.auth?.token;
  const authPayload = await verifyAuthToken(token);
  
  if (!authPayload) {
    const queryUserId = socket.handshake.query?.userId;
    if (queryUserId && queryUserId.startsWith("spectator_")) {
      socket.data.userId = queryUserId;
      console.log(`Spectator connected: ${socket.id}, userId: ${socket.data.userId}`);
    } else {
      socket.emit("error", { message: "Authentication required. Please sign in again." });
      socket.disconnect(true);
      return;
    }
  } else {
    // Store verified userId from the JWT payload
    socket.data.userId = authPayload.sub || authPayload.id;
    console.log(`Authenticated user connected: ${socket.id}, userId: ${socket.data.userId}`);
  }

  socket.on("join_matchmaking", async (data) => {
    try {
      if (await isRateLimited(socket.data.userId)) return;

      console.log(`User joined matchmaking: userId=${socket.data.userId}`);
      const targetTopic = data.topic || "Arrays";
      const targetDifficulty = data.difficulty || "Easy";
      const queueKey = `{arena}:queue:${targetTopic}:${targetDifficulty}`;
      const matchId = `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
        const opponent = result.opponent;

        // Phase 2: Liveness check (before any state mutation)
        const opponentSocket = io.sockets.sockets.get(opponent.socketId);
        if (!opponentSocket || !opponentSocket.connected) {
          // Re-push opponent back to queue (they were popped but no match was created)
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
        }
      } else {
        console.log(`Added to queue ${queueKey}`);
      }
    } catch (error) {
      console.error(`[join_matchmaking] Error for user ${socket.data.userId}:`, error);
      socket.emit("error", { message: "Matchmaking error. Please try again." });
    }
  });

  socket.on("leave_matchmaking", async () => {
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
      
      // Spectator simply joins the socket.io room to receive broadcasts.
      socket.join(data.matchId);
      // We explicitly DO NOT set {arena}:socket:${socket.id} -> matchId in Redis, 
      // preventing the spectator from emitting events.
      console.log(`Spectator ${socket.data.userId} joined match ${data.matchId}`);
    } catch (error) {
      console.error(`[join_spectator] Error for user ${socket.data.userId}:`, error);
    }
  });

  // Duel Room Events
  socket.on("typing_status", async (data) => {
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
    try {
      if (await isRateLimited(socket.data.userId)) return;

      const matchId = await redisClient.hget(`{arena}:socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;

      socket.to(data.matchId).emit("opponent_test_result", {
        userId: socket.data.userId,
        passed: data.passed,
        total: data.total,
        status: data.status,
        failedAttempts: data.failedAttempts
      });
    } catch (error) {
      console.error(`[test_result] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("spectate_match", async (data) => {
    if (!data.matchId) return;
    const room = `${data.matchId}-spectators`;
    socket.join(room);
    const sockets = await io.in(room).fetchSockets();
    io.in(room).emit("spectator_count", { count: sockets.length });
  });

  socket.on("leave_spectate_match", async (data) => {
    if (!data.matchId) return;
    const room = `${data.matchId}-spectators`;
    socket.leave(room);
    const sockets = await io.in(room).fetchSockets();
    io.in(room).emit("spectator_count", { count: sockets.length });
  });

  socket.on("disconnecting", async () => {
    for (const room of socket.rooms) {
      if (room.endsWith("-spectators")) {
        const sockets = await io.in(room).fetchSockets();
        io.in(room).emit("spectator_count", { count: Math.max(0, sockets.length - 1) });
      }
    }
  });

  socket.on("spectator_chat", (data) => {
    if (!data.matchId || !data.message) return;
    socket.to(data.matchId).emit("spectator_chat", {
      userId: socket.data.userId,
      username: socket.handshake.query.username || "Spectator",
      message: data.message,
      timestamp: Date.now()
    });
  });

  socket.on("spectator_emote", (data) => {
    if (!data.matchId || !data.emote) return;
    socket.to(data.matchId).emit("spectator_emote", {
      userId: socket.data.userId,
      emote: data.emote,
      timestamp: Date.now()
    });
  });

  socket.on("match_complete", async (data) => {
    try {
      if (await isRateLimited(socket.data.userId)) return;

      const matchId = await redisClient.hget(`{arena}:socket:${socket.id}`, "matchId");
      if (!matchId || matchId !== data.matchId) return;

      try {
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
      } catch (err) {
        console.error(`[match_complete] Error for user ${socket.data.userId}:`, err);
      }
    } catch (error) {
      console.error(`[match_complete] Error for user ${socket.data.userId}:`, error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      // First, clean up queue entries and socket key
      const existingQueueKey = await redisClient.hget(`{arena}:socket:${socket.id}`, 'queueKey');
      if (existingQueueKey) {
        const elements = await redisClient.lrange(existingQueueKey, 0, -1);
        if (elements && elements.length > 0) {
          for (const el of elements) {
            const pSocketId = el.match(/"socketId"\s*:\s*"([^"]+)"/)?.[1];
            const pUserId = el.match(/"userId"\s*:\s*"([^"]+)"/)?.[1];
            if (pSocketId === socket.id || pUserId === socket.data.userId) {
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

      // Clean up rate limit and socket key
      await redisClient.del(`{arena}:socket:${socket.id}`);
      await redisClient.del(`{arena}:ratelimit:${socket.id}`);

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
    if (debugKey && providedKey !== debugKey) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const clientIp = req.ip || req.connection.remoteAddress;
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
    const { matchId, userId } = req.params;
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

app.get("/health", (req, res) => {
  res.json({ status: "Arena Socket Server is running with Redis!" });
});

async function scanRedisKeys(pattern) {
  let keys = [];
  let cursor = '0';
  do {
    const result = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = result[0];
    keys.push(...result[1]);
  } while (cursor !== '0');
  return keys;
}

app.get("/api/matches/active", async (req, res) => {
  try {
    const matchKeys = await scanRedisKeys("{arena}:match:*");
    const activeMatches = [];
    for (const key of matchKeys) {
      if (key.endsWith(":completed")) continue;
      const matchStr = await redisClient.get(key);
      if (matchStr) {
        const match = JSON.parse(matchStr);
        if (match.status === "in-progress") {
          activeMatches.push(match);
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
