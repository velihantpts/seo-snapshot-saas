import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Free JSON-LD Schema Generator (Organization, Article, FAQ, Product)',
  description: 'Generate valid JSON-LD structured data for Organization, WebSite, Article, Product, and FAQ. Copy-paste ready for rich results. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/schema-generator' },
};

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
        <Link href="/tools" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">JSON-LD Schema Generator</h1>
        <p className="text-white/40 text-sm mb-8 max-w-2xl">Generate structured data to unlock rich results in Google. Pick a type, fill the fields, and paste the JSON-LD into your page.</p>
        <Client />
      </div>
    </div>
  );
}
