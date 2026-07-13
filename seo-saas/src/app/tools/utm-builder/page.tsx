import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free UTM Builder — Campaign URL Generator (GA4, Meta, Ads)',
  description: 'Build UTM-tagged campaign URLs for Google Analytics 4, Meta/Facebook, Google Ads, and email. Presets, live output, one-click copy. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/utm-builder' },
};

const faqs: FaqItem[] = [
  { q: 'What are UTM parameters?', a: 'UTM parameters are tags you add to a link (utm_source, utm_medium, utm_campaign, and optionally utm_term and utm_content) so your analytics can attribute the visit to a specific campaign. GA4, for example, reads them automatically to populate its Traffic Acquisition reports.' },
  { q: 'Which UTM parameters are required?', a: 'utm_source, utm_medium, and utm_campaign are the three that matter. utm_term and utm_content are optional — term is typically for paid keywords, content for distinguishing two links in the same campaign (e.g. a logo vs a text link).' },
  { q: 'Why does the tool lowercase everything?', a: 'Analytics tools treat utm_source=Facebook and utm_source=facebook as two different sources, which splits your data. Lowercasing and replacing spaces with underscores keeps every campaign consistent so your reports stay clean.' },
  { q: 'Do UTM tags hurt SEO?', a: 'They can create duplicate URLs of the same page, which is why you should only ever put UTM links in ads, emails, and social posts — never in internal links on your own site. A self-referencing canonical tag on the page protects you if a tagged URL does get indexed.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'UTM Campaign URL Builder',
    applicationCategory: 'Marketing Tool',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <ToolHeader />
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Add trackable UTM tags to any link so Google Analytics, Meta, and your other tools can tell where each visitor came from. Pick a preset, fill the fields, copy the URL.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Consistent tags, clean reports</h2>
          <p>The value of UTM tags comes entirely from consistency. If half your team writes <span className="font-mono text-white/60">medium=paid_social</span> and the other half writes <span className="font-mono text-white/60">paidsocial</span>, your analytics splits one campaign into two and the numbers stop meaning anything. This builder enforces one convention — lowercase, underscores — so every link you generate lines up.</p>
          <p>One rule worth repeating: only ever use tagged URLs in outbound places — ads, emails, social posts. Never link between your own pages with UTM tags. Internal UTM links overwrite the original attribution and create duplicate URLs that can leak into Google&apos;s index.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
