import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'Free Breadcrumb Schema Generator (BreadcrumbList JSON-LD)',
  description: 'Generate BreadcrumbList structured data from your page hierarchy as copy-paste JSON-LD. Get breadcrumb rich results in Google. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/breadcrumb-schema-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is breadcrumb schema?', a: 'BreadcrumbList structured data describes the path from your homepage to the current page. Google uses it to show a breadcrumb trail in place of the raw URL in search results, which reads more clearly and can improve click-through.' },
  { q: 'What order should the items be in?', a: 'Top of the hierarchy first (usually Home), ending with the current page. Each item gets a position number in that order — this generator numbers them automatically from top to bottom.' },
  { q: 'Should the last item link to itself?', a: 'It is fine to include the current page as the final item with its own URL. Google accepts both a linked and an unlinked final crumb; keeping the URL is the simplest, safe choice.' },
  { q: 'Where do I put the code?', a: 'Paste it inside the <head> of the page it describes. The breadcrumb in the markup should match a breadcrumb trail that is actually visible on the page.' },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">Breadcrumb Schema Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Add each level of your page hierarchy and get valid BreadcrumbList JSON-LD, numbered in order. Copy it into the page&apos;s head.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">A cleaner-looking result, for free</h2>
          <p>Breadcrumbs are one of the lowest-effort structured-data wins. Google swaps your long URL for a readable trail like Home › Blog › This Article, which looks more trustworthy in the results and reinforces your site structure. There&apos;s no downside as long as the trail matches your real navigation.</p>
          <p>Pair it with an <Link href="/tools/article-schema-generator" className="text-accent-400 hover:text-accent-300">Article</Link> or <Link href="/tools/product-schema-generator" className="text-accent-400 hover:text-accent-300">Product</Link> block on the same page, and confirm both with Google&apos;s Rich Results Test before shipping.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
