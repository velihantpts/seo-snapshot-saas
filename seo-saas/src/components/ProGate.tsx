'use client';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';

export function ProGate({ children, feature, isPro = false }: {
  children: ReactNode; feature: string; isPro?: boolean;
}) {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred content */}
      <div className="blur-[6px] select-none pointer-events-none opacity-60" aria-hidden="true">
        {children}
      </div>
      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-accent-400" />
          </div>
          <p className="text-sm font-medium text-white/80 mb-1">Pro Feature</p>
          <p className="text-xs text-white/40 mb-3 max-w-[200px]">Upgrade to see {feature}</p>
          <Link href="/pricing" className="btn-primary !py-2 !px-4 text-xs inline-block">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}
