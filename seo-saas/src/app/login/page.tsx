'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
      // Register first
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }
    }

    // Sign in
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(mode === 'register' ? 'Account created but login failed. Try logging in.' : 'Invalid email or password');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 sm:px-6 relative">
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="hero-glow" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8 opacity-0 animate-fade-in-up">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold shadow-glow-sm">S</div>
          </Link>
          <h1 className="text-2xl font-medium tracking-tight mb-2">
            {mode === 'login' ? 'Sign in to SEO Snapshot' : 'Create your account'}
          </h1>
          <p className="text-white/40 text-sm">
            {mode === 'login' ? 'Save your analyses and unlock Pro features' : 'Start analyzing for free — no credit card needed'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 opacity-0 animate-fade-in-up-delay-1">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-xs text-white/40 mb-1.5 ml-1">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/35 outline-none focus:border-accent-500/30 transition-all duration-200 min-h-[44px]"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs text-white/40 mb-1.5 ml-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/35 outline-none focus:border-accent-500/30 transition-all duration-200 min-h-[44px]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-white/40 mb-1.5 ml-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'At least 6 characters' : 'Your password'}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/35 outline-none focus:border-accent-500/30 transition-all duration-200 min-h-[44px]"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center py-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary min-h-[44px] disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="text-center mt-6 opacity-0 animate-fade-in-up-delay-2">
          {mode === 'login' ? (
            <p className="text-white/30 text-sm">
              Don&apos;t have an account?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="text-accent-400 hover:text-accent-300 transition">
                Sign up free
              </button>
            </p>
          ) : (
            <p className="text-white/30 text-sm">
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-accent-400 hover:text-accent-300 transition">
                Sign in
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-white/15 text-xs mt-8">
          By signing up, you agree to our <Link href="/terms" className="text-white/25 hover:text-white/40">Terms</Link> and <Link href="/privacy" className="text-white/25 hover:text-white/40">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
