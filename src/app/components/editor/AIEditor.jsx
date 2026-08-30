// src/app/components/editor/AIEditor.jsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

export function AIEditor({
  initialCode = '',
  language = 'javascript',
  onChange,
  onExecute,
  readOnly = false,
}) {
  const [code, setCode] = useState(initialCode);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const editorRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimer = useRef(null);
  const lastPosition = useRef(null);

  // Handle editor mount
  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    // Set up content change listener
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
      onChange?.(value);

      // Trigger completion check
      const position = editor.getPosition();
      if (position) {
        lastPosition.current = position;
        triggerCompletion(value, position);
      }
    });

    // Set up cursor position change listener
    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      lastPosition.current = position;
      
      // Check if we should show completions
      const model = editor.getModel();
      if (model) {
        const line = model.getLineContent(position.lineNumber);
        const prefix = line.slice(0, position.column).trim();
        
        // Show completions when user types certain characters
        if (prefix.endsWith('.') || prefix.endsWith('(') || prefix.endsWith(' ')) {
          triggerCompletion(editor.getValue(), position);
        }
      }
    });

    // Keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
      const position = editor.getPosition();
      if (position) {
        triggerCompletion(editor.getValue(), position);
      }
    });
  };

  // Trigger AI completion
  const triggerCompletion = async (code, position) => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce to avoid too many requests
    debounceTimer.current = setTimeout(async () => {
      if (!code || !position) return;

      setLoading(true);
      try {
        const response = await fetch('/api/ai/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            language,
            position: {
              lineNumber: position.lineNumber,
              column: position.column,
            },
          }),
        });

        const data = await response.json();
        if (data.success && data.data.suggestions.length > 0) {
          setSuggestions(data.data.suggestions);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Completion error:', error);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  // Insert suggestion
  const insertSuggestion = (suggestion) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const position = editor.getPosition();
    if (!position) return;

    // Insert text at current position
    editor.executeEdits('insert-suggestion', [{
      range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      },
      text: suggestion.text,
      forceMoveMarkers: true,
    }]);

    // Move cursor to end of inserted text
    const newPosition = {
      lineNumber: position.lineNumber,
      column: position.column + suggestion.text.length,
    };
    editor.setPosition(newPosition);
    editor.focus();

    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions) return;

      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSuggestions([]);
        e.preventDefault();
      } else if (e.key === 'Enter' && suggestions.length > 0) {
        // Insert first suggestion
        insertSuggestion(suggestions[0]);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        // Navigate down
        e.preventDefault();
      } else if (e.key === 'ArrowUp') {
        // Navigate up
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions]);

  return (
    <div className="relative">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => {
          setCode(value || '');
          onChange?.(value || '');
        }}
        onMount={handleEditorMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          automaticLayout: true,
          suggest: {
            showWords: true,
            showSnippets: true,
          },
        }}
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded text-sm">
          ⏳ Thinking...
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute bottom-full left-0 mb-2 w-96 max-h-80 overflow-y-auto bg-gray-900 text-white rounded-lg shadow-lg border border-gray-700 z-50"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => insertSuggestion(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                    {suggestion.text.slice(0, 100)}
                    {suggestion.text.length > 100 && '...'}
                  </div>
                  {suggestion.description && (
                    <div className="text-xs text-gray-400 mt-1">
                      {suggestion.description}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {suggestion.type && (
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                      {suggestion.type}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {(suggestion.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </button>
          ))}
          <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-800">
            Press Enter to insert • Esc to dismiss • Ctrl+Space to trigger
          </div>
        </div>
      )}
    </div>
  );
}