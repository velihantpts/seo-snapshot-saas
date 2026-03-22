import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://seosnapshot.dev';

  const blogSlugs = [
    'how-to-fix-missing-meta-description',
    'what-is-a-good-seo-score',
    'structured-data-json-ld-guide',
    'how-to-improve-core-web-vitals',
    'security-headers-for-seo',
    'open-graph-meta-tags-guide',
    'fix-render-blocking-resources',
    'robots-txt-guide',
    'image-seo-optimization',
    'canonical-url-explained',
    'website-accessibility-seo-checklist',
    'sitemap-xml-guide',
    'heading-hierarchy-seo',
    'free-seo-audit-tool-2026',
    'seo-checklist-for-developers',
    'eeat-seo-guide',
    'nginx-security-headers-guide',
    'how-to-improve-lighthouse-score',
    'meta-description-length-2026',
    'website-security-check-guide',
    'technical-seo-audit-complete-guide',
    'how-to-add-structured-data-json-ld',
    'hreflang-tags-complete-guide',
    'fix-render-blocking-resources-nextjs',
    'open-graph-image-size-2026',
    'seo-score-checker-free',
    'content-depth-seo-guide',
    'website-speed-optimization-guide',
    'keyword-cannibalization-fix',
  ];

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/compare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    ...blogSlugs.map(slug => ({
      url: `${base}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];
}
