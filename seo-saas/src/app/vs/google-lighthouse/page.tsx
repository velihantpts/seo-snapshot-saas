import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SEO Snapshot vs Google Lighthouse: Honest Comparison',
  description: 'How SEO Snapshot compares to Google Lighthouse for SEO audits — coverage, security headers, copy-paste fixes, history, and when to use each.',
  alternates: { canonical: 'https://seosnapshot.dev/vs/google-lighthouse' },
};

const rows: { feature: string; ss: boolean | string; lh: boolean | string }[] = [
  { feature: 'Runs from any URL (no install)', ss: true, lh: 'Needs Chrome / PageSpeed' },
  { feature: 'On-page SEO checks', ss: '100+', lh: 'Basic SEO audit' },
  { feature: 'HTTP security headers (HSTS, CSP…)', ss: true, lh: false },
  { feature: 'Core Web Vitals', ss: 'Via PageSpeed API', lh: 'Authoritative source' },
  { feature: 'Performance & PWA audits', ss: 'Limited', lh: true },
  { feature: 'Copy-paste fix code', ss: true, lh: false },
  { feature: 'Analysis history & dashboard', ss: true, lh: false },
  { feature: 'Shareable public report links', ss: true, lh: false },
  { feature: 'Free', ss: true, lh: true },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (v === false) return <X className="w-4 h-4 text-white/20 mx-auto" />;
  return <span className="text-xs text-white/50">{v}</span>;
}

export default function Page() {
  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-3">SEO Snapshot vs Google Lighthouse</h1>
        <p className="text-white/50 text-sm mb-8 leading-relaxed">
          Both are free and both are useful — they just optimize for different things. Google Lighthouse
          is the authoritative source for performance and Core Web Vitals and runs inside Chrome.
          SEO Snapshot is a URL-based, SEO-focused auditor that adds server security headers,
          copy-paste fixes, history, and shareable reports. Many people use both.
        </p>

        <div className="glass-card rounded-xl overflow-hidden mb-8">
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-3 border-b border-white/[0.08] text-xs font-medium text-white/60">
            <span>Feature</span>
            <span className="w-24 text-center">SEO Snapshot</span>
            <span className="w-24 text-center">Lighthouse</span>
          </div>
          {rows.map(r => (
            <div key={r.feature} className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-3 border-b border-white/[0.04] items-center text-sm">
              <span className="text-white/60">{r.feature}</span>
              <span className="w-24 text-center"><Cell v={r.ss} /></span>
              <span className="w-24 text-center"><Cell v={r.lh} /></span>
            </div>
          ))}
        </div>

        <h2 className="text-lg font-medium text-white/90 mt-8 mb-2">When to use Lighthouse</h2>
        <p className="text-sm text-white/50 leading-relaxed mb-4">You want the definitive performance score, Core Web Vitals lab data, or PWA/best-practices audits, and you are comfortable running it in Chrome DevTools or PageSpeed Insights.</p>

        <h2 className="text-lg font-medium text-white/90 mt-6 mb-2">When to use SEO Snapshot</h2>
        <p className="text-sm text-white/50 leading-relaxed mb-8">You want a fast SEO-focused audit from just a URL — including real HTTP security headers, 100+ on-page checks, and copy-paste fixes — with a saved history and a link you can share with a client or teammate.</p>

        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">See your SEO score in 10 seconds</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
