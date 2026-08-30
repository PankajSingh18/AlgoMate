"use client";

import React, { useState, useEffect } from "react";
import { Save, Trash2, Edit3, BookOpen } from "lucide-react";

export default function AlgorithmNotes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Load saved notes
  useEffect(() => {
    const savedNotes = localStorage.getItem("algorithm-notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage
  const saveToStorage = (updatedNotes) => {
    setNotes(updatedNotes);
    localStorage.setItem(
      "algorithm-notes",
      JSON.stringify(updatedNotes)
    );
  };

  // Add or update note
  const handleSave = () => {
    if (!note.trim()) return;

    let updatedNotes = [...notes];

    if (editingIndex !== null) {
      updatedNotes[editingIndex] = note;
      setEditingIndex(null);
    } else {
      updatedNotes.push(note);
    }

    saveToStorage(updatedNotes);
    setNote("");
  };

  // Edit note
  const handleEdit = (index) => {
    setNote(notes[index]);
    setEditingIndex(index);
  };

  // Delete note
  const handleDelete = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    saveToStorage(updatedNotes);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-5 bg-slate-900 text-white rounded-2xl shadow-lg my-6">
      
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-purple-400" />
        <h2 className="text-xl font-bold">
          Algorithm Notes & Annotations
        </h2>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your observations, doubts, or important concepts here..."
        className="w-full h-28 p-3 rounded-lg bg-slate-800 border border-slate-700 outline-none resize-none"
      />

      <button
        onClick={handleSave}
        className="mt-3 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium"
      >
        <Save size={18} />
        {editingIndex !== null ? "Update Note" : "Save Note"}
      </button>

      <div className="mt-6 space-y-3">
        {notes.length === 0 ? (
          <p className="text-slate-400">
            No notes added yet.
          </p>
        ) : (
          notes.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800 p-3 rounded-lg border border-slate-700"
            >
              <p className="mb-3">{item}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(index)}
                  className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300"
                >
                  <Edit3 size={16} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(index)}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}