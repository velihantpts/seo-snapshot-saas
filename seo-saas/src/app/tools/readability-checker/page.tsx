import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free Readability Checker — Flesch Reading Ease & Grade Level',
  description: 'Paste text and get the Flesch Reading Ease score, Flesch-Kincaid grade level, and sentence stats. Write content people actually read. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/readability-checker' },
};

const faqs: FaqItem[] = [
  { q: 'What is a good readability score?', a: 'For general web content, aim for a Flesch Reading Ease of 60 or higher — roughly an 8th to 9th grade level. That is the range most adults read comfortably while scanning. Technical or academic audiences tolerate lower scores, but even there, clearer usually wins.' },
  { q: 'How is the Flesch score calculated?', a: 'Reading Ease uses two inputs: average words per sentence and average syllables per word. Longer sentences and longer words both lower the score. The Flesch-Kincaid grade level converts the same inputs into a US school grade.' },
  { q: 'Does readability affect SEO?', a: 'Not as a direct ranking factor. But readable content keeps people on the page, gets shared and linked more, and answers queries clearly — all of which help indirectly. Google also favors content that plainly satisfies intent, and dense, hard-to-read text often does not.' },
  { q: 'How do I improve my score fast?', a: 'Two levers do most of the work: cut sentence length (break long sentences in two) and replace long words with short ones ("use" over "utilize"). The tool recomputes live, so you can watch the score climb as you edit.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Readability Checker',
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
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Score any text with the Flesch Reading Ease and Flesch-Kincaid grade level, and see the sentence and word stats behind the number. Edit and watch it update live. Nothing leaves your browser.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Clear writing is a growth tactic</h2>
          <p>Readability is not about dumbing content down — it&apos;s about removing friction. The same idea written at a 9th-grade level gets read to the end more often than one written at a college level, and content that gets read gets shared, linked, and ranked. The score is a proxy for how hard your reader has to work.</p>
          <p>Two things move it more than anything else: sentence length and word length. When your score is low, look for the 40-word sentences and the words with four syllables where two would do. Once the copy reads clearly, the <Link href="/tools/keyword-density-checker" className="text-accent-400 hover:text-accent-300">keyword density checker</Link> helps confirm it&apos;s still focused on the right topic.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
