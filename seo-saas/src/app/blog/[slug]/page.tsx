'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const articles: Record<string, { title: string; content: string }> = {
  'how-to-fix-missing-meta-description': {
    title: 'How to Fix "Missing Meta Description"',
    content: `## Why It Matters

Meta descriptions are the text snippets shown below your page title in Google search results. Without one, Google picks random text from your page — often something irrelevant or cut off mid-sentence.

A good meta description:
- Increases click-through rate by 5-10%
- Tells users exactly what to expect
- Contains your target keyword naturally

## How to Fix It

Add this tag inside your \`<head>\` section:

\`\`\`html
<meta name="description" content="Your compelling description here. Include your main keyword. Keep it under 160 characters for best display in search results.">
\`\`\`

### Platform-Specific Instructions

**WordPress:** Install Yoast SEO or Rank Math. Edit any page/post and fill in the "Meta Description" field.

**Next.js:** Add to your page's metadata export:
\`\`\`typescript
export const metadata = {
  description: 'Your description here',
};
\`\`\`

**HTML:** Add the meta tag directly in your \`<head>\`.

## Tips for Writing Great Descriptions

1. **Keep it 150-160 characters** — Google truncates longer descriptions
2. **Include your target keyword** — it gets bolded in search results
3. **Add a call-to-action** — "Learn how", "Discover", "Get started"
4. **Make it unique per page** — never duplicate descriptions across pages
5. **Don't stuff keywords** — write for humans, not robots

## Check Your Fix

After adding the description, run your URL through [SEO Snapshot](/) to verify it's detected correctly.`,
  },
  'what-is-a-good-seo-score': {
    title: 'What Is a Good SEO Score?',
    content: `## SEO Score Ranges

| Score | Rating | Meaning |
|-------|--------|---------|
| 90-100 | Excellent | Top-tier optimization, minimal issues |
| 75-89 | Good | Well-optimized, minor improvements possible |
| 50-74 | Needs Work | Several issues affecting visibility |
| 0-49 | Poor | Critical issues preventing indexing |

## What Affects Your Score?

SEO Snapshot checks 100 factors across 7 categories:

1. **Meta Tags (25%)** — Title, description, canonical, viewport
2. **Technical (20%)** — HTTPS, robots.txt, sitemap, redirects
3. **Performance (15%)** — Page speed, render-blocking resources
4. **Security (15%)** — HTTP headers, cookies, mixed content
5. **Content (10%)** — Word count, keywords, readability
6. **Social (10%)** — Open Graph, Twitter Card, JSON-LD
7. **Accessibility (5%)** — Alt text, form labels, heading hierarchy

## Fastest Ways to Improve

1. **Fix critical issues first** — They have the highest impact score
2. **Add meta description** — Usually worth +15 points
3. **Add structured data** — +5 points and enables rich snippets
4. **Fix broken links** — Improves both SEO and user experience
5. **Enable HTTPS** — +10 points and required by Google

## Industry Benchmarks

Most websites score between 50-70. Scoring above 80 puts you in the top 20% of sites we've analyzed.`,
  },
  'structured-data-json-ld-guide': {
    title: 'Structured Data (JSON-LD) Guide for Beginners',
    content: `## What Is Structured Data?

Structured data tells search engines exactly what your content is about — is it an article? A product? A FAQ? This enables rich snippets in search results (star ratings, FAQ dropdowns, recipe cards).

## JSON-LD Templates

### Website + Organization
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Site Name",
  "url": "https://yoursite.com",
  "description": "Your site description"
}
</script>
\`\`\`

### Article / Blog Post
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  "author": { "@type": "Person", "name": "Author Name" },
  "datePublished": "2026-03-20",
  "image": "https://yoursite.com/image.jpg"
}
</script>
\`\`\`

### FAQ Page
\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Your question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your answer."
      }
    }
  ]
}
</script>
\`\`\`

## Where to Add It

Place the \`<script>\` tag inside your \`<head>\` or at the end of \`<body>\`. Both work.

## Validate It

After adding structured data, use [SEO Snapshot](/) to check if it's detected and valid. We parse and validate the most common schema types automatically.`,
  },
  'how-to-improve-core-web-vitals': {
    title: 'How to Improve Core Web Vitals: LCP, FID, CLS Explained',
    content: `## What Are Core Web Vitals?

Core Web Vitals are Google's metrics for measuring real user experience. They directly impact your search rankings since 2021. There are three main metrics:

- **LCP (Largest Contentful Paint)** — How fast the main content loads. Target: under 2.5 seconds.
- **FID/INP (First Input Delay / Interaction to Next Paint)** — How fast the page responds to user interaction. Target: under 200ms.
- **CLS (Cumulative Layout Shift)** — How much the page layout shifts during loading. Target: under 0.1.

## How to Fix LCP

LCP is usually caused by large images, slow server response, or render-blocking resources.

1. **Optimize your hero image** — Use WebP format, set explicit width/height, add fetchpriority="high"
2. **Reduce server response time** — Use a CDN (Cloudflare is free), enable compression (gzip/brotli)
3. **Remove render-blocking CSS** — Inline critical CSS, defer non-critical stylesheets
4. **Preload key resources** — Add \`<link rel="preload">\` for your largest image and main font

## How to Fix CLS

CLS happens when elements shift position after the page starts rendering.

1. **Set dimensions on images and videos** — Always include width and height attributes
2. **Reserve space for ads and embeds** — Use CSS aspect-ratio or min-height
3. **Avoid inserting content above existing content** — Don't push content down with late-loading banners
4. **Use font-display: swap** — Prevents invisible text while fonts load

## How to Fix INP

INP measures responsiveness to all user interactions, not just the first one.

1. **Break up long tasks** — Use \`requestIdleCallback\` or \`setTimeout\` to split heavy JavaScript
2. **Reduce JavaScript bundle size** — Code-split with dynamic imports
3. **Avoid long main thread blocking** — Move heavy computation to Web Workers
4. **Minimize third-party scripts** — Each analytics/chat/ad script adds latency

## Measure Your Vitals

Use [SEO Snapshot](/) to check your Core Web Vitals. We integrate with Google PageSpeed Insights API to show real lab data, and Chrome UX Report (CrUX) for real user field data.`,
  },
  'security-headers-for-seo': {
    title: 'Security Headers Every Website Needs',
    content: `## Why Security Headers Matter for SEO

Security headers don't directly affect rankings, but they build trust signals and prevent attacks that could damage your reputation. Google has confirmed HTTPS as a ranking factor, and browsers now warn users about insecure sites.

## Essential Security Headers

### 1. Strict-Transport-Security (HSTS)
Forces browsers to always use HTTPS. Prevents SSL stripping attacks.

\`\`\`
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
\`\`\`

### 2. Content-Security-Policy (CSP)
Controls which resources can load on your page. Prevents XSS attacks.

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
\`\`\`

### 3. X-Frame-Options
Prevents your site from being embedded in iframes (clickjacking protection).

\`\`\`
X-Frame-Options: DENY
\`\`\`

### 4. X-Content-Type-Options
Prevents MIME type sniffing attacks.

\`\`\`
X-Content-Type-Options: nosniff
\`\`\`

### 5. Referrer-Policy
Controls how much referrer information is sent with requests.

\`\`\`
Referrer-Policy: strict-origin-when-cross-origin
\`\`\`

## How to Add Headers

**Nginx:**
\`\`\`
add_header Strict-Transport-Security "max-age=31536000" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
\`\`\`

**Next.js (next.config.js):**
\`\`\`javascript
async headers() {
  return [{ source: '/(.*)', headers: [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
  ]}];
}
\`\`\`

**Vercel (vercel.json):**
\`\`\`json
{ "headers": [{ "source": "/(.*)", "headers": [
  { "key": "X-Frame-Options", "value": "DENY" }
]}]}
\`\`\`

Check your security headers with [SEO Snapshot](/) — we grade your security from A+ to F and show exactly which headers are missing.`,
  },
  'open-graph-meta-tags-guide': {
    title: 'Open Graph Meta Tags: Complete Guide',
    content: `## What Are Open Graph Tags?

Open Graph (OG) tags control how your page looks when shared on social media — Facebook, LinkedIn, Twitter, Slack, Discord, and more. Without them, platforms pick random text and images from your page.

## Required OG Tags

\`\`\`html
<meta property="og:title" content="Your Page Title">
<meta property="og:description" content="A compelling description under 200 chars">
<meta property="og:image" content="https://yoursite.com/og-image.png">
<meta property="og:url" content="https://yoursite.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Your Site Name">
\`\`\`

## Image Requirements

- **Recommended size:** 1200 x 630 pixels
- **Minimum size:** 600 x 315 pixels
- **Format:** PNG or JPG (not SVG)
- **File size:** Under 5MB (ideally under 1MB)

## Twitter Card Tags

Twitter uses its own tags but falls back to OG tags if missing:

\`\`\`html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Your Title">
<meta name="twitter:description" content="Your description">
<meta name="twitter:image" content="https://yoursite.com/twitter-image.png">
\`\`\`

## Common Mistakes

1. **Missing og:image** — The #1 mistake. Without it, no preview image on social shares.
2. **og:image using relative URL** — Must be absolute: \`https://yoursite.com/image.png\`
3. **Image too small** — Under 200x200px won't display on most platforms.
4. **og:url doesn't match canonical** — These should point to the same URL.

## Test Your OG Tags

Use [SEO Snapshot](/) to validate all 6 OG tags and check if your og:image URL is accessible. We also verify Twitter Card tags and show what's missing.`,
  },
  'fix-render-blocking-resources': {
    title: 'How to Fix Render-Blocking Resources',
    content: `## What Are Render-Blocking Resources?

Render-blocking resources are CSS and JavaScript files that prevent the browser from displaying your page until they're fully downloaded and processed. They're one of the biggest causes of slow page loads.

## Identify Render-Blocking Resources

Run your URL through [SEO Snapshot](/) — we list all render-blocking scripts and stylesheets with their URLs.

## Fix Render-Blocking JavaScript

### Option 1: Add defer attribute
\`\`\`html
<script src="script.js" defer></script>
\`\`\`
Scripts with \`defer\` download in parallel and execute after HTML parsing.

### Option 2: Add async attribute
\`\`\`html
<script src="analytics.js" async></script>
\`\`\`
Use \`async\` for scripts that don't depend on other scripts (analytics, ads).

### Option 3: Move to bottom of body
\`\`\`html
<body>
  <!-- Page content -->
  <script src="script.js"></script>
</body>
\`\`\`

## Fix Render-Blocking CSS

### Inline critical CSS
Extract the CSS needed for above-the-fold content and inline it:
\`\`\`html
<style>/* Critical CSS here */</style>
<link rel="stylesheet" href="full.css" media="print" onload="this.media='all'">
\`\`\`

### Use media queries
\`\`\`html
<link rel="stylesheet" href="print.css" media="print">
<link rel="stylesheet" href="mobile.css" media="(max-width: 768px)">
\`\`\`

## Impact

Fixing render-blocking resources typically improves:
- **LCP** by 0.5-2 seconds
- **FCP** by 0.3-1 second
- **Google PageSpeed score** by 10-30 points`,
  },
  'robots-txt-guide': {
    title: 'robots.txt Guide: Control Search Engine Crawling',
    content: `## What Is robots.txt?

robots.txt is a text file at your website's root that tells search engines which pages to crawl and which to skip. Every website should have one.

## Basic Template

\`\`\`
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: https://yoursite.com/sitemap.xml
\`\`\`

## Important Rules

### Allow everything (default)
\`\`\`
User-agent: *
Allow: /
\`\`\`

### Block a specific directory
\`\`\`
User-agent: *
Disallow: /staging/
\`\`\`

### Block a specific bot
\`\`\`
User-agent: AhrefsBot
Disallow: /
\`\`\`

## Common Mistakes

1. **Blocking CSS/JS files** — Don't disallow CSS or JavaScript. Google needs them to render your page.
2. **Blocking your entire site** — \`Disallow: /\` blocks everything. Use carefully.
3. **No Sitemap reference** — Always include \`Sitemap:\` directive.
4. **Using robots.txt for security** — robots.txt is public. Don't hide sensitive URLs here — use authentication instead.

## Testing

Run your URL through [SEO Snapshot](/) — we check if robots.txt exists, count disallow rules, verify sitemap reference, and warn if your page is blocked.`,
  },
  'image-seo-optimization': {
    title: 'Image SEO: Alt Text, Lazy Loading, WebP',
    content: `## Why Image SEO Matters

Images make up 50% of average page weight. Poorly optimized images slow down your site and miss ranking opportunities in Google Image Search.

## Alt Text Best Practices

\`\`\`html
<!-- Bad: -->
<img src="photo.jpg" alt="">
<img src="photo.jpg" alt="image">
<img src="photo.jpg">  <!-- missing alt -->

<!-- Good: -->
<img src="photo.jpg" alt="Team meeting in modern office with whiteboard">
\`\`\`

### Rules:
1. **Be descriptive** — Describe what's in the image, not what it is
2. **Include keywords naturally** — Don't stuff keywords
3. **Keep it under 125 characters** — Screen readers truncate longer text
4. **Use empty alt for decorative images** — \`alt=""\` (not missing, empty)

## Lazy Loading

\`\`\`html
<!-- Below-fold images: add loading="lazy" -->
<img src="photo.jpg" alt="Description" loading="lazy" width="800" height="600">

<!-- Above-fold hero image: DON'T lazy load -->
<img src="hero.jpg" alt="Hero" fetchpriority="high" width="1200" height="600">
\`\`\`

## Modern Formats (WebP/AVIF)

WebP is 25-30% smaller than JPEG. AVIF is 50% smaller.

\`\`\`html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Description" width="800" height="600">
</picture>
\`\`\`

## Always Set Dimensions

Missing width/height causes layout shift (CLS):

\`\`\`html
<!-- Always include width and height: -->
<img src="photo.jpg" alt="Description" width="800" height="600">
\`\`\`

Check your images with [SEO Snapshot](/) — we detect missing alt text, missing dimensions, images without lazy loading, and non-WebP images.`,
  },
  'canonical-url-explained': {
    title: 'Canonical URLs: Prevent Duplicate Content',
    content: `## What Is a Canonical URL?

A canonical URL tells search engines which version of a page is the "main" one. This prevents duplicate content issues when the same content is accessible at multiple URLs.

## When You Need Canonical Tags

- **www vs non-www** — example.com and www.example.com
- **HTTP vs HTTPS** — http:// and https:// versions
- **Trailing slash** — /page and /page/
- **Query parameters** — /products and /products?sort=price
- **Syndicated content** — Content republished on other sites

## How to Add

\`\`\`html
<head>
  <link rel="canonical" href="https://yoursite.com/page">
</head>
\`\`\`

## Common Mistakes

1. **Missing canonical** — Every page should have one, pointing to itself
2. **Canonical to a 404 page** — Don't point to pages that don't exist
3. **Canonical doesn't match og:url** — These should be the same URL
4. **HTTP canonical on HTTPS page** — Always use HTTPS in canonical
5. **Relative URL** — Always use absolute URL with protocol

## Self-Referencing Canonicals

Even if a page has no duplicates, add a self-referencing canonical:

\`\`\`html
<!-- On https://yoursite.com/about -->
<link rel="canonical" href="https://yoursite.com/about">
\`\`\`

This is a best practice recommended by Google.

Check your canonicals with [SEO Snapshot](/) — we verify canonical exists, check for protocol mismatches, and compare with og:url.`,
  },
  'website-accessibility-seo-checklist': {
    title: 'Web Accessibility & SEO: 15 Checks',
    content: `## Why Accessibility Helps SEO

Accessibility and SEO share a common goal: making content understandable. Many accessibility fixes directly improve SEO.

## The 15-Point Checklist

### Images
1. **All images have alt text** — Screen readers and Google both use alt text
2. **Decorative images use alt=""** — Empty alt, not missing alt
3. **Images have width and height** — Prevents CLS, improves accessibility

### Headings
4. **One H1 per page** — Clear page topic for users and search engines
5. **Logical heading hierarchy** — H1 → H2 → H3, no skipping levels
6. **Headings contain keywords** — Natural keyword placement

### Forms
7. **All inputs have labels** — \`<label for="email">Email</label>\`
8. **Required fields are marked** — Use \`aria-required="true"\` or \`required\`
9. **Error messages are descriptive** — Not just "error" but "Email is required"

### Navigation
10. **Skip navigation link** — First focusable element: "Skip to main content"
11. **ARIA landmarks** — \`role="main"\`, \`role="navigation"\`, \`role="banner"\`
12. **Keyboard navigable** — All interactive elements reachable via Tab

### Content
13. **Language attribute** — \`<html lang="en">\` for screen readers
14. **Sufficient color contrast** — 4.5:1 ratio for normal text
15. **Readable font size** — Minimum 16px for body text

Check all 15 points with [SEO Snapshot](/) — we audit accessibility alongside SEO and show specific fixes for each issue.`,
  },
  'sitemap-xml-guide': {
    title: 'XML Sitemap Guide: Create and Submit',
    content: `## What Is an XML Sitemap?

An XML sitemap is a file that lists all important pages on your website. It helps search engines discover and crawl your content efficiently.

## Basic Sitemap

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com/</loc>
    <lastmod>2026-03-20</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yoursite.com/about</loc>
    <lastmod>2026-03-15</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
\`\`\`

## Next.js Sitemap (app/sitemap.ts)

\`\`\`typescript
export default function sitemap() {
  return [
    { url: 'https://yoursite.com', lastModified: new Date() },
    { url: 'https://yoursite.com/about', lastModified: new Date() },
  ];
}
\`\`\`

## Submit to Google

1. Go to Google Search Console
2. Click "Sitemaps" in the left menu
3. Enter your sitemap URL: \`https://yoursite.com/sitemap.xml\`
4. Click "Submit"

## Best Practices

1. **Include only canonical URLs** — No duplicate or redirected URLs
2. **Keep under 50,000 URLs** — Use sitemap index for larger sites
3. **Update lastmod dates** — Only when content actually changes
4. **Reference in robots.txt** — Add \`Sitemap: https://yoursite.com/sitemap.xml\`
5. **Don't include noindex pages** — Only pages you want indexed

Check if your sitemap exists and is properly configured with [SEO Snapshot](/).`,
  },
  'heading-hierarchy-seo': {
    title: 'H1-H6 Heading Hierarchy: Why It Matters',
    content: `## The Rules of Heading Hierarchy

Headings create a document outline that helps both users and search engines understand your content structure.

## The Golden Rules

### 1. One H1 Per Page
Your H1 is the main topic. Having multiple H1s confuses search engines.

\`\`\`html
<!-- Good: -->
<h1>How to Bake Chocolate Cake</h1>

<!-- Bad: -->
<h1>Recipes</h1>
<h1>Chocolate Cake</h1>
\`\`\`

### 2. Don't Skip Levels
Go H1 → H2 → H3. Never skip from H1 to H3.

\`\`\`html
<!-- Good: -->
<h1>Baking Guide</h1>
  <h2>Ingredients</h2>
    <h3>Dry Ingredients</h3>
    <h3>Wet Ingredients</h3>
  <h2>Instructions</h2>

<!-- Bad (skips H2): -->
<h1>Baking Guide</h1>
  <h3>Ingredients</h3>
\`\`\`

### 3. Include Keywords Naturally
Your H1 and H2s should contain your target keywords — but naturally, not stuffed.

### 4. Use Headings for Structure, Not Style
Don't use H3 because it "looks the right size." Use CSS for styling, headings for structure.

## SEO Impact

- **H1** carries the most weight — include your primary keyword
- **H2s** define major sections — use for subtopics
- **H3-H6** are for sub-sections — help with featured snippets

## Common Mistakes

1. **No H1 tag** — Every page needs one
2. **H1 in the logo** — Your logo shouldn't be the H1 on every page
3. **Multiple H1 tags** — Keep it to one
4. **Using headings for visual styling** — Use CSS classes instead
5. **Empty heading tags** — Never leave a heading empty

Check your heading structure with [SEO Snapshot](/) — we analyze H1-H6 count, detect multiple H1s, and warn about skipped heading levels.`,
  },
};

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles[slug];

  if (!article) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">Article not found</h1>
          <Link href="/blog" className="text-accent-400 text-sm">Back to blog</Link>
        </div>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-medium mt-8 mb-3 text-white/90">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-base font-medium mt-6 mb-2 text-white/80">{line.slice(4)}</h3>;
      if (line.startsWith('```')) return null; // skip code fences
      if (line.startsWith('|')) {
        // Simple table row
        const cells = line.split('|').filter(Boolean).map(c => c.trim());
        if (cells.every(c => c.match(/^-+$/))) return null;
        return <div key={i} className="grid grid-cols-3 gap-2 text-xs text-white/50 py-1.5 border-b border-white/[0.04]">{cells.map((c, j) => <span key={j}>{c}</span>)}</div>;
      }
      if (line.match(/^\d+\./)) return <p key={i} className="text-sm text-white/50 leading-relaxed ml-4 mb-1">{line}</p>;
      if (line.startsWith('- ')) return <p key={i} className="text-sm text-white/50 leading-relaxed ml-4 mb-1">{line}</p>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      // Check if it looks like code (indented or contains HTML tags)
      if (line.startsWith('  ') && (line.includes('<') || line.includes('{') || line.includes('}'))) {
        return <pre key={i} className="text-xs font-mono text-accent-300/70 bg-white/[0.02] px-3 py-0.5">{line}</pre>;
      }
      return <p key={i} className="text-sm text-white/50 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/blog" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>
        <h1 className="text-2xl font-medium tracking-tight mb-8 text-white/90">{article.title}</h1>
        <div className="prose-custom">
          {renderContent(article.content)}
        </div>
        <div className="mt-12 glass-card rounded-xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">Check your site's SEO score for free</p>
          <Link href="/" className="btn-primary text-sm">Analyze your site</Link>
        </div>
      </div>
    </div>
  );
}
