// src/lib/ai/test-generator.js

import { GoogleGenerativeAI } from '@google/generative-ai';

export class TestGenerator {
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
        maxOutputTokens: 2048,
      },
    });
  }

  /**
   * Generate tests for code
   */
  async generateTests(code, language = 'javascript', options = {}) {
    const prompt = this.buildTestPrompt(code, language, options);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return this.parseTestResponse(response, language);
    } catch (error) {
      console.error('Test generation error:', error);
      return this.getFallbackTests(code, language);
    }
  }

  /**
   * Build prompt for test generation
   */
  buildTestPrompt(code, language, options) {
    const framework = this.getTestFramework(language);
    const includeEdgeCases = options.includeEdgeCases !== false;
    const includeMocking = options.includeMocking || false;

    return `You are an expert test engineer. Generate comprehensive unit tests for the following ${language} code.

Code to test:
\`\`\`${language}
${code}
\`\`\`

Requirements:
1. Use ${framework} testing framework
2. ${includeEdgeCases ? 'Include edge cases (empty inputs, null, undefined, large values)' : 'Focus on basic functionality'}
3. ${includeMocking ? 'Include mocks where appropriate' : 'Avoid mocking'}
4. Include descriptive test names
5. Test both success and failure cases
6. Include assertions for expected outcomes

Generate tests in the following format:
{
  "tests": [
    {
      "name": "descriptive test name",
      "code": "complete test code",
      "description": "what this test verifies",
      "type": "unit|integration|edge-case",
      "assertions": ["assertion1", "assertion2"]
    }
  ],
  "setup": "any setup code needed",
  "teardown": "any teardown code needed"
}

Return valid JSON only.`;
  }

  /**
   * Parse test response
   */
  parseTestResponse(response, language) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.getFallbackTests('', language);
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        tests: parsed.tests || [],
        setup: parsed.setup || '',
        teardown: parsed.teardown || '',
        framework: this.getTestFramework(language),
      };
    } catch (error) {
      console.error('Parse error:', error);
      return this.getFallbackTests('', language);
    }
  }

  /**
   * Get test framework for language
   */
  getTestFramework(language) {
    const frameworks = {
      javascript: 'Jest',
      python: 'pytest',
      java: 'JUnit',
      cpp: 'Google Test',
      c: 'CUnit',
    };
    return frameworks[language] || 'Jest';
  }

  /**
   * Get fallback tests
   */
  getFallbackTests(code, language) {
    const tests = [];
    const framework = this.getTestFramework(language);

    // Basic test template
    tests.push({
      name: 'should handle basic functionality',
      code: this.getBasicTestTemplate(code, language, framework),
      description: 'Tests the core functionality',
      type: 'unit',
      assertions: ['Expects correct output'],
    });

    // Edge case test
    tests.push({
      name: 'should handle edge cases',
      code: this.getEdgeCaseTestTemplate(code, language, framework),
      description: 'Tests edge cases like empty inputs',
      type: 'edge-case',
      assertions: ['Handles edge cases gracefully'],
    });

    return {
      tests,
      setup: '',
      teardown: '',
      framework,
    };
  }

  /**
   * Get basic test template
   */
  getBasicTestTemplate(code, language, framework) {
    const functionName = this.extractFunctionName(code);
    if (!functionName) return '// Test code here';

    switch (language) {
      case 'javascript':
        return `test('${functionName} works correctly', () => {
  const result = ${functionName}(/* test input */);
  expect(result).toBe(/* expected output */);
});`;
      
      case 'python':
        return `def test_${functionName}_basic():
    result = ${functionName}(/* test input */)
    assert result == /* expected output */`;
      
      case 'java':
        return `@Test
public void test${functionName.charAt(0).toUpperCase() + functionName.slice(1)}() {
    // Test code
}`;
      
      default:
        return '// Test code here';
    }
  }

  /**
   * Get edge case test template
   */
  getEdgeCaseTestTemplate(code, language, framework) {
    const functionName = this.extractFunctionName(code);
    if (!functionName) return '// Edge case test';

    switch (language) {
      case 'javascript':
        return `test('${functionName} handles edge cases', () => {
  // Test with empty input
  expect(${functionName}()).toBe(/* expected */);
  // Test with null
  expect(${functionName}(null)).toBe(/* expected */);
});`;
      
      case 'python':
        return `def test_${functionName}_edge_cases():
    # Test with empty input
    assert ${functionName}() == /* expected */
    # Test with null
    assert ${functionName}(None) == /* expected */`;
      
      default:
        return '// Edge case test';
    }
  }

  /**
   * Extract function name from code
   */
  extractFunctionName(code) {
    const patterns = [
      /function\s+(\w+)\s*\(/,
      /const\s+(\w+)\s*=\s*function\s*\(/,
      /export\s+function\s+(\w+)\s*\(/,
      /export\s+const\s+(\w+)\s*=\s*\(/,
      /def\s+(\w+)\s*\(/,
      /public\s+(\w+)\s*\(/,
    ];

    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  /**
   * Generate test coverage report
   */
  generateCoverageReport(coverageData) {
    return {
      lines: {
        total: coverageData.totalLines || 0,
        covered: coverageData.coveredLines || 0,
        percentage: coverageData.coveredLines / coverageData.totalLines * 100 || 0,
      },
      functions: {
        total: coverageData.totalFunctions || 0,
        covered: coverageData.coveredFunctions || 0,
        percentage: coverageData.coveredFunctions / coverageData.totalFunctions * 100 || 0,
      },
      branches: {
        total: coverageData.totalBranches || 0,
        covered: coverageData.coveredBranches || 0,
        percentage: coverageData.coveredBranches / coverageData.totalBranches * 100 || 0,
      },
    };
  }

  /**
   * Generate test suggestions
   */
  generateTestSuggestions(code) {
    const functionName = this.extractFunctionName(code);
    const suggestions = [];

    if (!functionName) {
      suggestions.push('No function found to test');
      return suggestions;
    }

    // Check for array operations
    if (code.includes('map') || code.includes('filter') || code.includes('reduce')) {
      suggestions.push('Test array operations with different array sizes');
    }

    // Check for conditionals
    if (code.includes('if') || code.includes('switch')) {
      suggestions.push('Test all conditional branches');
    }

    // Check for loops
    if (code.includes('for') || code.includes('while')) {
      suggestions.push('Test loop edge cases (empty, single, many iterations)');
    }

    // Check for recursion
    if (code.includes(functionName) && code.includes('return')) {
      suggestions.push('Test recursive function with base case and recursive case');
    }

    suggestions.push('Test with edge cases (null, undefined, empty, large values)');
    suggestions.push('Test with invalid inputs to verify error handling');
    suggestions.push('Add documentation tests for examples');

    return suggestions;
  }
}