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
  'free-seo-audit-tool-2026': {
    title: 'Free SEO Audit Tool 2026: Compare the Top 10',
    content: `## Why You Need an SEO Audit Tool

An SEO audit tool crawls your website and identifies technical issues that hurt your search rankings. Without regular audits, problems like broken links, missing meta tags, and slow page speed silently damage your traffic.

## Top 10 Free SEO Audit Tools in 2026

### 1. SEO Snapshot (seosnapshot.dev)
- **123 checks** — most comprehensive free tool
- Copy-paste fix code snippets (unique feature)
- Security grade A+ to F
- No signup required, 5 free analyses/day
- E-E-A-T signal detection

### 2. Google Lighthouse
- Built into Chrome DevTools
- Performance, Accessibility, Best Practices, SEO scores
- No backlink or content analysis
- Good for Core Web Vitals

### 3. Semrush Site Audit (Free Tier)
- 100 pages per project
- Good issue categorization
- Limited to 1 project on free plan

### 4. Ahrefs Webmaster Tools
- Free for verified sites
- Backlink data included
- Requires Google Search Console verification

### 5. Seobility Free Checker
- Quick single-page analysis
- Clean interface
- Limited depth on free plan

### 6. SEOptimer
- 5 free reports per month
- PDF export
- Basic technical checks

### 7. The HOTH SEO Checker
- Quick overview scores
- Basic meta tag analysis
- Limited free usage

### 8. SiteChecker
- Technical crawl (250 pages free)
- Chrome extension available
- Good for small sites

### 9. Ubersuggest
- 3 free searches per day
- Keyword data included
- Owned by Neil Patel

### 10. Google Search Console
- Official Google tool
- Index coverage data
- Real search performance metrics

## Comparison Table

| Feature | SEO Snapshot | Lighthouse | Semrush Free |
|---------|-------------|------------|-------------|
| Checks | 123 | ~30 | ~100 |
| Fix code | Yes (76 snippets) | No | No |
| Security grade | A+ to F | No | No |
| Signup required | No | No | Yes |
| Backlinks | No | No | Limited |
| API access | Yes | No | No |

## How to Choose

- **Developers**: SEO Snapshot — gives you actual code to copy-paste
- **Beginners**: Lighthouse — built into Chrome, easy to understand
- **SEO professionals**: Semrush or Ahrefs — comprehensive but expensive
- **Quick check**: SEOptimer or The HOTH — fast overview

## FAQ

**Q: How often should I run an SEO audit?**
A: Monthly for active sites, quarterly for static sites. After major changes, audit immediately.

**Q: Are free SEO tools accurate?**
A: Yes, for on-page technical SEO. Backlink and ranking data requires paid tools.

**Q: What's the most important thing to fix first?**
A: Critical issues: missing title tags, no HTTPS, broken links. Use the impact score to prioritize.

Try [SEO Snapshot](/) now — 123 checks, fix code snippets, no signup needed.`,
  },
  'seo-checklist-for-developers': {
    title: 'SEO Checklist for Developers: 50 Essential Points',
    content: `## Why Developers Need SEO Knowledge

Most SEO guides are written for marketers. But developers control the HTML, server config, and page speed — the technical foundation that determines whether SEO efforts succeed or fail.

This checklist covers everything a developer should verify before deploying a website.

## Meta Tags (10 checks)

1. **Title tag exists** and is 30-60 characters
2. **Meta description** exists and is 120-160 characters
3. **Canonical URL** points to the correct page
4. **Viewport meta** tag is set for responsive design
5. **Language attribute** on html tag (\`lang="en"\`)
6. **Charset** is UTF-8
7. **Favicon** exists (ICO + SVG)
8. **robots meta** is index,follow (unless intentionally noindex)
9. **No duplicate** title or description tags
10. **Open Graph + Twitter Card** tags for social sharing

## Content Structure (8 checks)

11. **Exactly one H1** tag per page
12. **Heading hierarchy** — H1 → H2 → H3 (no skipping)
13. **No empty headings** — every heading has text
14. **Word count** above 300 for content pages
15. **Alt text** on all meaningful images
16. **Internal links** to related pages
17. **Descriptive anchor text** (not "click here")
18. **Structured data** (JSON-LD) for rich snippets

## Performance (10 checks)

19. **Gzip/Brotli compression** enabled
20. **Cache-Control headers** set for static assets
21. **Images lazy loaded** below the fold
22. **Images in WebP/AVIF** format
23. **Critical CSS** inlined or preloaded
24. **JavaScript deferred** or async
25. **No render-blocking** resources
26. **Font-display: swap** on custom fonts
27. **Preconnect** to critical third-party domains
28. **Total page weight** under 1.5MB

## Security (8 checks)

29. **HTTPS** everywhere
30. **HSTS header** with max-age ≥ 31536000
31. **CSP header** without unsafe-inline
32. **X-Frame-Options** set to DENY
33. **X-Content-Type-Options** nosniff
34. **Referrer-Policy** strict-origin-when-cross-origin
35. **No X-Powered-By** header exposed
36. **Cookies** have HttpOnly + Secure + SameSite flags

## Technical SEO (8 checks)

37. **robots.txt** exists and allows important pages
38. **sitemap.xml** lists all important URLs
39. **No redirect chains** (max 1 hop)
40. **301 redirects** for permanent URL changes (not 302)
41. **Clean URLs** — lowercase, hyphens, short
42. **Hreflang tags** for multi-language sites
43. **Canonical doesn't point to 404**
44. **No noindex on important pages**

## Accessibility (6 checks)

45. **Form labels** on all inputs
46. **Skip navigation** link
47. **ARIA landmarks** (header, nav, main, footer)
48. **Sufficient color contrast** (WCAG 4.5:1)
49. **Keyboard navigable** — all interactive elements focusable
50. **Heading hierarchy** (also an SEO factor)

## Automated Checking

Run all 50 checks automatically with [SEO Snapshot](/) — paste any URL and get results in seconds with copy-paste fix code.

## FAQ

**Q: Should developers learn SEO?**
A: Yes. 60% of SEO issues are technical — only developers can fix them properly.

**Q: What's the single most impactful SEO fix?**
A: Adding proper title tags. Pages without titles can't rank.

**Q: How do I test SEO before deploying?**
A: Use SEO Snapshot on your staging URL, or run Lighthouse in Chrome DevTools.`,
  },
  'eeat-seo-guide': {
    title: 'E-E-A-T in SEO: What It Is and How to Improve Your Score',
    content: `## What is E-E-A-T?

E-E-A-T stands for **Experience, Expertise, Authoritativeness, and Trustworthiness**. It's Google's framework for evaluating content quality — not a direct ranking factor, but a guideline that Google's Search Quality Raters use.

Google added the extra "E" (Experience) in December 2022, emphasizing first-hand experience.

## Why E-E-A-T Matters

Google's Helpful Content Update (2023-2024) significantly increased the weight of E-E-A-T signals. Sites without clear authorship, contact info, or trust indicators saw ranking drops.

## The Four Pillars

### Experience
Does the content creator have first-hand experience with the topic?

**How to demonstrate:**
- Share personal examples and case studies
- Include original screenshots or photos
- Write from "I tested this" not "experts say"

### Expertise
Does the author have relevant knowledge or qualifications?

**How to demonstrate:**
- Author bio with credentials
- Links to author's other work
- Detailed, accurate technical information

### Authoritativeness
Is the site recognized as a go-to source?

**How to demonstrate:**
- Backlinks from respected sites
- Mentions in industry publications
- Active social media presence

### Trustworthiness
Can users trust the site and its content?

**How to demonstrate:**
- HTTPS (secure connection)
- Clear contact information
- Privacy policy and terms of service
- About page with real team info
- No deceptive practices

## How to Check Your E-E-A-T Signals

[SEO Snapshot](/) automatically checks 5 E-E-A-T signals:
1. **Author information** — meta author tag or JSON-LD author
2. **About page link** — /about or about-us page exists
3. **Privacy policy** — /privacy link in footer
4. **Contact info** — contact page or mailto link
5. **Publish date** — \`<time>\` element or datePublished schema

## Actionable Improvements

1. **Add an author bio** to every blog post
2. **Create a detailed About page** with team photos
3. **Add JSON-LD Article schema** with author field
4. **Include dates** on all content (published + updated)
5. **Link to authoritative sources** (.edu, .gov, industry leaders)
6. **Add a privacy policy** and terms of service
7. **Display contact information** prominently
8. **Get backlinks** from industry publications

## FAQ

**Q: Is E-E-A-T a ranking factor?**
A: Not directly. It's a quality guideline. But sites that score well on E-E-A-T tend to rank higher because they produce helpful content.

**Q: Does E-E-A-T matter for all sites?**
A: It matters most for YMYL (Your Money or Your Life) topics — health, finance, legal, news. But all sites benefit.

**Q: How long does it take to improve E-E-A-T?**
A: Some signals (contact page, privacy policy) can be added today. Authority and expertise take months to build.

Check your E-E-A-T signals now with [SEO Snapshot](/) — we detect author info, about pages, privacy policies, and more.`,
  },
  'nginx-security-headers-guide': {
    title: 'Nginx Security Headers: Complete Configuration Guide',
    content: `## Why Security Headers Matter

Security headers protect your website from common attacks: XSS, clickjacking, MIME sniffing, and more. They also contribute to your site's trust signals — Google confirmed HTTPS as a ranking factor, and security headers build on that foundation.

## The Essential Headers

### 1. Strict-Transport-Security (HSTS)

Forces browsers to use HTTPS. Prevents downgrade attacks.

\`\`\`
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
\`\`\`

**max-age=31536000** = 1 year. Browser remembers to always use HTTPS.

### 2. Content-Security-Policy (CSP)

Controls which resources can load on your page. Prevents XSS.

\`\`\`
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self';" always;
\`\`\`

### 3. X-Frame-Options

Prevents your site from being embedded in iframes (clickjacking).

\`\`\`
add_header X-Frame-Options "DENY" always;
\`\`\`

### 4. X-Content-Type-Options

Prevents MIME type sniffing.

\`\`\`
add_header X-Content-Type-Options "nosniff" always;
\`\`\`

### 5. Referrer-Policy

Controls how much URL info is sent when users navigate away.

\`\`\`
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
\`\`\`

### 6. Permissions-Policy

Restricts browser features (camera, microphone, etc).

\`\`\`
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
\`\`\`

## Complete Nginx Configuration

\`\`\`
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Hide server info
    server_tokens off;
}
\`\`\`

## How to Check Your Headers

Use [SEO Snapshot](/) to check all 7 security headers + get a security grade from A+ to F. We also detect cookie security flags, SRI, and mixed content.

## FAQ

**Q: Do security headers affect SEO?**
A: HTTPS is a confirmed ranking factor. Other headers don't directly affect rankings but improve trust and prevent attacks.

**Q: What if I break my site with CSP?**
A: Start with CSP in report-only mode, then tighten gradually.`,
  },
  'how-to-improve-lighthouse-score': {
    title: 'How to Get Lighthouse Score 100: Step by Step Guide',
    content: `## What is Lighthouse?

Lighthouse is Google's open-source tool for auditing web page quality. It scores 4 categories: Performance, Accessibility, Best Practices, and SEO — each 0-100.

## Our Score: 100/96/100/100

SEO Snapshot scores **100 Performance, 96 Accessibility, 100 Best Practices, 100 SEO** on Lighthouse. Here's how we achieved it.

## Performance: 100/100

### Key Metrics
- **LCP** (Largest Contentful Paint): Under 2.5s
- **FID/INP** (Interaction to Next Paint): Under 200ms
- **CLS** (Cumulative Layout Shift): Under 0.1

### What We Did
1. **Static generation** with Next.js — HTML served from CDN
2. **No render-blocking scripts** — all JS deferred
3. **Gzip + Brotli** compression via Cloudflare
4. **Image optimization** — SVG for icons, lazy loading
5. **Minimal JavaScript** — no heavy libraries
6. **Font-display: swap** — no invisible text flash

### Quick Wins
- Add \`loading="lazy"\` to below-fold images
- Add \`defer\` to all script tags
- Enable gzip compression
- Set proper Cache-Control headers
- Use WebP images instead of JPEG/PNG

## SEO: 100/100

1. Title tag with keyword
2. Meta description 120-160 chars
3. Canonical URL
4. lang attribute on html
5. robots meta index,follow
6. Structured data (JSON-LD)
7. Mobile viewport meta tag
8. Proper heading hierarchy

## Best Practices: 100/100

1. HTTPS everywhere
2. No deprecated APIs
3. No console errors
4. Proper image aspect ratios
5. Charset declared

## Accessibility: Getting to 96+

1. All images have alt text
2. Color contrast ratios meet WCAG
3. Form inputs have labels
4. Heading hierarchy is logical
5. Skip navigation link exists

## Test Your Score

Use [SEO Snapshot](/) for a comprehensive audit that goes beyond Lighthouse — 123 checks with copy-paste fix code for every issue.`,
  },
  'meta-description-length-2026': {
    title: 'Meta Description Length in 2026: Character & Pixel Width Guide',
    content: `## The Short Answer

**Keep meta descriptions between 120-160 characters.** But the real limit is pixels, not characters.

## Character vs Pixel Limit

Google doesn't count characters — it measures **pixel width**:
- **Desktop**: ~920 pixels (~155-160 characters)
- **Mobile**: ~680 pixels (~120 characters)

Wide characters like "W" take more space than narrow ones like "i". That's why character count alone is unreliable.

## SEO Snapshot's Approach

[SEO Snapshot](/) measures **both** character count and estimated pixel width:
- Title pixel width check (max ~580px desktop)
- Description pixel width check (max ~920px)
- Warnings for truncation on both desktop and mobile

## Best Practices

1. **Front-load important info** — key message in first 120 chars
2. **Include target keyword** — bolded in search results
3. **Add a call-to-action** — "Learn more", "Get started", "Free guide"
4. **Unique per page** — no duplicate descriptions
5. **Match search intent** — answer the searcher's question

## Examples

**Good** (155 chars):
\`Learn how to fix missing meta descriptions with copy-paste HTML code. Free SEO audit tool with 123 checks. No signup required.\`

**Bad** (too short, 45 chars):
\`Fix meta descriptions. Check our tool.\`

**Bad** (too long, 220 chars):
\`Our comprehensive tool analyzes websites for meta description issues and provides detailed reports with actionable recommendations that you can implement to improve your search engine optimization results and rankings.\`

## FAQ

**Q: Does Google always use my meta description?**
A: No. Google may rewrite it if it thinks the page content better matches the query. But having one increases the chance Google uses yours.

**Q: What if I don't add a meta description?**
A: Google will auto-generate one from your page content. This is often irrelevant or awkwardly truncated.

Check your meta description length and pixel width with [SEO Snapshot](/) — free, no signup needed.`,
  },
  'website-security-check-guide': {
    title: 'Website Security Check: How to Grade Your Security Headers',
    content: `## What is a Security Grade?

A security grade (A+ to F) rates how well your website protects users through HTTP security headers. [SEO Snapshot](/) is one of the few tools that provides this grade as part of an SEO audit.

## How We Calculate the Grade

| Grade | Score | Meaning |
|-------|-------|---------|
| A+ | 95-100 | All headers configured optimally |
| A | 85-94 | Most headers present, minor gaps |
| B | 70-84 | Good baseline, some headers missing |
| C | 50-69 | Basic protection only |
| D | 30-49 | Significant gaps |
| F | 0-29 | Little to no protection |

## The 7 Headers We Check

1. **HSTS** — Forces HTTPS (3 points)
2. **CSP** — Prevents XSS attacks (3 points)
3. **X-Frame-Options** — Prevents clickjacking (1 point)
4. **X-Content-Type-Options** — Prevents MIME sniffing (1 point)
5. **Referrer-Policy** — Controls referrer data (1 point)
6. **Permissions-Policy** — Restricts browser features (1 point)
7. **Mixed content** — No HTTP on HTTPS pages (1 point)

Plus bonus checks: Cookie flags, SRI, X-Powered-By exposure.

## How to Fix a Low Grade

Check your site's security grade with [SEO Snapshot](/) — we provide the exact server configuration (nginx, Apache, Next.js, Vercel) to copy-paste for each missing header.

## FAQ

**Q: Do security headers affect SEO?**
A: HTTPS is a confirmed Google ranking factor. Other headers improve trust but aren't direct ranking signals.

**Q: How do I add security headers on Cloudflare?**
A: Cloudflare → Rules → Transform Rules → Modify Response Header. Add each header as a static value.`,
  },
  'technical-seo-audit-complete-guide': {
    title: 'Technical SEO Audit: The Complete 2026 Guide',
    content: `## What Is a Technical SEO Audit?

A technical SEO audit examines the infrastructure of your website — how search engines crawl, index, and render your pages. Unlike content SEO (keywords, topics), technical SEO ensures Google can actually access and understand your site.

## Why Technical SEO Matters

Google crawls billions of pages daily. If your site has technical issues, Google may:
- **Skip your pages** entirely (crawl budget waste)
- **Index the wrong version** (duplicate content)
- **Rank you lower** due to poor performance
- **Deindex pages** accidentally (noindex, robots.txt block)

## The 10-Step Technical SEO Audit

### Step 1: Crawlability

Can Google access all important pages?

**Check:**
- robots.txt exists and allows important pages
- No accidental noindex tags
- Sitemap.xml lists all important URLs
- No orphan pages (pages with no internal links)

**Tool:** [SEO Snapshot](/) checks robots.txt, sitemap, noindex, and sitemap-robots conflicts automatically.

### Step 2: Indexability

Is Google actually indexing your pages?

**Check:**
- Search \`site:yourdomain.com\` in Google
- Google Search Console → Index Coverage
- No canonical pointing to wrong URL
- No duplicate title/description tags

### Step 3: Site Architecture

How deep are your pages?

**Best practice:** Every important page should be reachable within 3 clicks from the homepage.

\`\`\`
Homepage (depth 0)
├── /products (depth 1)
│   ├── /products/shoes (depth 2)
│   │   └── /products/shoes/nike-air (depth 3) ← maximum
\`\`\`

### Step 4: Page Speed

Core Web Vitals are confirmed ranking factors:

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| LCP | < 2.5s | 2.5-4s | > 4s |
| INP | < 200ms | 200-500ms | > 500ms |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 |

**Quick wins:**
1. Enable gzip/brotli compression
2. Add Cache-Control headers
3. Lazy load images
4. Defer non-critical JavaScript

### Step 5: Mobile Friendliness

Google uses mobile-first indexing — your mobile version is what gets ranked.

**Check:**
- Viewport meta tag present
- No horizontal scrolling
- Tap targets at least 48x48px
- Text readable without zooming

### Step 6: HTTPS & Security

HTTPS is a confirmed ranking factor.

**Check:**
- All pages load over HTTPS
- No mixed content (HTTP resources on HTTPS pages)
- HSTS header configured
- Security grade A or higher

[SEO Snapshot](/) gives you a security grade from A+ to F with exact fix code for every missing header.

### Step 7: Structured Data

Schema markup enables rich results in Google.

**Check:**
- JSON-LD structured data present
- Valid schema (no errors)
- Appropriate type (Article, Product, FAQ, etc.)
- Required fields filled

### Step 8: Internal Linking

Internal links distribute ranking power across your site.

**Check:**
- No broken internal links
- No orphan pages
- Descriptive anchor text (not "click here")
- Important pages get more internal links

### Step 9: Redirects

**Check:**
- No redirect chains (A→B→C, should be A→C)
- No redirect loops
- 301 for permanent changes (not 302)
- Old URLs redirect to new ones

### Step 10: International SEO

If you serve multiple languages:

**Check:**
- Hreflang tags present
- x-default fallback defined
- Self-referencing hreflang
- Valid language codes

## Automated Audit

Run all these checks in seconds with [SEO Snapshot](/) — 123 automated checks with copy-paste fix code for every issue found.

## FAQ

**Q: How often should I do a technical SEO audit?**
A: Monthly for active sites. After every major update or redesign.

**Q: What's the most common technical SEO issue?**
A: Missing or duplicate meta descriptions, followed by missing alt text and slow page speed.

**Q: Can I do a technical SEO audit myself?**
A: Yes. Use free tools like SEO Snapshot, Google Search Console, and Lighthouse. For enterprise sites, consider Screaming Frog or Semrush.`,
  },
  'how-to-add-structured-data-json-ld': {
    title: 'How to Add JSON-LD Structured Data (With Copy-Paste Examples)',
    content: `## What Is JSON-LD?

JSON-LD (JavaScript Object Notation for Linked Data) is Google's preferred format for structured data. It tells search engines what your page is about in a machine-readable way.

## Why Add Structured Data?

Pages with structured data can show **rich results** in Google:
- ⭐ Star ratings
- 📋 FAQ accordions
- 🍳 Recipe cards
- 📅 Event dates
- 💰 Product prices
- 🔍 Sitelinks search box

Rich results get 20-30% higher click-through rates.

## Copy-Paste Templates

### WebPage (Any Page)

\`\`\`
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Your Page Title",
  "description": "Your page description",
  "url": "https://yoursite.com/page"
}
</script>
\`\`\`

### Article (Blog Post)

\`\`\`
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  "description": "Article summary",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2026-03-22",
  "dateModified": "2026-03-22",
  "publisher": {
    "@type": "Organization",
    "name": "Your Site Name"
  }
}
</script>
\`\`\`

### FAQ Page

\`\`\`
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO (Search Engine Optimization) is the practice of improving your website to increase visibility in search results."
      }
    },
    {
      "@type": "Question",
      "name": "How long does SEO take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO typically takes 3-6 months to see significant results, depending on competition and effort."
      }
    }
  ]
}
</script>
\`\`\`

### Product

\`\`\`
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>
\`\`\`

### Organization

\`\`\`
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://yoursite.com",
  "logo": "https://yoursite.com/logo.png",
  "sameAs": [
    "https://twitter.com/yourhandle",
    "https://linkedin.com/company/yourcompany"
  ]
}
</script>
\`\`\`

## Where to Add JSON-LD

Add the \`<script>\` tag in your HTML \`<head>\` or at the end of \`<body>\`. Google reads it regardless of position.

**In Next.js:**
\`\`\`
// app/layout.tsx
<script type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>
\`\`\`

**In WordPress:**
Use Yoast SEO or Rank Math plugin — they auto-generate schema.

## Validation

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [SEO Snapshot](/) — validates JSON-LD and checks required fields

## FAQ

**Q: Does structured data improve rankings?**
A: Not directly. But rich results increase CTR, which indirectly helps rankings.

**Q: Can I have multiple JSON-LD scripts on one page?**
A: Yes. Google recommends one script per entity but supports multiple.

**Q: What happens if my schema has errors?**
A: Google ignores invalid schema. It won't hurt rankings but you miss rich result opportunities.`,
  },
  'hreflang-tags-complete-guide': {
    title: 'Hreflang Tags: Complete Guide for Multi-Language Sites',
    content: `## What Are Hreflang Tags?

Hreflang tags tell Google which language and regional version of a page to show to users. Without them, Google might show the English version to a French user, or the US version to a UK user.

## When You Need Hreflang

You need hreflang if:
- Your site has pages in **multiple languages** (e.g., English + Spanish)
- You have **regional variations** of the same language (e.g., en-US vs en-GB)
- You have a **default version** for users whose language isn't specifically targeted

## Basic Syntax

\`\`\`
<link rel="alternate" hreflang="en" href="https://example.com/page">
<link rel="alternate" hreflang="es" href="https://example.com/es/page">
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page">
<link rel="alternate" hreflang="x-default" href="https://example.com/page">
\`\`\`

## The 5 Rules of Hreflang

### Rule 1: Always Include x-default

x-default is the fallback for users whose language isn't specifically targeted:

\`\`\`
<link rel="alternate" hreflang="x-default" href="https://example.com/">
\`\`\`

### Rule 2: Self-Reference

Every page must include a hreflang pointing to itself:

\`\`\`
<!-- On the English page: -->
<link rel="alternate" hreflang="en" href="https://example.com/page">
\`\`\`

### Rule 3: Reciprocal Links

If page A links to page B, page B must link back to A:

\`\`\`
<!-- On English page: -->
<link rel="alternate" hreflang="es" href="https://example.com/es/page">

<!-- On Spanish page: -->
<link rel="alternate" hreflang="en" href="https://example.com/page">
\`\`\`

### Rule 4: Valid Language Codes

Use ISO 639-1 codes:
- ✅ en, es, fr, de, tr, ja, zh
- ✅ en-US, en-GB, pt-BR, zh-TW
- ❌ english, eng, en_US

### Rule 5: Absolute URLs

Always use full URLs, not relative:
- ✅ https://example.com/page
- ❌ /page

## Implementation Methods

### Method 1: HTML Head (Recommended)
\`\`\`
<head>
  <link rel="alternate" hreflang="en" href="https://example.com/">
  <link rel="alternate" hreflang="tr" href="https://example.com/tr/">
  <link rel="alternate" hreflang="x-default" href="https://example.com/">
</head>
\`\`\`

### Method 2: HTTP Header
\`\`\`
Link: <https://example.com/>; rel="alternate"; hreflang="en",
      <https://example.com/tr/>; rel="alternate"; hreflang="tr"
\`\`\`

### Method 3: Sitemap
\`\`\`
<url>
  <loc>https://example.com/</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/"/>
  <xhtml:link rel="alternate" hreflang="tr" href="https://example.com/tr/"/>
</url>
\`\`\`

## Common Mistakes

1. **Missing x-default** — Google doesn't know which is the fallback
2. **Missing self-reference** — breaks the reciprocal chain
3. **Invalid language codes** — "english" instead of "en"
4. **Relative URLs** — must be absolute
5. **One-way links** — both pages must reference each other

## Checking Your Hreflang

[SEO Snapshot](/) automatically checks:
- x-default presence
- Self-referencing hreflang
- Valid ISO 639-1 language codes
- Hreflang tag count and languages

## FAQ

**Q: Does hreflang affect rankings?**
A: It doesn't boost rankings but ensures the right page shows to the right user, improving CTR and reducing bounce rate.

**Q: Can I use hreflang with a single-language site?**
A: Generally not needed. But if you target specific regions (en-US vs en-GB), it helps.

**Q: What if I only have 2 languages?**
A: You still need hreflang. Include both languages + x-default on every page.`,
  },
  'fix-render-blocking-resources-nextjs': {
    title: 'How to Fix Render-Blocking Resources in Next.js',
    content: `## What Are Render-Blocking Resources?

Render-blocking resources are CSS and JavaScript files that prevent the browser from displaying the page until they're fully loaded. They're one of the most common Lighthouse warnings.

## How Next.js Handles This

Next.js automatically optimizes most resources:
- **Code splitting** — only loads JS needed for the current page
- **Automatic CSS chunking** — splits CSS per page
- **Script component** — controls loading priority

But you can still have issues with:
- Third-party scripts (analytics, chat widgets)
- Custom fonts without font-display
- Large CSS libraries loaded globally

## Fix 1: Use Next.js Script Component

\`\`\`
import Script from 'next/script';

// BAD — blocks rendering
<script src="https://analytics.example.com/script.js"></script>

// GOOD — loads after page is interactive
<Script
  src="https://analytics.example.com/script.js"
  strategy="afterInteractive"
/>

// GOOD — loads when browser is idle
<Script
  src="https://chat-widget.example.com/widget.js"
  strategy="lazyOnload"
/>
\`\`\`

### Script Strategies:
- **beforeInteractive** — loads before hydration (rarely needed)
- **afterInteractive** — loads immediately after hydration (default)
- **lazyOnload** — loads during idle time (best for non-critical)

## Fix 2: Optimize Fonts

\`\`\`
// next.config.js
module.exports = {
  optimizeFonts: true, // default in Next.js 13+
};

// Use next/font (auto-optimizes, no layout shift)
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
\`\`\`

## Fix 3: Dynamic Imports

\`\`\`
import dynamic from 'next/dynamic';

// Heavy component loaded only when needed
const HeavyChart = dynamic(() => import('./Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // skip server-side render
});
\`\`\`

## Fix 4: CSS Optimization

\`\`\`
// Move component-specific CSS to CSS Modules
// styles.module.css
.card { ... }

// Component
import styles from './styles.module.css';
<div className={styles.card}>...</div>
\`\`\`

## Fix 5: Preconnect to External Domains

\`\`\`
// app/layout.tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
</head>
\`\`\`

## Measuring Impact

Use [SEO Snapshot](/) to check:
- Total render-blocking scripts count
- Inline JavaScript size
- Font-display usage
- Preconnect/DNS-prefetch hints

## FAQ

**Q: Does Next.js automatically fix render-blocking?**
A: Mostly yes, for your own code. Third-party scripts need manual optimization.

**Q: What about CSS-in-JS libraries?**
A: Tailwind CSS, CSS Modules, and styled-components are all fine with Next.js. Avoid importing large CSS files globally.`,
  },
  'open-graph-image-size-2026': {
    title: 'Open Graph Image Size and Best Practices 2026',
    content: `## Recommended OG Image Size

**1200 x 630 pixels** — this is the standard that works across all platforms.

## Size Requirements by Platform

| Platform | Recommended | Minimum | Aspect Ratio |
|----------|------------|---------|-------------|
| Facebook | 1200x630 | 600x315 | 1.91:1 |
| Twitter | 1200x628 | 600x314 | ~1.91:1 |
| LinkedIn | 1200x627 | 200x200 | 1.91:1 |
| WhatsApp | 1200x630 | 300x200 | 1.91:1 |
| Slack | 1200x630 | 250x250 | 1.91:1 |
| Discord | 1200x630 | Varies | 1.91:1 |

## The Essential OG Tags

\`\`\`
<meta property="og:title" content="Your Page Title">
<meta property="og:description" content="A compelling description under 200 chars">
<meta property="og:image" content="https://yoursite.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://yoursite.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Your Site Name">
\`\`\`

## Best Practices

### Do:
- Use 1200x630px PNG or JPG
- Keep file size under 300KB (compress with Squoosh)
- Include your brand name/logo
- Use high contrast text (readable at small sizes)
- Test with Facebook Sharing Debugger

### Don't:
- Use text-heavy images (gets cut off on mobile)
- Rely on OG image alone (always have og:title too)
- Use SVG (not supported by most platforms)
- Forget og:image:width and og:image:height
- Use HTTP URLs (must be HTTPS)

## OG Image in Next.js

\`\`\`
// app/layout.tsx
export const metadata = {
  openGraph: {
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Your Site Description',
    }],
  },
};
\`\`\`

## Dynamic OG Images

Generate OG images per page using @vercel/og:

\`\`\`
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET(request) {
  return new ImageResponse(
    <div style={{ fontSize: 48, background: '#000', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Your Dynamic Title
    </div>,
    { width: 1200, height: 630 }
  );
}
\`\`\`

## Checking Your OG Tags

[SEO Snapshot](/) checks:
- All 6 OG tags present
- og:image URL reachable (HEAD request)
- og:image completeness score

## FAQ

**Q: Does og:image affect SEO?**
A: Not directly. But good OG images increase click-through from social media, which drives traffic.

**Q: Can I use a different image for Twitter?**
A: Yes. Add twitter:image separately. If not set, Twitter falls back to og:image.

**Q: What format should I use?**
A: PNG for graphics/text, JPG for photos. Keep under 300KB.`,
  },
  'seo-score-checker-free': {
    title: 'Free SEO Score Checker: Analyze Any Website in Seconds',
    content: `## What Is an SEO Score?

An SEO score is a number from 0-100 that represents how well-optimized your website is for search engines. It's calculated by running automated checks against SEO best practices.

## What We Check (123 Checks)

[SEO Snapshot](/) runs **123 individual checks** across 7 categories:

### Meta Tags (25% of score)
- Title tag present, length, pixel width
- Meta description present, length, pixel width
- Canonical URL and deep analysis
- Viewport, lang, charset, favicon, DOCTYPE

### Content Quality (18% of score)
- Word count and readability
- Keyword placement (title, H1, URL, description)
- E-E-A-T signals (author, about page, privacy, contact)
- Heading diversity and content depth

### Technical SEO (17% of score)
- HTTPS enforcement
- Robots.txt and sitemap.xml
- Redirect chain and loop detection
- URL structure analysis
- Hreflang validation

### Performance (15% of score)
- Response time (TTFB)
- Compression (gzip/brotli)
- Render-blocking resources
- Lazy loading and image optimization
- Cache-Control headers
- Page weight and request count

### Security (10% of score)
- HTTPS (confirmed ranking factor)
- 7 security headers (HSTS, CSP, etc.)
- Cookie security flags
- Mixed content detection
- Security grade A+ to F

### Social & Schema (8% of score)
- Open Graph tags (6 tags checked)
- Twitter Card tags
- JSON-LD structured data validation

### Accessibility (7% of score)
- Form labels on inputs
- Alt text on images
- Heading hierarchy
- Language attribute

## Score Ranges

| Range | Rating | Meaning |
|-------|--------|---------|
| 90-100 | Excellent | Top-tier optimization |
| 70-89 | Good | Solid foundation, minor improvements needed |
| 50-69 | Needs Work | Significant issues hurting rankings |
| 0-49 | Poor | Major problems, likely not ranking |

## What Makes Us Different

Unlike other free SEO checkers:

1. **Copy-paste fix code** — not just warnings, actual HTML/config to implement
2. **Security grade A+ to F** — no other SEO tool does this
3. **E-E-A-T signal detection** — checks author info, about page, trust signals
4. **Tech stack detection** — WordPress, Next.js, Shopify specific advice
5. **Impact scores** — know which fix gives you the most points

## How to Use

1. Go to [seosnapshot.dev](/)
2. Enter any URL
3. Wait 5-15 seconds
4. Review your score and issues
5. Copy fix code for each issue
6. Implement and re-analyze

No signup required. 5 free analyses per day.

## FAQ

**Q: How accurate is the SEO score?**
A: Our score measures on-page technical SEO — what you can control. It doesn't include backlinks or domain authority (requires external data).

**Q: What score do I need to rank on Google?**
A: There's no magic number. But fixing critical issues (score below 50) is essential. Most top-ranking sites score 80+.

**Q: How often should I check my SEO score?**
A: Monthly, or after any significant website change. Set up monitoring for automatic weekly checks.

Try it now — [Analyze your site free](/).`,
  },
  'content-depth-seo-guide': {
    title: 'Content Depth in SEO: Why Word Count Alone Isn\'t Enough',
    content: `## The Word Count Myth

Many SEO guides say "write 2000+ words to rank." This is misleading. Google doesn't rank pages by word count — it ranks by **content quality and relevance**.

A 500-word page that perfectly answers a query will outrank a 3000-word page that rambles.

## What Is Content Depth?

Content depth measures how thoroughly a page covers its topic. It's a combination of:

1. **Topic breadth** — how many subtopics are covered
2. **Structural quality** — headings, lists, tables, images
3. **Readability** — sentence length, vocabulary level
4. **Supporting evidence** — examples, data, citations
5. **User engagement signals** — bounce rate, time on page

## How We Measure Content Depth

[SEO Snapshot](/) calculates a **Content Depth Score** (0-100) based on 7 factors:

| Factor | What We Check |
|--------|--------------|
| H2 headings | At least 2 for topic breadth |
| H3 headings | At least 1 for subtopic depth |
| Lists (ul/ol) | Present for scannable content |
| Images | At least 1 for visual context |
| Word count | 500+ for meaningful depth |
| Paragraphs | 3+ for structured argument |
| Tables/FAQ | Present for structured data |

## Content Depth vs Word Count

| Metric | Good Content | Bad Content |
|--------|-------------|-------------|
| Word count | 800-1500 | 300 OR 5000 (padded) |
| H2 headings | 4-6 (covering subtopics) | 0-1 (wall of text) |
| Lists | Yes (key points summarized) | No (buried in paragraphs) |
| Images | Relevant screenshots/diagrams | Stock photos or none |
| FAQ section | Answers real questions | No user questions addressed |
| Internal links | Links to related content | No internal linking |

## How to Improve Content Depth

### 1. Cover Related Questions
Use Google's "People Also Ask" for subtopic ideas:
- Search your target keyword
- Note the PAA questions
- Add H2 sections answering each one

### 2. Add Structured Elements
\`\`\`
<h2>Main Topic</h2>
<p>Introduction paragraph...</p>

<h3>Subtopic A</h3>
<p>Detailed explanation...</p>
<ul>
  <li>Key point 1</li>
  <li>Key point 2</li>
</ul>

<h3>Subtopic B</h3>
<table>
  <tr><th>Comparison</th><th>Option A</th><th>Option B</th></tr>
  ...
</table>
\`\`\`

### 3. Add FAQ Section
FAQ sections can trigger Google's FAQ rich snippet:

\`\`\`
<h2>Frequently Asked Questions</h2>
<h3>Q: What is content depth?</h3>
<p>A: Content depth measures how thoroughly...</p>
\`\`\`

## FAQ

**Q: Is longer content always better?**
A: No. Match content length to search intent. "What time is it in Tokyo?" needs 1 sentence, not 2000 words.

**Q: Does Google measure content depth?**
A: Not directly, but Google's Helpful Content system rewards comprehensive, well-structured content.

**Q: How do I know if my content is deep enough?**
A: Use [SEO Snapshot](/) — our Content Depth Score tells you exactly what's missing.`,
  },
  'website-speed-optimization-guide': {
    title: 'Website Speed Optimization: 15 Proven Techniques',
    content: `## Why Speed Matters

Google confirmed page speed as a ranking factor. Faster sites also convert better:
- 1 second delay = 7% less conversions
- 53% of mobile users leave if page takes 3+ seconds
- Core Web Vitals are a ranking signal

## 15 Speed Optimization Techniques

### Server-Side (1-5)

**1. Enable Compression**
\`\`\`
# Nginx
gzip on;
gzip_vary on;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript text/xml;
\`\`\`

**2. Set Cache-Control Headers**
\`\`\`
# Static assets — cache for 1 year
location ~* \\.(css|js|jpg|png|svg|woff2)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}
\`\`\`

**3. Use a CDN**
Cloudflare (free) or AWS CloudFront. Serves content from edge servers closest to users.

**4. Upgrade to HTTP/2 or HTTP/3**
HTTP/2 allows multiplexing (multiple files over one connection). Most modern servers support it.

**5. Optimize Time to First Byte (TTFB)**
- Use server-side caching (Redis, Varnish)
- Optimize database queries
- Use static site generation when possible

### Frontend (6-10)

**6. Lazy Load Images**
\`\`\`
<img src="photo.jpg" loading="lazy" alt="Description" width="800" height="600">
\`\`\`

**7. Use Modern Image Formats**
\`\`\`
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="Description">
</picture>
\`\`\`

**8. Defer Non-Critical JavaScript**
\`\`\`
<script src="analytics.js" defer></script>
<script src="chat-widget.js" async></script>
\`\`\`

**9. Inline Critical CSS**
Extract above-the-fold CSS and inline it in the HTML head. Load remaining CSS asynchronously.

**10. Preconnect to Third-Party Domains**
\`\`\`
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://www.google-analytics.com">
\`\`\`

### Content (11-15)

**11. Optimize Font Loading**
\`\`\`
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
}
\`\`\`

**12. Remove Unused CSS/JS**
Use Chrome DevTools Coverage tab to find unused code.

**13. Minimize DOM Size**
Keep under 1500 DOM elements. Deep nesting slows rendering.

**14. Avoid Layout Shifts (CLS)**
Always set width/height on images and embeds.

**15. Reduce Third-Party Scripts**
Each third-party script adds 50-200ms. Audit and remove unnecessary ones.

## Measuring Speed

Use [SEO Snapshot](/) to check:
- Response time (TTFB)
- Compression status
- Cache-Control headers
- Render-blocking resources
- Lazy loading usage
- Page weight estimation
- Request count
- Third-party script detection

## FAQ

**Q: What's a good page load time?**
A: Under 3 seconds. Aim for under 2 seconds for competitive advantage.

**Q: Does page speed directly affect rankings?**
A: Yes. Core Web Vitals (LCP, INP, CLS) are confirmed ranking factors.

**Q: Which optimization has the biggest impact?**
A: Compression + caching. They're server-side changes that affect every page instantly.`,
  },
  'keyword-cannibalization-fix': {
    title: 'Keyword Cannibalization: How to Find and Fix It',
    content: `## What Is Keyword Cannibalization?

Keyword cannibalization happens when **multiple pages on your site target the same keyword**. Instead of one strong page ranking, Google gets confused and splits ranking power between them — often resulting in neither page ranking well.

## How to Detect It

### Method 1: Google Search
Search \`site:yoursite.com "target keyword"\` — if multiple pages appear, you have cannibalization.

### Method 2: Google Search Console
Go to Performance → Filter by query → Check which pages rank for the same keyword. If multiple pages appear, they're cannibalizing each other.

### Method 3: SEO Tools
Use [SEO Snapshot](/) to analyze individual pages and check:
- Keyword density per page
- Title tag keyword usage
- H1 keyword usage

## How to Fix It

### Option 1: Consolidate (Best)
Merge competing pages into one comprehensive page:
1. Pick the stronger page (more backlinks, better content)
2. Merge content from the weaker page
3. 301 redirect the weaker page to the stronger one

### Option 2: Differentiate
Give each page a unique angle:
- Page A: "Best SEO Tools for Beginners" (informational)
- Page B: "SEO Tool Pricing Comparison" (commercial)

### Option 3: Canonical Tag
If you need both pages, add canonical to point to the primary:
\`\`\`
<link rel="canonical" href="https://yoursite.com/primary-page">
\`\`\`

### Option 4: Noindex
If one page is low-value, noindex it:
\`\`\`
<meta name="robots" content="noindex, follow">
\`\`\`

## Prevention

1. **Keyword map** — assign one primary keyword per page
2. **Check before publishing** — search your site for the keyword first
3. **Use distinct titles** — never use the same keyword in two title tags
4. **Internal linking** — link from supporting pages to the main page

## FAQ

**Q: Can cannibalization affect my entire site?**
A: Severe cases can. If Google can't determine your best page for a topic, it may lower trust in your entire domain for that topic.

**Q: How do I know which page to keep?**
A: Check Google Search Console — the page with more impressions and backlinks is usually the stronger one.

Check your pages for keyword overlap with [SEO Snapshot](/) — we detect keyword density, title/H1 keyword placement, and duplicate content signals.`,
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
