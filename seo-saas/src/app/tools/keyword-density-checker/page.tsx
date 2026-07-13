import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free Keyword Density Checker (with Word Count & Reading Time)',
  description: 'Paste any text and see word count, reading time, and keyword density for 1, 2, and 3-word phrases. Catch keyword stuffing. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/keyword-density-checker' },
};

const faqs: FaqItem[] = [
  { q: 'What is a good keyword density?', a: 'There is no exact target Google rewards. As a rough guide, keep any single keyword under about 2–3% of total words. Above ~5% starts to read as stuffing. Write naturally for readers first — modern search engines understand topics through context, not repetition counts.' },
  { q: 'How is density calculated?', a: 'Density = (times the phrase appears ÷ total phrases of that length) × 100. For single words this tool removes common stop-words (the, and, of…) so the results reflect meaningful terms, not filler.' },
  { q: 'Why check 2 and 3-word phrases too?', a: 'Real search queries are usually phrases, not single words. Seeing your top 2 and 3-word combinations tells you what topic your page actually signals — often more useful than single-word counts.' },
  { q: 'Does keyword density still matter for SEO?', a: 'Not as a target to hit. It matters as a diagnostic: very high density flags stuffing, and very low density for your main topic can mean the page is off-focus. Use it to sanity-check, not to optimize toward a magic number.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Keyword Density Checker',
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
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Paste your content to see word count, reading time, and how often each word and phrase appears — a fast way to spot keyword stuffing or an off-topic draft. Everything runs in your browser; nothing is uploaded.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Read your content the way a search engine does</h2>
          <p>Keyword density used to be something people optimized toward a target. That era is over — Google understands topics through context and related terms, not raw repetition. What density is still good for is a quick health check: if one word shows up at 8% you are probably stuffing, and if your main topic barely registers, the page may be drifting.</p>
          <p>The 2 and 3-word views are the useful part. They show the phrases your writing actually emphasizes, which is closer to how people search. If the phrases at the top are not the ones you want to rank for, that is your signal to refocus the content — not to sprinkle in more keywords.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
