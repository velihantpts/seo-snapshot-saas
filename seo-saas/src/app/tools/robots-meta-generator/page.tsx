import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'Robots Meta Tag Generator — noindex, nofollow & Canonical',
  description: 'Generate the robots meta tag (index/noindex, follow/nofollow, noarchive, nosnippet) plus canonical and X-Robots-Tag. Copy-paste ready. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/robots-meta-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is the difference between robots.txt and the robots meta tag?', a: 'robots.txt controls crawling (whether bots may fetch a URL). The robots meta tag controls indexing (whether a fetched page may appear in results). To keep a page out of Google, use noindex — and make sure the page is NOT blocked in robots.txt, or Google can’t read the noindex.' },
  { q: 'How do I remove a page from Google?', a: 'Add <meta name="robots" content="noindex"> to the page and keep it crawlable. Google will drop it on the next crawl. For faster removal, also use the Removals tool in Search Console.' },
  { q: 'What does nofollow do?', a: 'nofollow on the robots meta tag tells Google not to follow any links on the page. It’s different from rel="nofollow" on a single link. Most sites should leave links followable.' },
  { q: 'When should I use X-Robots-Tag?', a: 'For non-HTML files like PDFs or images, where you can’t add a meta tag. Set the X-Robots-Tag HTTP header on the server response instead.' },
  { q: 'What is max-image-preview:large?', a: 'It lets Google show a large image preview for your page in results and Discover, which can improve click-through. It’s a good default for content sites.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Robots Meta Tag Generator',
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
        <h1 className="text-2xl font-medium tracking-tight mb-2">Robots Meta Tag Generator</h1>
        <p className="text-white/40 text-sm mb-8 max-w-2xl">Control how search engines index a single page: <code className="text-accent-300">noindex</code>, <code className="text-accent-300">nofollow</code>, snippet and image rules, plus a canonical link — as a meta tag or an <code className="text-accent-300">X-Robots-Tag</code> header.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Indexing, controlled per page</h2>
          <p>The robots meta tag is how you tell Google what to do with a specific page — keep it out of the index, hide the cache, limit the snippet, or allow big image previews. It&apos;s the right tool for thin pages, staging URLs, thank-you pages, and paginated archives.</p>
          <p>Toggle the directives you need and copy the tag into your <code className="text-accent-300">&lt;head&gt;</code>. Remember: <code className="text-accent-300">noindex</code> only works if the page stays crawlable.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
