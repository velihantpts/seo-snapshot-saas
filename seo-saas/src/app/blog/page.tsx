import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { getBlogList } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'SEO Blog — Practical Guides & Fixes',
  description: "Practical, no-fluff guides to improve your website's SEO: meta tags, Core Web Vitals, security headers, structured data, and more.",
  alternates: { canonical: 'https://seosnapshot.dev/blog' },
};

// Revalidate so newly published posts appear without a redeploy.
export const revalidate = 60;

export default async function Blog() {
  const posts = await getBlogList();

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-medium tracking-tight mb-2">SEO Blog</h1>
        <p className="text-white/60 text-sm mb-10">Practical guides to improve your website&apos;s SEO. No fluff.</p>

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
              <p className="text-sm text-white/60 leading-relaxed">{post.excerpt}</p>
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
