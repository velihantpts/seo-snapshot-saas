'use client';
import { Component, type ReactNode } from 'react';
import Link from 'next/link';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
            <span className="text-red-400 text-xl">!</span>
          </div>
          <p className="text-white/60 text-sm text-center">Something went wrong loading this section.</p>
          <div className="flex gap-2">
            <button onClick={() => this.setState({ hasError: false })} className="btn-ghost !py-2 !px-4 text-xs">
              Try again
            </button>
            <Link href="/" className="btn-primary !py-2 !px-4 text-xs">Go home</Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
