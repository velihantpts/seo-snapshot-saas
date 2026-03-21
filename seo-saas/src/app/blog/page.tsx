'use client';
import Link from 'next/link';
import { useLocale } from '@/lib/i18n';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

  const { t } = useLocale();
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
];

export default function Blog() {
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
