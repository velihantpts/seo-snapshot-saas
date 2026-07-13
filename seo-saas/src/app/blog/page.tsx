import type { Metadata } from 'next';
import { getBlogList } from '@/lib/blog';
import BlogExplorer from './BlogExplorer';

export const metadata: Metadata = {
  title: 'SEO Blog — Practical Guides & Fixes',
  description: "Practical, no-fluff guides to improve your website's SEO: meta tags, Core Web Vitals, security headers, structured data, and more.",
  alternates: { canonical: 'https://seosnapshot.dev/blog' },
};

// Revalidate so newly published posts appear without a redeploy.
export const revalidate = 60;

export default async function Blog() {
  const posts = await getBlogList();
  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SEO Snapshot Blog',
    url: 'https://seosnapshot.dev/blog',
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `https://seosnapshot.dev/blog/${p.slug}`,
      datePublished: p.date || undefined,
      dateModified: p.updated || p.date || undefined,
    })),
  };
  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <BlogExplorer posts={posts} />
    </div>
  );
}
