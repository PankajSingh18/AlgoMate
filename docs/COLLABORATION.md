# 🤝 Collaborative Live Coding

## Overview

AlgoBuddy's collaborative coding feature enables real-time pair programming and mock interviews with:

- ✅ Real-time code synchronization with OT
- ✅ Cursor and selection sharing
- ✅ Interviewer/interviewee roles
- ✅ Integrated WebRTC audio/video
- ✅ Session management

## Architecture
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Client 1 │────▶│ Socket.io │────▶│ OT Engine │
│ (Editor) │ │ Server │ │ │
└─────────────┘ └─────────────┘ └─────────────┘
│ │ │
▼ ▼ ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Client 2 │────▶│ WebRTC │────▶│ Document │
│ (Editor) │ │ (P2P) │ │ State │
└─────────────┘ └─────────────┘ └─────────────┘

text

## Operational Transform (OT)

### How It Works

1. **Insert Operation**
 
   { type: 'insert', position: 5, chars: 'hello' }
Delete Operation

javascript
{ type: 'delete', position: 5, length: 3 }
Transform Operations

Operations are transformed to maintain consistency

Conflicts are resolved deterministically

## Example

User A: insert "a" at position 0
User B: insert "b" at position 0

After transform:
User A: insert "a" at position 0
User B: insert "b" at position 1

Result: "ab"
Roles
# Interviewer
View and edit code
Start/stop recording
Control session

# Interviewee
View and edit code
Share screen
Chat

## API Endpoints
# Create Session
bash
POST /api/collaboration/session
{
  "title": "Mock Interview",
  "type": "interview"
}
# Join Session
javascript
const client = new CollaborationClient();
await client.connect(token);
await client.joinSession(sessionId, {
  userId: 'user-123',
  userName: 'Alice',
  role: 'interviewer'
});
## WebRTC Configuration
# Audio/Video Requirements
Audio: Opus codec, 16kHz
Video: VP8 codec, 720p
ICE: STUN/TURN servers

# Peer Connection

const peer = new SimplePeer({
  initiator: true,
  trickle: true,
  stream: localStream
});
## Usage
# Start a Session

// Create session
const response = await fetch('/api/collaboration/session', {
  method: 'POST',
  body: JSON.stringify({ title: 'Coding Interview' })
});

const { sessionId } = await response.json();

// Share sessionId with participant
# Join a Session

import { CollaborativeEditor } from '@/components/collaboration/CollaborativeEditor';

function Interview() {
  return (
    <CollaborativeEditor
      sessionId={sessionId}
      userId={user.id}
      userName={user.name}
      role="interviewer"
      token={authToken}
    />
  );
}
## Security

# Authentication
Socket.io authentication with JWT
Session validation
Role-based permissions

# Data Protection
End-to-end encryption for WebRTC
Secure WebSocket connections
No persistent code storage

## Monitoring
# Session Status

GET /api/collaboration/session?id={sessionId}

# Health Check

GET /api/health