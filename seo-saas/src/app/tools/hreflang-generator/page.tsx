import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'Free Hreflang Tag Generator — Multi-Language SEO',
  description: 'Generate valid hreflang link tags for multi-language and multi-region sites, with x-default. Copy-paste ready. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/hreflang-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is hreflang for?', a: 'Hreflang tells Google which language/region version of a page to show which users. It prevents your English and Spanish pages from competing with each other and sends users to the right version.' },
  { q: 'What is x-default?', a: 'x-default is the fallback version for users whose language/region does not match any of your specific versions — usually a language selector or your main/international page.' },
  { q: 'Do hreflang links have to be reciprocal?', a: 'Yes. If page A points to page B with hreflang, page B must point back. Every version should also reference itself. Missing return links are the most common hreflang error.' },
  { q: 'Where do hreflang tags go?', a: 'In the <head> of each page, in your XML sitemap, or as HTTP headers — pick one method and apply it consistently. This tool generates the <head> link-tag version.' },
  { q: 'What format are the codes?', a: 'ISO 639-1 language, optionally plus ISO 3166-1 Alpha-2 region: en, en-GB, es-MX, pt-BR. The region is uppercase and optional; the language is lowercase and required.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Hreflang Tag Generator',
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
        <h1 className="text-2xl font-medium tracking-tight mb-2">Hreflang Tag Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Serving a site in multiple languages or regions? Generate valid <code className="text-accent-300">hreflang</code> link tags (with <code className="text-accent-300">x-default</code>) so Google shows the right version to each user.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Stop your language versions competing</h2>
          <p>Without hreflang, Google may show your English page to Spanish users, or treat your regional variants as duplicate content. Hreflang annotations map every version to its audience so the right page wins the right query.</p>
          <p>The rules are strict but simple: every page lists <em>all</em> versions including itself, links are reciprocal, and codes are valid. This tool handles the syntax; just add your language/URL pairs and an x-default.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
