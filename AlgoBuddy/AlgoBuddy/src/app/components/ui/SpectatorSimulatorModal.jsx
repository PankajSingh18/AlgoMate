"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, Eye, MessageSquare, Send, AlertCircle } from "lucide-react";
import { io } from "socket.io-client";
import confetti from "canvas-confetti";
import { useArenaProfile } from "@/app/hooks/useArenaProfile";

const EMOTES = ["🔥", "👏", "🤯", "😂", "❤️"];

export default function SpectatorSimulatorModal({ isOpen, onClose, matchData }) {
  const [seconds, setSeconds] = useState(0);
  const { profile } = useArenaProfile();

  const p1 = matchData?.players?.[0] || { name: "Player 1" };
  const p2 = matchData?.players?.[1] || { name: "Player 2" };

  const [p1Status, setP1Status] = useState("Idle");
  const [p2Status, setP2Status] = useState("Idle");
  const [p1Lines, setP1Lines] = useState(0);
  const [p2Lines, setP2Lines] = useState(0);
  
  const [p1Language, setP1Language] = useState("javascript");
  const [p2Language, setP2Language] = useState("javascript");
  const [p1Cpm, setP1Cpm] = useState(0);
  const [p2Cpm, setP2Cpm] = useState(0);
  const [p1Failed, setP1Failed] = useState(0);
  const [p2Failed, setP2Failed] = useState(0);
  const [p1Progress, setP1Progress] = useState(0);
  const [p2Progress, setP2Progress] = useState(0);
  const [p1TotalTests, setP1TotalTests] = useState(0);
  const [p2TotalTests, setP2TotalTests] = useState(0);

  const [matchEnded, setMatchEnded] = useState(false);
  const [winnerId, setWinnerId] = useState(null);

  // Calculate Tug-of-War Momentum
  const p1Score = (p1Progress || 0) + (p1Lines * 0.5);
  const p2Score = (p2Progress || 0) + (p2Lines * 0.5);
  const totalScore = p1Score + p2Score;
  const tugOfWarRatio = totalScore > 0 ? (p1Score / totalScore) * 100 : 50;

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [activeEmotes, setActiveEmotes] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [spectatorCount, setSpectatorCount] = useState(0);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const p1TypingTimeoutRef = useRef(null);
  const p2TypingTimeoutRef = useRef(null);

  // Auto scroll chat
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Socket Connection for real-time status
  useEffect(() => {
    if (!isOpen || !matchData?.matchId) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.")
        ? `http://${window.location.hostname}:4000`
        : "https://algobuddy-socket-server.onrender.com");

    const socket = io(socketUrl, {
      query: {
        userId: profile?.id || "spectator_" + Math.random().toString(36).substring(7),
        username: profile?.username || "Spectator_" + Math.floor(Math.random() * 1000)
      }
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Spectator Socket Connected");
      socket.emit("spectate_match", { matchId: matchData.matchId });
    });

    socket.on("spectator_count", (data) => {
      setSpectatorCount(data.count);
    });

    socket.on("opponent_typing_status", (data) => {
      if (data.userId === p1.userId) {
        setP1Status(data.isTyping ? "Typing..." : "Idle");
        if (data.linesCoded !== undefined) setP1Lines(data.linesCoded);
        if (data.cpm !== undefined) setP1Cpm(data.cpm);
        if (data.language) setP1Language(data.language);

        if (p1TypingTimeoutRef.current) clearTimeout(p1TypingTimeoutRef.current);
        if (data.isTyping) {
          p1TypingTimeoutRef.current = setTimeout(() => {
            setP1Status(prev => prev === "Typing..." ? "Idle" : prev);
            setP1Cpm(0);
          }, 3000);
        }
      } else if (data.userId === p2.userId) {
        setP2Status(data.isTyping ? "Typing..." : "Idle");
        if (data.linesCoded !== undefined) setP2Lines(data.linesCoded);
        if (data.cpm !== undefined) setP2Cpm(data.cpm);
        if (data.language) setP2Language(data.language);

        if (p2TypingTimeoutRef.current) clearTimeout(p2TypingTimeoutRef.current);
        if (data.isTyping) {
          p2TypingTimeoutRef.current = setTimeout(() => {
            setP2Status(prev => prev === "Typing..." ? "Idle" : prev);
            setP2Cpm(0);
          }, 3000);
        }
      }
    });

    socket.on("opponent_test_submit", (data) => {
      if (data.userId === p1.userId) {
        setP1Status("Testing Code...");
        if (data.failedAttempts !== undefined) setP1Failed(data.failedAttempts);
      }
      if (data.userId === p2.userId) {
        setP2Status("Testing Code...");
        if (data.failedAttempts !== undefined) setP2Failed(data.failedAttempts);
      }
    });

    socket.on("opponent_test_result", (data) => {
      const pct = data.total > 0 ? (data.passed / data.total) * 100 : 0;
      if (data.userId === p1.userId) {
        setP1Status("Idle");
        setP1Progress(pct);
        setP1TotalTests(data.total);
        if (data.failedAttempts !== undefined) setP1Failed(data.failedAttempts);
      } else if (data.userId === p2.userId) {
        setP2Status("Idle");
        setP2Progress(pct);
        setP2TotalTests(data.total);
        if (data.failedAttempts !== undefined) setP2Failed(data.failedAttempts);
      }
    });

    socket.on("match_ended", (data) => {
      setMatchEnded(true);
      setWinnerId(data.winnerId);
      if (data.winnerId === p1.userId) setP1Status("Finished");
      if (data.winnerId === p2.userId) setP2Status("Finished");
    });

    socket.on("spectator_chat", (data) => {
      setChatMessages(prev => [...prev, data]);
    });

    socket.on("spectator_emote", (data) => {
      const newEmote = { ...data, id: Date.now() + Math.random() };
      setActiveEmotes(prev => [...prev, newEmote]);
      setTimeout(() => {
        setActiveEmotes(prev => prev.filter(e => e.id !== newEmote.id));
      }, 2500);
    });

    return () => {
      if (p1TypingTimeoutRef.current) clearTimeout(p1TypingTimeoutRef.current);
      if (p2TypingTimeoutRef.current) clearTimeout(p2TypingTimeoutRef.current);
      socket.emit("leave_spectate_match", { matchId: matchData.matchId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, matchData, profile]);

  // Formatting time helper
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Main game timer
  useEffect(() => {
    if (!isOpen || matchEnded) return;
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, matchEnded]);

  // Winner Confetti
  useEffect(() => {
    if (matchEnded && winnerId) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          zIndex: 9999
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          zIndex: 9999
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [matchEnded, winnerId]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socketRef.current) return;
    const msg = {
      matchId: matchData.matchId,
      message: chatInput
    };
    socketRef.current.emit("spectator_chat", msg);
    setChatMessages(prev => [...prev, { ...msg, username: "You", isMe: true }]);
    setChatInput("");
  };

  const handleSendEmote = (emote) => {
    if (!socketRef.current) return;
    socketRef.current.emit("spectator_emote", { matchId: matchData.matchId, emote });
    const newEmote = { emote, id: Date.now() + Math.random(), isMe: true, left: Math.random() * 80 + 10 };
    setActiveEmotes(prev => [...prev, newEmote]);
    setTimeout(() => {
      setActiveEmotes(prev => prev.filter(e => e.id !== newEmote.id));
    }, 2500);
  };

  const renderLanguageBadge = (lang) => {
    const map = { javascript: "JS", python: "PY", cpp: "C++", java: "JAVA" };
    return <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold border border-slate-300 dark:border-slate-700">{map[lang] || lang.toUpperCase()}</span>;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white dark:bg-[#0f0f13] w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 flex flex-col overflow-hidden relative"
          style={{ height: "calc(100vh - 80px)" }}
        >
        <AnimatePresence>
          {matchEnded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-12 rounded-3xl shadow-2xl text-center flex flex-col items-center">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                  {winnerId === p1.userId ? p1.name : (winnerId === p2.userId ? p2.name : "IT'S A DRAW!")} 👑
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                  The match has concluded!
                </p>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                  Close Spectator
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

          {/* Header */}
          <div className="h-14 bg-slate-50 dark:bg-[#15151a] border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between px-4 shrink-0 relative overflow-hidden">
            
            {/* Tug of War Momentum Bar (Absolute positioned at the bottom of header) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 flex z-0">
              <motion.div 
                className="h-full bg-blue-500"
                animate={{ width: `${tugOfWarRatio}%` }}
                initial={false}
                transition={{ type: "spring", bounce: 0, duration: 1 }}
              />
            </div>
            
            <div className="flex items-center gap-4 z-10">
              <div className="bg-slate-200 dark:bg-[#1a1a24] px-3 py-1 rounded-full text-sm font-mono text-slate-700 dark:text-slate-300 font-bold tracking-widest border border-slate-300 dark:border-slate-700">
                {formatTime(seconds)}
              </div>
              <button 
                onClick={() => setIsChatOpen(prev => !prev)} 
                className="lg:hidden p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <MessageSquare size={18} />
              </button>
              <div className="hidden sm:block">
                <h3 className="font-bold text-slate-800 dark:text-neutral-200 text-sm leading-tight">
                  Spectator Mode: {matchData?.topic || "Match"}
                </h3>
                <div className="flex items-center">
                  <span className="text-[10px] font-semibold text-slate-500">Live Match • {formatTime(seconds)}</span>
                  {spectatorCount > 0 && (
                    <span className="text-[10px] ml-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      {spectatorCount} viewing
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-500 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex w-full h-[calc(100%-4rem)] overflow-hidden relative">
        
        {/* Overlay for mobile when chat is open */}
        {isChatOpen && (
          <div 
            className="absolute inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setIsChatOpen(false)}
          />
        )}

        {/* Left Side: Game State (Player 1 vs Player 2) */}
            <div className="flex-[3] flex overflow-hidden border-r border-slate-200 dark:border-neutral-800 relative">
              
              {/* Floating Emotes Layer */}
              <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                <AnimatePresence>
                  {activeEmotes.map(e => (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 100, scale: 0.5, x: (e.left || 50) + "%" }}
                      animate={{ opacity: [0, 1, 0], y: -200, scale: 2, x: (e.left || 50) + "%" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.5, ease: "easeOut" }}
                      className="absolute bottom-0 text-4xl"
                    >
                      {e.emote}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Player 1 View */}
              <div className="w-full lg:w-3/4 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 bg-slate-50/50 dark:bg-[#0a0a0f] overflow-y-auto">
                <div className="h-14 border-b border-slate-200 dark:border-neutral-800 flex flex-col justify-center px-4 bg-white dark:bg-[#111116]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                        {p1.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-xs text-slate-700 dark:text-neutral-300">
                        {p1.name} {winnerId === p1.userId && "👑"}
                      </span>
                      {renderLanguageBadge(p1Language)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400">Lines: {p1Lines}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p1Status === "Typing..." ? "bg-primary/20 text-primary-light animate-pulse" :
                          p1Status === "Testing Code..." ? "bg-amber-500/20 text-amber-500 animate-pulse" :
                          "bg-slate-500/20 text-slate-500"
                        }`}>
                        {p1Status}
                      </span>
                    </div>
                  </div>
                  {/* Speedometer Bar */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="text-[9px] text-slate-400 w-8">Speed</div>
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary"
                        animate={{ width: `${Math.min((p1Cpm / 300) * 100, 100)}%` }}
                        transition={{ ease: "linear", duration: 1 }}
                      />
                    </div>
                    <div className="text-[9px] text-slate-400 w-8 text-right">{p1Cpm}cpm</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
                  
                  <Terminal size={48} className={`mb-4 ${p1Status === "Typing..." ? "text-primary animate-pulse" : "text-slate-700"}`} />
                  <h4 className="text-lg font-bold text-slate-800 dark:text-neutral-200 mb-2">
                    {p1Status === "Idle" ? "Waiting for action..." : p1Status}
                  </h4>
                  
                  {/* Test Case Progress Box */}
                  <div className="mt-6 w-full max-w-sm bg-white dark:bg-[#15151a] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm min-h-[88px] flex flex-col justify-center">
                    {p1TotalTests > 0 || p1Failed > 0 ? (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Test Progress</span>
                          <span className="text-[10px] font-semibold text-slate-500">{p1TotalTests > 0 ? `${(p1Progress/100*p1TotalTests).toFixed(0)}/${p1TotalTests} Passed` : "Not Submitted"}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                          <motion.div 
                            className="h-full bg-emerald-500"
                            animate={{ width: `${p1Progress}%` }}
                          />
                        </div>
                        {p1Failed > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold bg-red-500/10 px-2 py-1 rounded w-fit mx-auto border border-red-500/20 mt-2">
                            <AlertCircle size={14} /> Failed Attempts: {p1Failed}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-70">
                        <span className="text-xs font-bold text-slate-500">Waiting for submission</span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Player 2 View */}
              <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0a0a0c]">
                <div className="h-14 border-b border-slate-200 dark:border-neutral-800 flex flex-col justify-center px-4 bg-white dark:bg-[#111116]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold">
                        {p2.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-xs text-slate-700 dark:text-neutral-300">
                        {p2.name} {winnerId === p2.userId && "👑"}
                      </span>
                      {renderLanguageBadge(p2Language)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400">Lines: {p2Lines}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p2Status === "Typing..." ? "bg-purple-500/20 text-purple-400 animate-pulse" :
                          p2Status === "Testing Code..." ? "bg-amber-500/20 text-amber-500 animate-pulse" :
                          "bg-slate-500/20 text-slate-500"
                        }`}>
                        {p2Status}
                      </span>
                    </div>
                  </div>
                  {/* Speedometer Bar */}
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="text-[9px] text-slate-400 w-8">Speed</div>
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-purple-500"
                        animate={{ width: `${Math.min((p2Cpm / 300) * 100, 100)}%` }}
                        transition={{ ease: "linear", duration: 1 }}
                      />
                    </div>
                    <div className="text-[9px] text-slate-400 w-8 text-right">{p2Cpm}cpm</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent opacity-50" />
                  
                  <Terminal size={48} className={`mb-4 ${p2Status === "Typing..." ? "text-purple-400 animate-pulse" : "text-slate-700"}`} />
                  <h4 className="text-lg font-bold text-slate-800 dark:text-neutral-200 mb-2">
                    {p2Status === "Idle" ? "Waiting for action..." : p2Status}
                  </h4>
                  
                  {/* Test Case Progress Box */}
                  <div className="mt-6 w-full max-w-sm bg-white dark:bg-[#15151a] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm min-h-[88px] flex flex-col justify-center">
                    {p2TotalTests > 0 || p2Failed > 0 ? (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Test Progress</span>
                          <span className="text-[10px] font-semibold text-slate-500">{p2TotalTests > 0 ? `${(p2Progress/100*p2TotalTests).toFixed(0)}/${p2TotalTests} Passed` : "Not Submitted"}</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                          <motion.div 
                            className="h-full bg-emerald-500"
                            animate={{ width: `${p2Progress}%` }}
                          />
                        </div>
                        {p2Failed > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold bg-red-500/10 px-2 py-1 rounded w-fit mx-auto border border-red-500/20 mt-2">
                            <AlertCircle size={14} /> Failed Attempts: {p2Failed}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-70">
                        <span className="text-xs font-bold text-slate-500">Waiting for submission</span>
                        <div className="flex items-center gap-1.5 mt-2">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Spectator Chat & Emotes (Right 25%) */}
            <div className={`
              absolute lg:relative right-0 top-0 bottom-0 z-40
              w-80 lg:w-1/4 h-full bg-white dark:bg-[#0c0c0e] border-l border-slate-200 dark:border-slate-800 flex flex-col
              transition-transform duration-300 ease-in-out
              ${isChatOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : "translate-x-full lg:translate-x-0"}
            `}>
              <div className="h-10 border-b border-slate-200 dark:border-neutral-800 flex items-center px-4 bg-slate-50 dark:bg-[#15151a]">
                <MessageSquare size={14} className="text-slate-500 mr-2" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Spectator Chat</span>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center mt-4">No messages yet. Be the first to cheer!</p>
                ) : (
                  chatMessages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
                      <span className="text-[9px] text-slate-400 font-semibold mb-0.5 px-1">{msg.username}</span>
                      <div className={`px-3 py-2 rounded-xl text-xs max-w-[90%] ${msg.isMe ? "bg-primary text-white rounded-br-none" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none"}`}>
                        {msg.message}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input & Emotes */}
              <div className="border-t border-slate-200 dark:border-neutral-800 p-3 bg-slate-50 dark:bg-[#15151a]">
                <div className="flex justify-around mb-3">
                  {EMOTES.map(emote => (
                    <button 
                      key={emote} 
                      onClick={() => handleSendEmote(emote)}
                      className="text-lg hover:scale-125 hover:-translate-y-1 transition-transform active:scale-95"
                    >
                      {emote}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Send a message..."
                    className="w-full bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-full pl-3 pr-10 py-2 outline-none focus:border-primary/50"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-light transition p-1">
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
