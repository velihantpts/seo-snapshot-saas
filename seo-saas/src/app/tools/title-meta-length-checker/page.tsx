import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Title Tag & Meta Description Length Checker (Pixel Width)',
  description: 'Check title tag and meta description length by pixel width, not just characters — the way Google actually truncates. Live Google preview. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/title-meta-length-checker' },
};

const faqs: FaqItem[] = [
  { q: 'How long should a title tag be?', a: 'Google truncates titles by pixel width, around 600px on desktop — roughly 50–60 characters, but it depends on the letters. A title of wide characters (W, M, capitals) truncates sooner than one of narrow ones. This tool measures the actual pixel width so you know for sure.' },
  { q: 'What is the ideal meta description length?', a: 'Aim to stay under about 920px on desktop (roughly 150–160 characters). Google shows less on mobile. Anything past the limit gets cut with an ellipsis, so put the key message and call to action first.' },
  { q: 'Why pixels instead of character count?', a: 'Because Google renders text and cuts it at a pixel boundary, not a character count. "IIIIIIIIII" and "WWWWWWWWWW" are the same number of characters but very different widths. Measuring pixels is the only accurate way to predict truncation.' },
  { q: 'Does length affect rankings?', a: 'Not directly. But a truncated title or description hides your message and hurts click-through, and Google is more likely to rewrite an over-long or awkward title. Getting the length right protects how your result reads in the SERP.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Title & Meta Description Length Checker',
    applicationCategory: 'SEO Tool',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <ToolHeader />
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Type your title and description and watch the pixel width in real time — the same measurement Google uses to decide what to truncate. The preview shows exactly how your result will read.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Characters lie, pixels don&apos;t</h2>
          <p>Every "60 character title" rule of thumb is an approximation of the real constraint: pixel width. Google lays out your title in a specific font and size and cuts it where it runs out of room. That is why two titles of identical length can behave differently — one fits, the other ends in an ellipsis.</p>
          <p>The practical takeaway is simple: front-load. Put the phrase you want people to see, and the words you want to rank for, at the start. Whatever gets truncated at the end should be the least important part. New to writing titles? Start with <Link href="/blog/how-to-write-seo-title-tags" className="text-accent-400 hover:text-accent-300">how to write title tags for SEO</Link> for the full formula, or get a pixel-accurate SERP mockup including the URL from the <Link href="/tools/serp-snippet-preview" className="text-accent-400 hover:text-accent-300">SERP snippet preview</Link>.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
