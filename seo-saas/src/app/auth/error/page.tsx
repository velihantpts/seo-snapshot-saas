'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorContent() {
  const params = useSearchParams();
  const error = params.get('error');

  const messages: Record<string, { title: string; desc: string }> = {
    Configuration: {
      title: 'Authentication not configured',
      desc: 'OAuth providers (Google/GitHub) are not set up yet. The site owner needs to add OAuth credentials.',
    },
    OAuthSignin: {
      title: 'Could not start sign in',
      desc: 'There was an issue connecting to the authentication provider. Please try again.',
    },
    OAuthCallback: {
      title: 'Sign in failed',
      desc: 'The authentication provider returned an error. Please try again.',
    },
    Default: {
      title: 'Authentication error',
      desc: 'Something went wrong during sign in. Please try again later.',
    },
  };

  const msg = messages[error || ''] || messages.Default;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-red-400 text-2xl">!</span>
        </div>
        <h1 className="text-xl font-medium tracking-tight mb-2">{msg.title}</h1>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">{msg.desc}</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary text-sm">Go home</Link>
          <Link href="/login" className="btn-ghost text-sm">Try again</Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><p className="text-white/40">Loading...</p></div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
