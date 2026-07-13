import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free URL Slug Generator — Clean, SEO-Friendly Slugs',
  description: 'Turn any title into a clean, SEO-friendly URL slug — lowercase, hyphenated, accents removed. Optional stop-word removal. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/slug-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What makes a good URL slug?', a: 'Short, lowercase, descriptive, and hyphen-separated. Include the main keyword, drop filler, and avoid dates or IDs you might want to change later. A slug like /fix-core-web-vitals beats /post?id=1423 for both users and search engines.' },
  { q: 'Hyphens or underscores?', a: 'Hyphens. Google treats a hyphen as a word separator, so "core-web-vitals" reads as three words, while "core_web_vitals" reads as one joined token. Always use hyphens in URLs.' },
  { q: 'Should I remove stop-words?', a: 'Optional. Removing words like "the", "a", and "of" makes slugs shorter and keyword-focused, which many prefer. But keep them when dropping them would make the slug read awkwardly or change the meaning. Readability first.' },
  { q: 'What happens to accents and symbols?', a: 'Accented letters are transliterated to their closest ASCII form (é → e), and symbols and punctuation are removed. This keeps the URL clean and avoids percent-encoding that makes links ugly and hard to share.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'URL Slug Generator',
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
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Turn a title into a clean, readable URL slug — lowercase, hyphenated, with accents and symbols stripped out. Copy it straight into your CMS.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Small detail, lasting impact</h2>
          <p>A URL slug is one of the few SEO choices that&apos;s hard to change later — once a page is indexed and linked, editing the slug means setting up redirects. Getting it right the first time is worth the ten seconds: clean, keyword-relevant, and readable enough that someone could guess what the page is about from the link alone.</p>
          <p>Once your slug is set, generate the matching <Link href="/tools/canonical-tag-generator" className="text-accent-400 hover:text-accent-300">canonical tag</Link> and, if you ever do change it, build the <Link href="/tools/redirect-generator" className="text-accent-400 hover:text-accent-300">301 redirect</Link> so you don&apos;t lose the ranking.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
