// lib/ai/analyzer.js

import { GoogleGenerativeAI } from '@google/generative-ai';

export class AIAnalyzer {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
      },
    });
  }

  /**
   * Analyze code complexity and provide optimization suggestions
   */
  async analyzeCode(code, language = 'javascript') {
    const prompt = this.buildAnalysisPrompt(code, language);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return this.parseAnalysisResponse(response);
    } catch (error) {
      console.error('AI Analysis error:', error);
      throw new Error('Failed to analyze code: ' + error.message);
    }
  }

  /**
   * Build analysis prompt for AI
   */
  buildAnalysisPrompt(code, language) {
    return `You are an expert algorithm analyst and code reviewer. Analyze the following ${language} code and provide:

1. **Time Complexity Analysis**:
   - Best case, average case, worst case complexity
   - Brief explanation of why

2. **Space Complexity Analysis**:
   - Memory usage analysis
   - Explanation of memory allocation

3. **Optimization Suggestions**:
   - 3-5 specific improvements
   - Before/after code examples
   - Expected performance impact

4. **Code Quality Score** (1-10):
   - Readability
   - Maintainability
   - Performance
   - Overall score

5. **Common Pitfalls**:
   - Edge cases missed
   - Potential bugs

6. **Test Cases**:
   - Recommended test cases
   - Expected outputs

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return as a structured JSON response with the following format:
{
  "timeComplexity": {
    "best": "string",
    "average": "string",
    "worst": "string",
    "explanation": "string"
  },
  "spaceComplexity": {
    "complexity": "string",
    "explanation": "string"
  },
  "optimizations": [
    {
      "title": "string",
      "description": "string",
      "before": "code string",
      "after": "code string",
      "impact": "string"
    }
  ],
  "codeQuality": {
    "readability": number,
    "maintainability": number,
    "performance": number,
    "overall": number,
    "feedback": "string"
  },
  "pitfalls": [
    {
      "title": "string",
      "description": "string",
      "suggestion": "string"
    }
  ],
  "testCases": [
    {
      "input": "string",
      "expectedOutput": "string",
      "description": "string"
    }
  ],
  "complexityChart": {
    "label": "string",
    "dataPoints": [
      { "inputSize": number, "time": number }
    ]
  }
}`;
  }

  /**
   * Parse AI response
   */
  parseAnalysisResponse(response) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Parse error:', error);
      // Return fallback analysis
      return this.getFallbackAnalysis();
    }
  }

  /**
   * Generate complexity graph data
   */
  generateComplexityGraph(complexity, inputSizes = [10, 50, 100, 500, 1000, 5000]) {
    const complexityMap = {
      'O(1)': (n) => 1,
      'O(log n)': (n) => Math.log2(n),
      'O(n)': (n) => n,
      'O(n log n)': (n) => n * Math.log2(n),
      'O(n²)': (n) => n * n,
      'O(n³)': (n) => n * n * n,
      'O(2ⁿ)': (n) => Math.pow(2, n),
      'O(n!)': (n) => this.factorial(n),
    };

    const complexityKey = complexity.best || 'O(n)';
    const fn = complexityMap[complexityKey] || complexityMap['O(n)'];
    
    return {
      label: complexityKey,
      dataPoints: inputSizes.map(n => ({
        inputSize: n,
        time: fn(n),
      })),
    };
  }

  /**
   * Get fallback analysis
   */
  getFallbackAnalysis() {
    return {
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)',
        explanation: 'Linear time complexity - iterates through input once',
      },
      spaceComplexity: {
        complexity: 'O(1)',
        explanation: 'Constant space - uses fixed amount of memory',
      },
      optimizations: [
        {
          title: 'Consider using more efficient data structures',
          description: 'Using appropriate data structures can improve performance',
          before: '// Current implementation',
          after: '// Optimized implementation',
          impact: '20-30% performance improvement',
        },
      ],
      codeQuality: {
        readability: 7,
        maintainability: 7,
        performance: 6,
        overall: 7,
        feedback: 'Good code with room for optimization',
      },
      pitfalls: [
        {
          title: 'Edge case handling',
          description: 'Consider empty input and large inputs',
          suggestion: 'Add input validation and boundary checks',
        },
      ],
      testCases: [
        {
          input: 'Default test case',
          expectedOutput: 'Expected output',
          description: 'Basic functionality test',
        },
      ],
    };
  }

  /**
   * Get optimization suggestions for code
   */
  async getOptimizationSuggestions(code, language = 'javascript') {
    const prompt = `Analyze this ${language} code and provide optimization suggestions:

\`\`\`${language}
${code}
\`\`\`

Provide:
1. Performance bottlenecks
2. Optimization opportunities
3. Before/after code examples
4. Expected performance impact

Return as JSON.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (error) {
      console.error('Optimization suggestions error:', error);
      return null;
    }
  }

  /**
   * Generate hints for failed test cases
   */
  async generateHints(code, testCase, expectedOutput, actualOutput) {
    const prompt = `The following code failed a test case:

Code:
\`\`\`
${code}
\`\`\`

Test Case:
Input: ${testCase.input}
Expected: ${expectedOutput}
Got: ${actualOutput}

Generate 3 helpful hints for fixing this issue.
Each hint should be actionable and educational.

Return as JSON array of hints.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch (error) {
      console.error('Hint generation error:', error);
      return ['Check your algorithm logic', 'Verify edge cases', 'Test with different inputs'];
    }
  }

  /**
   * Calculate factorial (for complexity)
   */
  factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
}