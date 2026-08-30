// src/lib/websocket/execution-server.js

import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { CodeExecutor } from '../sandbox/executor.js';
import { EventEmitter } from 'events';

export class ExecutionServer extends EventEmitter {
  constructor(server, options = {}) {
    super();
    this.io = new Server(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      ...options,
    });

    this.executions = new Map();
    this.executor = new CodeExecutor();
    this.cleanupInterval = null;

    // Initialize executor
    this.executor.initialize().catch(console.error);

    // Setup socket handlers
    this.setupSocketHandlers();

    // Cleanup idle executions every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupIdleExecutions();
    }, 5 * 60 * 1000);

    console.log('✅ WebSocket Execution Server initialized');
  }

  setupSocketHandlers() {
    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      // Verify token (simplified)
      socket.userId = token;
      next();
    });

    this.io.on('connection', (socket) => {
      console.log(`🔌 New WebSocket connection: ${socket.id}`);

      // Create execution
      socket.on('execute', async (data) => {
        await this.handleExecute(socket, data);
      });

      // Send input
      socket.on('input', (data) => {
        this.handleInput(socket, data);
      });

      // Control commands
      socket.on('control', (data) => {
        this.handleControl(socket, data);
      });

      // Disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  async handleExecute(socket, data) {
    try {
      const { code, language, options = {} } = data;
      
      if (!code) {
        socket.emit('error', { message: 'Code is required' });
        return;
      }

      // Create execution session
      const executionId = uuidv4();
      const startTime = Date.now();

      // Store execution context
      this.executions.set(executionId, {
        id: executionId,
        socketId: socket.id,
        userId: socket.userId,
        code,
        language,
        options,
        status: 'running',
        startTime,
        output: '',
        inputQueue: [],
        process: null,
      });

      // Send execution started
      socket.emit('execution-started', {
        executionId,
        timestamp: new Date().toISOString(),
      });

      // Execute code with streaming
      await this.executeWithStreaming(executionId, socket);

    } catch (error) {
      console.error('Execution error:', error);
      socket.emit('error', {
        message: error.message || 'Execution failed',
        executionId: null,
      });
    }
  }

  async executeWithStreaming(executionId, socket) {
    const execution = this.executions.get(executionId);
    if (!execution) return;

    try {
      // Get container from pool
      const container = await this.executor.dockerManager.getContainer();
      await container.start();

      // Write code to container
      const langConfig = this.executor.dockerManager.getLanguageConfig(execution.language);
      const filename = `script.${langConfig.extension}`;
      const codePath = `/home/sandbox/code/${filename}`;

      // Escape code for shell
      const escapedCode = execution.code.replace(/'/g, "'\\''");
      
      let exec = await container.exec({
        Cmd: ['bash', '-c', `echo '${escapedCode}' > ${codePath}`],
        AttachStdout: true,
        AttachStderr: true,
      });
      
      await exec.start();

      // Build execution command
      const command = this.executor.dockerManager.getExecutionCommand(
        execution.language,
        codePath
      );
      const timeout = execution.options.timeout || 
        parseInt(process.env.EXECUTION_TIMEOUT || '30');

      // Execute with streaming
      exec = await container.exec({
        Cmd: ['bash', '-c', `/usr/local/bin/timeout.sh ${timeout} ${command}`],
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
      });

      const stream = await exec.start({ hijack: true, stdin: true });

      // Handle stdout/stderr
      stream.on('data', (chunk) => {
        const data = chunk.toString();
        const lines = data.split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            // Check if it's input prompt
            if (line.includes('?') || line.includes(':')) {
              socket.emit('input-required', {
                executionId,
                prompt: line.trim(),
                timestamp: new Date().toISOString(),
              });
            } else {
              // Regular output
              socket.emit('output', {
                executionId,
                content: line,
                type: 'stdout',
                timestamp: new Date().toISOString(),
              });
            }
          }
        }
      });

      // Handle input
      const inputHandler = (data) => {
        if (data.executionId === executionId && data.input) {
          const input = data.input + '\n';
          stream.write(input);
        }
      };

      socket.on('input', inputHandler);

      // Wait for completion
      await new Promise((resolve, reject) => {
        stream.on('end', () => {
          socket.off('input', inputHandler);
          resolve();
        });
        stream.on('error', (err) => {
          socket.off('input', inputHandler);
          reject(err);
        });
      });

      // Get exit code
      const inspect = await exec.inspect();
      const exitCode = inspect.ExitCode || 0;

      // Update execution status
      execution.status = exitCode === 0 ? 'completed' : 'failed';
      execution.endTime = Date.now();
      execution.exitCode = exitCode;

      // Send completion
      socket.emit('execution-completed', {
        executionId,
        exitCode,
        executionTime: execution.endTime - execution.startTime,
        status: execution.status,
        timestamp: new Date().toISOString(),
      });

      // Return container to pool
      await this.executor.dockerManager.returnContainer(container);

    } catch (error) {
      console.error('Streaming error:', error);
      
      execution.status = 'error';
      execution.error = error.message;

      socket.emit('error', {
        executionId,
        message: error.message || 'Execution failed',
        timestamp: new Date().toISOString(),
      });
    } finally {
      // Clean up after some time
      setTimeout(() => {
        if (this.executions.has(executionId)) {
          this.executions.delete(executionId);
        }
      }, 30000); // Keep for 30 seconds for reference
    }
  }

  handleInput(socket, data) {
    const { executionId, input } = data;
    const execution = this.executions.get(executionId);
    
    if (!execution) {
      socket.emit('error', { message: 'Execution not found' });
      return;
    }

    // Queue input for the execution
    execution.inputQueue.push(input);
    
    // Emit input received
    socket.emit('input-received', {
      executionId,
      input,
      timestamp: new Date().toISOString(),
    });
  }

  handleControl(socket, data) {
    const { executionId, command } = data;
    const execution = this.executions.get(executionId);
    
    if (!execution) {
      socket.emit('error', { message: 'Execution not found' });
      return;
    }

    switch (command) {
      case 'pause':
        execution.status = 'paused';
        socket.emit('control-response', {
          executionId,
          command,
          status: 'paused',
          timestamp: new Date().toISOString(),
        });
        break;

      case 'resume':
        execution.status = 'running';
        socket.emit('control-response', {
          executionId,
          command,
          status: 'running',
          timestamp: new Date().toISOString(),
        });
        break;

      case 'stop':
        execution.status = 'stopped';
        // Kill the process
        socket.emit('control-response', {
          executionId,
          command,
          status: 'stopped',
          timestamp: new Date().toISOString(),
        });
        // Clean up
        setTimeout(() => {
          if (this.executions.has(executionId)) {
            this.executions.delete(executionId);
          }
        }, 5000);
        break;

      default:
        socket.emit('error', { message: 'Unknown command' });
    }
  }

  handleDisconnect(socket) {
    console.log(`🔌 WebSocket disconnected: ${socket.id}`);
    
    // Clean up executions for this socket
    for (const [id, execution] of this.executions) {
      if (execution.socketId === socket.id) {
        if (execution.status === 'running') {
          execution.status = 'disconnected';
        }
        // Mark for cleanup
        setTimeout(() => {
          if (this.executions.has(id)) {
            this.executions.delete(id);
          }
        }, 60000);
      }
    }
  }

  cleanupIdleExecutions() {
    const now = Date.now();
    const idleTimeout = 30 * 60 * 1000; // 30 minutes

    for (const [id, execution] of this.executions) {
      if (execution.status === 'completed' || 
          execution.status === 'failed' || 
          execution.status === 'error') {
        const endTime = execution.endTime || now;
        if (now - endTime > idleTimeout) {
          this.executions.delete(id);
          console.log(`🧹 Cleaned up idle execution: ${id}`);
        }
      }
    }
  }

  getExecutionStatus(executionId) {
    const execution = this.executions.get(executionId);
    if (!execution) return null;

    return {
      id: execution.id,
      status: execution.status,
      language: execution.language,
      startTime: execution.startTime,
      endTime: execution.endTime,
      exitCode: execution.exitCode,
      error: execution.error,
    };
  }

  getActiveExecutions() {
    const executions = [];
    for (const [id, exec] of this.executions) {
      if (exec.status === 'running' || exec.status === 'paused') {
        executions.push({
          id: exec.id,
          status: exec.status,
          language: exec.language,
          startTime: exec.startTime,
        });
      }
    }
    return executions;
  }

  shutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    // Clean up all executions
    for (const [id, execution] of this.executions) {
      if (execution.status === 'running' || execution.status === 'paused') {
        execution.status = 'stopped';
      }
    }
    this.executions.clear();
    
    this.io.close();
    console.log('🛑 WebSocket Execution Server shut down');
  }
}