"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./button";
import { logger } from "~/utils";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with context
    logger.error("React Error Boundary caught an error", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <div className="mb-4 text-6xl">🚨</div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Oops! Something went wrong
            </h1>
            <p className="mb-6 text-gray-600">
              We encountered an unexpected error. Don&apos;t worry, our team has
              been notified.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="mb-2 cursor-pointer text-sm text-gray-500">
                  Error Details (Development Only)
                </summary>
                <pre className="overflow-auto rounded bg-gray-100 p-3 text-xs text-red-600">
                  {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      {"\n\nStack Trace:\n"}
                      {this.state.error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={this.handleRetry} variant="primary">
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
