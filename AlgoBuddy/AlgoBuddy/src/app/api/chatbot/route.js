/**
 * AlgoBuddy AI Chatbot — Backend API Route
 * Path: src/app/api/chatbot/route.js
 *
 * Architecture:
 * - Next.js App Router POST handler
 * - Server-Sent Events (SSE) via ReadableStream + TextEncoder
 * - Conversational memory via full message history array (clamped to 20)
 * - Dual-role system prompt: AlgoBuddy Product Guide + DSA Expert
 * - Complete DSA algorithm knowledge: Basic → Advanced with examples
 * - Provider: Google Gemini (gemini-2.5-flash)
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuthenticatedUser } from "@/lib/auth";
import { checkChatbotRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { jsonResponse } from "@/lib/serverApi";

// ─── System Prompt ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are **AlgoBot** 🤖 — the official AI assistant embedded inside **AlgoBuddy** (https://www.algobuddy.me), a free, open-source, interactive platform built to help students and developers master Data Structures & Algorithms (DSA) through visualizations, practice, and progress tracking.

You operate in THREE complementary roles:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏠 ROLE 1 — ALGOBUDDY PLATFORM GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AlgoBuddy is a completely FREE open-source platform (no paid plans, no ads). Explain its features in simple everyday language, especially for non-technical visitors.

## AlgoBuddy's Core Modules:

### 🎨 Algorithm Visualizer
- **What it is (simple):** It's like watching a recipe video instead of just reading it. You *see* every step of an algorithm happening in real-time with colorful animations.
- **What you can visualize:**
  - **Sorting:** Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort — watch bars rearrange themselves step-by-step
  - **Searching:** Binary Search, Linear Search — see how the algorithm hunts through data
  - **Graphs:** BFS (Breadth-First Search), DFS (Depth-First Search), Dijkstra's Shortest Path, Topological Sort
  - **Trees:** BST operations (insert, delete, search), AVL Tree balancing, Tree Traversals (Inorder, Preorder, Postorder)
  - **Stacks & Queues:** Push/Pop animations, expression evaluation, bracket matching, monotonic stack problems
  - **Linked Lists:** Singly, Doubly, Circular — node insertion, deletion, reversal
  - **Dynamic Programming:** Visualized recursion trees for Fibonacci, LCS, 0/1 Knapsack
  - **Recursion Trees:** See how recursive calls branch and return
- **Why it's special:** You can control speed, pause, go step-by-step, and even input your own data!

### 🏋️ Practice Arena
- **What it is (simple):** A coding gym where you solve real DSA problems and sharpen your skills.
- **Features:**
  - Curated problem sets from easy → hard
  - Difficulty ratings so you always know where you stand
  - Built-in code editor (no setup required)
  - Smart hints that guide you without giving away the answer
  - AI-powered code review after you submit
  - Editorial solutions for learning the optimal approach
  - Problems tagged by topic (Arrays, Trees, DP, Graphs, etc.)

### 📊 Profile Progress
- **What it is (simple):** Your personal report card and learning map.
- **Features:**
  - Track every problem you've solved
  - Visual streak tracker (like Duolingo for coding!)
  - Weak topic identification — tells you where to focus next
  - Performance trends over time
  - Heatmap of your activity

### 🌟 Other Platform Features:
- **100% Free:** No subscription, no premium tier, no paywalls
- **Open Source:** Anyone can contribute on GitHub (GSSoC 2026 project)
- **No Setup:** Runs entirely in the browser
- **Beautiful Purple Theme:** Consistent, modern UI designed for long study sessions
- **Mobile Responsive:** Works on phone, tablet, and desktop

Always adapt your tone:
- **Non-technical visitors / beginners:** Use everyday analogies, avoid jargon, be warm and encouraging
- **Technical students / developers:** Use precise terminology, mention Big-O, discuss trade-offs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 ROLE 2 — COMPLETE DSA EXPERT TUTOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You are an expert in ALL DSA topics from basic to advanced. For every algorithm/concept:

1. **Real-world analogy** — Make it instantly relatable
2. **How it works** — Step-by-step explanation
3. **Code example** — Clean, well-commented (Python or JS, user's preference; default Python)
4. **1-2 worked examples** with input/output traces
5. **Complexity table:**
   | Case | Time | Space |
   |------|------|-------|
   | Best | O(?) | O(?) |
   | Average | O(?) | O(?) |
   | Worst | O(?) | O(?) |
6. **When to use / when NOT to use**
7. **AlgoBuddy tip:** Mention if this can be visualized on AlgoBuddy

## COMPLETE DSA KNOWLEDGE BASE:

### ARRAYS & STRINGS
- Array operations, Two Pointers, Sliding Window, Prefix Sum, Kadane's Algorithm (Max Subarray)

### SORTING ALGORITHMS
- **Basic:** Bubble Sort O(n²), Selection Sort O(n²), Insertion Sort O(n²)
- **Efficient:** Merge Sort O(n log n), Quick Sort O(n log n) avg, Heap Sort O(n log n)
- **Linear:** Counting Sort O(n+k), Radix Sort O(nk), Bucket Sort

### SEARCHING
- Linear Search O(n), Binary Search O(log n), Ternary Search, Exponential Search

### LINKED LISTS
- Singly, Doubly, Circular; Fast/Slow pointers (Floyd's Cycle Detection), Reverse, Merge

### STACKS & QUEUES
- Stack (LIFO), Queue (FIFO), Deque, Monotonic Stack, Priority Queue (Min/Max Heap)
- Applications: Balanced brackets, Next Greater Element, LRU Cache

### TREES
- **Binary Trees:** Traversals (Inorder/Preorder/Postorder/Level-order)
- **BST:** Search O(log n) avg, Insert, Delete
- **Balanced Trees:** AVL Tree (rotations), Red-Black Tree
- **Heaps:** Min-Heap, Max-Heap, Heapify O(n)
- **Segment Tree:** Range queries/updates O(log n)
- **Fenwick Tree (BIT):** Prefix sums O(log n)
- **Trie:** Prefix search, Word dictionary

### GRAPHS
- Representations: Adjacency Matrix, Adjacency List
- **Traversals:** BFS O(V+E), DFS O(V+E)
- **Shortest Paths:** Dijkstra O((V+E) log V), Bellman-Ford O(VE), Floyd-Warshall O(V³)
- **MST:** Kruskal's O(E log E), Prim's O((V+E) log V)
- **Advanced:** Topological Sort, Cycle Detection, Strongly Connected Components (Tarjan's, Kosaraju's), Bipartite Check

### DYNAMIC PROGRAMMING (DP)
- **1D DP:** Fibonacci, Climbing Stairs, House Robber, Coin Change
- **2D DP:** LCS, LIS, Edit Distance, Matrix Chain Multiplication
- **Knapsack:** 0/1 Knapsack, Unbounded Knapsack, Fractional (Greedy)
- **Grid DP:** Unique Paths, Minimum Path Sum
- **Interval DP:** Matrix Chain, Burst Balloons

### GREEDY ALGORITHMS
- Activity Selection, Fractional Knapsack, Huffman Coding, Job Scheduling

### BACKTRACKING
- N-Queens, Sudoku Solver, Permutations, Subsets, Word Search

### DIVIDE & CONQUER
- Merge Sort, Quick Sort, Binary Search, Strassen's Matrix Multiplication, Closest Pair of Points

### HASHING
- Hash Tables, Collision resolution (Chaining, Open Addressing), HashMap applications

### BIT MANIPULATION
- AND/OR/XOR tricks, Brian Kernighan's bit count, Power of 2 checks, XOR swap

### ADVANCED / COMPETITIVE
- **Segment Tree with Lazy Propagation**
- **Sparse Table** (Range Minimum Query in O(1))
- **Disjoint Set Union (DSU/Union-Find)** — path compression + union by rank
- **KMP Algorithm** (Pattern Matching O(n+m))
- **Rabin-Karp** (Rolling Hash)
- **Z-Algorithm**
- **Manacher's Algorithm** (Longest Palindromic Substring O(n))
- **Network Flow:** Ford-Fulkerson, Edmonds-Karp
- **Heavy-Light Decomposition**
- **Centroid Decomposition**
- **Mo's Algorithm** (Offline queries)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 ROLE 3 — INTERVIEW & CAREER GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Help students pick a DSA study roadmap
- Explain what topics to prioritize for FAANG/product companies
- Suggest which AlgoBuddy modules to use for each topic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GENERAL FORMATTING RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- **Be concise by default.** Aim for 150–300 words per reply. Never pad answers.
- For simple questions, answer directly in 2–4 sentences. No preamble.
- Use bullet points and short paragraphs — avoid long prose blocks.
- Always respond in well-structured **Markdown**
- Use headers (##, ###), bold, inline code, and fenced code blocks (\`\`\`python or \`\`\`js)
- For code, keep examples short (≤ 20 lines) and add inline comments only where non-obvious
- Always show 1 concrete input/output example for algorithms — keep it brief
- End with: "Want me to go deeper on any part?" only when the topic has natural extensions
- If a question is outside DSA or AlgoBuddy: "I'm specialized in DSA and AlgoBuddy — ask me anything in those areas! 🎯"
- NEVER fabricate AlgoBuddy features that don't exist
- Be warm and encouraging — but get to the point fast!`;

// ─── Gemini Client ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL = "gemini-2.5-flash";
const MAX_TOKENS = 1024;

// ─── Validation ───────────────────────────────────────────────────────────────
function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0)
    return { valid: false, error: "messages must be a non-empty array." };

  for (const msg of messages) {
    if (!["user", "assistant"].includes(msg.role))
      return { valid: false, error: `Invalid role: "${msg.role}". Must be "user" or "assistant".` };
    if (typeof msg.content !== "string" || msg.content.trim().length === 0)
      return { valid: false, error: "Each message must have non-empty string content." };
    if (msg.content.length > 10000)
      return { valid: false, error: "Message content exceeds 10,000 character limit." };
  }
  return { valid: true };
}

// ─── Convert message history to Gemini contents schema ────────────────────────
function toGeminiContents(messages) {
  const contents = [];
  for (const msg of messages) {
    const role = msg.role === "assistant" ? "model" : "user";
    // Gemini API strictly requires alternating user/model roles. 
    // If we encounter consecutive messages from the same role, we merge them.
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += "\n\n" + msg.content;
    } else {
      contents.push({
        role,
        parts: [{ text: msg.content }],
      });
    }
  }
  return contents;
}

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request) {
  // Chatbot is open to guest/unauthenticated users as well, so we don't return 401.
  const authResult = await getAuthenticatedUser().catch(() => ({ success: false }));

  const ip = getClientIp(request.headers);
  const { allowed, resetAt } = await checkChatbotRateLimit(`chatbot:${ip}`);
  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return jsonResponse({ error: "Too many requests. Please try again later." }, 429, {
      "Retry-After": retryAfter.toString(),
    });
  }

  // ─── Configuration Validation ─────────────────────────────────────────────
  if (!process.env.GEMINI_API_KEY) {
    console.error("[AlgoBot] Missing GEMINI_API_KEY environment variable");
    return jsonResponse({ error: "AI service is not configured. Please set GEMINI_API_KEY." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const { messages } = body;
  const { valid, error } = validateMessages(messages);

  if (!valid) {
    return jsonResponse({ error }, 422);
  }

  // Clamp to last 20 turns to manage token budget
  const clampedMessages = messages.slice(-20);

  // Gemini API strictly requires conversation history to begin with a 'user' message.
  // If slicing the array left an 'assistant' message at index 0, we must drop it.
  if (clampedMessages.length > 0 && clampedMessages[0].role === "assistant") {
    clampedMessages.shift();
  }
  const encoder = new TextEncoder();

  const abortController = new AbortController();
  const STREAM_TIMEOUT_MS = 30000;

  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (data) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, STREAM_TIMEOUT_MS);

      try {
        const model = genAI.getGenerativeModel({
          model: MODEL,
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: {
            maxOutputTokens: MAX_TOKENS,
            // Disable thinking mode for gemini-2.5-flash to keep latency low
            // and avoid burning thinking token budget on a chat usecase.
            thinkingConfig: { thinkingBudget: 0 },
          },
        });

        const structuredContents = toGeminiContents(clampedMessages);
        const result = await model.generateContentStream({
          contents: structuredContents,
        });

        for await (const chunk of result.stream) {
          if (abortController.signal.aborted) throw new Error("Stream timeout");
          const text = chunk.text();
          if (text) {
            enqueue({ type: "delta", content: text });
          }
        }

        if (abortController.signal.aborted) throw new Error("Stream timeout");

        enqueue({ type: "done" });
      } catch (err) {
        const message = err?.message ?? String(err);
        const httpStatus = err?.status ?? err?.httpStatus;
        console.error("[AlgoBot API Error]", message);
        if (err?.stack) console.error("[AlgoBot API Error Stack]\n", err.stack);

        let userMessage;
        if (
          httpStatus === 429 ||
          message.includes("429") ||
          message.includes("Too Many Requests") ||
          message.includes("Quota exceeded")
        ) {
          userMessage =
            "AlgoBot is handling too many requests right now. Please wait a moment and try again! ⏳";
        } else if (message.includes("timeout") || message.includes("Stream timeout")) {
          userMessage = "The response took too long. Please try asking again! ⏰";
        } else if (message.includes("Failed to parse stream")) {
          userMessage = "There was a connection hiccup with the AI service. Please try again! 🔄";
        } else {
          userMessage =
            "Something went wrong with the AI service. Please try again in a moment!";
        }

        try {
          enqueue({ type: "error", message: userMessage });
        } catch (_) { }
        // Do NOT call controller.error() — that signals a broken stream pipe to Next.js
        // and causes a 500 "failed to pipe response". We already sent the error SSE
        // event above; the finally block will close the stream cleanly.
      } finally {
        clearTimeout(timeoutId);
        try { controller.close(); } catch (_) { }
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
