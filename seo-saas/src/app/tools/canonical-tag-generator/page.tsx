import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'Free Canonical Tag Generator (HTML, Next.js, HTTP Header)',
  description: 'Generate a rel=canonical tag from any URL — as HTML, Next.js App Router metadata, or an HTTP Link header. Normalizes tracking params and protocol. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/canonical-tag-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is a canonical tag?', a: 'A rel="canonical" tag tells search engines which URL is the master version when the same or similar content is reachable through multiple URLs — query strings, trailing slashes, http vs https. It consolidates ranking signals onto the one URL you want indexed.' },
  { q: 'Should every page have a canonical?', a: 'A self-referencing canonical on every indexable page is the safest default. It pre-empts duplicates created by tracking parameters and URL variants. The one thing to avoid is a single hard-coded canonical shared across many different pages.' },
  { q: 'Absolute or relative URL?', a: 'Use an absolute URL (with https and your full domain). Relative canonicals are technically allowed but riskier — an absolute URL leaves no ambiguity about the exact page you mean.' },
  { q: 'Does a canonical guarantee that URL is indexed?', a: 'No — it is a strong hint, not a directive. Google can override it if other signals disagree. Make your internal links, sitemap, and redirects all point at the same canonical URL so the signals reinforce each other.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Canonical Tag Generator',
    applicationCategory: 'SEO Tool',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">Canonical Tag Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Paste a URL and get a clean canonical tag in three formats — HTML, Next.js metadata, and an HTTP header. It normalizes the protocol and strips tracking parameters automatically.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">The tag that quietly prevents duplicate content</h2>
          <p>Most duplicate-content problems aren&apos;t plagiarism — they&apos;re the same page reachable at slightly different URLs: with and without a trailing slash, with a tracking parameter, on www and non-www. A self-referencing canonical on every page tells Google which one counts, so ranking signals don&apos;t get split.</p>
          <p>On Next.js there&apos;s a specific gotcha worth knowing: a canonical set in the root layout is inherited by child routes, which can accidentally point every page at your homepage. The <Link href="/blog/canonical-url-nextjs" className="text-accent-400 hover:text-accent-300">Next.js canonical guide</Link> covers it, and the <Link href="/tools/http-header-checker" className="text-accent-400 hover:text-accent-300">HTTP header checker</Link> lets you confirm what&apos;s actually being served.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
