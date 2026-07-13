import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free HTTP Header Checker — View Response Headers & Redirects',
  description: 'Check any URL’s HTTP response headers, status code, and full redirect chain. See content-type, cache-control, x-robots-tag and more. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/http-header-checker' },
};

const faqs: FaqItem[] = [
  { q: 'What does an HTTP header checker show?', a: 'It fetches a URL and shows the server’s response: the status code, the full redirect chain if any, and every response header — content-type, cache-control, content-encoding, x-robots-tag, last-modified, server, and the rest. It’s how you see what a browser or crawler actually receives.' },
  { q: 'Which headers matter for SEO?', a: 'X-Robots-Tag can noindex a page at the header level (easy to miss), Content-Type must be correct for the page to render, Cache-Control and Content-Encoding affect speed, and the Link header can carry canonical or preload hints. Redirect status codes (301 vs 302) matter for how ranking signals pass.' },
  { q: 'Why does the redirect chain matter?', a: 'Every extra hop adds latency and can dilute or drop signals — and a chain that mixes 302s where 301s belong, or loops back on itself, is a real SEO problem. Seeing the full chain with each status code is the fastest way to catch it.' },
  { q: 'Does it follow redirects?', a: 'Yes — it follows up to 10 hops and shows each one with its status code and destination, then lists the headers of the final response. Every hop is re-checked so it never fetches an unsafe internal address.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'HTTP Header Checker',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <ToolHeader />
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Enter a URL to see its status code, full redirect chain, and every response header — exactly what a browser or search crawler receives from the server.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">What the server really sends</h2>
          <p>Response headers are the layer most SEO problems hide in. A page can look perfect in the browser while an <span className="font-mono text-white/60">X-Robots-Tag: noindex</span> quietly keeps it out of Google, or a chain of 302s bleeds ranking signals on every hop. None of that shows up on the page — only in the headers.</p>
          <p>This checker lays them out plainly, highlighting the ones that matter for SEO and speed. To grade just the security headers with fix code, use the <Link href="/tools/security-header-checker" className="text-accent-400 hover:text-accent-300">security header checker</Link>; to audit everything at once, run the full scan from the <Link href="/" className="text-accent-400 hover:text-accent-300">homepage</Link>.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
