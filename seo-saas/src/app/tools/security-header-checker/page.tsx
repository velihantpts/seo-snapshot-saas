import type { Metadata } from 'next';
import Link from 'next/link';
import Client from './Client';
import { ToolHeader } from '../_components/ToolHeader';
import { ToolFaq, type FaqItem } from '../_components/ToolFaq';
import { ToolFooter } from '../_components/ToolFooter';

export const metadata: Metadata = {
  title: 'Free Security Header Checker (Grade A+ to F)',
  description: 'Check a URL for HSTS, CSP, X-Frame-Options, and other security headers. Get a grade A+ to F and copy-paste nginx fixes for what’s missing. Free.',
  alternates: { canonical: 'https://seosnapshot.dev/tools/security-header-checker' },
};

const faqs: FaqItem[] = [
  { q: 'Which security headers matter most?', a: 'Strict-Transport-Security (HSTS) and Content-Security-Policy (CSP) carry the most weight — HSTS enforces HTTPS and CSP is the main defense against cross-site scripting. X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy round out a solid baseline.' },
  { q: 'How is the grade calculated?', a: 'Points are weighted toward the highest-impact protections: HTTPS and a long HSTS max-age, a CSP without unsafe-inline/eval, then the remaining headers. It uses the same weighting as our full site analyzer, so the grades line up. A+ means a hardened setup; F means the HTTPS baseline is missing.' },
  { q: 'Do security headers affect SEO?', a: 'Indirectly. HTTPS (which HSTS enforces) is a confirmed Google ranking signal, and browsers flag non-HTTPS pages as "Not Secure", which scares off users. The other headers do not move rankings directly but reflect a well-maintained, trustworthy site.' },
  { q: 'I added a header but it still shows missing — why?', a: 'Common causes: the header is set only on some routes, a proxy or CDN strips it, or (on nginx) an inner location block dropped inherited headers because it defines its own. Also make sure you added the "always" flag so headers are sent on error responses too.' },
];

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Security Header Checker',
    applicationCategory: 'SEO Tool',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <ToolHeader />
        <p className="text-white/60 text-sm mb-8 max-w-2xl">Enter a URL to see which HTTP security headers it sends, get a grade from A+ to F, and copy the exact nginx config to fix whatever&apos;s missing.</p>
        <Client />

        <section className="mt-14 max-w-2xl space-y-4 text-sm text-white/50 leading-relaxed">
          <h2 className="text-lg font-medium tracking-tight text-white/90">A few headers, a big difference</h2>
          <p>Security headers are among the highest-leverage changes you can make to a site: a handful of one-line directives that block entire classes of attack — protocol downgrades, clickjacking, MIME sniffing, cross-site scripting. Most sites are missing several, not because they&apos;re hard, but because nobody checked.</p>
          <p>This checker reads the live response and hands you the config to close the gaps. Once your headers are set, run a full scan from the <Link href="/" className="text-accent-400 hover:text-accent-300">homepage</Link> to catch cookies, mixed content, and the other 100 checks — and read the <Link href="/blog/security-headers-for-seo" className="text-accent-400 hover:text-accent-300">security headers guide</Link> for the reasoning behind each one.</p>
        </section>

        <ToolFaq items={faqs} />
        <ToolFooter />
      </div>
    </div>
  );
}
