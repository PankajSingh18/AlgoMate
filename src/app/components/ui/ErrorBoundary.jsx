"use client";
import { Component } from "react";

const ERROR_STYLES = {
  container: "flex flex-col items-center justify-center min-h-[400px] p-8 text-center",
  icon: "w-16 h-16 mb-4 text-red-500",
  title: "text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2",
  message: "text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md",
  button: "px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors",
};

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={ERROR_STYLES.container}>
          <svg
            className={ERROR_STYLES.icon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
          <h3 className={ERROR_STYLES.title}>Something went wrong</h3>
          <p className={ERROR_STYLES.message}>
            {this.props.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={this.handleReset}
            className={ERROR_STYLES.button}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
