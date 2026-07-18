import type { Metadata } from 'next';
import Link from 'next/link';
import Client from '../redirect-generator/Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Vercel Redirects Generator — vercel.json Rules',
  description: 'Generate a valid vercel.json redirects array (301/308 or 302/307) from a list of old → new URLs. Copy-paste ready. Free, no signup, runs in your browser.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/vercel-redirects-generator' },
};

const faqs: FaqItem[] = [
  { q: 'Where do Vercel redirects go?', a: 'In a "redirects" array inside vercel.json at your project root. Vercel applies them at the edge before your app runs, so they are fast and work for static and serverless routes alike. Redeploy for changes to take effect.' },
  { q: 'What does "permanent" mean in vercel.json?', a: 'permanent: true sends a 308 (the modern permanent redirect, equivalent to a 301 for SEO — it passes ranking signal and preserves the request method). permanent: false sends a 307 (temporary). This tool sets it from your 301/302 choice.' },
  { q: 'Can I redirect with wildcards on Vercel?', a: 'Yes — Vercel supports path segments like "/blog/:slug" and wildcards like "/docs/:path*" in the source, mapping them into the destination. This tool builds exact one-to-one redirects; add dynamic segments by hand for pattern rules.' },
  { q: 'redirects vs rewrites on Vercel — what is the difference?', a: 'A redirect changes the URL in the browser and returns a 3xx status (use it for moved pages, SEO-safe). A rewrite keeps the URL the same and serves different content behind the scenes (use it for proxying). For SEO migrations you almost always want redirects.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vercel Redirects Generator',
    applicationCategory: 'SEO Tool',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <ToolHeader />
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Paste old → new URLs and get a valid <code className="text-accent-300">vercel.json</code> redirects array — with the right permanent/temporary flag. Runs entirely in your browser.</p>
        <Client only="vercel" />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Edge redirects without losing rankings</h2>
          <p>On Vercel, redirects live in <code className="text-accent-300">vercel.json</code> and run at the edge before your Next.js or static app renders. A permanent redirect (308) forwards both visitors and crawlers and carries the old URL&apos;s ranking signal to the new one — essential when you rename routes or migrate.</p>
          <p>Generate the array here and drop it into your config. On a different stack? Use the <Link href="/tools/netlify-redirects-generator" className="text-accent-400 hover:text-accent-300">Netlify</Link> or <Link href="/tools/cloudflare-redirect-rules-generator" className="text-accent-400 hover:text-accent-300">Cloudflare</Link> generator, or set a canonical with the <Link href="/tools/canonical-tag-generator" className="text-accent-400 hover:text-accent-300">canonical tag generator</Link>.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
