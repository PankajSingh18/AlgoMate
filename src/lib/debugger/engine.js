// src/lib/debugger/engine.js

import { v4 as uuidv4 } from 'uuid';

export class DebuggerEngine {
  constructor() {
    this.executions = new Map();
    this.stepHandlers = new Map();
  }

  /**
   * Start debugging session
   */
  async startDebugging(code, language, options = {}) {
    const sessionId = uuidv4();
    const breakpoints = options.breakpoints || [];
    
    // Initialize execution state
    const state = {
      id: sessionId,
      code,
      language,
      breakpoints,
      currentLine: 0,
      variables: {},
      callStack: [],
      history: [],
      isPaused: true,
      isComplete: false,
      executionTime: 0,
      startTime: Date.now(),
    };

    this.executions.set(sessionId, state);
    
    // Start parsing and analyzing code
    await this.analyzeCode(sessionId);
    
    return {
      sessionId,
      state: this.getCurrentState(sessionId),
    };
  }

  /**
   * Analyze code structure
   */
  async analyzeCode(sessionId) {
    const state = this.executions.get(sessionId);
    if (!state) return;

    // Parse code to find functions, loops, conditions
    const analysis = this.parseCodeStructure(state.code, state.language);
    state.analysis = analysis;
    
    // Initialize variables
    state.variables = this.initializeVariables(analysis);
    
    // Set initial position
    state.currentLine = 0;
  }

  /**
   * Parse code structure
   */
  parseCodeStructure(code, language) {
    const lines = code.split('\n');
    const structure = {
      functions: [],
      loops: [],
      conditions: [],
      variables: [],
      lines: lines.map((line, index) => ({
        number: index + 1,
        content: line,
        type: this.getLineType(line, language),
        breakpoint: false,
        executed: false,
      })),
    };

    // Parse functions
    const functionRegex = language === 'javascript' 
      ? /function\s+(\w+)\s*\(([^)]*)\)/
      : /def\s+(\w+)\s*\(([^)]*)\)/;
    
    for (const line of lines) {
      const match = line.match(functionRegex);
      if (match) {
        structure.functions.push({
          name: match[1],
          params: match[2].split(',').map(p => p.trim()).filter(Boolean),
          line: lines.indexOf(line) + 1,
        });
      }
    }

    return structure;
  }

  /**
   * Get line type
   */
  getLineType(line, language) {
    const trimmed = line.trim();
    if (!trimmed) return 'empty';
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) return 'comment';
    if (trimmed.includes('function') || trimmed.includes('def ')) return 'function';
    if (trimmed.includes('for') || trimmed.includes('while')) return 'loop';
    if (trimmed.includes('if') || trimmed.includes('else')) return 'condition';
    if (trimmed.includes('return')) return 'return';
    if (trimmed.includes('console.log') || trimmed.includes('print')) return 'output';
    return 'statement';
  }

  /**
   * Initialize variables from analysis
   */
  initializeVariables(analysis) {
    const variables = {};
    for (const func of analysis.functions) {
      for (const param of func.params) {
        variables[param] = {
          value: undefined,
          type: 'parameter',
          history: [],
        };
      }
    }
    return variables;
  }

  /**
   * Step forward in execution
   */
  async stepForward(sessionId) {
    const state = this.executions.get(sessionId);
    if (!state || state.isComplete) return null;

    // Execute next line
    const result = await this.executeNextLine(sessionId);
    
    // Update state
    state.currentLine = result.lineNumber;
    state.variables = result.variables;
    state.callStack = result.callStack;
    state.history.push({
      line: result.lineNumber,
      variables: { ...result.variables },
      timestamp: Date.now(),
    });

    // Check breakpoints
    if (state.breakpoints.includes(result.lineNumber)) {
      state.isPaused = true;
    }

    // Check if complete
    if (result.isComplete) {
      state.isComplete = true;
      state.executionTime = Date.now() - state.startTime;
    }

    return this.getCurrentState(sessionId);
  }

  /**
   * Step backward in execution
   */
  stepBackward(sessionId) {
    const state = this.executions.get(sessionId);
    if (!state || state.history.length < 2) return null;

    // Remove last step
    state.history.pop();
    const previous = state.history[state.history.length - 1];
    
    if (previous) {
      state.currentLine = previous.line;
      state.variables = previous.variables;
    }

    return this.getCurrentState(sessionId);
  }

  /**
   * Execute next line (simplified)
   */
  async executeNextLine(sessionId) {
    const state = this.executions.get(sessionId);
    if (!state) return null;

    const currentLine = state.currentLine;
    const lines = state.analysis.lines;
    
    // Find next executable line
    let nextLine = currentLine;
    while (nextLine < lines.length) {
      nextLine++;
      if (lines[nextLine] && lines[nextLine].type !== 'empty' && lines[nextLine].type !== 'comment') {
        break;
      }
    }

    if (nextLine >= lines.length) {
      return {
        lineNumber: currentLine,
        variables: state.variables,
        callStack: state.callStack,
        isComplete: true,
      };
    }

    // Simulate execution
    const line = lines[nextLine];
    const variables = { ...state.variables };
    
    // Update variables based on line content
    this.updateVariables(variables, line.content, state.language);

    return {
      lineNumber: nextLine,
      variables,
      callStack: state.callStack,
      isComplete: false,
    };
  }

  /**
   * Update variables based on line content
   */
  updateVariables(variables, line, language) {
    // Simple variable assignment detection
    const assignmentRegex = /(\w+)\s*=\s*(.+)/;
    const match = line.match(assignmentRegex);
    
    if (match) {
      const [_, varName, value] = match;
      try {
        // Try to evaluate the value
        const evaluated = this.evaluateValue(value, variables);
        variables[varName] = {
          value: evaluated,
          type: typeof evaluated,
          history: [...(variables[varName]?.history || []), evaluated],
        };
      } catch {
        // Keep existing value
      }
    }

    // Array operations
    if (line.includes('push') || line.includes('pop')) {
      // Handle array operations
    }
  }

  /**
   * Evaluate value expression
   */
  evaluateValue(expression, variables) {
    // Replace variable references with values
    let evalExpr = expression;
    for (const [name, data] of Object.entries(variables)) {
      const value = data.value;
      if (value !== undefined) {
        evalExpr = evalExpr.replace(
          new RegExp(`\\b${name}\\b`, 'g'),
          typeof value === 'string' ? `"${value}"` : String(value)
        );
      }
    }

    try {
      return Function(`"use strict"; return (${evalExpr})`)();
    } catch {
      return undefined;
    }
  }

  /**
   * Set breakpoint
   */
  setBreakpoint(sessionId, lineNumber) {
    const state = this.executions.get(sessionId);
    if (!state) return false;

    if (state.breakpoints.includes(lineNumber)) {
      state.breakpoints = state.breakpoints.filter(b => b !== lineNumber);
    } else {
      state.breakpoints.push(lineNumber);
    }

    return true;
  }

  /**
   * Get current state
   */
  getCurrentState(sessionId) {
    const state = this.executions.get(sessionId);
    if (!state) return null;

    const currentLine = state.analysis?.lines?.[state.currentLine] || null;

    return {
      sessionId: state.id,
      currentLine: state.currentLine,
      currentLineContent: currentLine?.content || '',
      lineType: currentLine?.type || 'unknown',
      variables: state.variables,
      callStack: state.callStack,
      isPaused: state.isPaused,
      isComplete: state.isComplete,
      executionTime: state.executionTime,
      breakpoints: state.breakpoints,
      history: state.history.slice(-10), // Last 10 steps
      analysis: state.analysis,
    };
  }

  /**
   * Get visualization data
   */
  getVisualizationData(sessionId) {
    const state = this.executions.get(sessionId);
    if (!state) return null;

    const data = {
      type: 'array',
      data: [],
      variables: {},
    };

    // Extract array data from variables
    for (const [name, varData] of Object.entries(state.variables)) {
      if (Array.isArray(varData.value)) {
        data.data = varData.value;
        data.type = 'array';
        data.name = name;
        break;
      }
    }

    // Extract object data
    for (const [name, varData] of Object.entries(state.variables)) {
      if (typeof varData.value === 'object' && varData.value !== null && !Array.isArray(varData.value)) {
        data.variables[name] = varData.value;
        data.type = 'object';
      }
    }

    return data;
  }

  /**
   * Clean up session
   */
  cleanup(sessionId) {
    this.executions.delete(sessionId);
    this.stepHandlers.delete(sessionId);
  }
}