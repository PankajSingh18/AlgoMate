// src/app/components/testing/TestGenerator.jsx

'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

export function TestGenerator({ code: initialCode = '', language = 'javascript' }) {
  const [code, setCode] = useState(initialCode);
  const [generatedTests, setGeneratedTests] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('tests');
  const [includeEdgeCases, setIncludeEdgeCases] = useState(true);
  const [includeMocking, setIncludeMocking] = useState(false);
  const [error, setError] = useState(null);

  // Generate tests
  const generateTests = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          options: { includeEdgeCases, includeMocking },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedTests(data.data);
        // Get suggestions
        await fetchSuggestions();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions
  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/ai/test-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (data.success) {
        setSuggestions(data.data);
      }
    } catch (err) {
      console.error('Suggestions error:', err);
    }
  };

  // Copy tests to clipboard
  const copyTests = () => {
    if (!generatedTests) return;

    const testCode = generatedTests.tests
      .map(t => t.code)
      .join('\n\n');

    navigator.clipboard.writeText(testCode);
  };

  // Download tests file
  const downloadTests = () => {
    if (!generatedTests) return;

    const testCode = generatedTests.tests
      .map(t => t.code)
      .join('\n\n');

    const blob = new Blob([testCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test.${language === 'javascript' ? 'test.js' : 'test.py'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <button
            onClick={generateTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '⏳ Generating...' : '🧪 Generate Tests'}
          </button>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeEdgeCases}
              onChange={(e) => setIncludeEdgeCases(e.target.checked)}
            />
            Edge Cases
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeMocking}
              onChange={(e) => setIncludeMocking(e.target.checked)}
            />
            Include Mocks
          </label>

          {generatedTests && (
            <>
              <button
                onClick={copyTests}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                📋 Copy
              </button>
              <button
                onClick={downloadTests}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                💾 Download
              </button>
            </>
          )}
        </div>

        {/* Code Editor */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">📝 Your Code</h3>
          <div className="h-48 border rounded-lg overflow-hidden">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {generatedTests && (
          <div className="mt-4">
            {/* Tabs */}
            <div className="flex gap-2 border-b mb-4">
              <button
                onClick={() => setActiveTab('tests')}
                className={`px-4 py-2 ${
                  activeTab === 'tests'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Tests ({generatedTests.tests.length})
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`px-4 py-2 ${
                  activeTab === 'suggestions'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Suggestions ({suggestions.length})
              </button>
              <button
                onClick={() => setActiveTab('coverage')}
                className={`px-4 py-2 ${
                  activeTab === 'coverage'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Coverage
              </button>
            </div>

            {/* Tests Tab */}
            {activeTab === 'tests' && (
              <div className="space-y-4">
                <div className="text-sm text-gray-500 mb-2">
                  Framework: {generatedTests.framework}
                  {generatedTests.setup && ` • Setup: ${generatedTests.setup}`}
                </div>
                {generatedTests.tests.map((test, idx) => (
                  <div key={idx} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                      <div>
                        <span className="font-medium">{test.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {test.type || 'unit'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {test.assertions?.length || 0} assertions
                      </div>
                    </div>
                    <div className="p-4 bg-gray-900">
                      <pre className="text-gray-200 font-mono text-sm whitespace-pre-wrap">
                        {test.code}
                      </pre>
                    </div>
                    {test.description && (
                      <div className="px-4 py-2 text-sm text-gray-600 border-t">
                        💡 {test.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions Tab */}
            {activeTab === 'suggestions' && (
              <div className="space-y-3">
                {suggestions.length === 0 ? (
                  <p className="text-gray-500">No suggestions available</p>
                ) : (
                  suggestions.map((suggestion, idx) => (
                    <div key={idx} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <span className="text-sm">💡 {suggestion}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Coverage Tab */}
            {activeTab === 'coverage' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {generatedTests.tests.filter(t => t.type === 'unit').length}
                    </div>
                    <div className="text-sm text-gray-600">Unit Tests</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {generatedTests.tests.filter(t => t.type === 'edge-case').length}
                    </div>
                    <div className="text-sm text-gray-600">Edge Cases</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {generatedTests.tests.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Tests</div>
                  </div>
                </div>
                <div className="bg-gray-50 border rounded p-4">
                  <h4 className="font-medium mb-2">Test Summary</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✅ {generatedTests.tests.length} tests generated</li>
                    <li>📊 {generatedTests.tests.filter(t => t.assertions?.length).length || 0} tests with assertions</li>
                    <li>🎯 Covers {['unit', 'edge-case'].filter(type => 
                      generatedTests.tests.some(t => t.type === type)
                    ).length} test types</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}