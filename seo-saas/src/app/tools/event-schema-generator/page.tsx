import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Client from './Client';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free Event Schema Generator (JSON-LD)',
  description: 'Generate Event structured data — name, dates, location, tickets — as copy-paste JSON-LD for event rich results in Google. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/event-schema-generator' },
};

const faqs: FaqItem[] = [
  { q: 'What is Event schema?', a: 'Event structured data describes something happening at a specific time and place — a concert, webinar, conference, or sale. Google can show it with the date, location, and ticket info directly in search and in event experiences.' },
  { q: 'How do I mark up an online event?', a: 'Set the location to a Place named for the platform (or use the address field for "Online"). For strict compliance, Google also supports a VirtualLocation type with the event URL; this generator keeps it simple with a named location you can label "Online".' },
  { q: 'What date format should I use?', a: 'ISO 8601, which the date-time pickers here produce. Always include the start; add the end when known. Accurate dates are required for the event to be eligible for rich results.' },
  { q: 'Where do I put the code?', a: 'Paste it inside the <head> of the page describing that specific event. Use one Event block per event, and keep the details matching the visible page.' },
];

export default function Page() {
  const jsonLd = { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Event Schema Generator', applicationCategory: 'SEO Tool', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/tools" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> All tools
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-2">Event Schema Generator</h1>
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Enter your event&apos;s name, dates, location, and ticket details to get valid Event JSON-LD. Copy it into the event page&apos;s head.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Get the date and place in front of people</h2>
          <p>Event markup is one of the few schema types where the payoff is still very visible: Google can surface your event&apos;s date, location, and ticket link directly, and pull it into dedicated event experiences. The requirements are strict, though — a valid start date and a real location are the minimum.</p>
          <p>Keep the markup in sync if a date or venue changes, and validate with Google&apos;s Rich Results Test before publishing. Running a webinar landing page? Add an <Link href="/tools/article-schema-generator" className="text-accent-400 hover:text-accent-300">Article</Link> or <Link href="/tools/faq-schema-generator" className="text-accent-400 hover:text-accent-300">FAQ</Link> block alongside it.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
