import type { Metadata } from 'next';
import Link from 'next/link';
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
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-2">SEO Glossary</h1>
        <p className="text-white/60 text-sm mb-10">Plain-English definitions of the SEO terms that actually matter. Tap any term for the full explanation.</p>
        <dl className="space-y-4">
          {GLOSSARY.map((t) => (
            <Link
              key={t.slug}
              href={`/glossary/${t.slug}`}
              className="glass-card rounded-xl p-5 block hover:border-accent-500/30 transition group"
            >
              <dt className="text-base font-medium text-white/90 mb-1.5 group-hover:text-accent-300 transition">{t.term}</dt>
              <dd className="text-sm text-white/50 leading-relaxed">{t.short}</dd>
            </Link>
          ))}
        </dl>
        <div className="mt-10 glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">See these factors scored on your own site</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
