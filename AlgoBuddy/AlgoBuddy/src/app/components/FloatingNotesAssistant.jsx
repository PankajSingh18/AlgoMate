"use client";

import { useEffect, useState, useRef } from "react";
import { 
  NotebookPen, 
  X, 
  Trash2, 
  Plus, 
  Search, 
  Sparkles, 
  Download, 
  BookOpen, 
  Edit3, 
  Check, 
  Bold, 
  Italic, 
  Code,
  List,
  FileText
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useNotesManager } from "@/app/hooks/useNotesManager";

const TOPICS_LIST = [
  "General",
  "Array",
  "Linked List",
  "Stack",
  "Queue",
  "Recursion",
  "Tree",
  "HashMap",
  "Graph",
  "AI Algorithms",
  "Quiz",
  "Dynamic Programming"
];

const mdComponents = {
  code({ inline, className, children, ...props }) {
    if (inline) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-purple-600 dark:text-purple-300 font-mono text-sm font-semibold" {...props}>
          {children}
        </code>
      );
    }
    return (
      <pre className="overflow-x-auto p-3 rounded-xl bg-neutral-950 text-neutral-200 text-sm font-mono my-2 border border-neutral-800/80">
        <code>{children}</code>
      </pre>
    );
  },
  h1: ({ children }) => <h3 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mt-2.5 mb-1">{children}</h3>,
  h2: ({ children }) => <h3 className="text-base sm:text-lg font-bold text-slate-850 dark:text-neutral-200 mt-2 mb-1">{children}</h3>,
  h3: ({ children }) => <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-neutral-300 mt-1.5 mb-0.5">{children}</h4>,
  p: ({ children }) => <p className="text-base text-slate-600 dark:text-neutral-400 leading-relaxed mb-2 last:mb-0 whitespace-pre-wrap">{children}</p>,
  ul: ({ children }) => <ul className="my-2 pl-4 list-disc space-y-1 text-base text-slate-600 dark:text-neutral-400">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 pl-4 list-decimal space-y-1 text-base text-slate-600 dark:text-neutral-400">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed whitespace-pre-wrap">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-slate-850 dark:text-white">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-purple-400 hover:underline">
      {children}
    </a>
  )
};

const preprocessMarkdown = (text) => {
  if (!text) return "";
  // Forgive missing space after heading hash characters (e.g. #hello -> # hello)
  return text.replace(/^(#{1,6})([a-zA-Z0-9])/gm, "$1 $2");
};

export default function FloatingNotesAssistant() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState("write"); // 'write' or 'preview'
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef(null);

  const {
    notes,
    activeNote,
    filteredNotes,
    activeNoteId,
    setActiveNoteId,
    searchQuery,
    setSearchQuery,
    filterByTopicOnly,
    setFilterByTopicOnly,
    currentTopic,
    createNote,
    updateNote,
    deleteNote
  } = useNotesManager();

  // Format Helper for markdown tags
  const insertFormatting = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea || !activeNote) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    updateNote(activeNote.id, { content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Copy raw content
  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Download Markdown file
  const handleDownload = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${activeNote.title.toLowerCase().replace(/\s+/g, "-")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ask AI / Chatbot integration
  const handleDiscussWithAI = () => {
    if (!activeNote) return;
    const prompt = `Here are my study notes about the topic "${activeNote.topic}" (Note title: "${activeNote.title}"):\n\n\`\`\`markdown\n${activeNote.content}\n\`\`\`\n\nCan you review these notes, highlight any mistakes or key optimizations, and suggest 2 representative practice questions?`;
    
    const event = new CustomEvent("chatbot-explain", {
      detail: { prompt }
    });
    window.dispatchEvent(event);
  };

  const buttonPosition = "bottom-[152px] right-3 sm:right-6";

  const panelPosition = "bottom-[80px] right-4 left-4 sm:bottom-[92px] sm:right-[88px] sm:left-auto";

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`
          fixed ${buttonPosition} z-[9999]
          w-14 h-14 rounded-2xl
          bg-primary hover:bg-primary-dark
          text-white shadow-lg
          flex items-center justify-center
          transition-all duration-300 ease-in-out hover:scale-105
        `}
        aria-label="Algorithm Notebook"
      >
        {open ? <X size={22} /> : <NotebookPen size={22} />}
      </button>

      {/* Notebook Dashboard Panel */}
      {open && (
        <div
          className={`
            fixed ${panelPosition}
            w-[calc(100vw-32px)] sm:w-[540px] h-[400px] sm:h-[450px] max-h-[70vh] sm:max-h-[75vh]
            bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl
            rounded-3xl shadow-2xl
            border border-purple-100 dark:border-neutral-800/80
            flex flex-col overflow-hidden z-[9999]
            transition-all duration-300 ease-in-out
          `}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 dark:border-neutral-800/60 bg-slate-50/50 dark:bg-neutral-950/20 shrink-0">
            <div className="flex items-center gap-2">
              <NotebookPen size={18} className="text-primary" />
              <h2 className="font-black text-sm text-slate-800 dark:text-white">
                Algorithm Notebook
              </h2>
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Dashboard Layout */}
          <div className="flex flex-row flex-1 min-h-0">
            
            {/* Sidebar (Note Selection & Creation) */}
            <div className="flex flex-col w-[110px] sm:w-[190px] border-r border-slate-100 dark:border-neutral-800/60 p-2.5 bg-slate-50/30 dark:bg-neutral-950/10 shrink-0">
              
              {/* Add Note Button */}
              <button
                onClick={() => createNote(`Note ${notes.length + 1}`, "")}
                className="w-full py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 mb-3"
              >
                <Plus size={14} />
                <span>New Note</span>
              </button>

              {/* Search Box */}
              <div className="relative mb-2.5">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[10px] font-medium outline-none focus:border-primary transition"
                />
              </div>

              {/* Context Filter Checkbox */}
              {currentTopic !== "General" && (
                <label className="flex items-center gap-2 cursor-pointer select-none text-[10px] font-bold text-slate-500 dark:text-neutral-400 mb-3 border-b border-slate-100 dark:border-neutral-800 pb-2">
                  <input
                    type="checkbox"
                    checked={filterByTopicOnly}
                    onChange={(e) => setFilterByTopicOnly(e.target.checked)}
                    className="accent-primary w-3 h-3 cursor-pointer"
                  />
                  <span className="truncate">This Topic ({currentTopic})</span>
                </label>
              )}

              {/* Notes Scroll Container */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {filteredNotes.length === 0 ? (
                  <div className="text-[10px] text-center text-slate-400 dark:text-neutral-600 font-bold py-6">
                    No notes found
                  </div>
                ) : (
                  filteredNotes.map((n) => {
                    const isActive = n.id === activeNoteId;
                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          setActiveNoteId(n.id);
                          setEditMode("write");
                        }}
                        className={`p-2 rounded-xl cursor-pointer transition select-none text-left border ${
                          isActive
                            ? "bg-purple-500/10 border-primary text-primary dark:text-purple-300 font-black"
                            : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-neutral-800/40 text-slate-650 dark:text-neutral-400"
                        }`}
                      >
                        <div className="text-[11px] truncate leading-tight mb-0.5">{n.title}</div>
                        <div className="flex justify-between items-center gap-1">
                          <span className="text-[8px] text-slate-400 truncate max-w-[50px] uppercase font-bold">
                            {n.topic}
                          </span>
                          <span className="text-[8px] text-slate-350 dark:text-neutral-600 shrink-0 font-medium">
                            {new Date(n.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Note Editor Workspace Pane */}
            <div className="flex flex-col flex-1 p-4 min-w-0 bg-white dark:bg-neutral-900">
              {activeNote ? (
                <>
                  {/* Active Note Title Bar */}
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-neutral-800 pb-2.5 mb-2.5 shrink-0">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                      placeholder="Title"
                      className="flex-1 bg-transparent text-sm sm:text-base font-bold outline-none border-b border-transparent focus:border-purple-200/55 dark:text-white"
                    />

                    {/* Topic Dropdown tag */}
                    <div className="relative">
                      <select
                        value={activeNote.topic}
                        onChange={(e) => updateNote(activeNote.id, { topic: e.target.value })}
                        className="bg-purple-500/10 border-transparent text-primary dark:text-purple-300 text-[10px] font-black py-1 pl-2 pr-5 rounded-lg outline-none cursor-pointer appearance-none"
                      >
                        {TOPICS_LIST.map((t) => (
                          <option key={t} value={t} className="bg-white dark:bg-neutral-900 text-slate-800 dark:text-white font-medium">
                            {t}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-primary" />
                    </div>
                  </div>

                  {/* Mode Toggles & Formatting Toolbar */}
                  <div className="flex items-center justify-between gap-4 border-b border-slate-50 dark:border-neutral-800 pb-2 mb-2 shrink-0">
                    <div className="flex items-center gap-1">
                      {/* Write / Preview Tabs */}
                      <button
                        onClick={() => setEditMode("write")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          editMode === "write"
                            ? "bg-primary text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-650 dark:text-neutral-500 dark:hover:text-neutral-300"
                        }`}
                      >
                        Write
                      </button>
                      <button
                        onClick={() => setEditMode("preview")}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          editMode === "preview"
                            ? "bg-primary text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-650 dark:text-neutral-500 dark:hover:text-neutral-300"
                        }`}
                      >
                        Preview
                      </button>
                    </div>

                    {/* Editor Toolbar (Only in Write Mode) */}
                    {editMode === "write" && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => insertFormatting("**", "**")}
                          title="Bold"
                          className="p-1 rounded hover:bg-slate-150 dark:hover:bg-neutral-800 text-slate-450 hover:text-slate-800"
                        >
                          <Bold size={13} />
                        </button>
                        <button
                          onClick={() => insertFormatting("*", "*")}
                          title="Italic"
                          className="p-1 rounded hover:bg-slate-150 dark:hover:bg-neutral-800 text-slate-450 hover:text-slate-800"
                        >
                          <Italic size={13} />
                        </button>
                        <button
                          onClick={() => insertFormatting("```\n", "\n```")}
                          title="Code Block"
                          className="p-1 rounded hover:bg-slate-150 dark:hover:bg-neutral-800 text-slate-450 hover:text-slate-800"
                        >
                          <Code size={13} />
                        </button>
                        <button
                          onClick={() => insertFormatting("- ")}
                          title="List"
                          className="p-1 rounded hover:bg-slate-150 dark:hover:bg-neutral-800 text-slate-450 hover:text-slate-800"
                        >
                          <List size={13} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Core Editor/Preview Container */}
                  <div className="flex-1 min-h-0 overflow-y-auto mb-3">
                    {editMode === "write" ? (
                      <textarea
                        ref={textareaRef}
                        value={activeNote.content}
                        onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                        placeholder="Write note contents... (Supports Markdown)"
                        className="w-full h-full p-3 rounded-xl border border-slate-100 dark:border-neutral-800/80 bg-slate-50/20 dark:bg-neutral-900/30 text-base leading-relaxed resize-none outline-none focus:border-primary/45 transition dark:text-neutral-200"
                      />
                    ) : (
                      <div className="w-full h-full p-4 rounded-xl border border-slate-50 dark:border-neutral-800 bg-slate-50/20 dark:bg-neutral-950/10 overflow-y-auto text-left leading-relaxed text-base">
                        {activeNote.content.trim() ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                            {preprocessMarkdown(activeNote.content)}
                          </ReactMarkdown>
                        ) : (
                          <div className="text-slate-400 dark:text-neutral-600 font-bold italic py-8 text-center">
                            Note is empty. Write something to preview.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Workspace Action Bar */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-neutral-800 pt-3 shrink-0">
                    
                    {/* Discuss with AI */}
                    <button
                      onClick={handleDiscussWithAI}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary dark:text-purple-400 rounded-lg text-[10px] font-black transition flex items-center gap-1"
                    >
                      <Sparkles size={11} className="fill-primary dark:fill-purple-400" />
                      <span>Discuss with AlgoBot</span>
                    </button>

                    {/* Note Utilities */}
                    <div className="flex items-center gap-2">
                      {/* Copy */}
                      <button
                        onClick={handleCopy}
                        className="p-2 border border-slate-100 dark:border-neutral-800 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-450 transition-colors"
                        title="Copy raw markdown text"
                      >
                        {copied ? <Check size={13} className="text-emerald-500" /> : <FileText size={13} />}
                      </button>
                      
                      {/* Download */}
                      <button
                        onClick={handleDownload}
                        className="p-2 border border-slate-100 dark:border-neutral-800 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-800 text-slate-450 transition-colors"
                        title="Download Markdown note (.md)"
                      >
                        <Download size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteNote(activeNote.id)}
                        className="p-2 border border-red-100 dark:border-red-950/20 bg-red-50/50 dark:bg-red-950/10 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors ml-1"
                        title="Delete note"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                </>
              ) : (
                /* Workspace Empty State */
                <div className="flex-1 flex flex-col justify-center items-center text-center p-8 select-none">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
                    <NotebookPen size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-1.5">No active note</h3>
                  <p className="text-xs text-slate-400 dark:text-neutral-500 max-w-[240px] leading-normal mb-4">
                    Create a new note or select an existing one from the sidebar to begin drafting.
                  </p>
                  <button
                    onClick={() => createNote(`Note ${notes.length + 1}`, "")}
                    className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold transition hover:bg-primary-dark"
                  >
                    Create Note
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}