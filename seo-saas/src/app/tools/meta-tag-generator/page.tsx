import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Free Meta Tag Generator (Title, Description, OG, Twitter)',
  description: 'Generate SEO meta tags, Open Graph, and Twitter Card tags with live character counts. Copy-paste ready. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/meta-tag-generator' },
};

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
        <Link href="/tools" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">Meta Tag Generator</h1>
        <p className="text-white/40 text-sm mb-8 max-w-2xl">Create title, description, Open Graph, and Twitter Card tags with live length feedback. Paste them into your page&apos;s <code className="text-accent-300">&lt;head&gt;</code>.</p>
        <Client />
      </div>
    </div>
  );
}
