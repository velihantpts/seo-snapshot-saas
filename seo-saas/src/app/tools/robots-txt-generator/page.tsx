import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free robots.txt Generator (with Sitemap & Crawl-delay)',
  description: 'Generate a valid robots.txt file: allow/block crawling, disallow paths, add your sitemap and crawl-delay. Copy-paste ready. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/robots-txt-generator' },
};

const faqs: FaqItem[] = [
  { q: 'Where does robots.txt go?', a: 'It must live at the root of your domain: https://example.com/robots.txt. Search engines only look there — a robots.txt in a subfolder is ignored.' },
  { q: 'Does Disallow hide a page from Google?', a: 'No. Disallow stops crawling, not indexing. A blocked URL can still appear in results (without a snippet) if other pages link to it. To keep a page out of the index, allow crawling and use a noindex meta tag instead.' },
  { q: 'Should I add my sitemap here?', a: 'Yes. A Sitemap: line pointing to your sitemap.xml helps search engines discover all your URLs. You can list multiple sitemaps.' },
  { q: 'What is crawl-delay?', a: 'It asks crawlers to wait N seconds between requests to reduce server load. Google ignores it (control Googlebot in Search Console), but Bing and others honor it.' },
  { q: 'Can a bad robots.txt hurt my SEO?', a: 'Absolutely. A stray “Disallow: /” blocks your entire site from crawling. Always double-check the output and test it in Google Search Console’s robots.txt tester.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'robots.txt Generator',
    applicationCategory: 'SEO Tool',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <ToolHeader />
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Build a valid robots.txt to control how search engines crawl your site. Add disallow rules, your sitemap, and an optional crawl-delay.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Control crawling without breaking your SEO</h2>
          <p>A robots.txt file tells search engine crawlers which parts of your site they may request. It is powerful — and easy to get catastrophically wrong. One misplaced <code className="text-accent-300">Disallow: /</code> can wipe your site out of the index.</p>
          <p>This generator builds a valid file with sensible defaults, your sitemap, and per-path rules. Copy it to <code className="text-accent-300">/robots.txt</code> at your domain root, then confirm it in Search Console before relying on it.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
