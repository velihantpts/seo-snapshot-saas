import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: '301 Redirect Generator — .htaccess & Nginx Rules',
  description: 'Generate 301/302 redirect rules for Apache (.htaccess) and Nginx from a list of old→new URLs. Copy-paste ready. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/redirect-generator' },
};

const faqs: FaqItem[] = [
  { q: 'When should I use a 301 vs a 302?', a: 'Use 301 (permanent) when a URL has moved for good — it passes ranking signals to the new URL. Use 302 (temporary) only for short-lived redirects like A/B tests or maintenance, where you want to keep the original indexed.' },
  { q: 'Do 301 redirects pass SEO value?', a: 'Yes. A 301 passes essentially all ranking signals (PageRank) to the destination. This is why redirecting old URLs during a migration is critical — otherwise you lose the equity of those pages.' },
  { q: 'What are redirect chains and why avoid them?', a: 'A chain is A → B → C. Each hop adds latency and can dilute signals. Always redirect straight to the final destination (A → C), and update old rules when destinations change.' },
  { q: 'Where do I put .htaccess redirects?', a: 'In the .htaccess file at your site root. They apply top-down, so put more specific rules first. On Nginx there is no .htaccess — the rules go in your server block and require a reload.' },
  { q: 'Should I redirect http to https and www to non-www?', a: 'Yes — pick one canonical version and 301 everything else to it. Consistent redirects prevent duplicate content and split signals.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '301 Redirect Generator',
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
        <h1 className="text-2xl font-medium tracking-tight mb-2">301 Redirect Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Turn a list of old → new URLs into ready-to-paste redirect rules for Apache <code className="text-accent-300">.htaccess</code> or Nginx. Perfect for site migrations and URL changes.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Migrate URLs without losing rankings</h2>
          <p>When you change a URL, delete a page, or move to a new structure, a <strong>301 redirect</strong> forwards both users and search engines to the right place — and carries the old page&apos;s ranking equity with it. Skip it and you lose traffic and links overnight.</p>
          <p>List your old and new URLs above, pick your server, and copy the generated rules. Then verify there are no broken links or redirect chains left behind.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
