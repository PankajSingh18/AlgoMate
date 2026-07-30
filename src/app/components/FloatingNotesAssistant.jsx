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
    .catch(err => console.error(err))