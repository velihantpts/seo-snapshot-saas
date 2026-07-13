import type { Metadata } from 'next';
import Link from 'next/link';
import { ListChecks } from 'lucide-react';
import { CHECKS, CHECK_CATEGORIES } from '@/lib/checks-catalog';

const SITE = 'https://seosnapshot.dev';

export const metadata: Metadata = {
  title: 'SEO Checks: What They Mean and How to Fix Them',
  description: 'A reference for the most common SEO issues — what each check means, why it matters, and copy-paste code to fix it. Free, no signup.',
  alternates: { canonical: `${SITE}/checks` },
};

const severityColor: Record<string, string> = {
  critical: 'text-red-400',
  warning: 'text-amber-400',
  info: 'text-white/40',
};

export default function ChecksIndexPage() {
  // group by category, preserving the CHECK_CATEGORIES order
  const byCat = new Map<string, typeof CHECKS>();
  for (const c of CHECKS) {
    if (!byCat.has(c.category)) byCat.set(c.category, []);
    byCat.get(c.category)!.push(c);
  }
  const orderedCats = Object.keys(CHECK_CATEGORIES).filter((k) => byCat.has(k));

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'SEO Checks', item: `${SITE}/checks` }],
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-[11px] font-medium mb-5">
            <ListChecks className="w-3 h-3" /> {CHECKS.length} checks explained
          </div>
          <h1 className="text-3xl sm:text-[2.5rem] font-semibold tracking-tight leading-[1.06] text-balance">
            Every SEO check, with the <span className="gradient-text">fix</span>
          </h1>
          <p className="text-white/55 text-[15px] mt-4 leading-relaxed">
            What each common SEO issue means, why it matters, and the exact code to fix it — a sample of the 100+ checks the{' '}
            <Link href="/" className="text-accent-400 hover:text-accent-300">free analyzer</Link> runs on any URL.
          </p>
        </div>

        <div className="space-y-10">
          {orderedCats.map((cat) => (
            <section key={cat}>
              <h2 className="text-sm font-medium text-accent-400 uppercase tracking-wide mb-3">{CHECK_CATEGORIES[cat]}</h2>
              <div className="space-y-3">
                {byCat.get(cat)!.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/checks/${c.slug}`}
                    className="glass-card rounded-xl p-4 block hover:border-accent-500/30 transition group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[15px] font-medium text-white/90 group-hover:text-accent-300 transition">{c.title}</span>
                      <span className={`text-[11px] uppercase tracking-wide ${severityColor[c.severity] || 'text-white/40'}`}>{c.severity}</span>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed mt-1">{c.what}</p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">Find these issues on your own site in seconds</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
