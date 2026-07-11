import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getBlogPost, getBlogList, renderMarkdown } from '@/lib/blog';

export const revalidate = 60;

const SITE = 'https://seosnapshot.dev';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: 'Article not found' };
  const description = post.excerpt || `${post.title} — a practical SEO guide from SEO Snapshot.`;
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: post.title, description, url },
    twitter: { card: 'summary_large_image', title: post.title, description },
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  const html = renderMarkdown(post.content);
  const related = (await getBlogList()).filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = `${SITE}/blog/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'SEO Snapshot' },
    publisher: { '@type': 'Organization', name: 'SEO Snapshot', url: SITE },
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/blog" className="flex items-center gap-2 text-white/60 hover:text-white/70 transition text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-8 text-white/90">{post.title}</h1>

        <article className="blog-content" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="mt-12 glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">Check your site&apos;s SEO score for free</p>
          <Link href="/" className="btn-primary text-sm">Analyze your site</Link>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-medium text-white/50 mb-4">Related articles</h2>
            <div className="space-y-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`}
                  className="flex items-center justify-between gap-3 glass-card rounded-lg px-4 py-3 group hover:border-white/[0.1] transition">
                  <span className="text-sm text-white/70 group-hover:text-accent-400 transition-colors">{r.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
