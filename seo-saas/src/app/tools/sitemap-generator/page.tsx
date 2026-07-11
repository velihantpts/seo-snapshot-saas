import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'Free XML Sitemap Generator — Paste URLs, Get sitemap.xml',
  description: 'Turn a list of URLs into a valid XML sitemap with lastmod, changefreq, and priority. Copy or download sitemap.xml. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/sitemap-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is an XML sitemap?', a: 'A sitemap.xml is a file that lists the URLs on your site so search engines can discover and crawl them efficiently. It is especially useful for new sites, large sites, or pages with few internal links.' },
  { q: 'Do I need a sitemap?', a: 'Small, well-linked sites can rank fine without one, but a sitemap never hurts and helps Google find pages faster. It is essential for large sites or content that is not linked from your main navigation.' },
  { q: 'How many URLs can a sitemap have?', a: 'A single sitemap is limited to 50,000 URLs and 50MB uncompressed. Beyond that, split into multiple sitemaps and reference them from a sitemap index file.' },
  { q: 'Do changefreq and priority matter?', a: 'Google largely ignores both — they are hints, not directives. lastmod is the most useful field when it is accurate. Do not stress about priority values.' },
  { q: 'Where do I submit my sitemap?', a: 'Host it at your domain root (e.g. /sitemap.xml), reference it in robots.txt with a Sitemap: line, and submit it in Google Search Console under Sitemaps.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'XML Sitemap Generator',
    applicationCategory: 'SEO Tool',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">XML Sitemap Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Paste your URLs and get a valid <code className="text-accent-300">sitemap.xml</code> with optional lastmod, changefreq, and priority. Duplicate and invalid URLs are cleaned automatically.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Help Google find every page</h2>
          <p>A sitemap is a simple map of your site for search engines. It won&apos;t boost rankings on its own, but it speeds up discovery — which matters a lot for new pages, big sites, and anything buried deep in your structure.</p>
          <p>Paste one URL per line above. This tool validates them, removes duplicates, and outputs a spec-compliant sitemap you can copy or download. Then submit it in Search Console.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
