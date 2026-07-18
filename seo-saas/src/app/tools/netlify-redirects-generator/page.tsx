import type { Metadata } from 'next';
import Link from 'next/link';
import Client from '../redirect-generator/Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Netlify Redirects Generator — _redirects File Rules',
  description: 'Turn old → new URLs into Netlify _redirects rules (301/302) you can paste straight into your publish directory. Free, no signup, runs in your browser.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/netlify-redirects-generator' },
};

const faqs: FaqItem[] = [
  { q: 'Where does the _redirects file go on Netlify?', a: 'In your publish directory — the folder Netlify deploys (often "dist", "build", or "public"). Netlify reads a plain file named _redirects (no extension). You can also put the same rules under a [[redirects]] block in netlify.toml at the repo root.' },
  { q: 'What do the columns mean?', a: 'Each line is: source path, then destination, then status code. "/old  /new  301" permanently redirects /old to /new. Use 301 for permanent moves (passes ranking signal) and 302 for temporary ones.' },
  { q: 'Do Netlify redirects support wildcards and placeholders?', a: 'Yes. /blog/* /news/:splat 301 forwards everything under /blog to the matching path under /news. This tool generates exact one-to-one rules; add splats or :placeholders by hand for pattern redirects.' },
  { q: 'Why is my Netlify redirect not working?', a: 'The usual causes: the _redirects file is not in the publish directory, an earlier rule already matched (rules apply top to bottom, first match wins), or a trailing-slash mismatch. Netlify also treats a rule to an external URL as a proxy unless the status forces a redirect.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Netlify Redirects Generator',
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
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Paste a list of old → new URLs and get clean Netlify <code className="text-accent-300">_redirects</code> rules, ready to drop into your publish directory. Runs entirely in your browser.</p>
        <Client only="netlify" />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">Netlify _redirects, done right</h2>
          <p>When you rename a page or restructure a site on Netlify, a <strong>301 redirect</strong> forwards visitors and search engines to the new URL and carries the old page&apos;s ranking equity with it. The <code className="text-accent-300">_redirects</code> file is the simplest way to declare them — one rule per line, first match wins.</p>
          <p>Generate the rules here, then double-check nothing points into a redirect chain. Need a different host? Try the <Link href="/tools/vercel-redirects-generator" className="text-accent-400 hover:text-accent-300">Vercel</Link> or <Link href="/tools/cloudflare-redirect-rules-generator" className="text-accent-400 hover:text-accent-300">Cloudflare</Link> version, or the general <Link href="/tools/redirect-generator" className="text-accent-400 hover:text-accent-300">Apache / Nginx redirect generator</Link>.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
