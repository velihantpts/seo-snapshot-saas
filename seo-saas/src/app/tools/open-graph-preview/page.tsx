import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Open Graph Preview & Generator — See How Your Link Looks',
  description: 'Preview how your link appears on Facebook, X/Twitter, LinkedIn, and Discord. Generate og:image, og:title, and Twitter Card tags. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/open-graph-preview' },
};

const faqs: FaqItem[] = [
  { q: 'What is an Open Graph tag?', a: 'Open Graph (og:) tags are meta tags in your page’s <head> that tell social platforms what title, description, and image to show when your link is shared. Without them, platforms guess — and usually show a bare, unclickable link.' },
  { q: 'Why does my link show no image when I share it?', a: 'You are most likely missing an og:image tag, or the image URL is broken, too small, or blocked. Facebook, X, LinkedIn, and Discord all read og:image for the preview thumbnail. Add a publicly reachable 1200×630 image.' },
  { q: 'What size should an og:image be?', a: '1200×630 pixels (a 1.91:1 ratio) is the safe standard that renders well everywhere. Keep it under ~5MB and use JPG or PNG. Avoid tiny images — platforms may drop them and fall back to no preview.' },
  { q: 'Do I need separate Twitter Card tags?', a: 'Not strictly — X falls back to Open Graph tags if Twitter tags are missing. But adding twitter:card="summary_large_image" plus twitter:title/description/image gives you full control over the X preview.' },
  { q: 'Why does my updated preview still show the old image?', a: 'Social platforms cache previews aggressively. After changing your tags, use each platform’s debugger (Facebook Sharing Debugger, X Card Validator, LinkedIn Post Inspector) to force a re-scrape.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Open Graph Preview & Generator',
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
        <h1 className="text-2xl font-medium tracking-tight mb-2">Open Graph Preview &amp; Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">See exactly how your link will look when shared on Facebook, X/Twitter, LinkedIn, and Discord — then copy the <code className="text-accent-300">og:</code> and Twitter Card tags to fix it.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Why your social preview matters</h2>
          <p>When someone shares your link, the little card with the image, title, and description is often the <em>only</em> thing that decides whether people click. A bare link with no image gets a fraction of the engagement of a rich preview — and it makes your site look broken or spammy.</p>
          <p>That card is controlled entirely by Open Graph meta tags in your page&apos;s <code className="text-accent-300">&lt;head&gt;</code>. Paste your values above to preview the result across platforms, then drop the generated tags into your template. The most common (and most costly) mistake is shipping without an <code className="text-accent-300">og:image</code> at all.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
