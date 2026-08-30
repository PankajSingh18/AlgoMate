// src/lib/ai/completion-engine.js

import { GoogleGenerativeAI } from '@google/generative-ai';
import Fuse from 'fuse.js';

export class AICompletionEngine {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 200,
      },
    });
    
    // Cache for completions
    this.cache = new Map();
    this.cacheSize = 100;
    
    // Common code snippets
    this.snippets = this.loadSnippets();
    this.fuse = new Fuse(this.snippets, {
      keys: ['prefix', 'description'],
      threshold: 0.3,
    });
  }

  /**
   * Get code completion suggestions
   */
  async getCompletions(code, language, position, options = {}) {
    const cacheKey = `${language}:${code.slice(0, 100)}:${position}`;
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // First try local snippets
      const localSuggestions = this.getLocalSuggestions(code, language, position);
      
      // Then get AI suggestions
      const aiSuggestions = await this.getAISuggestions(code, language, position);
      
      // Combine and rank
      const suggestions = this.rankSuggestions([
        ...localSuggestions,
        ...aiSuggestions,
      ]);

      // Cache results
      if (this.cache.size >= this.cacheSize) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      this.cache.set(cacheKey, suggestions);

      return suggestions;
    } catch (error) {
      console.error('Completion error:', error);
      // Fallback to local suggestions
      return this.getLocalSuggestions(code, language, position);
    }
  }

  /**
   * Get AI-powered suggestions
   */
  async getAISuggestions(code, language, position) {
    const prompt = this.buildCompletionPrompt(code, language, position);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return this.parseCompletionResponse(response);
    } catch (error) {
      console.error('AI completion error:', error);
      return [];
    }
  }

  /**
   * Build prompt for AI completion
   */
  buildCompletionPrompt(code, language, position) {
    const context = this.getContextAroundPosition(code, position);
    
    return `You are an AI code completion assistant. Complete the following ${language} code.

Context before cursor:
\`\`\`${language}
${context.before}
\`\`\`

Cursor position: line ${context.line}, column ${context.column}

Provide 3 different completion suggestions that would logically complete the code.
Each suggestion should include:
1. The completion text
2. A brief description
3. A confidence score (0-1)

Return as JSON array:
[
  {
    "text": "completion code",
    "description": "what this does",
    "score": 0.95
  }
]`;
  }

  /**
   * Parse AI completion response
   */
  parseCompletionResponse(response) {
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) return [];
      return JSON.parse(jsonMatch[0]);
    } catch {
      return [];
    }
  }

  /**
   * Get context around cursor position
   */
  getContextAroundPosition(code, position) {
    const lines = code.split('\n');
    const line = lines[position.lineNumber - 1] || '';
    const before = lines.slice(0, position.lineNumber).join('\n');
    const after = lines.slice(position.lineNumber).join('\n');
    
    return {
      before,
      after,
      line,
      column: position.column,
      lineNumber: position.lineNumber,
    };
  }

  /**
   * Get local snippet suggestions
   */
  getLocalSuggestions(code, language, position) {
    const context = this.getContextAroundPosition(code, position);
    const currentLine = context.line || '';
    const prefix = this.getPrefix(currentLine, context.column);
    
    // Search for matching snippets
    const results = this.fuse.search(prefix);
    return results.slice(0, 5).map(result => ({
      text: result.item.code,
      description: result.item.description,
      score: result.score || 0.5,
      type: 'snippet',
    }));
  }

  /**
   * Get prefix from current line
   */
  getPrefix(line, column) {
    return line.slice(0, column).trim();
  }

  /**
   * Rank suggestions by score
   */
  rankSuggestions(suggestions) {
    return suggestions
      .filter(s => s.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  /**
   * Load common code snippets
   */
  loadSnippets() {
    return [
      // JavaScript snippets
      {
        prefix: 'function',
        description: 'Create a function',
        code: 'function ${1:name}(${2:params}) {\n  ${3}\n}',
        language: 'javascript',
      },
      {
        prefix: 'const',
        description: 'Declare a constant',
        code: 'const ${1:name} = ${2:value};',
        language: 'javascript',
      },
      {
        prefix: 'let',
        description: 'Declare a variable',
        code: 'let ${1:name} = ${2:value};',
        language: 'javascript',
      },
      {
        prefix: 'if',
        description: 'If statement',
        code: 'if (${1:condition}) {\n  ${2}\n}',
        language: 'javascript',
      },
      {
        prefix: 'for',
        description: 'For loop',
        code: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n  ${3}\n}',
        language: 'javascript',
      },
      {
        prefix: 'while',
        description: 'While loop',
        code: 'while (${1:condition}) {\n  ${2}\n}',
        language: 'javascript',
      },
      {
        prefix: 'try',
        description: 'Try-catch block',
        code: 'try {\n  ${1}\n} catch (error) {\n  console.error(error);\n}',
        language: 'javascript',
      },
      {
        prefix: 'class',
        description: 'Class definition',
        code: 'class ${1:ClassName} {\n  constructor(${2:params}) {\n    ${3}\n  }\n}',
        language: 'javascript',
      },
      // Python snippets
      {
        prefix: 'def',
        description: 'Define a function',
        code: 'def ${1:name}(${2:params}):\n    ${3:pass}',
        language: 'python',
      },
      {
        prefix: 'class',
        description: 'Class definition',
        code: 'class ${1:ClassName}:\n    def __init__(self, ${2:params}):\n        ${3:pass}',
        language: 'python',
      },
      {
        prefix: 'if',
        description: 'If statement',
        code: 'if ${1:condition}:\n    ${2}',
        language: 'python',
      },
      {
        prefix: 'for',
        description: 'For loop',
        code: 'for ${1:item} in ${2:items}:\n    ${3}',
        language: 'python',
      },
      {
        prefix: 'while',
        description: 'While loop',
        code: 'while ${1:condition}:\n    ${2}',
        language: 'python',
      },
      {
        prefix: 'try',
        description: 'Try-except block',
        code: 'try:\n    ${1}\nexcept Exception as e:\n    print(e)',
        language: 'python',
      },
      // Java snippets
      {
        prefix: 'class',
        description: 'Java class',
        code: 'public class ${1:ClassName} {\n    public static void main(String[] args) {\n        ${2}\n    }\n}',
        language: 'java',
      },
      {
        prefix: 'method',
        description: 'Java method',
        code: 'public ${1:returnType} ${2:methodName}(${3:params}) {\n    ${4}\n}',
        language: 'java',
      },
      // C++ snippets
      {
        prefix: 'class',
        description: 'C++ class',
        code: 'class ${1:ClassName} {\npublic:\n    ${2:ClassName}() {}\nprivate:\n    ${3}\n};',
        language: 'cpp',
      },
      {
        prefix: 'main',
        description: 'C++ main function',
        code: 'int main() {\n    ${1}\n    return 0;\n}',
        language: 'cpp',
      },
      // C snippets
      {
        prefix: 'main',
        description: 'C main function',
        code: 'int main() {\n    ${1}\n    return 0;\n}',
        language: 'c',
      },
      {
        prefix: 'struct',
        description: 'C struct',
        code: 'struct ${1:Name} {\n    ${2}\n};',
        language: 'c',
      },
    ];
  }
}