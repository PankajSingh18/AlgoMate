// src/lib/websocket/execution-client.js

import { io } from 'socket.io-client';

export class ExecutionClient {
  constructor(options = {}) {
    this.url = options.url || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000';
    this.socket = null;
    this.executions = new Map();
    this.eventListeners = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      this.socket = io(this.url, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      this.setupSocketHandlers();

      this.socket.on('connect', () => {
        console.log('✅ Connected to WebSocket execution server');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error);
        this.reconnectAttempts++;
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Failed to connect to execution server'));
        }
      });
    });
  }

  setupSocketHandlers() {
    this.socket.on('execution-started', (data) => {
      this.executions.set(data.executionId, {
        id: data.executionId,
        status: 'running',
        output: [],
        startTime: data.timestamp,
      });
      this.emit('execution-started', data);
    });

    this.socket.on('output', (data) => {
      const execution = this.executions.get(data.executionId);
      if (execution) {
        execution.output.push({
          content: data.content,
          type: data.type,
          timestamp: data.timestamp,
        });
        // Keep only last 1000 lines
        if (execution.output.length > 1000) {
          execution.output = execution.output.slice(-1000);
        }
      }
      this.emit('output', data);
    });

    this.socket.on('input-required', (data) => {
      this.emit('input-required', data);
    });

    this.socket.on('input-received', (data) => {
      this.emit('input-received', data);
    });

    this.socket.on('execution-completed', (data) => {
      const execution = this.executions.get(data.executionId);
      if (execution) {
        execution.status = data.status;
        execution.endTime = data.timestamp;
        execution.exitCode = data.exitCode;
        execution.executionTime = data.executionTime;
      }
      this.emit('execution-completed', data);
    });

    this.socket.on('control-response', (data) => {
      const execution = this.executions.get(data.executionId);
      if (execution) {
        execution.status = data.status;
      }
      this.emit('control-response', data);
    });

    this.socket.on('error', (data) => {
      this.emit('error', data);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.emit('disconnect');
    });
  }

  execute(code, language, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error('Not connected to execution server'));
        return;
      }

      this.socket.emit('execute', {
        code,
        language,
        options,
      });

      // Wait for execution-started
      const handler = (data) => {
        if (data.executionId) {
          this.off('execution-started', handler);
          resolve({
            executionId: data.executionId,
            startTime: data.timestamp,
          });
        }
      };

      this.on('execution-started', handler);

      // Timeout after 10 seconds
      setTimeout(() => {
        this.off('execution-started', handler);
        reject(new Error('Execution start timeout'));
      }, 10000);
    });
  }

  sendInput(executionId, input) {
    if (!this.isConnected) {
      throw new Error('Not connected to execution server');
    }

    this.socket.emit('input', {
      executionId,
      input,
    });
  }

  sendControl(executionId, command) {
    if (!this.isConnected) {
      throw new Error('Not connected to execution server');
    }

    this.socket.emit('control', {
      executionId,
      command,
    });
  }

  getExecution(executionId) {
    return this.executions.get(executionId) || null;
  }

  getOutput(executionId) {
    const execution = this.executions.get(executionId);
    return execution ? execution.output : [];
  }

  pause(executionId) {
    this.sendControl(executionId, 'pause');
  }

  resume(executionId) {
    this.sendControl(executionId, 'resume');
  }

  stop(executionId) {
    this.sendControl(executionId, 'stop');
  }

  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.eventListeners.has(event)) return;
    if (callback) {
      this.eventListeners.set(
        event,
        this.eventListeners.get(event).filter(cb => cb !== callback)
      );
    } else {
      this.eventListeners.delete(event);
    }
  }

  emit(event, data) {
    if (!this.eventListeners.has(event)) return;
    for (const callback of this.eventListeners.get(event)) {
      callback(data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.executions.clear();
    this.eventListeners.clear();
  }
}