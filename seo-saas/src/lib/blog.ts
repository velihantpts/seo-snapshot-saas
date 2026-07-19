import { marked } from 'marked';
import { articles } from './blog-articles';
import { prisma } from './prisma';
import { RETIRED_POST_SLUGS } from './retired-posts';

export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  readTime: string;
  category: string;
  source: 'static' | 'db';
}

export interface BlogFull {
  slug: string;
  title: string;
  content: string; // markdown
  excerpt: string;
  date: string;
  category: string;
}

marked.setOptions({ gfm: true, breaks: false });

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

// Render markdown and, in the same pass, give every H2 a stable id and collect
// a table of contents. Used to add "On this page" jump links to long articles.
export function renderMarkdownWithToc(md: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const used = new Set<string>();
  const html = renderMarkdown(md).replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
    let id = base, n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html, toc };
}

function estimateReadTime(md: string): string {
  const words = md.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

// Strip inline markdown so FAQ answers become clean plain text for JSON-LD.
function stripInlineMd(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
    .replace(/`([^`]+)`/g, '$1') // `code` -> code
    .replace(/\*\*([^*]+)\*\*/g, '$1') // **bold** -> bold
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract Q/A pairs from an article's `## FAQ` section (format:
// `**Q: question?**` on one line, `A: answer` on the next). Returns [] when
// the article has no FAQ block. Used to emit FAQPage structured data so
// articles become eligible for FAQ rich results in Google.
export function extractFaq(md: string): { question: string; answer: string }[] {
  const faqStart = md.search(/^##\s+FAQ\s*$/m);
  if (faqStart === -1) return [];
  let body = md.slice(faqStart);
  // Cut off at the next H2 after the FAQ heading, if any.
  const afterHeading = body.slice(3);
  const nextH2 = afterHeading.search(/\n##\s+/);
  if (nextH2 !== -1) body = afterHeading.slice(0, nextH2);
  const faqs: { question: string; answer: string }[] = [];
  const re = /\*\*Q:\s*(.+?)\*\*\s*\n+([\s\S]*?)(?=\n\*\*Q:|\n##\s|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const question = stripInlineMd(m[1]);
    const answer = stripInlineMd(m[2].replace(/^\s*A:\s*/, ''));
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
}

// Metadata for the hand-written articles that live in blog-articles.ts.
const STATIC_META: Omit<BlogListItem, 'source'>[] = [
  { slug: 'how-to-write-seo-title-tags', title: 'How to Write Title Tags for SEO (Format, Length, Examples)', excerpt: 'The one-line title tag is your most-read copy and strongest on-page signal. The formula, the real pixel-width limit, good vs bad examples, and the five mistakes that make Google rewrite your title.', date: '2026-07-19', updated: '2026-07-19', readTime: '6 min', category: 'Guide' },
  { slug: 'redirect-chains-what-they-are-and-how-to-fix', title: 'Redirect Chains: What They Are and How to Fix Them', excerpt: 'A → B → C redirects add latency, waste crawl budget, and leak ranking signal. A visual guide to spotting chains and collapsing them to a single direct hop.', date: '2026-07-18', updated: '2026-07-18', readTime: '4 min', category: 'Guide' },
  { slug: 'schema-type-to-rich-result-map', title: 'Which Schema Type Unlocks Which Rich Result', excerpt: 'A visual map: Product unlocks price and stars, Review unlocks star snippets, BreadcrumbList unlocks the breadcrumb trail, and more — plus why eligible is not guaranteed.', date: '2026-07-18', updated: '2026-07-18', readTime: '5 min', category: 'Guide' },
  { slug: 'how-googlebot-crawls-renders-indexes', title: 'Crawl, Render, Index: How Googlebot Actually Sees Your Page', excerpt: 'A diagram of the three stages — and the three failure points. robots.txt blocks crawl, JS content appears at render, noindex drops at index. Which stage failed = which fix.', date: '2026-07-18', updated: '2026-07-18', readTime: '5 min', category: 'Guide' },
  { slug: 'how-rel-canonical-works', title: 'How rel=canonical Actually Works (and How It Backfires)', excerpt: 'A visual guide to canonical consolidation: point duplicates at one preferred URL — and see how a wrong canonical quietly deindexes the wrong page.', date: '2026-07-18', updated: '2026-07-18', readTime: '5 min', category: 'Guide' },
  { slug: 'remove-page-from-google-410-vs-301-vs-noindex', title: 'How to Remove a Page From Google: 410 vs 301 vs noindex', excerpt: 'A visual decision tree: 301 if the content moved, 410/404 if it is gone for good, noindex to keep it live but hidden — and why robots.txt is never the answer.', date: '2026-07-18', updated: '2026-07-18', readTime: '5 min', category: 'Guide' },
  { slug: 'fix-text-content-does-not-match-server-rendered-html', title: 'Fix "Text content does not match server-rendered HTML"', excerpt: 'A React/Next hydration mismatch — usually harmless for SEO, unless the server renders an empty state. Causes, fixes, and what Google actually indexes.', date: '2026-07-18', updated: '2026-07-18', readTime: '6 min', category: 'Fixes' },
  { slug: 'astro-sitemap-not-working', title: 'Astro Sitemap Not Working? Here Is the Fix', excerpt: 'If @astrojs/sitemap outputs an empty or missing file, the cause is almost always a missing site option in astro.config. The fix, plus why dev shows nothing.', date: '2026-07-18', updated: '2026-07-18', readTime: '4 min', category: 'Fixes' },
  { slug: 'nuxt-hreflang-i18n', title: 'How to Add Hreflang Tags in Nuxt (i18n Done Right)', excerpt: '@nuxtjs/i18n can emit hreflang and x-default for you — once baseUrl and each locale language are set. Config, the head helper, and the common gotchas.', date: '2026-07-18', updated: '2026-07-18', readTime: '5 min', category: 'Guide' },
  { slug: 'framer-canonical-url', title: 'How to Set a Canonical URL in Framer', excerpt: 'Framer adds a self-canonical by default. When to override it (CMS duplicates, syndication), how to set a custom one, and the absolute-URL rule.', date: '2026-07-18', updated: '2026-07-18', readTime: '4 min', category: 'Guide' },
  { slug: 'fix-either-offers-review-or-aggregaterating', title: 'Fix "Either offers, review, or aggregateRating should be specified"', excerpt: 'This Rich Results warning means your Product schema has no price, rating, or review. Add offers, aggregateRating, or review — with a copy-paste JSON-LD example.', date: '2026-07-18', updated: '2026-07-18', readTime: '5 min', category: 'Fixes' },
  { slug: 'fix-missing-field-image-structured-data', title: 'Fix "Missing field image" in Structured Data', excerpt: 'The Missing field warning means a required or recommended schema field is absent. Add image (and author, datePublished, price) with real values and re-test.', date: '2026-07-18', updated: '2026-07-18', readTime: '5 min', category: 'Fixes' },
  { slug: 'fix-indexed-though-blocked-by-robots-txt', title: 'How to Fix "Indexed, though blocked by robots.txt"', excerpt: 'robots.txt controls crawling, not indexing — so a blocked URL can still get indexed. Decide whether you want it indexed, then fix it the right (counterintuitive) way.', date: '2026-07-18', updated: '2026-07-18', readTime: '5 min', category: 'Fixes' },
  { slug: '308-vs-301-redirect-seo', title: '308 vs 301 Redirect: Which Should You Use for SEO?', excerpt: 'For SEO they are equivalent — both permanent, both pass ranking signal. The difference is method preservation. When to use each, with a clear comparison table.', date: '2026-07-18', updated: '2026-07-18', readTime: '4 min', category: 'Guide' },
  { slug: 'how-to-fix-largest-contentful-paint-lcp', title: 'How to Fix Largest Contentful Paint (LCP)', excerpt: 'LCP marks when the biggest element renders. Find the slow element, preload the hero image, fix TTFB and render-blocking resources to get under 2.5s.', date: '2026-07-13', updated: '2026-07-13', readTime: '7 min', category: 'Fixes' },
  { slug: 'how-to-fix-cumulative-layout-shift-cls', title: 'How to Fix Cumulative Layout Shift (CLS)', excerpt: 'CLS scores how much your page jumps while loading. Set image dimensions, reserve space for ads and fonts, and get under 0.1 at the 75th percentile.', date: '2026-07-13', updated: '2026-07-13', readTime: '6 min', category: 'Fixes' },
  { slug: 'what-is-inp-interaction-to-next-paint', title: 'What Is INP (Interaction to Next Paint) and How to Fix It', excerpt: 'INP replaced FID in 2024 and is stricter. It measures full interaction latency across the visit. Break up long tasks and cut JavaScript to get under 200ms.', date: '2026-07-13', updated: '2026-07-13', readTime: '7 min', category: 'Guide' },
  { slug: 'fix-duplicate-without-user-selected-canonical', title: 'How to Fix "Duplicate Without User-Selected Canonical"', excerpt: "This GSC status means Google picked a canonical because you didn't. Add a self-referencing canonical, align sitemap and links, and reclaim the right URL.", date: '2026-07-13', updated: '2026-07-13', readTime: '7 min', category: 'Fixes' },
  { slug: 'fix-crawled-currently-not-indexed', title: 'How to Fix "Crawled — Currently Not Indexed" in Google Search Console', excerpt: "Crawled - currently not indexed means Google fetched your page but decided it was not worth indexing. Here's how to diagnose the cause and fix it.", date: '2026-07-11', updated: '2026-07-11', readTime: '7 min', category: 'Fixes' },
  { slug: 'fix-discovered-currently-not-indexed', title: '"Discovered — Currently Not Indexed": Causes and How to Fix It', excerpt: "Discovered - currently not indexed means your URL is queued but not yet crawled. Here's why Google delays it and how to get it crawled and indexed.", date: '2026-07-11', updated: '2026-07-11', readTime: '7 min', category: 'Fixes' },
  { slug: 'add-sitemap-nextjs', title: 'How to Add a sitemap.xml in Next.js (App Router)', excerpt: 'Next.js has no built-in sitemap. Add app/sitemap.ts with static and dynamic routes, correct lastModified, a robots.ts reference, and large-site splitting.', date: '2026-07-11', updated: '2026-07-11', readTime: '7 min', category: 'Guide' },
  { slug: 'canonical-url-nextjs', title: 'How to Set a Canonical URL in Next.js (App Router)', excerpt: 'Set canonical URLs in the Next.js App Router the right way: metadataBase, self-referencing canonicals, and the inherited-layout gotcha that deindexes pages.', date: '2026-07-11', updated: '2026-07-11', readTime: '7 min', category: 'Guide' },
  { slug: 'how-to-fix-missing-meta-description', title: 'How to Fix "Missing Meta Description" — The #1 SEO Issue', excerpt: "Meta descriptions appear in Google search results. Missing them means Google picks random text from your page. Here's how to fix it in 2 minutes.", date: '2026-03-20', updated: '2026-07-11', readTime: '3 min', category: 'Fixes' },
  { slug: 'what-is-a-good-seo-score', title: 'What Is a Good SEO Score? (And How to Improve Yours)', excerpt: 'SEO scores range from 0-100. Learn what score ranges mean, which checks matter most, and the fastest ways to improve your score.', date: '2026-03-19', updated: '2026-07-11', readTime: '5 min', category: 'Guide' },
  { slug: 'structured-data-json-ld-guide', title: 'Structured Data (JSON-LD) Guide for Beginners', excerpt: 'Structured data helps Google understand your content and show rich snippets. Copy-paste ready JSON-LD templates for every page type.', date: '2026-03-18', updated: '2026-07-11', readTime: '7 min', category: 'Guide' },
  { slug: 'how-to-improve-core-web-vitals', title: 'How to Improve Core Web Vitals: LCP, FID, CLS Explained', excerpt: 'Core Web Vitals directly impact Google rankings. Learn what LCP, FID/INP, and CLS measure, what good scores look like, and how to fix each one.', date: '2026-03-17', updated: '2026-07-11', readTime: '8 min', category: 'Guide' },
  { slug: 'security-headers-for-seo', title: 'Security Headers Every Website Needs (HSTS, CSP, X-Frame)', excerpt: 'Security headers protect your site and improve trust signals. Learn which headers to add, how to configure them for Nginx, Apache, Next.js, and Vercel.', date: '2026-03-16', updated: '2026-07-11', readTime: '6 min', category: 'Guide' },
  { slug: 'open-graph-meta-tags-guide', title: 'Open Graph Meta Tags: The Complete Guide for Social Sharing', excerpt: 'Control how your pages look when shared on Facebook, Twitter, LinkedIn. Learn all OG tags, ideal image sizes, and common mistakes to avoid.', date: '2026-03-15', updated: '2026-07-11', readTime: '5 min', category: 'Guide' },
  { slug: 'fix-render-blocking-resources', title: 'How to Fix Render-Blocking Resources (CSS & JavaScript)', excerpt: 'Render-blocking resources slow down your page load. Learn to defer scripts, async-load CSS, and use resource hints for faster pages.', date: '2026-03-14', updated: '2026-07-11', readTime: '6 min', category: 'Fixes' },
  { slug: 'robots-txt-guide', title: 'robots.txt Guide: Control How Search Engines Crawl Your Site', excerpt: 'A properly configured robots.txt saves crawl budget and prevents indexing of private pages. Templates for WordPress, Next.js, and static sites.', date: '2026-03-13', updated: '2026-07-11', readTime: '5 min', category: 'Guide' },
  { slug: 'image-seo-optimization', title: 'Image SEO: Alt Text, Lazy Loading, WebP — The Complete Checklist', excerpt: 'Images can hurt or help your SEO. Learn to write good alt text, implement lazy loading, serve WebP/AVIF, and set proper dimensions.', date: '2026-03-12', updated: '2026-07-11', readTime: '7 min', category: 'Guide' },
  { slug: 'canonical-url-explained', title: 'Canonical URLs Explained: Prevent Duplicate Content Issues', excerpt: 'Duplicate content confuses search engines. Learn what canonical URLs are, when to use them, and common mistakes that hurt your rankings.', date: '2026-03-11', updated: '2026-07-11', readTime: '4 min', category: 'Fixes' },
  { slug: 'website-accessibility-seo-checklist', title: 'Web Accessibility & SEO: 15 Checks That Improve Both', excerpt: 'Accessibility and SEO overlap more than you think. Alt text, heading hierarchy, form labels, ARIA landmarks — fixes that help everyone.', date: '2026-03-10', updated: '2026-07-11', readTime: '8 min', category: 'Guide' },
  { slug: 'sitemap-xml-guide', title: 'XML Sitemap Guide: How to Create and Submit to Google', excerpt: 'Sitemaps tell search engines which pages to crawl. Learn to generate sitemaps, submit to Google Search Console, and common pitfalls.', date: '2026-03-09', updated: '2026-07-11', readTime: '5 min', category: 'Guide' },
  { slug: 'heading-hierarchy-seo', title: 'H1-H6 Heading Hierarchy: Why It Matters for SEO', excerpt: 'Proper heading structure helps Google understand your content. Learn the rules: one H1, logical nesting, keyword placement, and common mistakes.', date: '2026-03-08', updated: '2026-07-11', readTime: '4 min', category: 'Fixes' },
  { slug: 'free-seo-audit-tool-2026', title: 'Free SEO Audit Tool 2026: Compare the Top 10', excerpt: 'We compared 10 free SEO audit tools — Lighthouse, Semrush, Ahrefs, and more. See which tool gives the most checks, fix code, and accurate results.', date: '2026-03-22', updated: '2026-07-11', readTime: '8 min', category: 'Comparison' },
  { slug: 'seo-checklist-for-developers', title: 'SEO Checklist for Developers: 50 Essential Points', excerpt: 'The complete technical SEO checklist for developers. Meta tags, performance, security headers, accessibility — 50 points with code examples.', date: '2026-03-22', updated: '2026-07-11', readTime: '12 min', category: 'Guide' },
  { slug: 'eeat-seo-guide', title: 'E-E-A-T in SEO: What It Is and How to Improve', excerpt: "Google's E-E-A-T (Experience, Expertise, Authority, Trust) framework explained. Learn what signals matter and how to check them automatically.", date: '2026-03-22', updated: '2026-07-11', readTime: '7 min', category: 'Guide' },
  { slug: 'nginx-security-headers-guide', title: 'Nginx Security Headers: Complete Configuration Guide', excerpt: 'Copy-paste nginx configuration for all 7 security headers: HSTS, CSP, X-Frame-Options, and more. Get an A+ security grade.', date: '2026-03-22', updated: '2026-07-11', readTime: '6 min', category: 'Guide' },
  { slug: 'how-to-improve-lighthouse-score', title: 'How to Get Lighthouse Score 100: Step by Step', excerpt: "We scored 100/96/100/100 on Lighthouse. Here's exactly what we did — performance, accessibility, best practices, and SEO.", date: '2026-03-22', updated: '2026-07-11', readTime: '8 min', category: 'Guide' },
  { slug: 'meta-description-length-2026', title: 'Meta Description Length in 2026: Pixel Width Guide', excerpt: 'The real limit is pixels, not characters. Learn the exact desktop (920px) and mobile (680px) limits and how to check them.', date: '2026-03-22', updated: '2026-07-11', readTime: '4 min', category: 'Guide' },
  { slug: 'website-security-check-guide', title: 'Website Security Check: How to Grade Your Headers', excerpt: 'Get a security grade from A+ to F. Learn which 7 headers matter, how to add them on nginx/Apache/Next.js, and why they matter.', date: '2026-03-22', updated: '2026-07-11', readTime: '5 min', category: 'Guide' },
  { slug: 'technical-seo-audit-complete-guide', title: 'Technical SEO Audit: The Complete 2026 Guide', excerpt: 'The 10-step technical SEO audit: crawlability, indexability, site architecture, page speed, mobile, HTTPS, structured data, internal links, redirects, and international SEO.', date: '2026-03-22', updated: '2026-07-11', readTime: '15 min', category: 'Guide' },
  { slug: 'how-to-add-structured-data-json-ld', title: 'How to Add JSON-LD Structured Data (With Examples)', excerpt: 'Copy-paste JSON-LD templates for WebPage, Article, FAQ, Product, and Organization. Enable rich results in Google search.', date: '2026-03-22', updated: '2026-07-11', readTime: '10 min', category: 'Guide' },
  { slug: 'hreflang-tags-complete-guide', title: 'Hreflang Tags: Complete Guide for Multi-Language Sites', excerpt: 'The 5 rules of hreflang: x-default, self-reference, reciprocal links, valid codes, absolute URLs. With implementation examples.', date: '2026-03-22', updated: '2026-07-11', readTime: '8 min', category: 'Guide' },
  { slug: 'fix-render-blocking-resources-nextjs', title: 'How to Fix Render-Blocking Resources in Next.js', excerpt: 'Use Script component, dynamic imports, font optimization, and preconnect to eliminate render-blocking warnings in Next.js.', date: '2026-03-22', updated: '2026-07-11', readTime: '7 min', category: 'Fixes' },
  { slug: 'open-graph-image-size-2026', title: 'Open Graph Image Size and Best Practices 2026', excerpt: '1200x630px is the standard. Size requirements for Facebook, Twitter, LinkedIn, WhatsApp. Dynamic OG image generation with Next.js.', date: '2026-03-22', updated: '2026-07-11', readTime: '5 min', category: 'Guide' },
  { slug: 'seo-score-checker-free', title: 'Free SEO Score Checker: Analyze Any Website', excerpt: '100+ checks across 7 categories. Copy-paste fix code for every issue. Security grade, E-E-A-T signals, tech stack detection. No signup.', date: '2026-03-22', updated: '2026-07-11', readTime: '6 min', category: 'Guide' },
  { slug: 'content-depth-seo-guide', title: "Content Depth in SEO: Why Word Count Alone Isn't Enough", excerpt: 'Content depth = topic breadth + structure + readability. Learn the 7 factors that matter more than word count for Google rankings.', date: '2026-03-22', updated: '2026-07-11', readTime: '7 min', category: 'Guide' },
  { slug: 'website-speed-optimization-guide', title: 'Website Speed Optimization: 15 Proven Techniques', excerpt: 'Server-side (compression, caching, CDN) + frontend (lazy load, WebP, defer JS) + content (fonts, DOM size, CLS) optimization techniques.', date: '2026-03-22', updated: '2026-07-11', readTime: '10 min', category: 'Guide' },
  { slug: 'keyword-cannibalization-fix', title: 'Keyword Cannibalization: How to Find and Fix It', excerpt: 'When multiple pages target the same keyword, neither ranks well. Learn to detect with Google Search Console and fix with consolidation, canonical, or noindex.', date: '2026-03-22', updated: '2026-07-11', readTime: '6 min', category: 'Fixes' },
];

const STATIC_BY_SLUG = new Map(STATIC_META.map((m) => [m.slug, m]));

export async function getBlogList(): Promise<BlogListItem[]> {
  let dbItems: BlogListItem[] = [];
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    dbItems = dbPosts
      // Drop retired Turkish posts: they 301 to English equivalents (see
      // retired-posts.ts) and must not appear in listings, related, or sitemap.
      .filter((p) => !RETIRED_POST_SLUGS.has(p.slug))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || '',
        date: p.createdAt.toISOString().slice(0, 10),
        updated: (p.updatedAt ?? p.createdAt).toISOString().slice(0, 10),
        readTime: estimateReadTime(p.content),
        category: p.category || 'Article',
        source: 'db' as const,
      }));
  } catch {
    // DB unavailable — fall back to static only
  }
  const staticItems: BlogListItem[] = STATIC_META.map((m) => ({ ...m, source: 'static' as const }));
  // Newest DB posts first, then the evergreen static library.
  return [...dbItems, ...staticItems];
}

export async function getBlogPost(slug: string): Promise<BlogFull | null> {
  // Retired Turkish posts 301 elsewhere (next.config.js); never render them,
  // even if something reaches this path directly.
  if (RETIRED_POST_SLUGS.has(slug)) return null;
  try {
    const db = await prisma.blogPost.findUnique({ where: { slug } });
    if (db && db.published) {
      return {
        slug: db.slug,
        title: db.title,
        content: db.content,
        excerpt: db.excerpt || '',
        date: db.createdAt.toISOString().slice(0, 10),
        category: db.category || 'Article',
      };
    }
  } catch {
    // ignore — try static
  }

  const a = articles[slug];
  if (a) {
    const meta = STATIC_BY_SLUG.get(slug);
    return {
      slug,
      title: a.title,
      content: a.content,
      excerpt: meta?.excerpt || '',
      date: meta?.date || '',
      category: meta?.category || 'Guide',
    };
  }
  return null;
}
