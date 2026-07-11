import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'Free JSON-LD Schema Generator (Organization, Article, FAQ, Product)',
  description: 'Generate valid JSON-LD structured data for Organization, WebSite, Article, Product, and FAQ. Copy-paste ready for rich results. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/schema-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is JSON-LD structured data?', a: 'JSON-LD is a small script you add to a page that describes it to search engines in a machine-readable way (e.g. this is an Article by X, published on Y). It can unlock rich results like star ratings, FAQs, and breadcrumbs.' },
  { q: 'Where do I put the JSON-LD?', a: 'Inside a <script type="application/ld+json"> tag, ideally in the <head> or anywhere in the <body>. One block per schema type; you can include several on the same page.' },
  { q: 'Does structured data improve rankings?', a: 'Not directly, but it makes you eligible for rich results, which increase visibility and click-through. It also helps search engines understand your content, which indirectly helps.' },
  { q: 'How do I test my structured data?', a: 'Paste it into Google’s Rich Results Test or the Schema.org validator. Make sure the values match what is visible on the page — marking up content that is not shown to users violates Google’s guidelines.' },
  { q: 'Which schema type should I use?', a: 'Use the type that matches the page: Organization/WebSite for your homepage, Article for blog posts, Product for product pages, and FAQPage for pages with a real Q&A section.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'JSON-LD Schema Generator',
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
        <h1 className="text-2xl font-medium tracking-tight mb-2">JSON-LD Schema Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Generate structured data to unlock rich results in Google. Pick a type, fill the fields, and paste the JSON-LD into your page.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Unlock rich results with structured data</h2>
          <p>Structured data is how you spell out what a page is — an article, a product, a company, an FAQ — in a format search engines can act on. Done right, it makes you eligible for eye-catching rich results that pull more clicks from the same ranking.</p>
          <p>Pick a type, fill the fields, and this tool outputs valid JSON-LD ready to paste. Always validate with Google&apos;s Rich Results Test, and only mark up content that&apos;s actually visible on the page.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
