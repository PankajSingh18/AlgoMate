// app/api/chatbot/route.js
// Fix for Issue #2694: Adds input length cap, sliding window context,
// friendly token-limit error messages, and Upstash Redis rate limiting.

import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getClientIp } from "@/lib/getClientIp";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — Tune these values here in one place if needed
// ─────────────────────────────────────────────────────────────────────────────

// Max characters a single user message can contain
const MAX_INPUT_LENGTH = 2000;

// How many conversation turns (user + AI pairs) to keep in context.
// Keeping the last 10 pairs = 20 messages max ever sent to Gemini.
// This keeps token usage bounded regardless of session length.
const MAX_HISTORY_TURNS = 10;

// Rate limit: max 10 chatbot requests per user per 60 seconds.
// Uses a sliding window so it's not a hard reset at the minute boundary.
const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW = "60 s";

// ─────────────────────────────────────────────────────────────────────────────
// UPSTASH REDIS RATE LIMITER
// Uses the UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars
// that are already documented in EnvExample.txt — no new setup needed.
// ─────────────────────────────────────────────────────────────────────────────
// During local development / testing without a real Redis URL,
// use a dummy rate limiter that never blocks.
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const isRedisConfigured = redisUrl && !redisUrl.includes("your-upstash-redis-rest-url");
const ratelimit = isRedisConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW),
      prefix: "algobuddy:chatbot",
    })
  : {
      limit: async () => ({ success: true, limit: 10, remaining: 10, reset: Date.now() + 60000 }),
    };

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI CLIENT
// ─────────────────────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The system prompt sets Gemini's personality and scope.
// Keeping it here (not sent by the client) prevents users from
// overriding it with a long preamble.
const SYSTEM_PROMPT = `You are AlgoBuddy AI, a friendly and concise teaching assistant 
specialised in Data Structures and Algorithms (DSA). 
Help students understand concepts clearly with simple explanations and short code examples. 
Keep answers focused and educational. If asked about unrelated topics, 
politely redirect the conversation back to DSA.`;

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/chatbot
// Expected request body:
//   {
//     message: string,          // The user's new message
//     history: Array<{          // Previous conversation turns (sent by frontend)
//       role: "user" | "model",
//       parts: [{ text: string }]
//     }>
//   }
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    // ── 0. AUTHENTICATION ─────────────────────────────────────────────────────
    const authResult = await getAuthenticatedUser();
    if (!authResult.success) {
      if (authResult.type === "CONFIG_ERROR" || authResult.type === "AUTH_PROVIDER_ERROR") {
        return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 });
      }
      return NextResponse.json({ error: "Authentication required to use the AI Chatbot." }, { status: 401 });
    }

    // ── 1. RATE LIMITING ──────────────────────────────────────────────────────
    const rateLimitId = authResult.user?.id || getClientIp(request);

    const { success, limit, remaining, reset } = await ratelimit.limit(rateLimitId);

    if (!success) {
      // Tell the user clearly AND tell the frontend how long to wait.
      return NextResponse.json(
        {
          error:
            "You're sending messages too quickly! Please wait a moment before asking another question.",
          retryAfter: Math.ceil((reset - Date.now()) / 1000), // seconds until reset
        },
        {
          status: 429, // HTTP 429 = Too Many Requests
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }

    // ── 2. PARSE REQUEST BODY ─────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request format. Please try again." },
        { status: 400 }
      );
    }

    const { message, history = [], currentUrl = "unknown" } = body;

    // ── 3. INPUT VALIDATION ───────────────────────────────────────────────────
    // Check message exists and is a string
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string." },
        { status: 400 }
      );
    }

    // Trim whitespace from the message
    const trimmedMessage = message.trim();

    // Check the message isn't empty after trimming
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    // ── KEY FIX #1: Input length cap ──────────────────────────────────────────
    // A single message over 2000 characters is almost certainly a paste of
    // a long problem description or code dump. We cap it here on the server
    // so the user can't bypass a frontend character limit.
    if (trimmedMessage.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Your message is too long (${trimmedMessage.length} characters). Please keep messages under ${MAX_INPUT_LENGTH} characters. Try breaking your question into smaller parts!`,
        },
        { status: 400 }
      );
    }

    // ── 4. VALIDATE HISTORY SHAPE ─────────────────────────────────────────────
    // The history comes from the frontend. We validate its basic shape
    // to avoid passing garbage to Gemini.
    if (!Array.isArray(history)) {
      return NextResponse.json(
        { error: "History must be an array." },
        { status: 400 }
      );
    }

    // ── KEY FIX #2: Sliding window context truncation ─────────────────────────
    // This is the core fix for the unbounded context growth issue.
    //
    // HOW IT WORKS:
    // Imagine history = [msg1, msg2, msg3, ... msg50].
    // MAX_HISTORY_TURNS = 10, so MAX_HISTORY_TURNS * 2 = 20.
    // We do history.slice(-20) which keeps only the LAST 20 items.
    // The system prompt is always prepended separately (it never grows).
    // Result: total context = system_prompt + last 20 messages + new message.
    // This is bounded no matter how long the conversation gets.
    const truncatedHistory = history.slice(-(MAX_HISTORY_TURNS * 2));

    // ── 5. CALL GEMINI API ────────────────────────────────────────────────────
    
    // Dynamically inject the user's current URL for Context Awareness
    const dynamicSystemPrompt = `${SYSTEM_PROMPT}\n\n[CONTEXT]: The user is currently viewing the page at URL path: ${currentUrl}. If they ask a vague question (e.g. 'explain this', 'give me an example'), assume they are asking about the algorithm or topic related to this page.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Fast and free-tier friendly
      systemInstruction: dynamicSystemPrompt,
    });

    // Start a chat session with the truncated history
    const chat = model.startChat({
      history: truncatedHistory,
      generationConfig: {
        maxOutputTokens: 1024, // Cap the response length too — prevents runaway long answers
        temperature: 0.7,      // Slightly creative but still accurate
      },
    });

    // Send the new message and get a response
    const result = await chat.sendMessage(trimmedMessage);
    const responseText = result.response.text();

    // ── 6. RETURN SUCCESS RESPONSE ────────────────────────────────────────────
    return NextResponse.json(
      {
        response: responseText,
        // Send back how many history items were actually used (useful for debugging)
        contextUsed: truncatedHistory.length,
        // Warn the frontend if we truncated history so it can show a subtle notice
        historyTruncated: history.length > truncatedHistory.length,
      },
      { status: 200 }
    );

  } catch (error) {
    // ── KEY FIX #3: Friendly error messages ───────────────────────────────────
    // Inspect the error from Gemini and return a human-readable message
    // instead of leaking a raw stack trace or showing a blank spinner.

    console.error("[Chatbot API Error]:", error?.message ?? error);

    const errorMessage = error?.message?.toLowerCase() ?? "";
    const errorStatus = error?.status;

    // ── Check for API key / auth issues FIRST ─────────────────────────────────
    // This must come before the generic 400 check so that invalid key errors
    // don't get mistaken for token‑limit problems.
    if (
      errorMessage.includes("api key") ||
      errorMessage.includes("unauthorized") ||
      errorStatus === 401 ||
      errorStatus === 403
    ) {
      return NextResponse.json(
        { error: "The AI service is temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      );
    }

    // ── Now check for actual context / token limit errors ─────────────────────
    const isTokenLimitError =
      errorMessage.includes("resource_exhausted") ||
      errorMessage.includes("context length exceeded") ||
      errorMessage.includes("too many tokens") ||
      // Keep "token" but be more specific to avoid false positives
      (errorMessage.includes("token") && errorMessage.includes("limit"));

    if (isTokenLimitError || (errorStatus === 400 && errorMessage.includes("request"))) {
      return NextResponse.json(
        {
          error:
            "This conversation has gotten too long for me to remember everything! 🧠 Please start a fresh chat to continue getting help. Your learning progress is saved!",
          code: "CONTEXT_LIMIT_EXCEEDED",
        },
        { status: 400 }
      );
    }

    // Generic fallback for all other unexpected errors
    return NextResponse.json(
      {
        error:
          "Something went wrong while getting a response. Please try again!",
      },
      { status: 500 }
    );
  }
}