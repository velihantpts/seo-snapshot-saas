'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { UserMenu } from './UserMenu';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl'
        : 'border-b border-transparent bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">S</div>
          <span className="font-semibold text-[15px] tracking-tight">SEO <span className="text-accent-400">Snapshot</span></span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/pricing" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-150">Pricing</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-150 hidden sm:inline">Dashboard</Link>
              <UserMenu />
            </>
          ) : (
            <button onClick={() => signIn()} className="btn-ghost !py-2 text-sm">Sign in</button>
          )}
        </div>
      </div>
    </nav>
  );
}
