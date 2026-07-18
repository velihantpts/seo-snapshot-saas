import type { Metadata } from 'next';
import Link from 'next/link';
import Client from '../redirect-generator/Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Cloudflare Redirect Rules Generator — _redirects & Bulk',
  description: 'Generate Cloudflare redirect rules (301/302) from old → new URLs — as a Cloudflare Pages _redirects file or a starting point for Bulk Redirects. Free, no signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/cloudflare-redirect-rules-generator' },
};

const faqs: FaqItem[] = [
  { q: 'Cloudflare Pages vs a normal Cloudflare domain — which redirect method?', a: 'On Cloudflare Pages, use a _redirects file in your build output (same syntax this tool outputs). On a normal proxied domain, redirects live in the dashboard as Single Redirects, Bulk Redirects, or a Redirect Rule — you can use the generated source/destination pairs as your import list.' },
  { q: 'What is the difference between a Redirect Rule and a Bulk Redirect?', a: 'A Redirect Rule (single) is for one pattern, configured with an expression. Bulk Redirects handle large one-to-one lists (thousands of URLs) uploaded as a list — the right choice for a site migration. Both do server-side 301/302 at Cloudflare\'s edge, before the request reaches your origin.' },
  { q: 'Do Cloudflare redirects help SEO?', a: 'Yes. A 301 at the edge forwards visitors and crawlers and passes ranking signal to the new URL, and it responds fast because it never hits your origin. Prefer 301 for permanent moves; reserve 302 for temporary ones.' },
  { q: 'Why is my Cloudflare redirect not working?', a: 'Common causes: the rule order (rules evaluate top-down, first match wins), a page rule and a redirect rule conflicting, "preserve query string" not set when you need it, or a cached response — purge the cache after changing rules.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Cloudflare Redirect Rules Generator',
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
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Paste old → new URLs and get Cloudflare redirect rules — as a Cloudflare Pages <code className="text-accent-300">_redirects</code> file, or a clean source/destination list to import as Bulk Redirects. Runs in your browser.</p>
        <Client only="cloudflare" />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Edge redirects that keep your rankings</h2>
          <p>Cloudflare applies redirects at its edge, before the request reaches your origin — so a <strong>301</strong> is both fast and SEO-safe, forwarding visitors and crawlers and passing the old URL&apos;s ranking signal to the new one. On Pages, the <code className="text-accent-300">_redirects</code> file is all you need; on a proxied domain, use these pairs to seed a Bulk Redirect list.</p>
          <p>Different stack? Use the <Link href="/tools/netlify-redirects-generator" className="text-accent-400 hover:text-accent-300">Netlify</Link> or <Link href="/tools/vercel-redirects-generator" className="text-accent-400 hover:text-accent-300">Vercel</Link> generator, or the general <Link href="/tools/redirect-generator" className="text-accent-400 hover:text-accent-300">Apache / Nginx redirect generator</Link>.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
