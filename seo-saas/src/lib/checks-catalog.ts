// Curated catalog of high-value SEO checks. One page each at /checks/[slug].
export interface CheckDef {
  slug: string;
  title: string;
  category: string;
  severity: string;
  what: string;
  why: string;
  fixLang: string;
  fixCode: string;
  related: { href: string; label: string }[];
}

export const CHECKS: CheckDef[] = [
  {
    "slug": "missing-meta-description",
    "title": "Missing meta description",
    "category": "meta",
    "severity": "warning",
    "what": "Checks whether the page has a <meta name=\"description\"> tag in the <head> with non-empty content.",
    "why": "The meta description is the snippet Google usually shows under your title in search results. When it's missing, Google auto-generates one from page text, which is often awkward or off-topic and can lower click-through. A concise, benefit-led description that matches search intent gives you control over how the result reads.",
    "fixLang": "html",
    "fixCode": "<!-- Add inside <head>, aim for roughly 120-155 characters -->\n<meta name=\"description\" content=\"Free SEO analyzer that scans your page and hands you copy-paste fix code for meta tags, headers, and Core Web Vitals.\">",
    "related": [
      {
        "href": "/blog/how-to-fix-missing-meta-description",
        "label": "How to fix a missing meta description"
      },
      {
        "href": "/tools/meta-tag-generator",
        "label": "Meta tag generator"
      }
    ]
  },
  {
    "slug": "missing-title-tag",
    "title": "Missing title tag",
    "category": "meta",
    "severity": "critical",
    "what": "Checks whether the page has a <title> element in the <head> with non-empty text.",
    "why": "The title tag is one of the strongest on-page relevance signals and is the clickable headline in search results, browser tabs, and social shares. A page with no title forces Google to invent one from the URL or on-page text, which rarely reads well and hurts rankings and clicks. Every indexable page needs a unique, descriptive title.",
    "fixLang": "html",
    "fixCode": "<!-- Add inside <head>, keep the primary keyword near the front -->\n<title>Free SEO Analyzer with Copy-Paste Fix Code | SEO Snapshot</title>",
    "related": [
      {
        "href": "/blog/how-to-write-seo-title-tags",
        "label": "How to write title tags for SEO"
      },
      {
        "href": "/tools/meta-tag-generator",
        "label": "Meta tag generator"
      },
      {
        "href": "/tools/serp-snippet-preview",
        "label": "SERP snippet preview"
      }
    ]
  },
  {
    "slug": "title-too-long",
    "title": "Title tag too long",
    "category": "meta",
    "severity": "info",
    "what": "Checks whether the <title> is long enough that Google is likely to truncate it in search results (roughly past 580-600 pixels, about 60 characters).",
    "why": "Google renders titles by pixel width, not character count, and cuts them off with an ellipsis when they run past the SERP width. A truncated title can hide your call to action or key phrase, and Google may rewrite an over-stuffed title entirely. Keeping the important words in the first ~60 characters ensures they always show.",
    "fixLang": "html",
    "fixCode": "<!-- Front-load the key phrase; trim filler so it stays around 60 chars -->\n<title>SEO Analyzer with Fix Code | SEO Snapshot</title>",
    "related": [
      {
        "href": "/blog/meta-description-length-2026",
        "label": "Meta and title length in 2026"
      },
      {
        "href": "/tools/serp-snippet-preview",
        "label": "SERP snippet preview"
      }
    ]
  },
  {
    "slug": "no-canonical-tag",
    "title": "Missing canonical tag",
    "category": "technical",
    "severity": "warning",
    "what": "Checks whether the page declares a <link rel=\"canonical\"> pointing to the preferred version of the URL.",
    "why": "Canonical tags tell search engines which URL is the master copy when the same or similar content is reachable through multiple URLs (query strings, trailing slashes, http vs https, tracking parameters). Without one, Google picks a canonical itself and can consolidate signals onto the wrong URL or split ranking equity across duplicates. Self-referencing canonicals on every page are a safe default.",
    "fixLang": "html",
    "fixCode": "<!-- Use the absolute, https, non-parameter URL of the page itself -->\n<link rel=\"canonical\" href=\"https://seosnapshot.dev/checks/no-canonical-tag\">",
    "related": [
      {
        "href": "/blog/canonical-url-explained",
        "label": "Canonical URLs explained"
      },
      {
        "href": "/blog/canonical-url-nextjs",
        "label": "Canonical URLs in Next.js"
      },
      {
        "href": "/blog/fix-duplicate-without-user-selected-canonical",
        "label": "Fix \"Duplicate without user-selected canonical\""
      }
    ]
  },
  {
    "slug": "missing-viewport-meta",
    "title": "Missing viewport meta tag",
    "category": "technical",
    "severity": "warning",
    "what": "Checks whether the page has a <meta name=\"viewport\"> tag that sets the layout width for mobile devices.",
    "why": "Without a viewport meta tag, mobile browsers render the page at a desktop width and zoom out, leaving text tiny and tap targets cramped. Google uses mobile-first indexing and evaluates mobile usability, so a page that isn't mobile-friendly can lose rankings and frustrate the majority of visitors who are on phones. The standard tag makes the layout adapt to the device width.",
    "fixLang": "html",
    "fixCode": "<!-- Add inside <head> -->\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
    "related": [
      {
        "href": "/",
        "label": "Run the free SEO analyzer"
      }
    ]
  },
  {
    "slug": "missing-h1",
    "title": "Missing H1 heading",
    "category": "content",
    "severity": "warning",
    "what": "Checks whether the page contains at least one <h1> element with visible text.",
    "why": "The H1 is the main on-page headline and helps both users and search engines understand what the page is about at a glance. Pages with no H1 miss a clear topical signal and often signal a broken template or CSS-styled text used in place of real headings. Each page should have one descriptive H1 that reflects the primary topic.",
    "fixLang": "html",
    "fixCode": "<!-- One clear H1 near the top of the main content -->\n<h1>How to Fix a Missing H1 Heading</h1>",
    "related": [
      {
        "href": "/blog/heading-hierarchy-seo",
        "label": "Heading hierarchy for SEO"
      }
    ]
  },
  {
    "slug": "multiple-h1",
    "title": "Multiple H1 headings",
    "category": "content",
    "severity": "info",
    "what": "Checks whether the page has more than one <h1> element.",
    "why": "While HTML5 technically allows multiple H1s, using several can muddy the page's main-topic signal and usually points to a document outline that isn't structured intentionally. A single H1 followed by H2s and H3s in a logical order makes the hierarchy clear for screen readers and search engines. Demote secondary headings to H2 or lower so one H1 owns the page topic.",
    "fixLang": "html",
    "fixCode": "<!-- Keep a single H1; step down section headings to H2/H3 -->\n<h1>Image SEO Optimization</h1>\n<h2>Choosing the right file format</h2>\n<h2>Writing descriptive alt text</h2>",
    "related": [
      {
        "href": "/blog/heading-hierarchy-seo",
        "label": "Heading hierarchy for SEO"
      }
    ]
  },
  {
    "slug": "images-missing-alt-text",
    "title": "Images missing alt text",
    "category": "accessibility",
    "severity": "warning",
    "what": "Checks for <img> elements that have no alt attribute or an empty alt on images that convey meaning.",
    "why": "Alt text is read aloud by screen readers and shown when an image fails to load, so missing alt hurts accessibility for visually impaired users. It also gives search engines the context they need to rank images in Google Images and to understand surrounding content. Describe what the image shows; use an empty alt=\"\" only for purely decorative images.",
    "fixLang": "html",
    "fixCode": "<!-- Describe the image's content and purpose -->\n<img src=\"/serp-preview.png\" alt=\"SERP snippet preview showing title, URL, and meta description\">\n\n<!-- Decorative-only image: intentionally empty alt so screen readers skip it -->\n<img src=\"/divider.svg\" alt=\"\">",
    "related": [
      {
        "href": "/blog/image-seo-optimization",
        "label": "Image SEO optimization"
      },
      {
        "href": "/blog/website-accessibility-seo-checklist",
        "label": "Accessibility SEO checklist"
      }
    ]
  },
  {
    "slug": "images-missing-dimensions",
    "title": "Images missing width and height",
    "category": "performance",
    "severity": "warning",
    "what": "Checks for <img> elements that lack explicit width and height attributes (or an equivalent aspect-ratio in CSS).",
    "why": "When an image has no declared dimensions, the browser doesn't know how much space to reserve, so content jumps as images load, hurting your Cumulative Layout Shift (CLS) Core Web Vital. Setting width and height lets the browser reserve the correct box before the image arrives, keeping the layout stable. Modern browsers use those attributes to compute an aspect ratio even when the image is CSS-scaled to be responsive.",
    "fixLang": "html",
    "fixCode": "<!-- Set the image's intrinsic pixel dimensions; CSS can still scale it responsively -->\n<img src=\"/hero.jpg\" width=\"1200\" height=\"630\" alt=\"Report dashboard\" style=\"max-width:100%;height:auto;\">",
    "related": [
      {
        "href": "/blog/how-to-fix-cumulative-layout-shift-cls",
        "label": "Fix Cumulative Layout Shift (CLS)"
      },
      {
        "href": "/blog/how-to-improve-core-web-vitals",
        "label": "Improve Core Web Vitals (CLS)"
      },
      {
        "href": "/blog/image-seo-optimization",
        "label": "Image SEO optimization"
      }
    ]
  },
  {
    "slug": "render-blocking-resources",
    "title": "Render-blocking resources",
    "category": "performance",
    "severity": "warning",
    "what": "Checks for CSS and synchronous JavaScript in the <head> that block the browser from rendering the page until they finish downloading and executing.",
    "why": "Render-blocking files delay First Contentful Paint and Largest Contentful Paint because the browser can't show anything until they load, which slows the page for real users and drags down Core Web Vitals. Deferring non-critical JavaScript, inlining critical CSS, and lazy-loading the rest lets the page paint sooner. Faster paints improve both perceived speed and the field metrics Google measures.",
    "fixLang": "html",
    "fixCode": "<!-- Defer non-critical JS so it doesn't block parsing -->\n<script src=\"/app.js\" defer></script>\n\n<!-- Load non-critical CSS without blocking render -->\n<link rel=\"preload\" href=\"/non-critical.css\" as=\"style\" onload=\"this.rel='stylesheet'\">\n<noscript><link rel=\"stylesheet\" href=\"/non-critical.css\"></noscript>",
    "related": [
      {
        "href": "/blog/fix-render-blocking-resources",
        "label": "Fix render-blocking resources"
      },
      {
        "href": "/blog/fix-render-blocking-resources-nextjs",
        "label": "Fix render-blocking resources in Next.js"
      },
      {
        "href": "/blog/how-to-fix-largest-contentful-paint-lcp",
        "label": "Fix Largest Contentful Paint (LCP)"
      }
    ]
  },
  {
    "slug": "no-hsts-header",
    "title": "Missing HSTS header",
    "category": "security",
    "severity": "warning",
    "what": "Checks whether the server sends a Strict-Transport-Security response header over HTTPS.",
    "why": "HSTS tells browsers to only ever connect to your site over HTTPS, which blocks protocol-downgrade and man-in-the-middle attacks that a plain http redirect can't prevent on the first request. It's part of the security posture that reflects a trustworthy, well-maintained site. Only enable it once every subdomain and asset is reliably served over HTTPS, since the policy is cached for the max-age you set.",
    "fixLang": "nginx",
    "fixCode": "# Send only over HTTPS; 2 years, cover subdomains, and be preload-eligible\nadd_header Strict-Transport-Security \"max-age=63072000; includeSubDomains; preload\" always;",
    "related": [
      {
        "href": "/blog/security-headers-for-seo",
        "label": "Security headers for SEO"
      },
      {
        "href": "/blog/nginx-security-headers-guide",
        "label": "Nginx security headers guide"
      }
    ]
  },
  {
    "slug": "missing-csp-header",
    "title": "Missing Content-Security-Policy header",
    "category": "security",
    "severity": "info",
    "what": "Checks whether the server sends a Content-Security-Policy response header.",
    "why": "A Content-Security-Policy restricts which sources of scripts, styles, and other resources the browser will load, which is the strongest defense against cross-site scripting and content injection. Beyond protecting users, a solid CSP signals a hardened, well-run site. Start in report-only mode to catch violations before enforcing, because an overly strict policy can break legitimate assets.",
    "fixLang": "nginx",
    "fixCode": "# Tighten sources to match what your site actually loads\nadd_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'self'; base-uri 'self'\" always;\n\n# Safer rollout: report violations without blocking first\n# add_header Content-Security-Policy-Report-Only \"default-src 'self'; report-uri /csp-report\" always;",
    "related": [
      {
        "href": "/blog/security-headers-for-seo",
        "label": "Security headers for SEO"
      }
    ]
  },
  {
    "slug": "missing-x-frame-options",
    "title": "Missing X-Frame-Options header",
    "category": "security",
    "severity": "info",
    "what": "Checks whether the server sends an X-Frame-Options header (or an equivalent frame-ancestors directive in CSP) to control whether the page can be embedded in a frame.",
    "why": "X-Frame-Options prevents your pages from being loaded inside an iframe on another domain, which stops clickjacking attacks where an attacker overlays your UI to trick users into clicking. It's a low-risk header that most security scanners and audits expect to see. The modern equivalent is the CSP frame-ancestors directive, and you can safely send both.",
    "fixLang": "nginx",
    "fixCode": "# Block embedding on other origins (legacy header)\nadd_header X-Frame-Options \"SAMEORIGIN\" always;\n\n# Modern equivalent via CSP\nadd_header Content-Security-Policy \"frame-ancestors 'self'\" always;",
    "related": [
      {
        "href": "/blog/security-headers-for-seo",
        "label": "Security headers for SEO"
      },
      {
        "href": "/blog/website-security-check-guide",
        "label": "Website security check guide"
      }
    ]
  },
  {
    "slug": "no-structured-data",
    "title": "No structured data",
    "category": "social",
    "severity": "info",
    "what": "Checks whether the page includes Schema.org structured data, ideally as JSON-LD in a <script type=\"application/ld+json\"> block.",
    "why": "Structured data describes your content to search engines in a machine-readable format and is what makes rich results possible: review stars, FAQs, breadcrumbs, article bylines, and more. Those enhanced listings can take up more space in the SERP and improve click-through. Use the schema type that matches the page (Article, Product, FAQPage, Organization) and validate it against Google's Rich Results Test.",
    "fixLang": "json",
    "fixCode": "<script type=\"application/ld+json\">\n{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"Article\",\n  \"headline\": \"No structured data: what it means and how to fix it\",\n  \"author\": { \"@type\": \"Organization\", \"name\": \"SEO Snapshot\" },\n  \"publisher\": {\n    \"@type\": \"Organization\",\n    \"name\": \"SEO Snapshot\",\n    \"logo\": { \"@type\": \"ImageObject\", \"url\": \"https://seosnapshot.dev/logo.png\" }\n  },\n  \"datePublished\": \"2026-07-11\"\n}\n</script>",
    "related": [
      {
        "href": "/blog/how-to-add-structured-data-json-ld",
        "label": "Add structured data with JSON-LD"
      },
      {
        "href": "/tools/schema-generator",
        "label": "Schema generator"
      }
    ]
  },
  {
    "slug": "missing-open-graph-tags",
    "title": "Missing Open Graph tags",
    "category": "social",
    "severity": "info",
    "what": "Checks whether the page has the core Open Graph meta tags (og:title, og:description, og:image, og:url) in the <head>.",
    "why": "Open Graph tags control how your page looks when shared on social platforms and in messaging apps, defining the title, description, and preview image on the link card. Without them, platforms guess and often pull a random image or truncated text, making shares look broken and lowering click-through. A dedicated og:image around 1200x630 gives you a clean, branded preview.",
    "fixLang": "html",
    "fixCode": "<!-- Add inside <head> -->\n<meta property=\"og:title\" content=\"Free SEO Analyzer with Copy-Paste Fix Code\">\n<meta property=\"og:description\" content=\"Scan any page and get the exact code to fix every issue.\">\n<meta property=\"og:image\" content=\"https://seosnapshot.dev/og-image.png\">\n<meta property=\"og:url\" content=\"https://seosnapshot.dev/\">\n<meta property=\"og:type\" content=\"website\">",
    "related": [
      {
        "href": "/blog/open-graph-meta-tags-guide",
        "label": "Open Graph meta tags guide"
      },
      {
        "href": "/tools/open-graph-preview",
        "label": "Open Graph preview"
      }
    ]
  },
  {
    "slug": "missing-xml-sitemap",
    "title": "Missing XML sitemap",
    "category": "technical",
    "severity": "warning",
    "what": "Checks whether an XML sitemap exists (commonly at /sitemap.xml) and is referenced from robots.txt.",
    "why": "An XML sitemap lists the URLs you want indexed and helps search engines discover pages that internal linking might miss, which matters most for large or newer sites. It also lets you communicate the canonical URL and last-modified date for each page. Submitting the sitemap in Google Search Console and linking it from robots.txt speeds up discovery and recrawling.",
    "fixLang": "xml",
    "fixCode": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n  <url>\n    <loc>https://seosnapshot.dev/</loc>\n    <lastmod>2026-07-11</lastmod>\n  </url>\n  <url>\n    <loc>https://seosnapshot.dev/checks/missing-xml-sitemap</loc>\n    <lastmod>2026-07-11</lastmod>\n  </url>\n</urlset>",
    "related": [
      {
        "href": "/blog/sitemap-xml-guide",
        "label": "XML sitemap guide"
      },
      {
        "href": "/tools/sitemap-generator",
        "label": "Sitemap generator"
      }
    ]
  },
  {
    "slug": "blocked-by-robots-txt",
    "title": "Page blocked by robots.txt",
    "category": "technical",
    "severity": "critical",
    "what": "Checks whether the page's URL is disallowed for search crawlers by a rule in the site's robots.txt file.",
    "why": "A Disallow rule that matches the page keeps crawlers from fetching it, so it usually won't be indexed and can't rank, and any page it links to may go undiscovered. This is a common accidental cause of pages vanishing from search after a staging config ships to production. Note that robots.txt blocks crawling, not indexing, so use a noindex meta tag rather than a Disallow when you want to keep a URL out of results.",
    "fixLang": "text",
    "fixCode": "# robots.txt: allow crawling of the page (remove or narrow the Disallow)\nUser-agent: *\nAllow: /\n\n# Keep only the paths you truly want blocked, e.g.\nDisallow: /admin/\nDisallow: /cart/\n\nSitemap: https://seosnapshot.dev/sitemap.xml",
    "related": [
      {
        "href": "/blog/robots-txt-guide",
        "label": "robots.txt guide"
      },
      {
        "href": "/tools/robots-txt-generator",
        "label": "robots.txt generator"
      }
    ]
  },
  {
    "slug": "mixed-content",
    "title": "Mixed content",
    "category": "security",
    "severity": "warning",
    "what": "Checks whether an HTTPS page loads any resources (images, scripts, styles, iframes) over insecure http.",
    "why": "When a secure page pulls in http assets, browsers either block them or flag the page as not fully secure, breaking the padlock and sometimes the layout or functionality. Active mixed content like scripts is blocked outright because it can be tampered with in transit. Serving every resource over https keeps the page secure and avoids console warnings that erode user trust.",
    "fixLang": "html",
    "fixCode": "<!-- Change http:// asset URLs to https:// (or protocol-relative // ) -->\n<img src=\"https://cdn.seosnapshot.dev/chart.png\" alt=\"Chart\">\n<script src=\"https://cdn.seosnapshot.dev/app.js\" defer></script>\n\n<!-- Or have the browser auto-upgrade insecure requests via CSP header/meta -->\n<meta http-equiv=\"Content-Security-Policy\" content=\"upgrade-insecure-requests\">",
    "related": [
      {
        "href": "/blog/security-headers-for-seo",
        "label": "Security headers for SEO"
      }
    ]
  },
  {
    "slug": "slow-ttfb",
    "title": "Slow Time to First Byte (TTFB)",
    "category": "performance",
    "severity": "warning",
    "what": "Checks how long the server takes to send the first byte of the response after the browser requests the page.",
    "why": "TTFB captures server processing, database queries, and network latency before any rendering can start, so a slow first byte delays every downstream metric including Largest Contentful Paint. Google's guidance treats a TTFB under about 800ms as a reasonable target for a good experience. Caching, a CDN, faster backend queries, and edge rendering are the usual levers to bring it down.",
    "fixLang": "nginx",
    "fixCode": "# Cache full HTML responses at the edge/proxy to slash TTFB on repeat hits\nproxy_cache_path /var/cache/nginx levels=1:2 keys_zone=html_cache:10m max_size=500m inactive=60m;\n\nlocation / {\n    proxy_cache html_cache;\n    proxy_cache_valid 200 10m;\n    add_header X-Cache-Status $upstream_cache_status;\n    proxy_pass http://app_upstream;\n}",
    "related": [
      {
        "href": "/blog/what-is-ttfb-and-how-to-improve-it",
        "label": "What is TTFB and how to improve it"
      },
      {
        "href": "/blog/how-to-fix-largest-contentful-paint-lcp",
        "label": "How TTFB affects LCP"
      },
      {
        "href": "/blog/website-speed-optimization-guide",
        "label": "Website speed optimization guide"
      }
    ]
  },
  {
    "slug": "not-using-https",
    "title": "Not using HTTPS",
    "category": "security",
    "severity": "critical",
    "what": "Checks whether the page is served over HTTPS and whether http requests redirect to the secure version.",
    "why": "HTTPS encrypts traffic between the browser and server, protecting user data and preventing tampering, and Google has confirmed it as a lightweight ranking signal. Browsers label plain http pages as Not Secure, which scares off users and can block form submissions. Getting a free certificate and forcing a 301 redirect from http to https is the baseline for any modern site.",
    "fixLang": "nginx",
    "fixCode": "# Permanently redirect all http traffic to https\nserver {\n    listen 80;\n    server_name seosnapshot.dev www.seosnapshot.dev;\n    return 301 https://$host$request_uri;\n}",
    "related": [
      {
        "href": "/blog/security-headers-for-seo",
        "label": "Security headers for SEO"
      }
    ]
  }
];

export const checkBySlug = new Map(CHECKS.map((c) => [c.slug, c]));

export const CHECK_CATEGORIES: Record<string, string> = {
  meta: "Meta Tags",
  technical: "Technical SEO",
  performance: "Performance",
  security: "Security",
  content: "Content",
  social: "Social & Schema",
  accessibility: "Accessibility",
};
