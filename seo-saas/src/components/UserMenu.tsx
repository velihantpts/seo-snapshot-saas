'use client';
import { useState, useRef, useEffect } from 'react';
import { useLocale } from '@/lib/i18n';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User, LogOut, CreditCard, Settings } from 'lucide-react';

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!session) return null;

  const { t } = useLocale();
  const plan = session.user?.plan || 'free';
  const isPro = plan !== 'free';
  const initial = session.user?.name?.[0] || session.user?.email?.[0] || 'U';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors duration-150"
      >
        <div className="w-7 h-7 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold uppercase">
          {initial}
        </div>
        <span className="text-sm text-white/60 hidden sm:inline max-w-[120px] truncate">{session.user?.email}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 glass-card rounded-xl py-2 shadow-lg animate-fade-in z-50">
          <div className="px-4 py-2 border-b border-white/[0.04]">
            <p className="text-sm text-white/80 truncate">{session.user?.name || session.user?.email}</p>
            <span className={`text-[10px] uppercase tracking-wider font-medium ${isPro ? 'text-accent-400' : 'text-white/30'}`}>
              {plan === 'pro_lifetime' ? 'Pro Lifetime' : plan === 'pro_monthly' ? 'Pro' : 'Free Plan'}
            </span>
          </div>
          <div className="py-1">
            <Link href="/dashboard" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors duration-150">
              <User className="w-4 h-4" /> {t('menu.dashboard')}
            </Link>
            <Link href="/pricing" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors duration-150">
              <CreditCard className="w-4 h-4" /> {t('menu.billing')}
            </Link>
          </div>
          <div className="border-t border-white/[0.04] pt-1">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-400/70 hover:text-red-400 hover:bg-white/[0.04] transition-colors duration-150 w-full"
            >
              <LogOut className="w-4 h-4" /> {t('menu.signout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
