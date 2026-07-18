// Orphaned Turkish blog posts left in the DB from the old multilingual build.
// The site is English-only now, so these read as mixed-language, near-duplicate
// content and sat in Search Console as "Crawled - currently not indexed",
// wasting crawl budget and blurring the site's language/topic focus.
//
// We 301 each to its English equivalent (next.config.js redirects — keep that
// list in sync with this one) and filter them out of listings/sitemap via
// RETIRED_POST_SLUGS below.
export const RETIRED_POST_REDIRECTS: { from: string; to: string }[] = [
  { from: 'canonical-url-nedir', to: 'canonical-url-explained' },
  { from: 'core-web-vitals-nedir', to: 'how-to-improve-core-web-vitals' },
  { from: 'meta-aciklama-nasil-yazilir', to: 'how-to-fix-missing-meta-description' },
  { from: 'robots-txt-nedir-nasil-olusturulur', to: 'robots-txt-guide' },
  { from: 'seo-skoru-nedir-nasil-yukseltilir', to: 'what-is-a-good-seo-score' },
  { from: 'sitemap-nedir-google-nasil-gonderilir', to: 'sitemap-xml-guide' },
];

export const RETIRED_POST_SLUGS = new Set(RETIRED_POST_REDIRECTS.map((r) => r.from));
