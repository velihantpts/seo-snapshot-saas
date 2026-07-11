export const articles: Record<string, { title: string; content: string }> = {
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
    content: `## What an SEO Score Actually Is

An SEO score is a proxy. A tool crawls your page, checks a fixed list of on-page and technical signals, weights them, and rolls the result into a single number. That number is useful — it turns "is this page healthy?" into something you can track over time — but it is not a ranking prediction. Google doesn't publish a score, and no third-party tool has access to the ranking system. A score answers "did I do the mechanical parts right?" It cannot answer "will this outrank the incumbent?"

Different tools measure different things and produce wildly different numbers for the same URL. Lighthouse's SEO audit checks about a dozen things — a title, a meta description, a valid \`robots.txt\`, crawlable links, legible font size. You can score 100 on Lighthouse SEO with a thin, backlink-free page. A full audit tool like the [SEO Snapshot analyzer](/) checks 100+ signals across meta, technical, performance, security, content, and social, so its number is stricter and more actionable. Neither is "the" SEO score — they're both proxies with different scopes.

## SEO Score Ranges

| Score | Rating | Meaning |
|-------|--------|---------|
| 90-100 | Excellent | Top-tier optimization, minimal issues |
| 75-89 | Good | Well-optimized, minor improvements possible |
| 50-74 | Needs Work | Several issues affecting visibility |
| 0-49 | Poor | Critical issues preventing indexing |

Treat these bands as a health check, not a leaderboard. A brand-new page with clean markup can hit 90 on day one and still get zero traffic for months because nobody links to it and Google hasn't decided it's worth ranking. An established page sitting at 68 might already pull thousands of visits because it earned authority years ago. The score describes the page's technical fitness, not its market position.

## What Affects Your Score

SEO Snapshot checks 100 factors across 7 categories. The weights aren't arbitrary — they roughly track how much each area moves the needle on whether a page can be found, understood, and trusted.

1. **Meta Tags (25%)** — Title, description, canonical, viewport. This is the heaviest bucket because these tags are how you tell search engines and users what the page is. A missing or duplicate title, a truncated description, or a wrong canonical directly changes what shows in search results and which URL gets indexed.
2. **Technical (20%)** — HTTPS, \`robots.txt\`, sitemap, redirects, status codes. This measures whether the page can be crawled and indexed at all. A \`noindex\` you forgot to remove, or a \`robots.txt\` that blocks your own CSS, is more damaging than any missing tag — which is why it's weighted second.
3. **Performance (15%)** — Page speed, render-blocking resources, and the lab-side signals that feed Core Web Vitals. Slow pages get crawled less and convert worse; Google uses page experience as a tiebreaker.
4. **Security (15%)** — HTTP response headers (HSTS, CSP, \`X-Content-Type-Options\`), cookie flags, mixed content. HTTPS is a confirmed ranking signal, and mixed-content warnings actively scare users off.
5. **Content (10%)** — Word count, keyword presence, readability. Weighted lower on purpose: a tool can count words but can't judge whether they're *good*. This is a floor check, not a quality verdict.
6. **Social (10%)** — Open Graph, Twitter Card, JSON-LD. These don't rank you directly but control how links look when shared and whether you're eligible for rich results.
7. **Accessibility (5%)** — Alt text, form labels, heading hierarchy. Overlaps with SEO (alt text and headings help both) but is the lightest bucket because most of it is indirect.

## What a Score Can't Tell You

Here's where a lot of people misread the number. A perfect on-page score does not mean you'll rank, because the biggest ranking factors are things a page crawler can't see:

- **Backlinks and authority.** Off-page signals — who links to you and how trusted those sites are — are among the strongest ranking factors, and no on-page tool can measure them. A page scoring 100 with zero referring domains will lose to a 70-scoring page with 200 quality links every time on a competitive term.
- **Search intent.** You can nail every tag and still target the wrong intent. If someone searching "best running shoes" wants a comparison list and you published a single product page, no score fixes that mismatch.
- **Content quality.** A tool sees 1,800 words and a keyword. It can't tell whether the writing actually answers the question better than the current top result. Depth that genuinely helps is what wins — see the [content depth guide](/blog/content-depth-seo-guide).
- **E-E-A-T and reputation.** Experience, expertise, authoritativeness, and trust are reputation signals Google builds over time from many sources. There's no header or tag that grants it. Our [E-E-A-T guide](/blog/eeat-seo-guide) covers what actually moves it.

So: chase the score to remove blockers and quick wins, then stop treating it as the goal and start treating traffic and rankings as the goal.

## How to Prioritize Fixes

Not every point is worth the same effort. Work in this order.

**1. Critical and indexability issues first.** Anything that stops the page from being indexed outranks every other fix. Check for a stray \`noindex\`, a \`robots.txt\` disallow on the URL, a broken canonical pointing elsewhere, or a soft 404. One of these can zero out a page no matter how clean the rest is. Confirm the page is actually indexable before touching anything cosmetic. The [technical SEO audit guide](/blog/technical-seo-audit-complete-guide) walks through the full checklist.

**2. High-impact on-page.** Title tag, meta description, and canonical. These are the 25% bucket and they're fast. A [missing meta description](/blog/how-to-fix-missing-meta-description) is usually the single biggest quick win — it's low effort and directly changes your search snippet. Generate clean tags with the [meta tag generator](/tools/meta-tag-generator).

**3. Performance and security polish.** Compress images, defer render-blocking scripts, add the security headers you're missing. Real improvements, but slower to build and lower per-point payoff than steps 1 and 2. Do them once the fundamentals are clean.

## A Realistic Before/After

A client landing page scored **58/100**. Not broken, just neglected. Four fixes over one afternoon:

- Removed a leftover \`noindex\` from a staging config that shipped to production (this was the emergency — the page couldn't rank at all).
- Wrote a proper 155-character meta description (it had none).
- Fixed a self-referencing canonical that pointed at the \`http://\` version.
- Added \`Strict-Transport-Security\` and \`X-Content-Type-Options\` headers.

New score: **86/100**. No new content, no backlinks — just removing blockers and doing the on-page basics right. The \`noindex\` fix is what got the page back into the index; the rest earned the visible points. Rankings followed over the next few weeks because the page could finally compete on the strength it already had.

## FAQ

**Is a 100 SEO score worth chasing?**
Only to the point of removing blockers and easy wins. Past ~90, extra points come from diminishing-return tweaks. Your time is better spent on content and links, which the score can't measure.

**Why does my Lighthouse SEO score differ from an audit tool's?**
They check different things. Lighthouse SEO tests roughly a dozen on-page basics; a full audit tool checks 100+ signals including security headers and social markup. Different scope, different number — both can be right.

**My score is 90 but I get no traffic. Why?**
The score confirms your page is technically healthy. Traffic needs the things it can't see: matching search intent, content that beats the current results, and backlinks. Run your URL in the [free SEO score checker](/blog/seo-score-checker-free) or [compare free audit tools](/blog/free-seo-audit-tool-2026), fix what it flags, then invest in content and authority.

**What's a good score for a brand-new site?**
Aim for 85+ on technical and on-page from launch — that's fully in your control. Rankings will lag while Google evaluates the site. [Run your URL](/) to see your score with issues ranked by impact.`,
  },
  'structured-data-json-ld-guide': {
    title: 'Structured Data (JSON-LD) Guide for Beginners',
    content: `## What Is Structured Data?

Structured data is a standardized way to describe your page's content so a machine can read it without guessing. A human sees a headline, an author byline, and a date. A search engine sees a blob of HTML. Structured data hands the machine a labeled map: this is the \`headline\`, this is the \`author\`, this is the \`datePublished\`. The vocabulary everyone uses is [schema.org](https://schema.org), a shared dictionary maintained by Google, Microsoft, and others.

Why bother? Because Google can turn that labeled data into **rich results** — the enhanced listings that stand out in search. Instead of a plain blue link, you might get star ratings under a product, expandable FAQ questions, or a recipe card with cook time and calories. Rich results don't guarantee higher rankings, but they take up more space and pull more clicks. That's the whole payoff.

## What Rich Results Actually Look Like

A few common ones, so the abstract idea gets concrete:

- **FAQ** — your questions appear as collapsible dropdowns directly in the results, so the listing takes up several extra lines.
- **Product** — price, availability ("In stock"), and a star rating with review count show under the title.
- **Recipe** — a thumbnail, star rating, total time, and calorie count in a card, often inside a carousel.
- **Breadcrumbs** — instead of \`example.com/blog/2026/03/slug\`, Google shows \`Home › Blog › Structured Data\`.
- **Article** — larger thumbnail and clearer publish date in Top Stories and news surfaces.

Google decides whether to show any of these. Valid markup makes you *eligible*; it isn't a switch you flip.

## Which Schema Types Support Rich Results

You can mark up almost anything with schema.org, but only a subset triggers a visual rich result in Google. The ones worth knowing as a beginner:

- **Article** / **BlogPosting** — blog posts and news.
- **FAQPage** — question-and-answer content you own on the page.
- **Product** — e-commerce items, usually paired with \`Offer\` and \`AggregateRating\`.
- **Recipe** — cooking content.
- **BreadcrumbList** — your page's position in the site hierarchy.
- **Organization** — your brand, logo, and social profiles (feeds knowledge panels).
- **LocalBusiness** — a physical business with address, hours, and phone.
- **Event** — dated events with a location and start time.

There are dozens more (\`Review\`, \`VideoObject\`, \`JobPosting\`…), but start with the type that matches your page. A blog post is an \`Article\`. A store page is a \`Product\`. Don't stack five types onto one page hoping something sticks — mark up what's genuinely there.

## JSON-LD vs Microdata vs RDFa

There are three ways to write structured data. **Microdata** and **RDFa** interleave attributes into your HTML tags (\`itemscope\`, \`itemprop\`, \`vocab\`), so the markup is scattered across the visible content. **JSON-LD** keeps everything in a single \`<script>\` block, separate from your HTML.

Google explicitly recommends JSON-LD, and for good reason. It sits in one place, so you can generate it server-side, template it, and diff it in code review without touching your markup. Microdata forces you to keep attributes in sync with the DOM every time a designer moves an element. Unless you're maintaining a legacy site already full of Microdata, use JSON-LD and don't look back.

Here's the same Article in JSON-LD:

\`\`\`html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Structured Data (JSON-LD) Guide for Beginners",
  "author": { "@type": "Person", "name": "Author Name" },
  "datePublished": "2026-03-20",
  "image": "https://yoursite.com/image.jpg"
}
</script>
\`\`\`

## Ready-to-Use Templates

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

Every block starts the same: \`@context\` points at schema.org, \`@type\` names what you're describing. Get those two right and the rest is filling in properties. For more copy-paste blocks — Product, LocalBusiness, BreadcrumbList — see [how to add JSON-LD structured data with examples](/blog/how-to-add-structured-data-json-ld), or generate one for your page with the [schema generator](/tools/schema-generator).

## Where to Put the Script

The \`<script type="application/ld+json">\` tag can go in \`<head>\` or at the end of \`<body>\` — both are valid, and Google reads either. \`<head>\` is the conventional home. On a framework like Next.js, render it server-side so it's in the initial HTML; Google does execute JavaScript, but static output is one less thing to go wrong.

## Required vs Recommended Properties

Each rich-result type has a spec in Google's documentation splitting properties into **required** and **recommended**. Miss a *required* property and you lose eligibility entirely — Search Console flags it as an error. Miss a *recommended* one and you're still eligible, but you leave a possible enhancement on the table (a warning, not an error).

Example: a \`Product\` result needs a \`name\`. To show a price you need an \`Offer\` with \`price\` and \`priceCurrency\`. To show stars you need \`review\` or \`aggregateRating\`. Skip the rating and you still get a valid Product — just no stars. Read the spec for your type once and keep the required fields straight.

## How to Test It

Never trust markup you haven't validated. Three tools:

1. **[Rich Results Test](https://search.google.com/test/rich-results)** — Google's own checker. Tells you which rich result you're eligible for and lists errors and warnings.
2. **[Schema Markup Validator](https://validator.schema.org)** — checks schema.org syntax generally, beyond just rich-result types.
3. **Search Console** — the *Enhancements* reports show errors across your whole live site over time, not just one URL.

To confirm your markup is present and parseable on a live page, run the URL through the [SEO Snapshot analyzer](/) — it detects and validates the common schema types automatically, which is a fast first pass before you open the Google testers.

## Common Beginner Mistakes

- **Invalid JSON.** A trailing comma or a smart quote pasted from a doc breaks the whole block silently. Validators catch this instantly.
- **Marking up content that isn't on the page.** Google's guidelines require the structured data to reflect visible content. Inventing FAQ answers users can't see, or claiming a rating you don't display, is a spam violation that can trigger a manual action.
- **Wrong \`@type\`.** Tagging a category listing as \`Product\`, or a blog index as \`Article\`, gives Google contradictory signals. Match the type to what the page really is.
- **Missing required fields.** The most common Search Console error. Check the spec.
- **Fake or self-serving reviews.** \`AggregateRating\` on your own site, unmoderated, is exactly what Google's reviews policy targets.

Structured data is one layer of a healthy site. Pair it with the fundamentals in a [technical SEO audit](/blog/technical-seo-audit-complete-guide) and back it with the credibility signals covered in the [E-E-A-T guide](/blog/eeat-seo-guide) — schema tells Google *what* the content is; those tell it *whether to trust it*.

## FAQ

**Does adding structured data improve my rankings?**
Not directly. It makes you eligible for rich results, which can raise click-through rate. Better CTR can indirectly help, but schema itself isn't a ranking factor.

**Do I need to submit structured data to Google anywhere?**
No. Google picks it up when it crawls the page. You can request re-indexing in Search Console to speed things up, but there's no separate submission step.

**Why isn't my rich result showing even though the test passes?**
Passing the Rich Results Test means you're *eligible*, not guaranteed. Google chooses per query, and it can take days to weeks after the page is re-crawled. It may also withhold rich results from sites with quality or policy issues.

**Can I use more than one JSON-LD block on a page?**
Yes. Multiple \`<script type="application/ld+json">\` blocks are fine — for example one for \`BreadcrumbList\` and one for \`Article\`. Just keep each valid on its own.`,
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
    content: `## What "Render-Blocking" Actually Means

When the browser parses your HTML and hits a \`<link rel="stylesheet">\` or a plain \`<script src>\`, it can't just keep going. Those resources sit on the **critical rendering path** — the sequence of work the browser must finish before it can paint a single pixel.

CSS blocks rendering because the browser refuses to paint content it might have to restyle. It builds the DOM from HTML and the CSSOM from your stylesheets, then combines them into the render tree. Until the CSSOM is complete, there's no render tree, so there's nothing to show. A stylesheet in the \`<head>\` therefore holds back **First Contentful Paint (FCP)** for as long as it takes to download and parse.

Synchronous JavaScript blocks for a different reason: it can call \`document.write()\` or mutate the DOM, so the parser stops dead at each \`<script>\` tag, fetches the file, executes it, and only then resumes parsing. Worse, if a stylesheet is still loading when the parser reaches a script, the browser also waits for that CSS first (scripts might read computed styles). One slow \`.js\` file in the head can stall everything behind it.

That's the whole problem in one sentence: **resources in the head delay the first paint, and delaying the first paint delays LCP and hurts your [Core Web Vitals](/blog/how-to-improve-core-web-vitals).**

## Reading the Lighthouse Audit

In PageSpeed Insights and Lighthouse the audit is called **"Eliminate render-blocking resources."** It lists each blocking URL with two numbers: **Transfer size** and **Potential savings (ms)**. The savings estimate is Lighthouse's guess at how much FCP would improve if that resource stopped blocking — it's a lab estimate, not a promise, but it tells you where to spend effort.

Sort by savings and work top-down. A 4 ms saving on a tiny stylesheet isn't worth touching; a 900 ms blocking third-party script is. [SEO Snapshot's analyzer](/) also lists render-blocking scripts and stylesheets with their URLs when you run your page, which is a fast way to see what's in the head before you open DevTools.

## defer vs async vs module

For scripts, the fix is almost always an attribute change. Here's how the three loading modes actually behave:

| Attribute | Downloads | Blocks parser? | Executes | Order preserved | Use for |
|---|---|---|---|---|---|
| (none) | immediately | **Yes** | as soon as fetched | yes | almost never in \`<head>\` |
| \`async\` | in parallel | no | the moment it arrives | **no** | independent scripts: analytics, ads |
| \`defer\` | in parallel | no | after HTML parsing, before \`DOMContentLoaded\` | yes | app code, anything with dependencies |
| \`type="module"\` | in parallel | no | deferred by default, after parsing | yes (per graph) | modern ES modules |

\`\`\`html
<!-- Your main app bundle: order matters, wait for the DOM -->
<script src="/js/app.js" defer></script>

<!-- Fire-and-forget, no dependencies -->
<script src="https://analytics.example.com/tag.js" async></script>

<!-- ES modules are deferred automatically -->
<script type="module" src="/js/main.mjs"></script>
\`\`\`

The mental model: reach for \`defer\` by default. Use \`async\` only when the script genuinely doesn't care about DOM readiness or execution order. Note that \`type="module"\` is deferred *implicitly* — adding \`defer\` to a module does nothing.

## The Critical-CSS + Async-Load Pattern

CSS has no \`defer\`. The standard trick is to inline the small slice of CSS needed to render above-the-fold content, then load the full stylesheet without blocking:

\`\`\`html
<head>
  <style>/* critical, above-the-fold CSS only — header, hero, layout */</style>

  <link rel="stylesheet" href="/css/full.css"
        media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/css/full.css"></noscript>
</head>
\`\`\`

\`media="print"\` makes the browser treat the stylesheet as non-render-blocking (it's not for the screen), so it downloads without holding up paint. The \`onload\` handler flips \`media\` back to \`all\` once it arrives, applying the styles. The \`<noscript>\` fallback matters: with JavaScript disabled, \`onload\` never fires, so you'd ship an unstyled page without it.

**The caveat nobody mentions:** if your critical CSS is wrong or incomplete, the async stylesheet lands a moment later and restyles the page — a visible flash. Tools like \`critical\` or \`critters\` (used by some frameworks) extract above-the-fold CSS automatically. Get the critical set right or you're trading a slow paint for a janky one.

## Splitting CSS by Media Query

You don't always need the async trick. The browser downloads stylesheets with non-matching \`media\` at a low priority and doesn't let them block render:

\`\`\`html
<link rel="stylesheet" href="/css/base.css">
<link rel="stylesheet" href="/css/print.css" media="print">
<link rel="stylesheet" href="/css/desktop.css" media="(min-width: 1024px)">
\`\`\`

On a phone, \`desktop.css\` and \`print.css\` don't block the first paint. Splitting one giant \`styles.css\` into media-scoped files is a low-risk win if your CSS is already organized by breakpoint.

## preload vs preconnect vs dns-prefetch

These three resource hints get confused constantly. They solve different problems:

\`\`\`html
<!-- Fetch a specific resource early, at high priority -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- Open the full connection (DNS + TCP + TLS) to a known origin -->
<link rel="preconnect" href="https://cdn.example.com" crossorigin>

<!-- Just resolve DNS — cheap, for origins you'll touch but not immediately -->
<link rel="dns-prefetch" href="https://analytics.example.com">
\`\`\`

- **\`preload\`** tells the browser to fetch *this exact file* now because it's needed soon (fonts, the LCP image, a critical CSS chunk). It does not block render, but it competes for bandwidth.
- **\`preconnect\`** warms up a connection to a third-party origin so the eventual request skips the handshake — worth ~100–300 ms on a fresh TLS connection. Use it for origins you're certain you'll hit.
- **\`dns-prefetch\`** does only the DNS lookup. It's the lightweight fallback for \`preconnect\` on origins that are lower priority or many in number.

## Third-Party Scripts

Third-party tags — tag managers, chat widgets, A/B testing, ads — are often the biggest offenders because you don't control their size or timing. Rules that hold up:

- Load them \`async\`, never synchronously in the head.
- \`preconnect\` to their origin so the request is ready.
- Delay non-essential widgets (live chat, heatmaps) until user interaction or \`requestIdleCallback\` — they don't need to run during first paint.
- Self-host what you can. A self-hosted analytics snippet avoids an extra DNS + TLS round trip.

## Common Mistakes

**Deferring a script an inline script depends on.** If you \`defer\` jQuery but keep an inline \`<script>\` that calls \`$(...)\` in the body, the inline script runs first and throws \`$ is not defined\`. Deferred scripts run *after* parsing; inline scripts run *immediately*. Either defer both or convert the inline code to a \`DOMContentLoaded\` listener.

**Preloading everything.** \`preload\` is a priority instruction. Preload ten things and you've told the browser nothing is more important than anything else — you'll delay your real LCP resource. Preload the one or two assets on the critical path, no more. Chrome will warn in the console when a preloaded resource isn't used within a few seconds.

**Inlining too much CSS.** Inlined CSS isn't cached and ships on every HTML response. Inline your full 60 KB stylesheet and every page load re-downloads it, bloating the HTML and hurting repeat visits. Keep the inline block to genuine above-the-fold styles — usually a few KB.

## Before / After

\`\`\`html
<!-- BEFORE: three blocking resources in the head -->
<head>
  <link rel="stylesheet" href="/css/styles.css">
  <script src="/js/jquery.js"></script>
  <script src="/js/app.js"></script>
</head>
\`\`\`

\`\`\`html
<!-- AFTER: nothing blocks the first paint -->
<head>
  <style>/* critical CSS */</style>
  <link rel="stylesheet" href="/css/styles.css"
        media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/css/styles.css"></noscript>
  <script src="/js/jquery.js" defer></script>
  <script src="/js/app.js" defer></script>
</head>
\`\`\`

## Measuring the Win

Don't trust the score alone — measure FCP and LCP before and after. Run the page in an incognito window with the DevTools Performance panel, or re-run Lighthouse in a controlled environment (throttling on, no extensions). Field data in the Chrome UX Report is the real judge, but it lags weeks behind, so use lab numbers to iterate. Fixing render-blocking on a page that had two blocking scripts and a full stylesheet in the head commonly moves FCP by 0.3–1 s and LCP by 0.5–2 s.

If you want the framework-specific version of all this, see [fixing render-blocking resources in Next.js](/blog/fix-render-blocking-resources-nextjs). For the broader picture, [website speed optimization](/blog/website-speed-optimization-guide) and [getting a Lighthouse score of 100](/blog/how-to-improve-lighthouse-score) cover the other audits that move alongside this one.

## FAQ

**Does \`defer\` slow anything down?** No. Deferred scripts still download in parallel during parsing; they just execute after the DOM is built. For most sites \`defer\` is strictly better than a blocking script in the head.

**Should I inline all my CSS to pass the audit?** No. Inline only above-the-fold critical CSS and load the rest asynchronously. Inlining everything kills caching and bloats every HTML response.

**Is \`async\` faster than \`defer\`?** Not meaningfully — both download without blocking. \`async\` executes sooner but in unpredictable order, which breaks dependent code. Use \`defer\` unless the script is truly independent.

**Why does Lighthouse still flag a stylesheet after I split it?** Check the \`media\` attribute actually doesn't match the test conditions. Lighthouse runs mobile emulation by default, so a \`media="(min-width: 1024px)"\` sheet won't block — but a plain screen stylesheet still will.`,
  },
  'robots-txt-guide': {
    title: 'robots.txt Guide: Control Search Engine Crawling',
    content: `## What robots.txt actually does

robots.txt is a plain text file at the root of your host that tells crawlers which URL paths they're allowed to request. That's it. It controls *crawling* — whether a bot fetches the page — not *indexing*, and definitely not access. The file is public, unauthenticated, and advisory. Well-behaved bots (Googlebot, Bingbot) obey it; scrapers and malware ignore it entirely.

A few mechanics that trip people up:

- **It's per-host, per-scheme.** \`https://example.com/robots.txt\` covers \`https://example.com\` only. \`www.example.com\`, \`blog.example.com\`, and the \`http://\` version each need their own file (or a redirect to the canonical one). A subdomain has no access to its parent's rules.
- **It has to live at exactly \`/robots.txt\`.** \`/subfolder/robots.txt\` does nothing. \`/Robots.txt\` won't be found — the path is case-sensitive on most servers, though the filename crawlers request is always lowercase.
- **Google caches it for roughly 24 hours.** Change a rule and Googlebot may keep using the old version for up to a day. Don't expect an instant effect.
- **A 5xx on robots.txt can freeze crawling.** If Google requests your robots.txt and gets a server error, it may treat the whole site as disallowed until the file responds again. A missing file (clean 404) means "crawl everything" — which is fine.

## Crawling vs indexing — the mistake that costs traffic

This is the single most common robots.txt error, so read it twice: **\`Disallow\` does not remove a page from Google.** It stops Google from *fetching* the page. But if other sites link to that URL, Google can still index it — showing the URL with a snippet like "No information is available for this page" because it was never allowed to read the content.

So if your goal is "keep this out of search results," robots.txt is the wrong tool. You need a \`noindex\` signal, which the crawler has to actually *read* the page to see:

\`\`\`html
<meta name="robots" content="noindex">
\`\`\`

Or the header equivalent for non-HTML files like PDFs:

\`\`\`nginx
add_header X-Robots-Tag "noindex" always;
\`\`\`

The trap: if you \`Disallow\` the page *and* add \`noindex\`, Google can't crawl it, so it never sees the \`noindex\`, and the URL can linger in the index anyway. To deindex, **allow crawling and use noindex** — then, once it's dropped out, you can Disallow it. You can generate either signal with the [robots meta / X-Robots-Tag generator](/tools/robots-meta-generator), and the difference between blocking and de-duplicating is covered in [Canonical URLs explained](/blog/canonical-url-explained). For anything truly private, neither robots.txt nor noindex is security — use authentication or a password.

## Crawl budget: mostly a big-site problem

"I need robots.txt to save crawl budget" is usually premature. Google crawls small and medium sites (say, under ~10k URLs) about as often as it wants to; you're not fighting a limit. Crawl budget becomes real when you have hundreds of thousands of URLs, faceted navigation generating infinite parameter combinations, or a slow server where every crawl request costs you. There, blocking low-value URL patterns (\`?sort=\`, \`?sessionid=\`, internal search results) keeps Googlebot focused on pages that matter. For a normal blog or brochure site, don't over-engineer it.

## How matching works

### User-agent selection

A crawler reads the file, finds the group whose \`User-agent\` line best matches its name, and obeys **only that group**. Matching is by longest (most specific) token, case-insensitive. Given:

\`\`\`
User-agent: *
Disallow: /internal/

User-agent: Googlebot
Disallow: /no-google/
\`\`\`

Googlebot uses the second group *only* — it ignores the \`*\` group entirely, so \`/internal/\` is *not* blocked for Googlebot. If you want a rule to apply to everyone including a specifically-named bot, you have to repeat it in that bot's group.

### Allow vs Disallow precedence

Within a group, Google doesn't go top-to-bottom. It picks the rule with the **longest path match**; if an Allow and a Disallow tie on length, Allow wins. This lets you carve exceptions:

\`\`\`
User-agent: *
Disallow: /downloads/
Allow: /downloads/public/
\`\`\`

\`/downloads/public/report.pdf\` is allowed (longer match), while everything else under \`/downloads/\` stays blocked. Note Bing's engine leans more on rule order, so keep patterns unambiguous rather than relying on subtle length ties.

### Wildcards: \`*\` and \`$\`

Two special characters, both supported by Google and Bing:

- \`*\` matches any sequence of characters.
- \`$\` anchors the end of the URL.

\`\`\`
User-agent: *
Disallow: /*?           # any URL containing a query string
Disallow: /*.pdf$       # any URL ending in .pdf
Allow: /*.js$           # (usually unnecessary — see below)
\`\`\`

\`Disallow: /*.pdf$\` blocks \`/report.pdf\` but not \`/report.pdf?v=2\` (the \`$\` requires \`.pdf\` to be the literal end).

### Trailing-slash gotcha

\`Disallow: /blog\` blocks \`/blog\`, \`/blog/\`, \`/blogging\`, and \`/blog-archive\` — it's a prefix, not an exact path. If you only mean the folder, write \`Disallow: /blog/\` with the trailing slash. Getting this wrong quietly blocks pages you never intended to.

### Crawl-delay

\`\`\`
User-agent: *
Crawl-delay: 10
\`\`\`

**Google ignores \`Crawl-delay\` completely.** Bing and Yandex honor it. To throttle Googlebot, set the crawl rate in Search Console instead (or just serve pages faster).

## Platform templates

**WordPress** serves a virtual robots.txt if no physical file exists. A sane starting point:

\`\`\`
User-agent: *
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://example.com/sitemap_index.xml
\`\`\`

**Next.js (App Router)** — generate it dynamically so it stays in sync with your environment:

\`\`\`typescript
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
\`\`\`

**Static site (nginx)** — just drop a file at the web root; make sure it's served as \`text/plain\` and not swallowed by a catch-all route.

Whichever platform, pair robots.txt with a real sitemap — see the [XML Sitemap guide](/blog/sitemap-xml-guide) for the \`Sitemap:\` directive and how the two work together — and generate a clean file fast with the [robots.txt generator](/tools/robots-txt-generator).

## Before / after

A blog owner wanted to keep their tag archives out of Google. They wrote:

\`\`\`
User-agent: *
Disallow: /tag/
Disallow: /css/
Disallow: /js/
\`\`\`

Two problems: blocking \`/css/\` and \`/js/\` stops Google rendering the site (it can't see your layout or interactive content, which hurts rankings), and \`Disallow: /tag/\` doesn't deindex the tag pages already in Google — it just freezes them. Fixed version:

\`\`\`
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml
\`\`\`

...combined with \`<meta name="robots" content="noindex,follow">\` on the tag templates themselves. Crawlable, renderable, and the tag pages actually drop out of the index over the next few weeks.

## Common mistakes

- **Blocking CSS/JS.** Google renders pages like a browser. Block the assets and you can tank how it understands your content. Almost never disallow these.
- **Treating it as security.** The file is world-readable and often *advertises* your sensitive paths. Use auth.
- **Blocking staging, then shipping the block to production.** A \`Disallow: /\` on staging that gets deployed live will quietly remove your whole site from Google. This is the classic launch-day disaster — check production's robots.txt on day one.
- **Assuming Disallow deindexes.** Covered above. It doesn't.
- **Prefix vs folder trailing-slash slips.** \`Disallow: /new\` also blocks \`/newsletter\`.

## FAQ

**Do I even need a robots.txt?** Not strictly. A missing file means "crawl everything," which is a fine default. Add one when you have paths to exclude or a sitemap to advertise.

**Why is my page still in Google after I disallowed it?** Because \`Disallow\` blocks crawling, not indexing. Remove the Disallow, add \`noindex\`, let Google re-crawl, then re-block if you want.

**Can I have more than one Sitemap line?** Yes — list each on its own \`Sitemap:\` line, with absolute URLs. They can sit anywhere in the file.

**How do I know if a specific page is blocked?** Run the URL through the [SEO Snapshot analyzer](/) — it fetches your robots.txt, tells you whether the page is crawlable, checks for a sitemap reference, and flags accidental blocks. It's a fast sanity check before and after a launch, and pairs well with a full [technical SEO audit](/blog/technical-seo-audit-complete-guide).`,
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
    content: `## What a Canonical URL Actually Is

Canonicalization is the process search engines use to pick one representative URL when the same (or nearly the same) content is reachable at several addresses. The \`rel="canonical"\` tag is how you tell Google which version you consider primary.

The part most guides get wrong: \`rel="canonical"\` is a **hint, not a directive**. Google treats it as one signal among several. If your canonical says one thing but your internal links, sitemap, and redirects say another, Google can and will override your choice and pick a different canonical. A directive (like a \`noindex\` tag or a \`Disallow\` in robots.txt) has to be obeyed. A hint gets weighed.

That distinction explains almost every canonical problem people run into.

## The Signals Google Weighs to Pick a Canonical

When duplicates exist, Google clusters them and chooses one canonical for the group. The signals it uses include:

- **The \`rel="canonical"\` you declared** — your stated preference.
- **Internal links** — which version do your own pages link to most?
- **The URL in your XML sitemap** — sitemaps imply "this is the one I want indexed."
- **Redirects** — a 301 is a strong vote for the destination.
- **HTTPS over HTTP** — Google prefers the secure version, all else equal.
- **Shorter, cleaner URLs** — mild tiebreaker.
- **\`hreflang\` and other on-page consistency.**

When these agree, canonicalization just works. When they conflict, Google trusts the weight of the evidence over your tag. That's why the fix is almost never "just change the tag" — it's making every signal point at the same URL.

## Where Duplicate URLs Come From

Most sites generate duplicates without anyone deciding to. The usual suspects:

- **www vs non-www** — \`example.com\` and \`www.example.com\` serve the same content.
- **http vs https** — both protocols resolve.
- **Trailing slash** — \`/page\` and \`/page/\`.
- **\`index.html\`** — \`/dir/\` and \`/dir/index.html\`.
- **Query parameters** — \`/products\` vs \`/products?sort=price\`. Sorting and filtering create near-infinite variants.
- **UTM and faceted params** — \`?utm_source=newsletter\` is the same page; faceted navigation (\`?color=red&size=m\`) can spawn thousands of crawlable URLs.
- **Pagination** — \`/blog?page=2\`. Each page is distinct content, so it should usually self-canonicalize, *not* canonical back to page 1 (that hides the deeper pages' links).
- **Print / AMP versions** — a \`/print\` or AMP copy should canonical to the main article.
- **Syndication** — when a partner republishes your article, they should point a **cross-domain canonical** at your original so you keep the credit.

For www/non-www, http/https, trailing slash, and \`index.html\`, the right primary fix is a 301 redirect to one form — canonical is the backup. For query-param duplicates you usually can't redirect (the params do real work), so canonical is the main tool.

## How to Set the Canonical

**HTML \`<head>\`** — the common case. Always absolute, always the protocol you actually serve:

\`\`\`html
<head>
  <link rel="canonical" href="https://yoursite.com/page" />
</head>
\`\`\`

**HTTP \`Link\` header** — for non-HTML files (PDFs, images) where there's no \`<head>\` to put a tag in. Set it at the server:

\`\`\`nginx
location ~* \\.pdf$ {
  add_header Link '<https://yoursite.com/files/whitepaper.pdf>; rel="canonical"';
}
\`\`\`

**Next.js metadata** — the App Router exposes canonical through \`alternates\`:

\`\`\`typescript
export const metadata = {
  alternates: {
    canonical: 'https://yoursite.com/page',
  },
};
\`\`\`

For dynamic routes, build it per-page in \`generateMetadata\` so every URL self-references correctly instead of every page inheriting one hardcoded value.

## Self-Referencing Canonicals

Even a page with zero duplicates should point a canonical at itself:

\`\`\`html
<!-- On https://yoursite.com/about -->
<link rel="canonical" href="https://yoursite.com/about" />
\`\`\`

This inoculates the page against accidental duplicates — tracking params, a stray \`index.html\`, a CMS that adds a slash. It costs nothing.

## Fixing "Duplicate, Google chose a different canonical"

This is the Search Console status that sends people digging. It means: Google found your page, saw your \`rel="canonical"\`, and decided a *different* URL is the real canonical anyway. Your declared preference lost the vote.

It's a hint-vs-signals problem: your other signals contradict your tag. To fix it, align all of them on ONE URL:

1. **Pick the winner** — decide the single canonical URL for the cluster.
2. **Fix internal links** — make sure your nav, footer, and in-content links point to that exact URL (right protocol, right slash). This is usually the biggest lever.
3. **Fix the sitemap** — list only the canonical URL, never the duplicates. See the [XML sitemap guide](/blog/sitemap-xml-guide) for keeping sitemaps to canonical URLs only.
4. **Fix redirects** — 301 the alternates to the chosen URL where you can.
5. **Confirm the tag** — the \`rel="canonical"\` matches the chosen URL and is served in the raw HTML, not injected late by JavaScript.

Then request validation and wait a crawl cycle. When the signals stop fighting, Google's pick flips to yours.

## Canonical vs 301 vs noindex vs hreflang

These get mixed up constantly. Quick decision guide:

- **301 redirect** — you want *one* URL to exist. Users and bots both land on the destination. Use for www/https consolidation, moved pages, killed duplicates. It's a directive and passes the strongest signal. Generate config with the [redirect generator](/tools/redirect-generator).
- **rel=canonical** — you need *both* URLs to stay reachable (filters, tracking params, syndication) but want only one indexed. A hint.
- **noindex** — keep the page live and crawlable but out of the index entirely (thank-you pages, thin tag archives, internal search results). A directive. Don't combine \`noindex\` with a canonical to another page — the mixed signal confuses Google.
- **hreflang** — the pages are the *same content in different languages/regions* and should *all* be indexed, each shown to the right audience. It's not a duplicate-handling tool. Details in the [hreflang tags guide](/blog/hreflang-tags-complete-guide).

Canonical is also one lever for [fixing keyword cannibalization](/blog/keyword-cannibalization-fix) — when two of your pages compete for the same query, canonicalizing the weaker one to the stronger consolidates the signals. For the full crawl-and-index picture, the [technical SEO audit guide](/blog/technical-seo-audit-complete-guide) covers where canonicals fit alongside redirects and sitemaps.

## Before / After

Before — signals fighting, params indexed separately:

\`\`\`html
<!-- served at https://shop.com/shoes?utm_source=fb -->
<link rel="canonical" href="http://shop.com/shoes/" />
\`\`\`

Protocol mismatch (http on an https page), trailing slash the site doesn't use, and the sitemap listing the param version. Google picks its own canonical.

After — one clean, self-consistent target:

\`\`\`html
<!-- served at https://shop.com/shoes?utm_source=fb -->
<link rel="canonical" href="https://shop.com/shoes" />
\`\`\`

Same protocol, no stray slash, param stripped, and the sitemap plus internal links all point at \`https://shop.com/shoes\`.

## FAQ

**Does a canonical pass link equity like a 301?** Roughly, yes — consolidated signals flow to the canonical. But it's weaker and slower than a 301 because it's a hint. If you don't need both URLs live, redirect instead.

**Can I canonical to a different domain?** Yes — cross-domain canonicals are the correct way to handle syndication. The republisher points at your original.

**Should paginated pages canonical to page 1?** No. Let each page self-canonicalize so Google can crawl the links on pages 2, 3, and beyond. Pointing them all at page 1 buries that content.

**My canonical is ignored — why?** Usually conflicting signals (internal links or sitemap pointing elsewhere), a canonical injected by JavaScript that the crawler doesn't see, or a canonical to a URL that redirects or 404s.

Run your URL through [SEO Snapshot](/) to check that a canonical exists, that it uses the right protocol, and that it matches your \`og:url\` — three of the most common quiet mistakes.`,
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
    content: `## What an XML sitemap actually does

An XML sitemap is a list of URLs you want Google to know about. That's it. It doesn't force indexing, it doesn't boost rankings, and it won't rescue thin pages. What it does well is help crawlers *discover* URLs that internal linking might miss — deep pages, fresh posts, pages orphaned by a bad nav. On a small, well-linked site the impact is marginal. On a large site, or one where new content outpaces Google's recrawl, it's how discovery keeps up.

The most common mistake: treating the sitemap as a dump of every URL that returns HTML. A sitemap is a set of *recommendations*, and Google reads one full of junk as a signal your site quality is low.

## What belongs in a sitemap (and what doesn't)

Every URL in your sitemap should be a page you'd be happy to see ranking. Concretely, each entry must be:

- **Canonical** — the version you consider authoritative. Never list a URL whose \`<link rel="canonical">\` points somewhere else.
- **Status 200** — no redirects, no 404s, no soft-404s. If \`/old-page\` 301s to \`/new-page\`, list \`/new-page\`.
- **Indexable** — not blocked by \`noindex\` (meta tag or \`X-Robots-Tag\`), not disallowed in robots.txt.

Putting a \`noindex\` URL in your sitemap sends Google two contradictory instructions: "index this" and "don't index this." Search Console flags exactly this as an error. Same story with canonicalized-away duplicates — if \`?ref=twitter\` canonicalizes to the clean URL, only the clean URL goes in the sitemap.

For a full pass over which pages should be indexable in the first place, work through the [technical SEO audit guide](/blog/technical-seo-audit-complete-guide); the sitemap is downstream of those decisions. And if you're unsure which URL is canonical, the [canonical URLs explainer](/blog/canonical-url-explained) covers how Google picks a representative when signals conflict.

## The limits: 50,000 URLs, 50MB, and sitemap index files

A single sitemap file caps at **50,000 URLs** or **50MB uncompressed**, whichever you hit first. Gzip is allowed and recommended (\`sitemap.xml.gz\`), but the 50MB limit is measured *before* compression.

Cross either limit and you split into multiple sitemaps referenced by a **sitemap index** — a sitemap of sitemaps:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://yoursite.com/sitemaps/posts-1.xml</loc>
    <lastmod>2026-07-10</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://yoursite.com/sitemaps/products.xml</loc>
    <lastmod>2026-07-09</lastmod>
  </sitemap>
</sitemapindex>
\`\`\`

Splitting by content type (posts, products, categories) is smarter than splitting arbitrarily — Search Console reports coverage per sitemap, so a logical split tells you *which section* has indexing problems.

## lastmod, priority, and changefreq — what Google reads

\`\`\`xml
<url>
  <loc>https://yoursite.com/blog/xml-sitemaps</loc>
  <lastmod>2026-07-08T14:20:00+00:00</lastmod>
</url>
\`\`\`

**\`lastmod\`** is the one field worth getting right. Google uses it to prioritize recrawls — *but only if it trusts you*. If every URL shows today's date on every regeneration, or \`lastmod\` never matches an actual content change, Google learns to ignore the field entirely across your whole site. Set it to the real last-meaningful-modification time (a fixed typo doesn't count; a rewritten section does). Use W3C datetime format — a full timestamp with timezone is fine, or just \`YYYY-MM-DD\`.

**\`priority\`** and **\`changefreq\`** are effectively dead. Google has publicly said it ignores both. They were meant to hint relative importance and update cadence, but sites gamed them (everything \`priority 1.0\`, \`changefreq always\`) until the signals were worthless. You can include them for other consumers, but don't spend a minute tuning them for Google. The before/after below reflects this.

**Before** — a hand-crafted 2019-era entry:

\`\`\`xml
<url>
  <loc>https://yoursite.com/about/</loc>
  <lastmod>2026-07-11</lastmod>
  <changefreq>daily</changefreq>
  <priority>0.8</priority>
</url>
\`\`\`

That \`changefreq>daily\` on an about page that hasn't changed in two years is a small lie Google notices. **After** — honest and lean:

\`\`\`xml
<url>
  <loc>https://yoursite.com/about/</loc>
  <lastmod>2024-11-03</lastmod>
</url>
\`\`\`

## Generating sitemaps

**Next.js (App Router)** — \`app/sitemap.ts\` generates \`/sitemap.xml\` at build or request time. Pull real routes and real modification dates instead of hardcoding:

\`\`\`typescript
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const postUrls = posts.map((post) => ({
    url: \`https://yoursite.com/blog/\${post.slug}\`,
    lastModified: post.updatedAt, // real date from your CMS/DB
  }))

  return [
    { url: 'https://yoursite.com', lastModified: new Date() },
    { url: 'https://yoursite.com/about', lastModified: new Date('2024-11-03') },
    ...postUrls,
  ]
}
\`\`\`

Past 50,000 URLs, Next.js supports \`generateSitemaps()\` to shard automatically into an index. Filter *before* the map — drafts, \`noindex\` pages, and non-canonical variants should never reach the array.

**WordPress** — don't hand-write anything. Yoast SEO and Rank Math both generate an index at \`/sitemap_index.xml\` and keep it current as you publish, correctly excluding \`noindex\` posts and (usually) archive pages you've told them to hide. WordPress core also ships a basic \`/wp-sitemap.xml\`; the plugins are better because they respect your indexing rules.

**Static sites** — most generators (Astro, Hugo, \`next-sitemap\`, Gatsby plugins) emit a sitemap at build. Verify it excludes the same URLs your robots rules do. For a one-off or a quick sanity check, the free [XML sitemap generator](/tools/sitemap-generator) crawls a URL and produces a valid file.

## Sitemap extensions: image, video, news

Standard sitemaps handle pages. Three extensions add media context:

- **Image** — \`<image:image>\` entries help image discovery, useful for galleries and product shots. Pairs with the fundamentals in [image SEO optimization](/blog/image-seo-optimization).
- **Video** — \`<video:video>\` carries thumbnail, duration, and title for video-heavy pages.
- **News** — a separate Google News sitemap for URLs published in the last 48 hours; only relevant if you're in a News-approved publication.

For multilingual sites, hreflang can be declared *inside* the sitemap with \`xhtml:link\` alternates instead of on-page tags — see the [hreflang tags guide](/blog/hreflang-tags-complete-guide) for the annotation pattern.

## Submitting: Search Console AND robots.txt

Do both. They're independent discovery paths.

1. **Search Console** → Sitemaps → paste \`https://yoursite.com/sitemap.xml\` → Submit. This gives you the coverage report, which is the actual reason to bother.
2. **robots.txt** — add a \`Sitemap:\` line so any crawler finds it without Search Console:

\`\`\`
Sitemap: https://yoursite.com/sitemap.xml
\`\`\`

The directive takes an absolute URL and can appear anywhere in the file. Full syntax is in the [robots.txt guide](/blog/robots-txt-guide).

## Debugging the two errors you'll actually see

**"Couldn't fetch"** — Google couldn't retrieve the file. Check, in order: the URL returns 200 (not a redirect to a login or a 404), robots.txt isn't blocking the sitemap path, the \`Content-Type\` is \`application/xml\` or \`text/xml\`, and the XML is well-formed (one stray unescaped \`&\` breaks the whole file — encode it as \`&amp;\`). "Couldn't fetch" often resolves itself on the next crawl; if it persists after a day, the file is genuinely broken or blocked.

**"Discovered – currently not indexed"** — Google *found* the URL (often via the sitemap) but chose not to index it yet. The sitemap did its job; this is a quality/crawl-budget signal, not a sitemap bug. Adding the URL again won't help. Improve internal links to it, strengthen the content, and confirm it isn't a near-duplicate of a page already indexed.

You can confirm a site exposes a sitemap and references it correctly in robots.txt by running the URL through [SEO Snapshot](/) — it checks presence and configuration in one pass.

## FAQ

**Do I need a sitemap if my site is small?** Not strictly. Google can crawl a well-linked 30-page site fine without one. It doesn't hurt to have it, and Search Console's coverage report is worth the two minutes regardless.

**Will a sitemap get my pages indexed faster?** It speeds *discovery*, not the indexing decision. A newly published post in the sitemap gets found sooner, but Google still decides independently whether to index it.

**How often should I regenerate it?** Automatically, whenever content changes — which is what the CMS and framework approaches above do for free. Don't schedule daily rebuilds if nothing changed daily; that just produces fake \`lastmod\` dates Google learns to distrust.`,
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
