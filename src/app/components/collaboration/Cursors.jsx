// components/collaboration/Cursors.jsx

'use client';

import { useEffect, useRef, useState } from 'react';

export function Cursors({ participants, currentUserId, editorRef }) {
  const [cursorPositions, setCursorPositions] = useState({});

  useEffect(() => {
    const positions = {};
    for (const participant of participants) {
      if (participant.id !== currentUserId && participant.cursor) {
        positions[participant.id] = participant.cursor;
      }
    }
    setCursorPositions(positions);
  }, [participants, currentUserId]);

  if (!editorRef.current || Object.keys(cursorPositions).length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {Object.entries(cursorPositions).map(([userId, cursor]) => {
        const participant = participants.find(p => p.id === userId);
        if (!participant) return null;

        // Calculate cursor position in editor
        const editor = editorRef.current;
        const model = editor.getModel();
        if (!model) return null;

        const position = model.getPositionAt(cursor.line, cursor.column);
        const coords = editor.getScrolledVisiblePosition(position);

        return (
          <div
            key={userId}
            className="absolute"
            style={{
              left: coords?.left || 0,
              top: coords?.top || 0,
              transform: 'translateY(-100%)',
            }}
          >
            <div
              className="w-0.5 h-5"
              style={{
                backgroundColor: getColorForUser(userId),
              }}
            />
            <div
              className="text-xs px-1 rounded"
              style={{
                backgroundColor: getColorForUser(userId),
                color: 'white',
                whiteSpace: 'nowrap',
              }}
            >
              {participant.name || 'Anonymous'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getColorForUser(userId) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#FF8C94', '#82CCDD',
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}