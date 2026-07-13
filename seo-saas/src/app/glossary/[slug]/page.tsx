import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { GLOSSARY, glossaryBySlug, type GlossaryTerm } from '@/lib/glossary';

const SITE = 'https://seosnapshot.dev';

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = glossaryBySlug.get(params.slug);
  if (!t) return { title: 'Term not found' };
  const url = `${SITE}/glossary/${t.slug}`;
  return {
    title: `${t.term} — SEO Glossary`,
    description: t.short,
    alternates: { canonical: url },
    openGraph: { title: `${t.term} — SEO Glossary`, description: t.short, url },
    twitter: { card: 'summary_large_image', title: `${t.term} — SEO Glossary`, description: t.short },
  };
}

export default function GlossaryTermPage({ params }: { params: { slug: string } }) {
  const t = glossaryBySlug.get(params.slug);
  if (!t) notFound();
  const related = t.related
    .map((s) => glossaryBySlug.get(s))
    .filter((x): x is GlossaryTerm => Boolean(x));
  const url = `${SITE}/glossary/${t.slug}`;

  const definedTermLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.short,
    inDefinedTermSet: `${SITE}/glossary`,
    url,
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Glossary', item: `${SITE}/glossary` },
      { '@type': 'ListItem', position: 2, name: t.term, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/glossary" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> SEO Glossary
        </Link>

        <p className="text-accent-400 text-xs font-medium uppercase tracking-wide mb-2">SEO Term</p>
        <h1 className="text-3xl font-semibold tracking-tight mb-4">{t.term}</h1>
        <p className="text-lg text-white/80 leading-relaxed mb-6">{t.short}</p>

        <div className="text-[15px] text-white/60 leading-relaxed space-y-4">
          {t.long.split('\n').filter(Boolean).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8">
          <Link href={t.link.href} className="text-accent-400 hover:text-accent-300 text-sm font-medium">
            {t.link.label} →
          </Link>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-medium text-white/80 mb-3">Related terms</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/glossary/${r.slug}`}
                  className="glass-card rounded-lg px-3 py-1.5 text-sm text-white/70 hover:text-white transition"
                >
                  {r.term}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">See how your own site scores on {t.term.toLowerCase()} and 100+ other checks</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
