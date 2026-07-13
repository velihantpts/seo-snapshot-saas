import { MetadataRoute } from 'next';
import { getBlogList } from '@/lib/blog';
import { GLOSSARY } from '@/lib/glossary';
import { CHECKS } from '@/lib/checks-catalog';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://seosnapshot.dev';

  // Stable lastmod for core/static routes. A constant (not `new Date()`) so
  // Google sees a real change signal only when we bump it, instead of "now"
  // on every regeneration (which crawlers learn to ignore).
  const SITE_UPDATED = new Date('2026-07-11');

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: SITE_UPDATED, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/pricing`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/compare`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: SITE_UPDATED, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/tools`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/tools/security-header-checker`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/http-header-checker`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/keyword-density-checker`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/utm-builder`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/title-meta-length-checker`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/robots-txt-tester`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/readability-checker`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/meta-tag-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/robots-txt-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/schema-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/localbusiness-schema-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/faq-schema-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/product-schema-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/breadcrumb-schema-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/article-schema-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/event-schema-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/open-graph-preview`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/og-image-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/slug-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/canonical-tag-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/serp-snippet-preview`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/hreflang-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/sitemap-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/robots-meta-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/tools/redirect-generator`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/docs`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/glossary`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/checks`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/badge`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/vs/google-lighthouse`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/methodology`, lastModified: SITE_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, lastModified: SITE_UPDATED, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy`, lastModified: SITE_UPDATED, changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Blog posts (static library + DB-published)
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogList();
    blogRoutes = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      // Prefer the real last-updated date so edits give Google a recrawl
      // signal; fall back to the publish date, then to now.
      lastModified: p.updated
        ? new Date(p.updated)
        : p.date
          ? new Date(p.date)
          : new Date(),
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

  // Programmatic reference pages (glossary terms + SEO checks)
  const glossaryRoutes: MetadataRoute.Sitemap = GLOSSARY.map((t) => ({
    url: `${base}/glossary/${t.slug}`,
    lastModified: SITE_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));
  const checkRoutes: MetadataRoute.Sitemap = CHECKS.map((c) => ({
    url: `${base}/checks/${c.slug}`,
    lastModified: SITE_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...reportRoutes, ...glossaryRoutes, ...checkRoutes];
}
