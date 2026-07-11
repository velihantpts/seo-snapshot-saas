import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'SERP Snippet Preview — Google Title & Meta Description Tester',
  description: 'Preview your Google search result and see if your title tag and meta description get truncated. Pixel-accurate, desktop & mobile. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/serp-snippet-preview' },
};

const faqs: FaqItem[] = [
  { q: 'How long should a title tag be?', a: 'Google truncates by pixel width (~600px on desktop), not characters — roughly 50–60 characters. Put your primary keyword and the most important words first so they survive truncation.' },
  { q: 'How long should a meta description be?', a: 'Around 920px on desktop (~150–160 characters) and a bit more on mobile. Google may rewrite it, but a tight, keyword-relevant description improves click-through when it is used.' },
  { q: 'Why does Google show a different title than mine?', a: 'Google sometimes rewrites titles using your H1, anchor text, or brand when it thinks that better matches the query. A clear, non-stuffed title tag is more likely to be kept as-is.' },
  { q: 'Does the meta description affect rankings?', a: 'Not directly — it is not a ranking factor. But it heavily influences click-through rate, which matters. Treat it as ad copy for your search listing.' },
  { q: 'Why pixel width instead of character count?', a: 'A “W” is much wider than an “i”, so two titles with the same character count can truncate very differently. This tool measures the actual rendered width, like Google does.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SERP Snippet Preview',
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
        <h1 className="text-2xl font-medium tracking-tight mb-2">SERP Snippet Preview</h1>
        <p className="text-white/40 text-sm mb-8 max-w-2xl">Write a title tag and meta description and see the pixel-accurate Google preview — including exactly where each gets truncated on desktop and mobile.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Write titles that survive truncation</h2>
          <p>Your Google listing is a tiny ad. The title tag is the blue clickable link and the meta description is the copy beneath it — together they decide your click-through rate, which is one of the few things fully in your control.</p>
          <p>Google cuts both off by <strong>pixel width</strong>, so the safest move is to front-load your keyword and most compelling words. This tool measures the real rendered width with a canvas, so what you see here closely matches the live SERP.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
