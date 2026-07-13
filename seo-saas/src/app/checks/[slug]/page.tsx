import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CHECKS, checkBySlug, CHECK_CATEGORIES } from '@/lib/checks-catalog';

const SITE = 'https://seosnapshot.dev';

export function generateStaticParams() {
  return CHECKS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = checkBySlug.get(params.slug);
  if (!c) return { title: 'Check not found' };
  const url = `${SITE}/checks/${c.slug}`;
  const description = `${c.title}: what it means, why it matters for SEO, and how to fix it with copy-paste code.`;
  return {
    title: `${c.title}: What It Means and How to Fix It`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${c.title}: What It Means and How to Fix It`, description, url },
    twitter: { card: 'summary_large_image', title: `${c.title} — SEO fix`, description },
  };
}

const severityColor: Record<string, string> = {
  critical: 'text-red-400 border-red-400/30',
  warning: 'text-amber-400 border-amber-400/30',
  info: 'text-white/50 border-white/15',
};

export default function CheckPage({ params }: { params: { slug: string } }) {
  const c = checkBySlug.get(params.slug);
  if (!c) notFound();
  const url = `${SITE}/checks/${c.slug}`;
  const catLabel = CHECK_CATEGORIES[c.category] || c.category;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${c.title}: What It Means and How to Fix It`,
    description: c.what,
    inLanguage: 'en',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'SEO Snapshot', url: SITE },
    publisher: { '@type': 'Organization', name: 'SEO Snapshot', url: SITE, logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SEO Checks', item: `${SITE}/checks` },
      { '@type': 'ListItem', position: 2, name: c.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/checks" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All SEO checks
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <span className="text-accent-400 text-xs font-medium uppercase tracking-wide">{catLabel}</span>
          <span className={`text-[11px] uppercase tracking-wide border rounded-full px-2 py-0.5 ${severityColor[c.severity] || 'text-white/50 border-white/15'}`}>{c.severity}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-8">{c.title}</h1>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-white/90 mb-2">What this check looks for</h2>
          <p className="text-[15px] text-white/60 leading-relaxed">{c.what}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-white/90 mb-2">Why it matters</h2>
          <p className="text-[15px] text-white/60 leading-relaxed">{c.why}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-medium text-white/90 mb-3">How to fix it</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
              <span className="text-[11px] uppercase tracking-wide text-white/40">{c.fixLang}</span>
            </div>
            <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed"><code className="text-accent-200 font-mono whitespace-pre">{c.fixCode}</code></pre>
          </div>
        </section>

        {c.related.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-medium text-white/80 mb-3">Go deeper</h2>
            <ul className="space-y-1.5">
              {c.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-accent-400 hover:text-accent-300 text-sm">
                    {r.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">Check your site for this and 100+ other issues</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
