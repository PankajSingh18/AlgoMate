"use client";

/**
 * AlgoBuddy AI Chatbot — Frontend Component
 * Path: app/components/Chatbot/Chatbot.jsx
 *
 * Features:
 *  - Framer Motion floating widget anchored bottom-right
 *  - Unread message badge on trigger button
 *  - Welcome screen with rich suggestion chips (6 chips across 3 categories)
 *  - SSE streaming with live cursor
 *  - react-markdown + remark-gfm for full Markdown rendering
 *  - Syntax-highlighted code blocks with Copy button per block
 *  - Full conversational memory (message history sent per request)
 *  - Clean typed error UI (never raw stack traces)
 *  - Auto-resize textarea, keyboard shortcuts
 *  - AlgoBuddy purple brand theme
 *
 * Dependencies:
 *   npm install react-markdown remark-gfm framer-motion lucide-react @anthropic-ai/sdk
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  User,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ChevronDown,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/apiClient";
import { CSRF_HEADER_NAME } from "@/lib/csrf";

// ─── Custom Robot Icon matching AlgoBuddy Theme ──────────────────────────────

function AlgoBotIcon({ className = "w-5 h-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Antennas / Signal */}
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      <path d="M12 4v3M9 6h6" strokeWidth="1.5" />
      {/* Head */}
      <rect x="4" y="8" width="16" height="12" rx="3" fill="currentColor" fillOpacity="0.1" />
      {/* Eyes */}
      <circle cx="8.5" cy="13" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="13" r="1.2" fill="currentColor" />
      {/* Mouth */}
      <path d="M10 16.5h4" strokeWidth="1.8" />
      {/* Side Bolts / Programming Brackets */}
      <path d="M2.5 12a1.5 1.5 0 0 1 1.5-1.5M21.5 12a1.5 1.5 0 0 0-1.5-1.5" />
    </svg>
  );
}

// ─── Welcome Message ──────────────────────────────────────────────────────────

const WELCOME_MESSAGE = {
  role: "assistant",
  id: "welcome",
  content: `Greetings! I'm **AlgoBot**

I can help you:
- Explore **AlgoBuddy** features
- Learn **DSA** concepts & roadmaps
- Get clear **code walkthroughs**

Choose a question below or start typing!`,
};

const SUGGESTION_QUESTIONS = [
  {
    id: "q1",
    label: "What is AlgoBuddy?",
    query: "What is AlgoBuddy? Explain it in simple terms so even a non-technical person understands.",
  },
  {
    id: "q2",
    label: "How can this help me?",
    query: "How can AlgoBuddy help me as a student? What features should I start with?",
  },
  {
    id: "q3",
    label: "What can I visualize?",
    query: "What algorithms and data structures can I visualize on AlgoBuddy? Give me the complete list.",
  },
  {
    id: "q4",
    label: "Tell me about Practice Arena",
    query: "Explain the Practice Arena feature on AlgoBuddy. How does it help me improve my coding?",
  },
  {
    id: "q5",
    label: "Binary Search explanation",
    query: "Explain Binary Search with a real-world analogy, a step-by-step code walkthrough in Python, a worked example, and time/space complexity.",
  },
  {
    id: "q6",
    label: "DSA learning roadmap",
    query: "I'm a complete beginner. Give me a step-by-step DSA learning roadmap and tell me how AlgoBuddy can help at each stage.",
  },
];

// ─── Code Block with Copy ─────────────────────────────────────────────────────

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "code";
  const code = String(children).trim();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0f0f16] dark:bg-slate-950 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tracking-widest uppercase ml-1">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-emerald-400 transition-colors duration-150 px-2 py-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800/50"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-500 dark:text-emerald-400" />
              <span className="text-emerald-500 dark:text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed scrollbar-thin [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-800/80 [&::-webkit-scrollbar-thumb]:rounded-full">
        <code className="font-mono text-slate-200 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ─── Markdown Components ──────────────────────────────────────────────────────

const mdComponents = {
  code({ inline, className, children, ...props }) {
    if (inline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-primary dark:text-purple-300 font-mono text-[0.85em]"
          {...props}
        >
          {children}
        </code>
      );
    }
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  h2: ({ children }) => (
    <h2 className="text-[14px] font-bold text-slate-800 dark:text-white mt-4 mb-2 flex items-center gap-2 border-b border-purple-500/20 pb-1.5">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-[13px] font-semibold text-primary dark:text-purple-300 mt-3 mb-1">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => <ul className="my-2 space-y-1 pl-1">{children}</ul>,
  ol: ({ children }) => (
    <ol className="my-2 space-y-1 pl-4 list-decimal list-outside text-[13px] text-slate-600 dark:text-slate-300">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex gap-2 text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
      <span className="text-primary dark:text-purple-400 mt-0.5 shrink-0">›</span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-850 dark:text-white">{children}</strong>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 border border-slate-200 dark:border-slate-800 rounded-lg">
      <table className="w-full text-[12px] border-collapse overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-slate-100 dark:bg-purple-950/40 text-slate-700 dark:text-purple-200">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold border-b border-slate-200 dark:border-slate-700/50">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-slate-600 dark:text-slate-300 border-r last:border-0 border-slate-200 dark:border-slate-700/30">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/50 dark:border-purple-500/50 pl-3 my-2 text-slate-500 dark:text-slate-400 italic text-[13px]">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary dark:text-purple-400 hover:text-primary-dark dark:hover:text-purple-300 underline underline-offset-2 inline-flex items-center gap-0.5"
    >
      {children}
      <ExternalLink size={10} />
    </a>
  ),
};

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const isError = message.isError;

  if (message.id === "welcome") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="flex gap-2.5"
      >
        {/* Avatar */}
        <div className="shrink-0 w-7 h-7 rounded-xl bg-primary flex items-center justify-center mt-0.5 shadow-sm">
          <AlgoBotIcon className="w-3.5 h-3.5 text-white" />
        </div>

        {/* Welcome Card content */}
        <div className="max-w-[84%] rounded-2xl px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-tl-sm shadow-sm backdrop-blur-sm">
          <h3 className="text-[14px] font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-2">
            Greetings! I'm <span className="text-primary dark:text-purple-400">AlgoBot</span>
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mb-3.5 leading-relaxed">
            I can help you:
          </p>

          <div className="space-y-3 mb-4">
            <div className="flex gap-2.5 items-start text-[13px] text-slate-600 dark:text-slate-350">
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-purple-50/50 dark:bg-purple-950/30 text-primary dark:text-purple-400 shrink-0 text-[11px] font-bold mt-0.5">
                ⮕
              </span>
              <div className="leading-normal">
                Explore <strong className="font-semibold text-slate-800 dark:text-white">AlgoBuddy</strong> features
              </div>
            </div>
            <div className="flex gap-2.5 items-start text-[13px] text-slate-600 dark:text-slate-350">
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-purple-50/50 dark:bg-purple-950/30 text-primary dark:text-purple-400 shrink-0 text-[11px] font-bold mt-0.5">
                ⮕
              </span>
              <div className="leading-normal">
                Learn <strong className="font-semibold text-slate-800 dark:text-white">DSA</strong> concepts &amp; roadmaps
              </div>
            </div>
            <div className="flex gap-2.5 items-start text-[13px] text-slate-600 dark:text-slate-350">
              <span className="flex items-center justify-center w-5 h-5 rounded-md bg-purple-50/50 dark:bg-purple-950/30 text-primary dark:text-purple-400 shrink-0 text-[11px] font-bold mt-0.5">
                ⮕
              </span>
              <div className="leading-normal">
                Get clear <strong className="font-semibold text-slate-800 dark:text-white">code walkthroughs</strong>
              </div>
            </div>
          </div>

          <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
            Choose a question below or start typing!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center mt-0.5 shadow-sm transition-all duration-200
          ${isUser
            ? "bg-primary"
            : isError
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-primary"
          }`}
      >
        {isUser ? (
          <User size={13} className="text-white" />
        ) : isError ? (
          <AlertCircle size={13} className="text-red-500 dark:text-red-400" />
        ) : (
          <AlgoBotIcon className="w-3.5 h-3.5 text-white" />
        )}
      </div>

      {/* Bubble content */}
      <div
        className={`max-w-[84%] rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200
          ${isUser
            ? "bg-primary text-white rounded-tr-sm shadow-md"
            : isError
              ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 rounded-tl-sm"
              : "bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-tl-sm shadow-sm backdrop-blur-sm text-slate-800 dark:text-slate-200"
          }`}
      >
        {isError ? (
          <div className="flex items-start gap-2">
            <AlertCircle size={14} className="text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
            <p className="text-[13px] text-red-700 dark:text-red-300 leading-relaxed">{message.content}</p>
          </div>
        ) : isUser ? (
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap text-white">{message.content}</p>
        ) : (
          <div className="prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {message.content}
            </ReactMarkdown>

            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary dark:bg-purple-400 rounded-full animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <div className="shrink-0 w-7 h-7 rounded-xl bg-primary flex items-center justify-center shadow-sm">
        <AlgoBotIcon className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm flex items-center gap-2.5 backdrop-blur-sm">
        <div className="flex gap-1 items-center h-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/70 dark:bg-purple-400"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Chatbot ─────────────────────────────────────────────────────────────

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const previousMessageCount = useRef(messages.length);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // ── Scroll-to-bottom button visibility ───────────────────────────────────────
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBtn(distFromBottom > 120);
  };

  useEffect(() => {
  if (
    !isOpen &&
    messages.length > previousMessageCount.current
  ) {
    const lastMessage = messages[messages.length - 1];

    if (
  lastMessage?.role === "assistant" &&
  lastMessage.id !== "welcome" &&
  !lastMessage.isStreaming &&
  !lastMessage.isError
) {
  setUnreadCount((prev) => prev + 1);
}
  }

  previousMessageCount.current = messages.length;
}, [messages, isOpen]);


  // ── Focus on open ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 280);
  }, [isOpen]);

  // ── Cleanup ──────────────────────────────────────────────────────────────────
  useEffect(() => () => abortControllerRef.current?.abort(), []);

  // ─── Send Message ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (queryOverride) => {
      const text = (queryOverride ?? inputValue).trim();
      if (!text || isStreaming) return;

      if (!hasInteracted) {
        setHasInteracted(true);
      }

      setInputValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      const userMsg = { role: "user", content: text, id: `u-${Date.now()}` };
      const assistantId = `a-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        userMsg,
        { role: "assistant", content: "", id: assistantId, isStreaming: true },
      ]);
      setIsStreaming(true);

      // Build history for API (exclude system welcome + placeholders)
      const history = messages
        .filter((m) => m.id !== "welcome" && !m.isError && !m.isStreaming)
        .map(({ role, content }) => ({ role, content }));
      history.push({ role: "user", content: text });

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      try {
        const csrfToken = await api.getCsrfToken();

const headers = {
  "Content-Type": "application/json",
};

if (csrfToken) {
  headers[CSRF_HEADER_NAME] = csrfToken;
}

const res = await fetch("/api/chatbot", {
  method: "POST",
  headers,
  body: JSON.stringify({ messages: history }),
  signal: abortControllerRef.current.signal,
});

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? `Server error ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const raw = line.slice(5).trim();
            if (!raw) continue;

            let parsed;
            try { parsed = JSON.parse(raw); } catch { continue; }

            if (parsed.type === "delta") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + parsed.content }
                    : m
                )
              );
            } else if (parsed.type === "done") {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, isStreaming: false } : m
                )
              );
              break;
            } else if (parsed.type === "error") {
              throw new Error(parsed.message);
            }
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        setMessages((prev) =>
          prev
            .filter((m) => m.id !== assistantId)
            .concat({
              role: "assistant",
              content: `**Connection error:** ${err.message}.\n\nPlease check your internet connection and try again.`,
              id: `err-${Date.now()}`,
              isError: true,
            })
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [inputValue, isStreaming, messages, hasInteracted]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearChat = () => {
    abortControllerRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setHasInteracted(false);
    setIsStreaming(false);
    setUnreadCount(0);
    previousMessageCount.current = 1;
  };

  const handleTextareaChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 108) + "px";
  };

  // ─── Listen for custom explain events ─────────────────────────────────────────
  useEffect(() => {
    const handleExplain = (e) => {
      const { prompt } = e.detail;
      setIsOpen(true);
      // Slight delay to ensure Chatbot is fully open and focused before sending
      setTimeout(() => {
        sendMessage(prompt);
      }, 50);
    };

    window.addEventListener("chatbot-explain", handleExplain);
    return () => window.removeEventListener("chatbot-explain", handleExplain);
  }, [sendMessage]);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="font-sans">
      {/* ── Chat Panel ─────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-[80px] sm:bottom-[92px] right-4 sm:right-6 z-[10000] w-[calc(100vw-32px)] sm:w-[400px] h-[600px] max-h-[calc(100vh-120px)] flex flex-col rounded-2xl overflow-hidden
              bg-white/95 dark:bg-[#1c1d1f]/95 border border-purple-100 dark:border-purple-900/30 shadow-2xl backdrop-blur-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-primary border-b border-primary-dark/20 shadow-sm transition-all duration-300">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-white text-primary flex items-center justify-center border border-white/20 shadow-sm transition-all duration-300">
                  <AlgoBotIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[14px] font-semibold text-white leading-none">AlgoBot</h3>
                  </div>
                  <p className="text-[11px] text-white/85 mt-1.5 leading-none font-medium">
                    {isStreaming ? (
                      <span className="text-white/95 flex items-center gap-1">
                        <Loader2 size={10} className="animate-spin" /> Thinking…
                      </span>
                    ) : (
                      "Your DSA Mentor"
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  title="Reset conversation"
                  className="w-7.5 h-7.5 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="w-7.5 h-7.5 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-900/50 transition-colors"
              style={{ scrollbarWidth: "thin" }}
            >
              {messages
                .filter((msg) => !(msg.role === "assistant" && msg.content === "" && msg.isStreaming))
                .map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              {isStreaming &&
                messages[messages.length - 1]?.content === "" && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll-to-bottom button */}
            <AnimatePresence>
              {showScrollBtn && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  onClick={() => scrollToBottom()}
                  className="absolute bottom-[92px] right-6 w-8 h-8 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 
                    flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-lg"
                >
                  <ChevronDown size={16} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Suggestion Chips */}
            {messages.length === 1 && !isStreaming && (
              <div className="px-4 pt-3 pb-2.5 border-t border-slate-100 dark:border-slate-800/60 shrink-0 bg-white/50 dark:bg-[#1c1d1f]/50">
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-550 uppercase tracking-widest mb-2 px-1">
                  Suggested Questions
                </p>
                <div className="w-full flex flex-row items-center gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-purple-900/50">
                  {SUGGESTION_QUESTIONS.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => sendMessage(q.query)}
                      className="shrink-0 border border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/10 text-purple-700 dark:text-purple-300 hover:bg-purple-100/50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-700/60 transition-all duration-150 rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="px-3 py-3 border-t border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-[#1c1d1f]/50 shrink-0">
              <div
                className="flex items-end gap-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2
                  focus-within:border-primary/50 dark:focus-within:border-purple-500/50 focus-within:bg-white dark:focus-within:bg-slate-900/80 transition-all duration-200"
              >
                <textarea
                  ref={(el) => {
                    inputRef.current = el;
                    textareaRef.current = el;
                  }}
                  rows={1}
                  value={inputValue}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about AlgoBuddy or any DSA topic…"
                  disabled={isStreaming}
                  className="flex-1 bg-transparent text-[13px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500
                    resize-none outline-none leading-relaxed min-h-[24px] max-h-[108px]
                    disabled:opacity-50 scrollbar-none"
                  style={{ scrollbarWidth: "none" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputValue.trim() || isStreaming}
                  className="shrink-0 w-8 h-8 rounded-lg bg-primary hover:bg-primary-dark
                    flex items-center justify-center text-white shadow-md active:scale-95 transition-all duration-150
                    disabled:opacity-45 disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  {isStreaming ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <p className="text-[10px] text-slate-400 dark:text-slate-600">
                  ↵ Send &nbsp;·&nbsp; Shift+↵ New line
                </p>
                <a
                  href="https://www.algobuddy.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-primary dark:text-purple-400 hover:opacity-85 transition-opacity flex items-center gap-0.5"
                >
                  algobuddy.me <ExternalLink size={8} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Trigger Button ─────────────────────────────────────────────── */}
      <div className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[10000] ${isOpen ? "hidden sm:block" : "block"}`}>
        <motion.button
          onClick={() => {
            setIsOpen((v) => {
              const next = !v;

              if (next) {
                setUnreadCount(0);
              }

              return next;
            });
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative w-14 h-14 rounded-2xl bg-primary hover:bg-primary-dark flex items-center justify-center shadow-lg transition-colors"
          aria-label={isOpen ? "Close AlgoBot" : "Open AlgoBot"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={22} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <AlgoBotIcon className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread badge */}
          <AnimatePresence>
            {!isOpen && unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-red-500
                  border-2 border-white dark:border-[#1c1d1f] flex items-center justify-center text-[9px] font-bold text-white shadow"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}