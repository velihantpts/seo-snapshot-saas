import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free FAQ Schema Generator (FAQPage JSON-LD)',
  description: 'Turn your questions and answers into valid FAQPage JSON-LD structured data. Copy-paste ready, live output, no signup. Free FAQ schema markup generator.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/faq-schema-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is FAQ schema?', a: 'FAQPage structured data marks up a list of questions and their answers so search engines can read them in a machine-readable format. It is one of the most common schema types because almost any page can carry a short FAQ.' },
  { q: 'Will FAQ schema still show rich results in Google?', a: 'Be aware: in 2023 Google restricted FAQ rich results to well-known, authoritative government and health sites. For most sites the FAQ snippet no longer appears in search. The markup is still valid and useful — it helps machines and assistants parse your content — but do not add it expecting the old expandable rich result.' },
  { q: 'What are the rules for FAQ schema?', a: 'The questions and answers must be visible on the page (not hidden), the content must genuinely be an FAQ, and it should not be promotional or advertising. One FAQPage block per page.' },
  { q: 'Where do I put the code?', a: 'Paste it inside the <head> of the page whose visible content matches these exact questions and answers. Keep the markup and the on-page text in sync.' },
];

export default function Page() {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'FAQ Schema Generator', applicationCategory: 'SEO Tool', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <ToolHeader />
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Add your questions and answers and get valid FAQPage JSON-LD to paste into your page. The markup updates live as you type.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Still worth adding — with realistic expectations</h2>
          <p>Since Google narrowed FAQ rich results to authoritative sites in 2023, the visible SERP snippet is gone for most pages. So why still mark up your FAQ? Because structured data isn&apos;t only for rich results: it helps search engines and AI assistants understand and quote your answers, and it future-proofs the content if the treatment changes again.</p>
          <p>The one rule that hasn&apos;t changed: the questions and answers in your markup must match what a visitor actually sees on the page. Generating markup for hidden or invented Q&amp;A is a guidelines violation. Building an article instead? The <Link href="/tools/article-schema-generator" className="text-accent-400 hover:text-accent-300">article schema generator</Link> is next door.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
