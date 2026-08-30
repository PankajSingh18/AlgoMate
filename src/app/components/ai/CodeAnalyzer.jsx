// components/ai/CodeAnalyzer.jsx

'use client';

import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function CodeAnalyzer({ code, language = 'javascript' }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      // Analyze code
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePerformanceTest = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          functionName: 'myFunction',
          language,
          maxInputSize: 1000,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPerformanceData(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderComplexityChart = () => {
    if (!analysis?.complexityChart) return null;

    const data = {
      labels: analysis.complexityChart.dataPoints.map(d => d.inputSize),
      datasets: [
        {
          label: 'Time Complexity',
          data: analysis.complexityChart.dataPoints.map(d => d.time),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };

    return <Line data={data} />;
  };

  const renderOptimizations = () => {
    if (!analysis?.optimizations) return null;

    return (
      <div className="space-y-4">
        {analysis.optimizations.map((opt, idx) => (
          <div key={idx} className="border rounded-lg p-4">
            <h4 className="font-semibold text-lg">{opt.title}</h4>
            <p className="text-gray-600 mt-1">{opt.description}</p>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-red-600">Before</span>
                <pre className="bg-gray-100 p-2 rounded text-sm mt-1 overflow-x-auto">
                  {opt.before}
                </pre>
              </div>
              <div>
                <span className="text-sm font-medium text-green-600">After</span>
                <pre className="bg-gray-100 p-2 rounded text-sm mt-1 overflow-x-auto">
                  {opt.after}
                </pre>
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-2">Impact: {opt.impact}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderPerformanceChart = () => {
    if (!performanceData) return null;

    const actual = performanceData.chartData.actual;
    const estimated = performanceData.chartData.estimated;

    const chartData = {
      labels: actual.map(d => d.inputSize),
      datasets: [
        {
          label: 'Actual Performance',
          data: actual.map(d => d.time),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: `Estimated (${performanceData.chartData.complexity})`,
          data: estimated.map(d => d.time),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderDash: [5, 5],
        },
      ],
    };

    return <Line data={chartData} />;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : '🤖 Analyze Code'}
        </button>
        <button
          onClick={handlePerformanceTest}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : '⚡ Performance Test'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {analysis && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex gap-2 mb-4 border-b">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 ${
                activeTab === 'analysis'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab('optimizations')}
              className={`px-4 py-2 ${
                activeTab === 'optimizations'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Optimizations
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2 ${
                activeTab === 'performance'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Performance
            </button>
          </div>

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Complexity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold">Time Complexity</h3>
                  <p className="text-lg font-mono">
                    Best: {analysis.timeComplexity.best}
                  </p>
                  <p className="text-lg font-mono">
                    Average: {analysis.timeComplexity.average}
                  </p>
                  <p className="text-lg font-mono">
                    Worst: {analysis.timeComplexity.worst}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {analysis.timeComplexity.explanation}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold">Space Complexity</h3>
                  <p className="text-lg font-mono">
                    {analysis.spaceComplexity.complexity}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {analysis.spaceComplexity.explanation}
                  </p>
                </div>
              </div>

              {/* Code Quality */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Code Quality</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Readability</span>
                    <div className="text-2xl font-bold">
                      {analysis.codeQuality.readability}/10
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Maintainability</span>
                    <div className="text-2xl font-bold">
                      {analysis.codeQuality.maintainability}/10
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Performance</span>
                    <div className="text-2xl font-bold">
                      {analysis.codeQuality.performance}/10
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Overall</span>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.codeQuality.overall}/10
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {analysis.codeQuality.feedback}
                </p>
              </div>

              {/* Complexity Chart */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Complexity Graph</h3>
                <div className="h-64">
                  {renderComplexityChart()}
                </div>
              </div>

              {/* Pitfalls */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Common Pitfalls</h3>
                <div className="space-y-2">
                  {analysis.pitfalls.map((pitfall, idx) => (
                    <div key={idx} className="border-l-4 border-yellow-400 pl-3">
                      <p className="font-medium">{pitfall.title}</p>
                      <p className="text-sm text-gray-600">{pitfall.description}</p>
                      <p className="text-sm text-blue-600">
                        Suggestion: {pitfall.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Cases */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Recommended Test Cases</h3>
                <div className="space-y-2">
                  {analysis.testCases.map((test, idx) => (
                    <div key={idx} className="bg-gray-50 p-2 rounded">
                      <p className="font-mono text-sm">Input: {test.input}</p>
                      <p className="font-mono text-sm text-green-600">
                        Expected: {test.expectedOutput}
                      </p>
                      <p className="text-sm text-gray-600">{test.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'optimizations' && (
            <div>{renderOptimizations()}</div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              {performanceData ? (
                <>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Performance Results</h3>
                    <div className="h-64">
                      {renderPerformanceChart()}
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        Estimated Complexity: {performanceData.results.estimatedComplexity}
                      </p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Test Results</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Input Size</th>
                            <th className="text-left p-2">Time (ms)</th>
                            <th className="text-left p-2">Memory</th>
                          </tr>
                        </thead>
                        <tbody>
                          {performanceData.results.allResults.map((result, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="p-2">{result.inputSize}</td>
                              <td className="p-2">{result.time.toFixed(2)}</td>
                              <td className="p-2">{result.memory || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-gray-600">
                  Run a performance test to see results
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}