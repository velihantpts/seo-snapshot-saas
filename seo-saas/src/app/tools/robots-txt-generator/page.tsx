import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Free robots.txt Generator (with Sitemap & Crawl-delay)',
  description: 'Generate a valid robots.txt file: allow/block crawling, disallow paths, add your sitemap and crawl-delay. Copy-paste ready. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/robots-txt-generator' },
};

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
        <Link href="/tools" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">robots.txt Generator</h1>
        <p className="text-white/40 text-sm mb-8 max-w-2xl">Build a valid robots.txt to control how search engines crawl your site. Add disallow rules, your sitemap, and an optional crawl-delay.</p>
        <Client />
      </div>
    </div>
  );
}
