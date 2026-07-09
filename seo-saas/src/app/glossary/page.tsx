import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SEO Glossary — 30 Key Terms Explained',
  description: 'Plain-English definitions of essential SEO terms: canonical, Core Web Vitals, crawl budget, JSON-LD, LCP, noindex, and more.',
  alternates: { canonical: 'https://seosnapshot.dev/glossary' },
};

const terms: { term: string; def: string }[] = [
  { term: 'Alt text', def: 'A text description of an image, read by screen readers and used by Google to understand images. Improves accessibility and image SEO.' },
  { term: 'Anchor text', def: 'The clickable text of a link. Descriptive anchor text helps search engines understand the linked page.' },
  { term: 'Backlink', def: 'A link from another website to yours. High-quality backlinks are one of the strongest ranking signals.' },
  { term: 'Canonical URL', def: 'A tag that tells search engines which version of a duplicate/similar page is the "master" to index, preventing duplicate-content issues.' },
  { term: 'CLS (Cumulative Layout Shift)', def: 'A Core Web Vital measuring unexpected layout movement while a page loads. Aim for under 0.1.' },
  { term: 'Core Web Vitals', def: 'Google\'s set of user-experience metrics (LCP, CLS, INP) that directly influence rankings.' },
  { term: 'Crawl budget', def: 'The number of pages a search engine will crawl on your site in a given time. Wasting it on low-value URLs hurts indexing.' },
  { term: 'Crawlability', def: 'How easily search engine bots can access and navigate your site\'s pages.' },
  { term: 'E-E-A-T', def: 'Experience, Expertise, Authoritativeness, Trust — quality signals Google uses to evaluate content, especially in sensitive niches.' },
  { term: 'Hreflang', def: 'An attribute that tells Google which language/region a page targets, for multi-language sites.' },
  { term: 'Indexing', def: 'The process of a search engine storing a page so it can appear in results. Crawling ≠ indexing.' },
  { term: 'INP (Interaction to Next Paint)', def: 'A Core Web Vital measuring responsiveness to user input. Replaced FID in 2024. Aim for under 200ms.' },
  { term: 'JSON-LD', def: 'The recommended format for structured data — a script that describes your content to enable rich results.' },
  { term: 'Keyword cannibalization', def: 'When multiple pages target the same keyword and compete with each other, weakening all of them.' },
  { term: 'LCP (Largest Contentful Paint)', def: 'A Core Web Vital measuring how fast the largest visible element loads. Aim for under 2.5s.' },
  { term: 'Meta description', def: 'The summary shown under your title in search results. Influences click-through rate. 150-160 characters ideal.' },
  { term: 'noindex', def: 'A directive telling search engines not to show a page in results. The page can still be crawled.' },
  { term: 'nofollow', def: 'A link attribute telling search engines not to pass ranking authority through that link.' },
  { term: 'Open Graph', def: 'Meta tags that control how your page looks when shared on social media (title, description, image).' },
  { term: 'Organic traffic', def: 'Visitors who arrive from unpaid search engine results.' },
  { term: 'Rich results', def: 'Enhanced search listings (stars, FAQs, images) enabled by structured data.' },
  { term: 'Robots.txt', def: 'A file at your site root that tells crawlers which URLs they may or may not crawl.' },
  { term: 'Schema markup', def: 'Structured data (usually JSON-LD) that describes your content type to search engines.' },
  { term: 'SERP', def: 'Search Engine Results Page — the page of results Google shows for a query.' },
  { term: 'Sitemap (XML)', def: 'A file listing your important URLs to help search engines discover and crawl them.' },
  { term: 'Structured data', def: 'Machine-readable markup that describes your content, enabling rich results.' },
  { term: 'Title tag', def: 'The clickable headline in search results and browser tabs. The single strongest on-page element. 50-60 characters ideal.' },
  { term: 'TTFB (Time to First Byte)', def: 'The time from request to the first byte of server response. A slow TTFB delays everything, including LCP.' },
  { term: 'Canonicalization', def: 'The process of selecting the preferred URL when several show the same content.' },
  { term: 'Crawl-delay', def: 'A robots.txt directive requesting bots wait between requests, to reduce server load.' },
];

export default function GlossaryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'SEO Glossary',
    hasDefinedTerm: terms.map(t => ({ '@type': 'DefinedTerm', name: t.term, description: t.def })),
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-2">SEO Glossary</h1>
        <p className="text-white/40 text-sm mb-10">Plain-English definitions of the SEO terms that actually matter.</p>
        <dl className="space-y-5">
          {terms.map(t => (
            <div key={t.term} className="glass-card rounded-xl p-5">
              <dt className="text-base font-medium text-white/90 mb-1.5">{t.term}</dt>
              <dd className="text-sm text-white/50 leading-relaxed">{t.def}</dd>
            </div>
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
