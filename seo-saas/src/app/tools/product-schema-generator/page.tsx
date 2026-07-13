import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, ToolCta, type FaqItem } from '../_components/ToolFaq';

export const metadata: Metadata = {
  title: 'Free Product Schema Generator (JSON-LD)',
  description: 'Generate Product structured data with price, availability, brand, and ratings as copy-paste JSON-LD. Support merchant listings and rich results. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/product-schema-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is Product schema?', a: 'Product structured data describes an item you sell — name, image, description, brand, price, availability, and optionally ratings. It helps Google show price and availability in search and Shopping surfaces.' },
  { q: 'What fields are required?', a: 'For a basic valid Product you need a name. To qualify for price-related enhancements you also need an offer with price, priceCurrency, and availability. Image and description are strongly recommended.' },
  { q: 'Can I add review stars?', a: 'Only if genuine reviews exist and are visible on the page. Google prohibits self-serving or fabricated aggregateRating markup, and it can trigger a manual action. Fill the rating fields only when the reviews are real and on-page.' },
  { q: 'Where do I put the code?', a: 'Paste it inside the <head> of the individual product page it describes. Use one Product block per product page, with details that match the visible content.' },
];

export default function Page() {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Product Schema Generator', applicationCategory: 'SEO Tool', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">Product Schema Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Enter your product details and get valid Product JSON-LD with an offer and optional rating. Copy it straight into the product page.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Accurate markup, not wishful markup</h2>
          <p>Product schema is powerful because Google can surface price and stock right in the results — but that power comes with scrutiny. Price, availability, and especially ratings must reflect what&apos;s truly on the page. The fastest way to lose rich results (or earn a manual action) is markup that claims a 4.9 rating the page can&apos;t back up.</p>
          <p>Fill only the fields you can honestly support, validate with Google&apos;s Rich Results Test, and keep the markup in sync when prices change. Need structured data for other page types? Try the <Link href="/tools/breadcrumb-schema-generator" className="text-accent-400 hover:text-accent-300">breadcrumb</Link> or <Link href="/tools/localbusiness-schema-generator" className="text-accent-400 hover:text-accent-300">LocalBusiness</Link> generators.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolCta />
      </div>
    </div>
  );
}
