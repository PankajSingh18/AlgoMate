// lib/collaboration/client.js

import { io } from 'socket.io-client';
import OTEngine from '../ot/transform.js';

export class CollaborationClient {
  constructor() {
    this.socket = null;
    this.sessionId = null;
    this.userId = null;
    this.userName = null;
    this.role = null;
    this.otEngine = new OTEngine();
    this.document = '';
    this.participants = [];
    this.callbacks = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  /**
   * Connect to collaboration server
   */
  connect(token, options = {}) {
    return new Promise((resolve, reject) => {
      const url = options.serverUrl || process.env.NEXT_PUBLIC_COLLABORATION_URL || 'http://localhost:3001';

      this.socket = io(url, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.setupSocketHandlers();

      this.socket.on('connect', () => {
        console.log('✅ Connected to collaboration server');
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to collaboration server'));
        }
      });
    });
  }

  /**
   * Setup socket event handlers
   */
  setupSocketHandlers() {
    this.socket.on('session-joined', (data) => {
      this.sessionId = data.sessionId;
      this.role = data.role;
      this.document = data.document;
      this.participants = data.participants;
      this.otEngine.version = data.version || 0;

      this.trigger('session-joined', data);
      this.trigger('document-update', this.document);
      this.trigger('participants-update', this.participants);
    });

    this.socket.on('participant-joined', (data) => {
      this.participants.push(data.participant);
      this.trigger('participants-update', this.participants);
      this.trigger('participant-joined', data);
    });

    this.socket.on('participant-left', (data) => {
      this.participants = this.participants.filter(p => p.id !== data.userId);
      this.trigger('participants-update', this.participants);
      this.trigger('participant-left', data);
    });

    this.socket.on('code-update', (data) => {
      // Apply remote operation
      if (data.operation) {
        this.document = this.otEngine.apply(data.operation, this.document);
        this.otEngine.version = data.version || this.otEngine.version + 1;
        this.trigger('document-update', this.document);
        this.trigger('remote-change', data);
      }
    });

    this.socket.on('code-ack', (data) => {
      this.otEngine.version = data.version || this.otEngine.version;
      this.trigger('code-ack', data);
    });

    this.socket.on('cursor-update', (data) => {
      this.trigger('cursor-update', data);
    });

    this.socket.on('selection-update', (data) => {
      this.trigger('selection-update', data);
    });

    this.socket.on('webrtc-offer', (data) => {
      this.trigger('webrtc-offer', data);
    });

    this.socket.on('webrtc-answer', (data) => {
      this.trigger('webrtc-answer', data);
    });

    this.socket.on('webrtc-ice-candidate', (data) => {
      this.trigger('webrtc-ice-candidate', data);
    });

    this.socket.on('error', (data) => {
      this.trigger('error', data);
    });

    this.socket.on('disconnect', () => {
      this.trigger('disconnect');
    });
  }

  /**
   * Join a collaboration session
   */
  joinSession(sessionId, options = {}) {
    return new Promise((resolve, reject) => {
      this.sessionId = sessionId;
      this.userId = options.userId;
      this.userName = options.userName || `User-${Math.random().toString(36).slice(2, 8)}`;
      this.role = options.role || 'interviewee';

      this.socket.emit('join-session', {
        sessionId,
        role: this.role,
        userId: this.userId,
        userName: this.userName,
      });

      // Wait for session-joined event
      const handler = (data) => {
        if (data.sessionId === sessionId) {
          this.off('session-joined', handler);
          resolve(data);
        }
      };

      this.on('session-joined', handler);

      // Timeout after 10 seconds
      setTimeout(() => {
        this.off('session-joined', handler);
        reject(new Error('Timeout joining session'));
      }, 10000);
    });
  }

  /**
   * Send code change
   */
  sendCodeChange(operation) {
    if (!this.socket || !this.sessionId) {
      return;
    }

    this.socket.emit('code-change', {
      sessionId: this.sessionId,
      operation,
      version: this.otEngine.getVersion(),
    });
  }

  /**
   * Update cursor position
   */
  updateCursor(cursor) {
    if (!this.socket || !this.sessionId) {
      return;
    }

    this.socket.emit('cursor-update', {
      sessionId: this.sessionId,
      cursor,
    });
  }

  /**
   * Update selection
   */
  updateSelection(selection) {
    if (!this.socket || !this.sessionId) {
      return;
    }

    this.socket.emit('selection-update', {
      sessionId: this.sessionId,
      selection,
    });
  }

  /**
   * Send WebRTC offer
   */
  sendWebRTCOffer(targetUserId, offer) {
    if (!this.socket || !this.sessionId) {
      return;
    }

    this.socket.emit('webrtc-offer', {
      sessionId: this.sessionId,
      targetUserId,
      payload: offer,
    });
  }

  /**
   * Send WebRTC answer
   */
  sendWebRTCAnswer(targetUserId, answer) {
    if (!this.socket || !this.sessionId) {
      return;
    }

    this.socket.emit('webrtc-answer', {
      sessionId: this.sessionId,
      targetUserId,
      payload: answer,
    });
  }

  /**
   * Send WebRTC ICE candidate
   */
  sendWebRTCICECandidate(targetUserId, candidate) {
    if (!this.socket || !this.sessionId) {
      return;
    }

    this.socket.emit('webrtc-ice-candidate', {
      sessionId: this.sessionId,
      targetUserId,
      payload: candidate,
    });
  }

  /**
   * Get current document
   */
  getDocument() {
    return this.document;
  }

  /**
   * Get participants
   */
  getParticipants() {
    return this.participants;
  }

  /**
   * Register event callback
   */
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  /**
   * Remove event callback
   */
  off(event, callback) {
    if (!this.callbacks[event]) {
      return;
    }
    if (callback) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    } else {
      this.callbacks[event] = [];
    }
  }

  /**
   * Trigger event callbacks
   */
  trigger(event, data) {
    if (!this.callbacks[event]) {
      return;
    }
    for (const callback of this.callbacks[event]) {
      callback(data);
    }
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.sessionId = null;
    this.participants = [];
    this.document = '';
    this.trigger('disconnect');
  }
}

export default CollaborationClient;