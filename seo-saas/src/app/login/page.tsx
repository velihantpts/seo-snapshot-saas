'use client';
import { signIn, getProviders } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n';

type OAuthProvider = { id: string; name: string };

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthProviders, setOauthProviders] = useState<OAuthProvider[]>([]);
  const [callbackUrl, setCallbackUrl] = useState('/dashboard');
  const router = useRouter();
  const { t } = useLocale();

  useEffect(() => {
    // Only show OAuth buttons for providers that are actually configured.
    getProviders()
      .then((provs) => {
        if (!provs) return;
        setOauthProviders(
          Object.values(provs)
            .filter((p) => p.type === 'oauth')
            .map((p) => ({ id: p.id, name: p.name }))
        );
      })
      .catch(() => {});

    // Preserve where the user was headed (e.g. pricing checkout flow).
    const cb = new URLSearchParams(window.location.search).get('callbackUrl');
    if (cb) setCallbackUrl(cb);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('login.err.register'));
        setLoading(false);
        return;
      }
    }

    const result = await signIn('credentials', { email, password, redirect: false });

    if (result?.error) {
      setError(mode === 'register' ? t('login.err.afterRegister') : t('login.err.invalid'));
      setLoading(false);
      return;
    }

    // Honour callbackUrl so the pricing checkout (and similar) flows resume.
    router.push(callbackUrl);
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
            {mode === 'login' ? t('login.title') : t('login.title.register')}
          </h1>
          <p className="text-white/40 text-sm">
            {mode === 'login' ? t('login.desc') : t('login.desc.register')}
          </p>
        </div>

        {oauthProviders.length > 0 && (
          <div className="space-y-2.5 mb-5 opacity-0 animate-fade-in-up-delay-1">
            {oauthProviders.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => signIn(p.id, { callbackUrl })}
                className="w-full min-h-[44px] rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.08] transition-all duration-150 flex items-center justify-center gap-2"
              >
                {p.id === 'google' ? t('login.google') : p.id === 'github' ? t('login.github') : p.name}
              </button>
            ))}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-white/25 text-xs">{t('login.or')}</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 opacity-0 animate-fade-in-up-delay-1">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="block text-xs text-white/40 mb-1.5 ml-1">{t('login.name')}</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('login.name.ph')}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/35 outline-none focus:border-accent-500/30 transition-all duration-200 min-h-[44px]"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs text-white/40 mb-1.5 ml-1">{t('login.email')}</label>
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
            <label htmlFor="password" className="block text-xs text-white/40 mb-1.5 ml-1">{t('login.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'register' ? t('login.pw.ph.reg') : t('login.pw.ph')}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/35 outline-none focus:border-accent-500/30 transition-all duration-200 min-h-[44px]"
              required
              minLength={mode === 'register' ? 6 : 1}
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
            {loading ? t('login.wait') : mode === 'login' ? t('login.submit') : t('login.submit.register')}
          </button>
        </form>

        <div className="text-center mt-6 opacity-0 animate-fade-in-up-delay-2">
          {mode === 'login' ? (
            <p className="text-white/30 text-sm">
              {t('login.noAccount')}{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="text-accent-400 hover:text-accent-300 transition">
                {t('login.signupFree')}
              </button>
            </p>
          ) : (
            <p className="text-white/30 text-sm">
              {t('login.hasAccount')}{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-accent-400 hover:text-accent-300 transition">
                {t('login.signinLink')}
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-white/15 text-xs mt-8">
          {t('login.agree')} <Link href="/terms" className="text-white/25 hover:text-white/40">{t('terms.title')}</Link> {t('login.and')} <Link href="/privacy" className="text-white/25 hover:text-white/40">{t('privacy.title')}</Link>.
        </p>
      </div>
    </div>
  );
}
