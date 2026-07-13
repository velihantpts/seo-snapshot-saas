import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free LocalBusiness Schema Generator (JSON-LD)',
  description: 'Generate LocalBusiness structured data — name, address, phone, hours, price range — as copy-paste JSON-LD. Help Google understand your local business. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/localbusiness-schema-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is LocalBusiness schema?', a: 'It is structured data that tells search engines the key facts about a physical business — name, address, phone, opening hours, and price range. It helps Google connect your site to your business entity and can support your presence in local search and the knowledge panel.' },
  { q: 'Which business type should I pick?', a: 'Use the most specific type that fits. If you are a restaurant, use Restaurant; a shop, use Store. When nothing specific matches, the general LocalBusiness type is a safe default. More specific types unlock more relevant properties.' },
  { q: 'Does this replace my Google Business Profile?', a: 'No. Your Google Business Profile is the primary source for local listings. LocalBusiness schema on your website reinforces the same facts and helps Google match your site to that profile — they work together, they are not substitutes.' },
  { q: 'Where do I put the code?', a: 'Paste it inside the <head> of your homepage or contact page — wherever your business details live. Use one LocalBusiness block per physical location, and keep the details identical to your Google Business Profile and other citations.' },
];

export default function Page() {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'LocalBusiness Schema Generator', applicationCategory: 'SEO Tool', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">LocalBusiness Schema Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Fill in your business details and get clean LocalBusiness JSON-LD to paste into your site. Helps Google understand who you are, where you are, and when you&apos;re open.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Consistency is the whole game for local</h2>
          <p>Local search runs on matching. Google is constantly cross-checking your name, address, and phone number across your site, your Google Business Profile, and directories. LocalBusiness schema is your site&apos;s clean, machine-readable statement of those facts — so make it match everywhere else exactly, down to the abbreviation of the street type.</p>
          <p>Need other structured data too? Build <Link href="/tools/faq-schema-generator" className="text-accent-400 hover:text-accent-300">FAQ</Link>, <Link href="/tools/breadcrumb-schema-generator" className="text-accent-400 hover:text-accent-300">breadcrumb</Link>, or <Link href="/tools/product-schema-generator" className="text-accent-400 hover:text-accent-300">product</Link> schema, or run a full scan from the <Link href="/" className="text-accent-400 hover:text-accent-300">homepage</Link> to see what your live pages are missing.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
