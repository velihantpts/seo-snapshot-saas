import type { Metadata } from 'next';
import Link from 'next/link';
import { BookMarked } from 'lucide-react';
import { GLOSSARY } from '@/lib/glossary';

export const metadata: Metadata = {
  title: 'SEO Glossary — 30 Key Terms Explained',
  description: 'Plain-English definitions of essential SEO terms: canonical, Core Web Vitals, crawl budget, JSON-LD, LCP, noindex, and more. One page per term.',
  alternates: { canonical: 'https://seosnapshot.dev/glossary' },
};

export default function GlossaryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'SEO Glossary',
    url: 'https://seosnapshot.dev/glossary',
    hasDefinedTerm: GLOSSARY.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.short,
      url: `https://seosnapshot.dev/glossary/${t.slug}`,
    })),
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-[11px] font-medium mb-5">
            <BookMarked className="w-3 h-3" /> {GLOSSARY.length} terms
          </div>
          <h1 className="text-3xl sm:text-[2.5rem] font-semibold tracking-tight leading-[1.06] text-balance">
            The SEO <span className="gradient-text">glossary</span>, in plain English
          </h1>
          <p className="text-white/55 text-[15px] mt-4 leading-relaxed">Definitions of the SEO terms that actually matter — canonical, Core Web Vitals, crawl budget, JSON-LD and more. Tap any term for the full explanation.</p>
        </div>
        <dl className="grid sm:grid-cols-2 gap-3">
          {GLOSSARY.map((t) => (
            <Link
              key={t.slug}
              href={`/glossary/${t.slug}`}
              className="glass-card rounded-xl p-5 block hover:border-accent-500/30 hover:bg-white/[0.04] transition-all duration-200 group"
            >
              <dt className="text-[15px] font-medium text-white/90 mb-1 group-hover:text-accent-200 transition">{t.term}</dt>
              <dd className="text-[13px] text-white/50 leading-relaxed">{t.short}</dd>
            </Link>
          ))}
        </dl>
        <div className="mt-12 glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">See these factors scored on your own site</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
