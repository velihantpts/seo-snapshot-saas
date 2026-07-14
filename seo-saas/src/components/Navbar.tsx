'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from './UserMenu';
import { Menu, X } from 'lucide-react';
import { useLocale } from '@/lib/i18n';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const { t } = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes (Navbar persists across
  // routes in the App Router, so this needs to react to pathname, not just mount).
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/pricing', label: t('nav.pricing'), desktop: true },
    { href: '/compare', label: t('nav.compare'), desktop: 'lg' as const },
    { href: '/tools', label: t('nav.tools'), desktop: true },
    { href: '/docs', label: t('nav.api'), desktop: 'lg' as const },
    { href: '/blog', label: t('nav.blog'), desktop: false },
  ];

  const authLinks = session ? [
    { href: '/dashboard', label: t('nav.dashboard'), desktop: true },
    { href: '/monitor', label: t('nav.monitor'), desktop: false },
  ] : [];

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
            {[...navLinks, ...authLinks].filter(l => l.desktop).map(link => {
              const isTools = link.href === '/tools';
              return (
                <Link key={link.href} href={link.href} className={`text-[13px] transition-colors duration-150 ${link.desktop === 'lg' ? 'hidden lg:inline' : ''} ${isTools ? 'text-accent-400 hover:text-accent-300 font-medium' : 'text-white/50 hover:text-white/80'}`}>
                  {link.label}
                </Link>
              );
            })}

            {session ? (
              <UserMenu />
            ) : (
              <button onClick={() => signIn()} className="btn-ghost !py-2 text-sm">{t('nav.signin')}</button>
            )}
          </div>

          {/* Mobile: hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
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
