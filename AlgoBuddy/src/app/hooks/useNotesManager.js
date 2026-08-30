import { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const TOPIC_MAPPING = {
  array: "Array",
  "linked-list": "Linked List",
  linkedlist: "Linked List",
  stack: "Stack",
  queue: "Queue",
  recursion: "Recursion",
  tree: "Tree",
  hashmap: "HashMap",
  graph: "Graph",
  ai: "AI Algorithms",
  quiz: "Quiz",
  dp: "Dynamic Programming"
};

export function useNotesManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByTopicOnly, setFilterByTopicOnly] = useState(false);

  // Load notes on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("algobuddy-notebook");
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        if (parsed.length > 0) {
          setActiveNoteId(parsed[0].id);
        }
      } else {
        // Fallback/Migration: Check if there was an old single note
        const oldNote = localStorage.getItem("algobuddy-notes");
        if (oldNote && oldNote.trim()) {
          const initialNote = {
            id: "default-note",
            title: "My First Note",
            content: oldNote,
            topic: "General",
            createdAt: Date.now(),
            updatedAt: Date.now()
          };
          setNotes([initialNote]);
          setActiveNoteId(initialNote.id);
          localStorage.setItem("algobuddy-notebook", JSON.stringify([initialNote]));
        }
      }
    } catch (e) {
      console.error("Failed to load notebook notes:", e);
    }
  }, []);

  // Save notes on state change
  const saveNotes = useCallback((newNotes) => {
    setNotes(newNotes);
    localStorage.setItem("algobuddy-notebook", JSON.stringify(newNotes));
  }, []);

  // Detect current topic from path or queries
  const currentTopic = useMemo(() => {
    if (!pathname) return "General";

    // 1. Check path segments (e.g. /visualizer/array/... or /practice/tree)
    const segments = pathname.split("/").filter(Boolean);
    for (const segment of segments) {
      const lower = segment.toLowerCase();
      if (TOPIC_MAPPING[lower]) {
        return TOPIC_MAPPING[lower];
      }
    }

    // 2. Check search params (e.g. ?topic=Array)
    if (searchParams) {
      const topicParam = searchParams.get("topic") || searchParams.get("slug");
      if (topicParam) {
        const lower = topicParam.toLowerCase();
        return TOPIC_MAPPING[lower] || topicParam.charAt(0).toUpperCase() + topicParam.slice(1);
      }
    }

    return "General";
  }, [pathname, searchParams]);

  // Create Note
  const createNote = useCallback((title = "Untitled Note", content = "") => {
    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim() || "Untitled Note",
      content,
      topic: currentTopic,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [newNote, ...notes];
    saveNotes(updated);
    setActiveNoteId(newNote.id);
    return newNote;
  }, [notes, currentTopic, saveNotes]);

  // Update Note
  const updateNote = useCallback((id, fields) => {
    const updated = notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          ...fields,
          updatedAt: Date.now()
        };
      }
      return note;
    });
    saveNotes(updated);
  }, [notes, saveNotes]);

  // Delete Note
  const deleteNote = useCallback((id) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : null);
    }
  }, [notes, activeNoteId, saveNotes]);

  // Filtered notes list based on search and current topic toggle
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.topic.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic = !filterByTopicOnly || note.topic === currentTopic;

      return matchesSearch && matchesTopic;
    });
  }, [notes, searchQuery, filterByTopicOnly, currentTopic]);

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  return {
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
  };
}
