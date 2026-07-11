import type { Metadata } from 'next';
import Link from 'next/link';
import { Tag, FileCode, Braces, Share2, Search, Languages, ListTree, EyeOff, CornerUpRight, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free SEO Tools — Generators & Preview Checkers',
  description: 'Free SEO tools: Open Graph preview, SERP snippet preview, meta tag, schema, hreflang, sitemap, robots.txt & 301 redirect generators. No signup.',
  alternates: { canonical: 'https://seosnapshot.dev/tools' },
};

const tools = [
  { href: '/tools/open-graph-preview', icon: Share2, title: 'Open Graph Preview', desc: 'See how your link looks on Facebook, X, LinkedIn & Discord, then get the tags.' },
  { href: '/tools/serp-snippet-preview', icon: Search, title: 'SERP Snippet Preview', desc: 'Pixel-accurate Google preview — catch truncated titles & descriptions.' },
  { href: '/tools/meta-tag-generator', icon: Tag, title: 'Meta Tag Generator', desc: 'Title, description, Open Graph & Twitter Card tags with live length checks.' },
  { href: '/tools/schema-generator', icon: Braces, title: 'JSON-LD Schema Generator', desc: 'Structured data for Organization, LocalBusiness, Article, FAQ, Product, Event & more.' },
  { href: '/tools/hreflang-generator', icon: Languages, title: 'Hreflang Generator', desc: 'Multi-language & multi-region tags with x-default, done right.' },
  { href: '/tools/sitemap-generator', icon: ListTree, title: 'XML Sitemap Generator', desc: 'Paste your URLs, get a valid sitemap.xml — copy or download.' },
  { href: '/tools/robots-txt-generator', icon: FileCode, title: 'robots.txt Generator', desc: 'Control crawling with disallow rules, sitemap, and crawl-delay.' },
  { href: '/tools/robots-meta-generator', icon: EyeOff, title: 'Robots Meta Generator', desc: 'noindex, nofollow, canonical & X-Robots-Tag for a single page.' },
  { href: '/tools/redirect-generator', icon: CornerUpRight, title: '301 Redirect Generator', desc: '.htaccess & Nginx redirect rules from a list of old → new URLs.' },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Free SEO Tools</h1>
        <p className="text-white/40 text-sm mb-10">Fast, copy-paste generators. No signup, completely free.</p>
        <div className="space-y-4">
          {tools.map(tool => (
            <Link key={tool.href} href={tool.href} className="flex items-start gap-4 glass-card rounded-xl p-5 group hover:border-white/[0.1] transition-all duration-200">
              <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center flex-shrink-0">
                <tool.icon className="w-5 h-5 text-accent-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-medium text-white/90 group-hover:text-accent-400 transition-colors mb-1">{tool.title}</h2>
                <p className="text-sm text-white/40 leading-relaxed">{tool.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/25 mt-1 flex-shrink-0" />
            </Link>
          ))}
        </div>
        <div className="mt-10 glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">Want a full audit instead of a single tool?</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL — 100 checks free</Link>
        </div>
      </div>
    </div>
  );
}
