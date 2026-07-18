// Curated cross-links: article slug -> the free tools that directly act on that
// topic. Gives high-intent article bodies keyword-anchored internal links down
// to the matching /tools pages, concentrating authority inside each topic
// cluster (a title-tags guide -> the title/SERP tools, etc.). Unknown or
// mistyped tool slugs are dropped by the toolBySlug lookup, so a bad entry can
// never render a dead link (see catalog-integrity.test.ts for the guard).
import { toolBySlug, type ToolDef } from './tools-catalog';

export const ARTICLE_TOOL_MAP: Record<string, string[]> = {
  'how-to-write-seo-title-tags': ['title-meta-length-checker', 'serp-snippet-preview'],
  'how-to-fix-missing-meta-description': ['meta-tag-generator', 'title-meta-length-checker'],
  'open-graph-image-size-2026': ['og-image-generator', 'open-graph-preview'],
  'open-graph-meta-tags-guide': ['open-graph-preview', 'meta-tag-generator', 'og-image-generator'],
  'canonical-url-nextjs': ['canonical-tag-generator'],
  'canonical-url-explained': ['canonical-tag-generator'],
  'fix-duplicate-without-user-selected-canonical': ['canonical-tag-generator'],
  'robots-txt-guide': ['robots-txt-generator', 'robots-txt-tester'],
  'structured-data-json-ld-guide': ['schema-generator', 'faq-schema-generator'],
  'sitemap-xml-guide': ['sitemap-generator'],
  'add-sitemap-nextjs': ['sitemap-generator'],
  'security-headers-for-seo': ['security-header-checker', 'http-header-checker'],
  'image-seo-optimization': ['og-image-generator'],
  'fix-either-offers-review-or-aggregaterating': ['product-schema-generator', 'schema-generator'],
  'fix-missing-field-image-structured-data': ['schema-generator', 'article-schema-generator'],
  'fix-indexed-though-blocked-by-robots-txt': ['robots-txt-tester', 'robots-meta-generator', 'robots-txt-generator'],
  '308-vs-301-redirect-seo': ['redirect-generator', 'vercel-redirects-generator', 'netlify-redirects-generator'],
  'astro-sitemap-not-working': ['sitemap-generator', 'robots-txt-generator'],
  'nuxt-hreflang-i18n': ['hreflang-generator'],
  'framer-canonical-url': ['canonical-tag-generator'],
  'remove-page-from-google-410-vs-301-vs-noindex': ['redirect-generator', 'robots-meta-generator', 'robots-txt-tester'],
  'redirect-chains-what-they-are-and-how-to-fix': ['http-header-checker', 'redirect-generator'],
  'schema-type-to-rich-result-map': ['schema-generator', 'product-schema-generator'],
  'how-googlebot-crawls-renders-indexes': ['robots-txt-tester', 'robots-meta-generator'],
  'how-rel-canonical-works': ['canonical-tag-generator'],
};

export function toolsForArticle(slug: string): ToolDef[] {
  return (ARTICLE_TOOL_MAP[slug] ?? [])
    .map((s) => toolBySlug.get(s))
    .filter((t): t is ToolDef => Boolean(t));
}
