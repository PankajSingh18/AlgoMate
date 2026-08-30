// lib/collaboration/server.js

import { Server } from 'socket.io';
import OTEngine from '../ot/transform.js';
import { v4 as uuidv4 } from 'uuid';

export class CollaborationServer {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.sessions = new Map();
    this.documents = new Map();
    this.users = new Map();
    this.otEngines = new Map();

    this.setupSocketHandlers();
    console.log('✅ Collaboration server initialized');
  }

  setupSocketHandlers() {
    this.io.use((socket, next) => {
      // Authentication middleware
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      // Verify token (simplified)
      socket.userId = token;
      next();
    });

    this.io.on('connection', (socket) => {
      console.log(`👤 User connected: ${socket.id}`);

      // Store user
      this.users.set(socket.id, {
        id: socket.id,
        userId: socket.userId,
        socket,
        sessionId: null,
        cursor: { line: 0, column: 0 },
        selection: null,
      });

      // Join session
      socket.on('join-session', async (data) => {
        await this.handleJoinSession(socket, data);
      });

      // Code changes
      socket.on('code-change', (data) => {
        this.handleCodeChange(socket, data);
      });

      // Cursor update
      socket.on('cursor-update', (data) => {
        this.handleCursorUpdate(socket, data);
      });

      // Selection update
      socket.on('selection-update', (data) => {
        this.handleSelectionUpdate(socket, data);
      });

      // Audio/Video signaling
      socket.on('webrtc-offer', (data) => {
        this.handleWebRTC(socket, 'offer', data);
      });

      socket.on('webrtc-answer', (data) => {
        this.handleWebRTC(socket, 'answer', data);
      });

      socket.on('webrtc-ice-candidate', (data) => {
        this.handleWebRTC(socket, 'ice-candidate', data);
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  async handleJoinSession(socket, data) {
    try {
      const { sessionId, role, userId, userName } = data;

      // Validate session
      if (!this.sessions.has(sessionId)) {
        // Create new session
        this.sessions.set(sessionId, {
          id: sessionId,
          participants: [],
          document: '',
          otEngine: new OTEngine(),
          createdBy: userId,
          createdAt: new Date(),
          roles: {},
        });
        this.otEngines.set(sessionId, new OTEngine());
        this.documents.set(sessionId, '');
      }

      // Get session
      const session = this.sessions.get(sessionId);
      
      // Check role limits
      if (role === 'interviewer') {
        const interviewers = Object.values(session.roles).filter(r => r === 'interviewer');
        if (interviewers.length >= 1) {
          socket.emit('error', { message: 'Only one interviewer allowed' });
          return;
        }
      }

      // Add participant
      const participant = {
        id: socket.id,
        userId,
        userName: userName || `User-${socket.id.slice(0, 6)}`,
        role: role || 'interviewee',
        joinedAt: new Date(),
        cursor: { line: 0, column: 0 },
        selection: null,
      };

      session.participants.push(participant);
      session.roles[socket.id] = participant.role;

      // Update user data
      const user = this.users.get(socket.id);
      user.sessionId = sessionId;

      // Join socket room
      socket.join(sessionId);

      // Send current document
      const currentDoc = this.documents.get(sessionId) || '';
      socket.emit('session-joined', {
        sessionId,
        role: participant.role,
        document: currentDoc,
        participants: session.participants.map(p => ({
          id: p.id,
          name: p.userName,
          role: p.role,
          cursor: p.cursor,
          selection: p.selection,
        })),
        version: this.otEngines.get(sessionId).getVersion(),
      });

      // Broadcast to others
      socket.to(sessionId).emit('participant-joined', {
        participant: {
          id: participant.id,
          name: participant.userName,
          role: participant.role,
        },
      });

      console.log(`📍 User ${participant.userName} joined session ${sessionId} as ${participant.role}`);

    } catch (error) {
      console.error('Error joining session:', error);
      socket.emit('error', { message: error.message });
    }
  }

  handleCodeChange(socket, data) {
    try {
      const { sessionId, operation, version } = data;
      const user = this.users.get(socket.id);
      
      if (!user || user.sessionId !== sessionId) {
        return;
      }

      // Get OT engine
      const otEngine = this.otEngines.get(sessionId);
      if (!otEngine) return;

      // Get current document
      let document = this.documents.get(sessionId) || '';

      // Apply operation locally
      const newDocument = otEngine.apply(operation, document);
      this.documents.set(sessionId, newDocument);

      // Increment version
      otEngine.incrementVersion();

      // Broadcast to others
      socket.to(sessionId).emit('code-update', {
        userId: user.userId,
        userName: user.userName,
        operation,
        version: otEngine.getVersion(),
        document: newDocument,
      });

      // Send acknowledgment
      socket.emit('code-ack', {
        version: otEngine.getVersion(),
      });

    } catch (error) {
      console.error('Error handling code change:', error);
      socket.emit('error', { message: 'Failed to apply change' });
    }
  }

  handleCursorUpdate(socket, data) {
    try {
      const { sessionId, cursor } = data;
      const user = this.users.get(socket.id);
      
      if (!user || user.sessionId !== sessionId) {
        return;
      }

      // Update user cursor
      user.cursor = cursor;
      this.users.set(socket.id, user);

      // Update session participant
      const session = this.sessions.get(sessionId);
      if (session) {
        const participant = session.participants.find(p => p.id === socket.id);
        if (participant) {
          participant.cursor = cursor;
        }
      }

      // Broadcast to others
      socket.to(sessionId).emit('cursor-update', {
        userId: user.userId,
        userName: user.userName,
        cursor,
      });

    } catch (error) {
      console.error('Error handling cursor update:', error);
    }
  }

  handleSelectionUpdate(socket, data) {
    try {
      const { sessionId, selection } = data;
      const user = this.users.get(socket.id);
      
      if (!user || user.sessionId !== sessionId) {
        return;
      }

      // Update user selection
      user.selection = selection;
      this.users.set(socket.id, user);

      // Update session participant
      const session = this.sessions.get(sessionId);
      if (session) {
        const participant = session.participants.find(p => p.id === socket.id);
        if (participant) {
          participant.selection = selection;
        }
      }

      // Broadcast to others
      socket.to(sessionId).emit('selection-update', {
        userId: user.userId,
        userName: user.userName,
        selection,
      });

    } catch (error) {
      console.error('Error handling selection update:', error);
    }
  }

  handleWebRTC(socket, type, data) {
    try {
      const { sessionId, targetUserId, payload } = data;
      const user = this.users.get(socket.id);
      
      if (!user || user.sessionId !== sessionId) {
        return;
      }

      // Find target socket
      let targetSocket = null;
      for (const [id, u] of this.users) {
        if (u.userId === targetUserId && u.sessionId === sessionId) {
          targetSocket = u.socket;
          break;
        }
      }

      if (!targetSocket) {
        socket.emit('error', { message: 'Target user not found' });
        return;
      }

      // Forward WebRTC message
      targetSocket.emit(`webrtc-${type}`, {
        fromUserId: user.userId,
        fromUserName: user.userName,
        payload,
      });

    } catch (error) {
      console.error('Error handling WebRTC:', error);
    }
  }

  handleDisconnect(socket) {
    try {
      const user = this.users.get(socket.id);
      if (!user) return;

      const sessionId = user.sessionId;
      if (sessionId && this.sessions.has(sessionId)) {
        const session = this.sessions.get(sessionId);
        
        // Remove participant
        session.participants = session.participants.filter(p => p.id !== socket.id);
        delete session.roles[socket.id];

        // Broadcast to others
        socket.to(sessionId).emit('participant-left', {
          userId: user.userId,
          userName: user.userName,
        });

        // Clean up empty sessions
        if (session.participants.length === 0) {
          this.sessions.delete(sessionId);
          this.documents.delete(sessionId);
          this.otEngines.delete(sessionId);
          console.log(`🗑️ Session ${sessionId} removed (no participants)`);
        }
      }

      // Remove user
      this.users.delete(socket.id);
      console.log(`👤 User disconnected: ${socket.id}`);

    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  }

  /**
   * Get session status
   */
  getSessionStatus(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }

    return {
      id: session.id,
      participants: session.participants.map(p => ({
        id: p.id,
        name: p.userName,
        role: p.role,
        cursor: p.cursor,
        selection: p.selection,
      })),
      documentLength: (this.documents.get(sessionId) || '').length,
      version: this.otEngines.get(sessionId)?.getVersion() || 0,
      createdAt: session.createdAt,
    };
  }

  /**
   * Close server
   */
  close() {
    this.io.close();
    console.log('🛑 Collaboration server closed');
  }
}

export default CollaborationServer;