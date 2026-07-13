import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'Free Article Schema Generator (JSON-LD)',
  description: 'Generate Article structured data with headline, author, dates, and publisher as copy-paste JSON-LD. Help Google understand your content. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/article-schema-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is Article schema?', a: 'Article structured data describes a news story, blog post, or editorial page — its headline, author, publish and modified dates, and publisher. It helps Google understand authorship and freshness, and supports enhanced presentation in Google News and Discover.' },
  { q: 'Which date fields matter?', a: 'datePublished and dateModified. Keep dateModified accurate — updating it when you genuinely revise the article gives Google a legitimate freshness signal. Don’t bump it without real changes.' },
  { q: 'Do I need a publisher logo?', a: 'It is recommended. A publisher Organization with a logo helps Google attribute the content correctly. Use a clear, reasonably sized logo URL that stays stable over time.' },
  { q: 'Where do I put the code?', a: 'Paste it inside the <head> of the article it describes. The headline, author, and dates in the markup should match what is visible on the page.' },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">Article Schema Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Enter your article&apos;s headline, author, dates, and publisher to get valid Article JSON-LD. Copy it into the post&apos;s head.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Authorship and freshness, made explicit</h2>
          <p>Article schema won&apos;t rank a weak post, but it makes the signals Google cares about — who wrote this, when, and who published it — unambiguous. That matters most for time-sensitive content and for building the authorship trail that supports E-E-A-T.</p>
          <p>Keep the dates honest: update dateModified when you actually revise the piece, not on a schedule. Add a <Link href="/tools/breadcrumb-schema-generator" className="text-accent-400 hover:text-accent-300">breadcrumb</Link> block to the same page, and scan your live post from the <Link href="/" className="text-accent-400 hover:text-accent-300">homepage</Link> to catch anything else missing.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
