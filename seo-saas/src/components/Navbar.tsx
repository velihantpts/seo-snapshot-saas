'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { Menu, X, Globe } from 'lucide-react';
import { useLocale, LOCALES, type Locale } from '@/lib/i18n';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { data: session } = useSession();
  const { locale, t, setLocale } = useLocale();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, []);

  const navLinks = [
    { href: '/pricing', label: t('nav.pricing'), desktop: true },
    { href: '/compare', label: t('nav.compare'), desktop: 'lg' as const },
    { href: '/docs', label: t('nav.api'), desktop: 'lg' as const },
    { href: '/blog', label: t('nav.blog'), desktop: false },
  ];

  const authLinks = session ? [
    { href: '/dashboard', label: t('nav.dashboard'), desktop: true },
    { href: '/monitor', label: t('nav.monitor'), desktop: false },
  ] : [];

  const currentFlag = LOCALES.find(l => l.code === locale)?.flag || '🇬🇧';

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">S</div>
            <span className="font-semibold text-[15px] tracking-tight">SEO <span className="text-accent-400">Snapshot</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-2 md:gap-3">
            {[...navLinks, ...authLinks].filter(l => l.desktop).map(link => (
              <Link key={link.href} href={link.href} className={`text-[13px] text-white/50 hover:text-white/80 transition-colors duration-150 ${link.desktop === 'lg' ? 'hidden lg:inline' : ''}`}>
                {link.label}
              </Link>
            ))}

            {/* Language selector */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="text-sm text-white/40 hover:text-white/70 transition px-1.5 py-1" aria-label="Change language">
                {currentFlag}
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-surface/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl py-1.5 min-w-[140px]">
                    {LOCALES.map(l => (
                      <button key={l.code} onClick={() => { setLocale(l.code); setLangOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-white/[0.06] transition ${locale === l.code ? 'text-accent-400' : 'text-white/60'}`}>
                        <span>{l.flag}</span> {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {session ? (
              <UserMenu />
            ) : (
              <button onClick={() => signIn()} className="btn-ghost !py-2 text-sm">{t('nav.signin')}</button>
            )}
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <button onClick={() => setLangOpen(!langOpen)} className="text-white/40 p-2" aria-label="Change language">
              {currentFlag}
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                <div className="absolute right-12 top-14 z-50 bg-surface/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-2xl py-1.5 min-w-[140px]">
                  {LOCALES.map(l => (
                    <button key={l.code} onClick={() => { setLocale(l.code); setLangOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2.5 hover:bg-white/[0.06] transition ${locale === l.code ? 'text-accent-400' : 'text-white/60'}`}>
                      <span>{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              </>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/60 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-surface/95 backdrop-blur-xl sm:hidden pt-16">
          <div className="flex flex-col px-6 py-8 gap-1">
            {[...navLinks, ...authLinks].map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="text-lg text-white/70 hover:text-white py-3 border-b border-white/[0.04] transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="mt-6">
              {session ? (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center py-3">
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <button onClick={() => { setMobileOpen(false); signIn(); }} className="btn-primary w-full py-3">
                  {t('nav.signin')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
