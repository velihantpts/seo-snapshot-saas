import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free Meta Tag Generator (Title, Description, OG, Twitter)',
  description: 'Generate SEO meta tags, Open Graph, and Twitter Card tags with live character counts. Copy-paste ready. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/meta-tag-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What meta tags does a page actually need?', a: 'At minimum: a unique title tag and meta description. For good sharing, add Open Graph (og:title, og:description, og:image, og:url) and Twitter Card tags. A canonical link is also strongly recommended to avoid duplicate-content issues.' },
  { q: 'How long should the title and description be?', a: 'Aim for ~50–60 characters for the title and ~150–160 for the description. Google truncates by pixel width, so front-load the important words. The counters above turn amber when you exceed the safe range.' },
  { q: 'Where do I put these tags?', a: 'Paste them inside the <head> section of your HTML, or in your framework’s head component (e.g. Next.js metadata, a <Helmet>, or your CMS SEO fields). One set of tags per page.' },
  { q: 'Do meta keywords still matter?', a: 'No. Google has ignored the meta keywords tag for well over a decade. Focus on the title, description, and structured data instead.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Meta Tag Generator',
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
        <h1 className="text-2xl font-medium tracking-tight mb-2">Meta Tag Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Create title, description, Open Graph, and Twitter Card tags with live length feedback. Paste them into your page&apos;s <code className="text-accent-300">&lt;head&gt;</code>.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Meta tags, done right in 30 seconds</h2>
          <p>Meta tags are how you tell search engines and social platforms what a page is about. The title and description shape your Google listing; the Open Graph and Twitter tags shape how your link looks when shared. Getting them right is one of the cheapest, highest-leverage SEO wins.</p>
          <p>Fill the fields above and this tool writes clean, valid tags with live length feedback so nothing gets truncated. Copy them straight into your page&apos;s <code className="text-accent-300">&lt;head&gt;</code>.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
