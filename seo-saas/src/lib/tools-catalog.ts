import {
  Tag, FileCode, Braces, Share2, Search, Languages, ListTree, EyeOff, CornerUpRight,
  Hash, Link2, Ruler, Bot, BookOpen, MapPin, HelpCircle, ShoppingBag, ChevronRight,
  Newspaper, Calendar, ShieldCheck, Server, Scissors, Anchor, Image as ImageIcon,
  type LucideIcon,
} from 'lucide-react';

export type ToolCategory = 'analyze' | 'generate' | 'schema';

export interface ToolDef {
  slug: string;
  title: string;
  short: string;
  category: ToolCategory;
  icon: LucideIcon;
  keywords: string;
  backend?: boolean; // hits our API (server-side)
}

export const TOOL_CATEGORIES: { key: ToolCategory; label: string; blurb: string }[] = [
  { key: 'analyze', label: 'Analyze & Preview', blurb: 'Inspect a live URL or your content and see exactly what search engines and social platforms get.' },
  { key: 'generate', label: 'Generate & Build', blurb: 'Produce clean, copy-paste-ready tags, files, and links in seconds.' },
  { key: 'schema', label: 'Structured Data', blurb: 'Build valid JSON-LD for every schema type Google supports.' },
];

export const TOOLS: ToolDef[] = [
  // ---- Analyze & Preview ----
  { slug: 'security-header-checker', title: 'Security Header Checker', short: 'Grade any URL A+ to F on HSTS, CSP & more, with copy-paste nginx fixes.', category: 'analyze', icon: ShieldCheck, keywords: 'security headers hsts csp x-frame grade audit', backend: true },
  { slug: 'http-header-checker', title: 'HTTP Header Checker', short: 'See status, redirect chain & every response header a crawler receives.', category: 'analyze', icon: Server, keywords: 'http headers response redirect status content-type cache', backend: true },
  { slug: 'robots-txt-tester', title: 'robots.txt Tester', short: 'Check if any URL is allowed or blocked, using Google’s matching rules.', category: 'analyze', icon: Bot, keywords: 'robots txt tester allow disallow crawl block googlebot' },
  { slug: 'keyword-density-checker', title: 'Keyword Density Checker', short: 'Word count, reading time & 1/2/3-word keyword density — catch stuffing.', category: 'analyze', icon: Hash, keywords: 'keyword density word count reading time stuffing ngram' },
  { slug: 'readability-checker', title: 'Readability Checker', short: 'Flesch Reading Ease & grade level with live sentence and word stats.', category: 'analyze', icon: BookOpen, keywords: 'readability flesch kincaid grade level reading ease content' },
  { slug: 'title-meta-length-checker', title: 'Title & Meta Length Checker', short: 'Pixel-accurate title & description length with a live Google preview.', category: 'analyze', icon: Ruler, keywords: 'title tag meta description length pixel width serp truncate' },
  { slug: 'serp-snippet-preview', title: 'SERP Snippet Preview', short: 'Pixel-accurate Google preview — catch truncated titles & descriptions.', category: 'analyze', icon: Search, keywords: 'serp snippet preview google result title description pixel' },
  { slug: 'open-graph-preview', title: 'Open Graph Preview', short: 'See how your link looks on Facebook, X, LinkedIn & Discord, then get the tags.', category: 'analyze', icon: Share2, keywords: 'open graph preview og facebook twitter linkedin discord social card' },

  // ---- Generate & Build ----
  { slug: 'meta-tag-generator', title: 'Meta Tag Generator', short: 'Title, description, Open Graph & Twitter Card tags with live length checks.', category: 'generate', icon: Tag, keywords: 'meta tags title description open graph twitter card generator head' },
  { slug: 'og-image-generator', title: 'Open Graph Image Generator', short: 'Design & download a 1200×630 social share image in your browser.', category: 'generate', icon: ImageIcon, keywords: 'open graph image og image social share 1200 630 png generator card' },
  { slug: 'utm-builder', title: 'UTM Campaign URL Builder', short: 'Tag links for GA4, Meta, Google Ads & email with presets and one-click copy.', category: 'generate', icon: Link2, keywords: 'utm builder campaign url ga4 google analytics meta facebook ads tracking' },
  { slug: 'slug-generator', title: 'URL Slug Generator', short: 'Turn any title into a clean, hyphenated, SEO-friendly URL slug.', category: 'generate', icon: Scissors, keywords: 'slug generator url permalink hyphen clean seo friendly' },
  { slug: 'canonical-tag-generator', title: 'Canonical Tag Generator', short: 'rel=canonical as HTML, Next.js metadata, or an HTTP header.', category: 'generate', icon: Anchor, keywords: 'canonical tag rel canonical duplicate content next.js header' },
  { slug: 'hreflang-generator', title: 'Hreflang Generator', short: 'Multi-language & multi-region tags with x-default, done right.', category: 'generate', icon: Languages, keywords: 'hreflang generator language region international x-default multilingual' },
  { slug: 'sitemap-generator', title: 'XML Sitemap Generator', short: 'Paste your URLs, get a valid sitemap.xml — copy or download.', category: 'generate', icon: ListTree, keywords: 'xml sitemap generator urls loc lastmod priority download' },
  { slug: 'robots-txt-generator', title: 'robots.txt Generator', short: 'Control crawling with disallow rules, sitemap, and crawl-delay.', category: 'generate', icon: FileCode, keywords: 'robots txt generator disallow allow crawl delay sitemap' },
  { slug: 'robots-meta-generator', title: 'Robots Meta Generator', short: 'noindex, nofollow, canonical & X-Robots-Tag for a single page.', category: 'generate', icon: EyeOff, keywords: 'robots meta noindex nofollow x-robots-tag canonical index' },
  { slug: 'redirect-generator', title: '301 Redirect Generator', short: '.htaccess & Nginx redirect rules from a list of old → new URLs.', category: 'generate', icon: CornerUpRight, keywords: '301 redirect generator htaccess nginx apache old new url' },

  // ---- Structured Data ----
  { slug: 'schema-generator', title: 'JSON-LD Schema Generator', short: 'Structured data for Organization, WebSite, Article, FAQ, Product & more.', category: 'schema', icon: Braces, keywords: 'schema generator json-ld structured data organization website all types' },
  { slug: 'localbusiness-schema-generator', title: 'LocalBusiness Schema Generator', short: 'Name, address, hours & phone as LocalBusiness JSON-LD for local SEO.', category: 'schema', icon: MapPin, keywords: 'localbusiness schema json-ld address hours local seo markup' },
  { slug: 'faq-schema-generator', title: 'FAQ Schema Generator', short: 'Turn questions & answers into valid FAQPage JSON-LD in seconds.', category: 'schema', icon: HelpCircle, keywords: 'faq schema faqpage json-ld questions answers markup' },
  { slug: 'product-schema-generator', title: 'Product Schema Generator', short: 'Price, availability, brand & ratings as Product JSON-LD.', category: 'schema', icon: ShoppingBag, keywords: 'product schema json-ld price availability rating offer markup' },
  { slug: 'breadcrumb-schema-generator', title: 'Breadcrumb Schema Generator', short: 'BreadcrumbList JSON-LD from your page hierarchy — cleaner SERP trails.', category: 'schema', icon: ChevronRight, keywords: 'breadcrumb schema breadcrumblist json-ld hierarchy trail markup' },
  { slug: 'article-schema-generator', title: 'Article Schema Generator', short: 'Headline, author, dates & publisher as Article JSON-LD.', category: 'schema', icon: Newspaper, keywords: 'article schema json-ld headline author date publisher news markup' },
  { slug: 'event-schema-generator', title: 'Event Schema Generator', short: 'Dates, location & tickets as Event JSON-LD for event rich results.', category: 'schema', icon: Calendar, keywords: 'event schema json-ld date location tickets rich result markup' },
];

export const toolBySlug = new Map(TOOLS.map((t) => [t.slug, t]));

// Related tools: same category first, then fill from other categories, excluding self.
export function relatedTools(slug: string, limit = 4): ToolDef[] {
  const self = toolBySlug.get(slug);
  if (!self) return TOOLS.slice(0, limit);
  const sameCat = TOOLS.filter((t) => t.slug !== slug && t.category === self.category);
  const others = TOOLS.filter((t) => t.slug !== slug && t.category !== self.category);
  return [...sameCat, ...others].slice(0, limit);
}
