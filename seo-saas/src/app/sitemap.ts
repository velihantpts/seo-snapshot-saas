import { MetadataRoute } from 'next';
import { getBlogList } from '@/lib/blog';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://seosnapshot.dev';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/meta-tag-generator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/robots-txt-generator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/schema-generator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/badge`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/vs/google-lighthouse`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/methodology`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Blog posts (static library + DB-published)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogList();
    blogRoutes = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // ignore — DB may be unavailable at build time
  }

  // Public report pages (indexable programmatic content)
  let reportRoutes: MetadataRoute.Sitemap = [];
  try {
    const analyses = await prisma.analysis.findMany({
      where: { public: true },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });
    reportRoutes = analyses.map((a) => ({
      url: `${base}/report/${a.id}`,
      lastModified: a.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  } catch {
    // ignore
  }

  return [...staticRoutes, ...blogRoutes, ...reportRoutes];
}
