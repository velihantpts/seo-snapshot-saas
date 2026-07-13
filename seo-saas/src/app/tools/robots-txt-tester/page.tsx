import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free robots.txt Tester — Check if a URL Is Blocked',
  description: 'Paste your robots.txt and test whether any URL is allowed or blocked for Googlebot and other crawlers. Follows Google matching rules. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/robots-txt-tester' },
};

const faqs: FaqItem[] = [
  { q: 'How does robots.txt matching work?', a: 'Crawlers pick the group whose User-agent best matches them (a specific name beats the * wildcard), then apply the most specific rule in that group — the one with the longest matching path. A * is a wildcard, a trailing $ anchors the end of the URL, and when an Allow and a Disallow of equal length both match, the Allow wins.' },
  { q: 'Does robots.txt stop a page from being indexed?', a: 'No — this is the most common misunderstanding. robots.txt controls crawling, not indexing. A blocked URL can still appear in Google (usually without a description) if other pages link to it. To keep a page out of results, allow crawling and add a noindex meta tag, or use HTTP auth.' },
  { q: 'Why did Google remove its robots.txt tester?', a: 'Google retired the standalone robots.txt Tester tool from Search Console. You can still see the fetched file and test individual URLs via the URL Inspection tool, but a quick side-by-side tester like this one is often faster for checking rules as you edit them.' },
  { q: 'What path should I enter?', a: 'Either a full URL or just the path. The tester uses the path and query string (e.g. /admin/page?sort=asc), which is what crawlers match against — the domain itself is not part of robots.txt rule matching.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'robots.txt Tester',
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
        <h1 className="text-2xl font-medium tracking-tight mb-2">robots.txt Tester</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Paste your robots.txt, enter a URL, and see instantly whether it&apos;s allowed or blocked for a given crawler — using the same longest-match rules Google applies. Runs entirely in your browser.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Catch the accidental block before Google does</h2>
          <p>The single most damaging robots.txt mistake is a broad <span className="font-mono text-white/60">Disallow: /</span> that ships from staging to production and quietly blocks the whole site. The second is a rule that&apos;s more aggressive than intended — a <span className="font-mono text-white/60">Disallow: /*?</span> that catches URLs you actually want crawled. Testing specific paths is how you catch both.</p>
          <p>Once the file is right, generate a clean version with the <Link href="/tools/robots-txt-generator" className="text-accent-400 hover:text-accent-300">robots.txt generator</Link>, and remember the golden rule: to remove a page from search results, don&apos;t block it here — let it be crawled and add a noindex tag, which you can build with the <Link href="/tools/robots-meta-generator" className="text-accent-400 hover:text-accent-300">robots meta generator</Link>.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
