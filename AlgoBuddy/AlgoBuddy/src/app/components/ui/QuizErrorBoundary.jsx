"use client";

import { Component } from "react";

/**
 * QuizErrorBoundary — wraps the AlgorithmQuiz component to catch unexpected
 * runtime errors and display a recoverable fallback UI instead of a blank crash.
 */
export default class QuizErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message ?? "An unexpected error occurred.",
    };
  }

  componentDidCatch(error, info) {
    // Log for observability
    console.error("[QuizErrorBoundary] Caught error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10">
          <div className="max-w-md text-center p-8 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg border border-red-100 dark:border-red-950/30">
            <p className="text-4xl mb-4">⚠️</p>
            <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
              Something went wrong in the Quiz
            </h2>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mb-6">
              An unexpected error occurred. You can try reloading the quiz or
              return to the visualizer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition"
              >
                Retry Quiz
              </button>
              <a
                href="/visualizer"
                className="px-5 py-2.5 border border-slate-200 dark:border-neutral-700 rounded-xl text-sm font-bold text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
              >
                Back to Visualizer
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
