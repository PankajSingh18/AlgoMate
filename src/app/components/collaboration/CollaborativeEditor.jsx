// components/collaboration/CollaborativeEditor.jsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import CollaborationClient from '@/lib/collaboration/client.js';
import OTEngine from '@/lib/ot/transform.js';
import { Cursors } from './Cursors.jsx';
import { Participants } from './Participants.jsx';
import { WebRTC } from './WebRTC.jsx';

export function CollaborativeEditor({
  sessionId,
  userId,
  userName,
  role,
  token,
  onError,
}) {
  const [client, setClient] = useState(null);
  const [document, setDocument] = useState('');
  const [participants, setParticipants] = useState([]);
  const [connected, setConnected] = useState(false);
  const [cursor, setCursor] = useState({ line: 0, column: 0 });
  const [selection, setSelection] = useState(null);
  const [isInterviewer, setIsInterviewer] = useState(role === 'interviewer');
  const editorRef = useRef(null);
  const otEngine = useRef(new OTEngine());

  // Initialize collaboration client
  useEffect(() => {
    const collaborationClient = new CollaborationClient();
    setClient(collaborationClient);

    // Connect to server
    collaborationClient.connect(token)
      .then(() => {
        setConnected(true);
        return collaborationClient.joinSession(sessionId, {
          userId,
          userName,
          role,
        });
      })
      .then(() => {
        setDocument(collaborationClient.getDocument());
        setParticipants(collaborationClient.getParticipants());
      })
      .catch((error) => {
        console.error('Failed to join session:', error);
        onError?.(error);
      });

    // Setup event handlers
    collaborationClient.on('document-update', (doc) => {
      setDocument(doc);
    });

    collaborationClient.on('participants-update', (participants) => {
      setParticipants(participants);
    });

    collaborationClient.on('remote-change', (data) => {
      // Update editor if it's from remote
      if (editorRef.current && data.userId !== userId) {
        // Editor will update via document prop
      }
    });

    collaborationClient.on('error', (error) => {
      console.error('Collaboration error:', error);
      onError?.(error);
    });

    collaborationClient.on('disconnect', () => {
      setConnected(false);
    });

    return () => {
      collaborationClient.disconnect();
    };
  }, [sessionId, userId, userName, role, token]);

  // Handle editor mount
  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    // Set up cursor tracking
    editor.onDidChangeCursorPosition((e) => {
      const position = e.position;
      setCursor({ line: position.lineNumber, column: position.column });
      client?.updateCursor({ line: position.lineNumber, column: position.column });
    });

    // Set up selection tracking
    editor.onDidChangeCursorSelection((e) => {
      const selection = e.selection;
      setSelection(selection);
      client?.updateSelection(selection);
    });
  };

  // Handle document changes
  const handleEditorChange = (value) => {
    if (!client || !editorRef.current) return;

    // Generate operation
    const operation = otEngine.current.generateOperation(document, value);
    if (operation) {
      // Send to server
      client.sendCodeChange(operation);
    }

    setDocument(value);
  };

  // Handle before change (for OT)
  const handleBeforeChange = (value) => {
    // Store current document for diff
    return document;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with participants */}
      <div className="flex justify-between items-center p-2 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {isInterviewer ? '👨‍🏫 Interviewer' : '👨‍💻 Interviewee'}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${
            connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <Participants participants={participants} currentUserId={userId} />
      </div>

      {/* Main editor area */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={document}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          options={{
            readOnly: !isInterviewer && role === 'interviewee',
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
          }}
        />

        {/* Cursors overlay */}
        <Cursors
          participants={participants}
          currentUserId={userId}
          editorRef={editorRef}
        />
      </div>

      {/* WebRTC for audio/video */}
      <WebRTC
        client={client}
        participants={participants}
        currentUserId={userId}
        sessionId={sessionId}
      />
    </div>
  );
}