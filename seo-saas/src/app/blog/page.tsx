'use client';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const posts = [
  {
    slug: 'how-to-fix-missing-meta-description',
    title: 'How to Fix "Missing Meta Description" — The #1 SEO Issue',
    excerpt: 'Meta descriptions appear in Google search results. Missing them means Google picks random text from your page. Here\'s how to fix it in 2 minutes.',
    date: '2026-03-20',
    readTime: '3 min',
    category: 'Fixes',
  },
  {
    slug: 'what-is-a-good-seo-score',
    title: 'What Is a Good SEO Score? (And How to Improve Yours)',
    excerpt: 'SEO scores range from 0-100. Learn what score ranges mean, which checks matter most, and the fastest ways to improve your score.',
    date: '2026-03-19',
    readTime: '5 min',
    category: 'Guide',
  },
  {
    slug: 'structured-data-json-ld-guide',
    title: 'Structured Data (JSON-LD) Guide for Beginners',
    excerpt: 'Structured data helps Google understand your content and show rich snippets. Copy-paste ready JSON-LD templates for every page type.',
    date: '2026-03-18',
    readTime: '7 min',
    category: 'Guide',
  },
  {
    slug: 'how-to-improve-core-web-vitals',
    title: 'How to Improve Core Web Vitals: LCP, FID, CLS Explained',
    excerpt: 'Core Web Vitals directly impact Google rankings. Learn what LCP, FID/INP, and CLS measure, what good scores look like, and how to fix each one.',
    date: '2026-03-17',
    readTime: '8 min',
    category: 'Guide',
  },
  {
    slug: 'security-headers-for-seo',
    title: 'Security Headers Every Website Needs (HSTS, CSP, X-Frame)',
    excerpt: 'Security headers protect your site and improve trust signals. Learn which headers to add, how to configure them for Nginx, Apache, Next.js, and Vercel.',
    date: '2026-03-16',
    readTime: '6 min',
    category: 'Guide',
  },
  {
    slug: 'open-graph-meta-tags-guide',
    title: 'Open Graph Meta Tags: The Complete Guide for Social Sharing',
    excerpt: 'Control how your pages look when shared on Facebook, Twitter, LinkedIn. Learn all OG tags, ideal image sizes, and common mistakes to avoid.',
    date: '2026-03-15',
    readTime: '5 min',
    category: 'Guide',
  },
  {
    slug: 'fix-render-blocking-resources',
    title: 'How to Fix Render-Blocking Resources (CSS & JavaScript)',
    excerpt: 'Render-blocking resources slow down your page load. Learn to defer scripts, async-load CSS, and use resource hints for faster pages.',
    date: '2026-03-14',
    readTime: '6 min',
    category: 'Fixes',
  },
  {
    slug: 'robots-txt-guide',
    title: 'robots.txt Guide: Control How Search Engines Crawl Your Site',
    excerpt: 'A properly configured robots.txt saves crawl budget and prevents indexing of private pages. Templates for WordPress, Next.js, and static sites.',
    date: '2026-03-13',
    readTime: '5 min',
    category: 'Guide',
  },
  {
    slug: 'image-seo-optimization',
    title: 'Image SEO: Alt Text, Lazy Loading, WebP — The Complete Checklist',
    excerpt: 'Images can hurt or help your SEO. Learn to write good alt text, implement lazy loading, serve WebP/AVIF, and set proper dimensions.',
    date: '2026-03-12',
    readTime: '7 min',
    category: 'Guide',
  },
  {
    slug: 'canonical-url-explained',
    title: 'Canonical URLs Explained: Prevent Duplicate Content Issues',
    excerpt: 'Duplicate content confuses search engines. Learn what canonical URLs are, when to use them, and common mistakes that hurt your rankings.',
    date: '2026-03-11',
    readTime: '4 min',
    category: 'Fixes',
  },
  {
    slug: 'website-accessibility-seo-checklist',
    title: 'Web Accessibility & SEO: 15 Checks That Improve Both',
    excerpt: 'Accessibility and SEO overlap more than you think. Alt text, heading hierarchy, form labels, ARIA landmarks — fixes that help everyone.',
    date: '2026-03-10',
    readTime: '8 min',
    category: 'Guide',
  },
  {
    slug: 'sitemap-xml-guide',
    title: 'XML Sitemap Guide: How to Create and Submit to Google',
    excerpt: 'Sitemaps tell search engines which pages to crawl. Learn to generate sitemaps, submit to Google Search Console, and common pitfalls.',
    date: '2026-03-09',
    readTime: '5 min',
    category: 'Guide',
  },
  {
    slug: 'heading-hierarchy-seo',
    title: 'H1-H6 Heading Hierarchy: Why It Matters for SEO',
    excerpt: 'Proper heading structure helps Google understand your content. Learn the rules: one H1, logical nesting, keyword placement, and common mistakes.',
    date: '2026-03-08',
    readTime: '4 min',
    category: 'Fixes',
  },
];

export default function Blog() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-2">{t('blog.title')}</h1>
        <p className="text-white/40 text-sm mb-10">{t('blog.desc')}</p>

        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block glass-card rounded-xl p-5 sm:p-6 group hover:border-white/[0.1] transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400">{post.category}</span>
                <span className="text-xs text-white/25 flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="text-xs text-white/25 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
              <h2 className="text-base font-medium text-white/90 group-hover:text-accent-400 transition-colors duration-150 mb-2">{post.title}</h2>
              <p className="text-sm text-white/40 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Read more <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
