'use client';
import { useLocale } from '@/lib/i18n';
import { Shield, FileText, Link2, Image, Lock, Zap, Code, Globe, Smartphone, Eye, BarChart3, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const checks = [
  {
    category: 'Meta Tags',
    icon: FileText,
    color: 'text-blue-400',
    weight: '25%',
    items: [
      { name: 'Title tag', what: 'Checks if your page has a <title> tag and whether it\'s between 30-60 characters.', why: 'Title is the #1 on-page SEO factor. Google uses it as the clickable headline in search results. Too short = missed keyword opportunity. Too long = gets truncated.' },
      { name: 'Title pixel width', what: 'Measures the visual width of your title in Google search results (max ~580px).', why: 'Google truncates titles by pixel width, not character count. "WWWW" takes more space than "iiii" at the same character count.' },
      { name: 'Meta description', what: 'Checks for a meta description between 120-160 characters.', why: 'The description appears below your title in search results. A compelling description increases click-through rate (CTR).' },
      { name: 'Description pixel width', what: 'Measures visual width of description in SERP (max ~920px mobile).', why: 'Prevents truncation in search results. Truncated descriptions look unprofessional and lose information.' },
      { name: 'Canonical URL', what: 'Checks for <link rel="canonical"> and validates it matches the page URL.', why: 'Canonical tells Google which version of a page is the "original." Without it, duplicate content can split your ranking power.' },
      { name: 'Canonical analysis', what: 'Deep check: protocol mismatch (HTTP vs HTTPS), og:url mismatch, self-referencing.', why: 'Mismatched canonicals confuse Google and can cause indexing issues.' },
      { name: 'Viewport meta', what: 'Checks for <meta name="viewport" content="width=device-width, initial-scale=1">.', why: 'Required for mobile-friendly pages. Without it, Google may not rank you in mobile search results.' },
      { name: 'Language attribute', what: 'Checks for lang="xx" on the <html> tag.', why: 'Helps search engines understand your content\'s language. Important for international SEO and screen readers.' },
      { name: 'Charset', what: 'Checks for <meta charset="UTF-8">.', why: 'Ensures characters display correctly. Missing charset can cause encoding issues and broken text.' },
      { name: 'Favicon', what: 'Checks for a favicon (<link rel="icon">).', why: 'Favicons appear in browser tabs, bookmarks, and Google search results. Missing favicon looks unprofessional.' },
      { name: 'DOCTYPE', what: 'Checks for <!DOCTYPE html> declaration.', why: 'Without DOCTYPE, browsers enter "quirks mode" which can cause rendering issues.' },
      { name: 'Duplicate tags', what: 'Checks for multiple <title> or <meta description> tags.', why: 'Multiple title/description tags confuse search engines. Google may pick the wrong one.' },
    ]
  },
  {
    category: 'Content Quality',
    icon: BarChart3,
    color: 'text-emerald-400',
    weight: '15%',
    items: [
      { name: 'H1 heading', what: 'Checks for exactly one <h1> tag on the page.', why: 'H1 is the main heading — it tells Google what your page is about. Zero or multiple H1s weaken your topic signal.' },
      { name: 'Keyword in title/H1', what: 'Checks if your top keyword appears in the title and H1.', why: 'Pages that include the target keyword in title and H1 rank significantly better for that keyword.' },
      { name: 'Word count', what: 'Counts words in main content (excluding nav, footer, sidebar).', why: 'Pages under 300 words are considered "thin content" by Google. Comprehensive content (800-1500 words) ranks better.' },
      { name: 'Readability score', what: 'Calculates Flesch reading ease score (0-100). Higher = easier to read.', why: 'Content that\'s easy to read gets more engagement, lower bounce rate, and better rankings.' },
      { name: 'Paragraph length', what: 'Flags paragraphs longer than 300 words.', why: 'Long paragraphs are hard to read on screens. Break them up for better user experience.' },
      { name: 'List usage', what: 'Checks if content uses <ul>/<ol> lists for scannability.', why: 'Lists improve readability and can trigger Google\'s featured snippet (position zero).' },
      { name: 'Content uniqueness', what: 'Measures percentage of unique words vs total words.', why: 'Repetitive content signals low quality. Diverse vocabulary indicates depth and expertise.' },
      { name: 'Text-to-HTML ratio', what: 'Ratio of visible text to total HTML code.', why: 'Low ratio (<10%) means too much code, too little content. Google may see this as thin content.' },
      { name: 'Copyright year', what: 'Checks if copyright year is current.', why: 'Outdated copyright years (e.g. 2019) make your site look abandoned. Users and search engines notice.' },
      { name: 'Heading hierarchy', what: 'Checks if headings follow logical order (H1 → H2 → H3, no skipping).', why: 'Proper heading structure helps Google understand your content outline and improves accessibility.' },
    ]
  },
  {
    category: 'Links',
    icon: Link2,
    color: 'text-cyan-400',
    weight: '10%',
    items: [
      { name: 'Broken links', what: 'Tests up to 10 links with HEAD requests (falls back to GET if needed).', why: 'Broken links hurt user experience and waste Google\'s crawl budget. They signal a poorly maintained site.' },
      { name: 'Internal/external count', what: 'Counts internal links (same domain) and external links (other domains).', why: 'Internal links spread ranking power. External links to authoritative sites build trust.' },
      { name: 'Empty anchors', what: 'Finds <a> tags with no text content.', why: 'Empty anchors provide no context to users or search engines. They\'re accessibility failures.' },
      { name: 'Generic anchors', what: 'Detects "click here", "read more", "learn more" link text.', why: 'Descriptive anchor text helps Google understand what the linked page is about.' },
      { name: 'Nofollow links', what: 'Counts links with rel="nofollow".', why: 'Nofollow tells Google not to pass ranking power. Use intentionally, not accidentally.' },
      { name: 'rel=noopener', what: 'Checks target="_blank" links for rel="noopener noreferrer".', why: 'Without noopener, the linked page can access your page via window.opener — a security vulnerability.' },
    ]
  },
  {
    category: 'Images',
    icon: Image,
    color: 'text-amber-400',
    weight: '10%',
    items: [
      { name: 'Alt text', what: 'Checks every <img> for alt attribute.', why: 'Alt text helps Google understand images (image SEO) and is required for screen readers (accessibility).' },
      { name: 'Image dimensions', what: 'Checks for width/height attributes on <img> tags.', why: 'Explicit dimensions prevent layout shifts (CLS) when images load. This is a Core Web Vital.' },
      { name: 'Lazy loading', what: 'Checks for loading="lazy" on below-fold images.', why: 'Lazy loading defers offscreen images, speeding up initial page load and reducing data usage.' },
      { name: 'Modern formats', what: 'Detects images not using WebP or AVIF format.', why: 'WebP is 25-35% smaller than JPEG at same quality. Faster load = better user experience and SEO.' },
      { name: 'Broken images', what: 'HEAD request to image URLs to check if they return 200.', why: 'Broken images create poor user experience and waste page resources.' },
    ]
  },
  {
    category: 'Security',
    icon: Lock,
    color: 'text-red-400',
    weight: '15%',
    items: [
      { name: 'HTTPS', what: 'Checks if the page is served over HTTPS.', why: 'Google confirmed HTTPS as a ranking signal. Chrome marks HTTP sites as "Not Secure."' },
      { name: 'HSTS header', what: 'Checks for Strict-Transport-Security with max-age >= 31536000.', why: 'HSTS forces browsers to use HTTPS, preventing downgrade attacks.' },
      { name: 'Content-Security-Policy', what: 'Checks for CSP header and flags unsafe-inline/unsafe-eval.', why: 'CSP prevents XSS attacks. unsafe-inline and unsafe-eval weaken the protection significantly.' },
      { name: 'X-Frame-Options', what: 'Checks for X-Frame-Options header (DENY or SAMEORIGIN).', why: 'Prevents your site from being embedded in iframes on other sites (clickjacking attacks).' },
      { name: 'X-Content-Type-Options', what: 'Checks for X-Content-Type-Options: nosniff.', why: 'Prevents browsers from MIME-sniffing responses, reducing drive-by download attacks.' },
      { name: 'Referrer-Policy', what: 'Checks for Referrer-Policy header.', why: 'Controls how much referrer information is sent when users navigate away from your site.' },
      { name: 'Permissions-Policy', what: 'Checks for Permissions-Policy (formerly Feature-Policy) header.', why: 'Restricts which browser features your site can use (camera, microphone, geolocation).' },
      { name: 'Cookie security', what: 'Checks cookies for HttpOnly, Secure, and SameSite flags.', why: 'HttpOnly prevents XSS from stealing cookies. Secure ensures cookies only sent over HTTPS. SameSite prevents CSRF.' },
      { name: 'Mixed content', what: 'Detects HTTP resources loaded on an HTTPS page.', why: 'Mixed content triggers browser warnings and can be intercepted by attackers.' },
      { name: 'SRI (Subresource Integrity)', what: 'Checks CDN-loaded scripts for integrity="sha384-..." attribute.', why: 'SRI prevents supply chain attacks — if a CDN is compromised, tampered scripts won\'t execute.' },
      { name: 'X-Powered-By', what: 'Flags if X-Powered-By header exposes server technology.', why: 'Revealing "Express", "Next.js", or "PHP/7.4" helps attackers find known vulnerabilities.' },
      { name: 'Email exposure', what: 'Scans page source for plaintext email addresses.', why: 'Exposed emails get harvested by spam bots. Use contact forms or JavaScript obfuscation instead.' },
    ]
  },
  {
    category: 'Performance',
    icon: Zap,
    color: 'text-yellow-400',
    weight: '15%',
    items: [
      { name: 'TTFB (Time to First Byte)', what: 'Measures server response time from our server to yours.', why: 'Google uses TTFB as a speed signal. Under 200ms is good, over 1000ms is concerning.' },
      { name: 'HTML size', what: 'Measures the raw HTML document size in KB.', why: 'Large HTML documents take longer to download and parse. Keep under 100KB ideally.' },
      { name: 'Render-blocking scripts', what: 'Counts <script> tags without async or defer attributes.', why: 'Render-blocking scripts delay page rendering. Users see a blank screen until scripts finish loading.' },
      { name: 'Inline JavaScript size', what: 'Measures total size of inline <script> blocks.', why: 'Large inline scripts can\'t be cached and increase HTML size. Move to external files.' },
      { name: 'Font-display', what: 'Checks @font-face for font-display: swap (or optional/fallback).', why: 'Without font-display, custom fonts can cause invisible text while loading (FOIT).' },
      { name: 'Compression', what: 'Checks Content-Encoding header for gzip or brotli.', why: 'Compression reduces transfer size by 60-80%. One of the easiest performance wins.' },
      { name: 'Cache-Control', what: 'Checks for Cache-Control header on the response.', why: 'Proper caching means returning visitors load pages instantly from browser cache.' },
      { name: 'Page weight', what: 'Estimates total page weight (HTML + scripts + styles).', why: 'Pages over 3MB are too heavy for mobile users. Aim for under 1MB.' },
      { name: 'Request count', what: 'Total number of resources: scripts + stylesheets + images + iframes.', why: 'Each request adds latency. Over 80 requests significantly slows page load.' },
      { name: 'Preconnect hints', what: 'Checks for <link rel="preconnect"> to external domains.', why: 'Preconnect establishes early connections to critical third-party domains, saving 100-500ms per domain.' },
    ]
  },
  {
    category: 'Technical SEO',
    icon: Code,
    color: 'text-orange-400',
    weight: '20%',
    items: [
      { name: 'Redirect chain', what: 'Follows all redirects and counts hops (301, 302, etc).', why: 'Each redirect adds latency and can lose ranking power. Direct links are always better.' },
      { name: 'Redirect loop', what: 'Detects infinite redirect loops (A→B→A).', why: 'Redirect loops make pages completely inaccessible to both users and search engines.' },
      { name: '302 vs 301', what: 'Flags temporary (302) redirects that should be permanent (301).', why: '301 redirects pass full link equity. 302s are for temporary changes only.' },
      { name: 'URL structure', what: 'Checks URL length, uppercase letters, and underscores.', why: 'Clean URLs (short, lowercase, hyphens) are more user-friendly and slightly better for SEO.' },
      { name: 'robots.txt', what: 'Fetches and parses /robots.txt for disallow rules.', why: 'robots.txt controls what search engines can crawl. Missing or misconfigured robots.txt can block indexing.' },
      { name: 'sitemap.xml', what: 'Checks if /sitemap.xml exists and lists your pages.', why: 'Sitemaps help Google discover and index your pages faster, especially for large or new sites.' },
      { name: 'Hreflang tags', what: 'Validates hreflang tags for x-default and self-referencing.', why: 'Hreflang tells Google which language/region each page targets. Critical for international SEO.' },
      { name: 'Noindex detection', what: 'Warns if <meta name="robots" content="noindex"> is present.', why: 'Noindexed pages won\'t appear in Google at all. Make sure it\'s intentional.' },
      { name: 'Meta refresh', what: 'Detects <meta http-equiv="refresh"> client-side redirects.', why: 'Meta refresh is bad for SEO — use server-side 301 redirects instead.' },
      { name: 'Deprecated HTML', what: 'Finds old tags like <center>, <font>, <marquee>.', why: 'Deprecated tags indicate outdated code. Modern CSS is more maintainable and performs better.' },
    ]
  },
  {
    category: 'Social & Schema',
    icon: Globe,
    color: 'text-purple-400',
    weight: '10%',
    items: [
      { name: 'Open Graph tags', what: 'Checks for og:title, og:description, og:image, og:url, og:type, og:site_name.', why: 'OG tags control how your page looks when shared on Facebook, LinkedIn, WhatsApp, and other platforms.' },
      { name: 'og:image validation', what: 'Verifies the og:image URL is reachable (HEAD request).', why: 'Broken og:image means no preview image when your page is shared — dramatically reduces clicks.' },
      { name: 'Twitter Card', what: 'Checks for twitter:card, twitter:title, twitter:description, twitter:image.', why: 'Twitter Cards create rich previews on Twitter/X. Without them, links look plain and get fewer clicks.' },
      { name: 'JSON-LD structured data', what: 'Parses all <script type="application/ld+json"> and validates required fields.', why: 'Structured data enables rich results in Google: star ratings, FAQ accordions, recipe cards, event dates, etc.' },
    ]
  },
  {
    category: 'Mobile',
    icon: Smartphone,
    color: 'text-sky-400',
    weight: '5%',
    items: [
      { name: 'Viewport meta', what: 'Checks for proper viewport configuration.', why: 'Without viewport meta, your site won\'t be mobile-friendly. Google uses mobile-first indexing.' },
      { name: 'Zoom/scalable', what: 'Flags user-scalable=no or maximum-scale=1.', why: 'Disabling zoom is an accessibility violation. Users with low vision need to zoom.' },
    ]
  },
  {
    category: 'Accessibility',
    icon: Eye,
    color: 'text-pink-400',
    weight: '5%',
    items: [
      { name: 'Form labels', what: 'Checks that every <input> has an associated <label>.', why: 'Labels help screen readers announce what each form field is for. Required by WCAG 2.1.' },
      { name: 'Image alt text', what: 'Same as Images check — every img needs alt.', why: 'Screen readers read alt text to describe images to visually impaired users.' },
      { name: 'Language attribute', what: 'Same as Meta check — html lang="xx".', why: 'Screen readers use the lang attribute to switch pronunciation. Critical for accessibility.' },
      { name: 'Heading hierarchy', what: 'Checks for skipped heading levels (H1 → H3, missing H2).', why: 'Screen reader users navigate by headings. Skipped levels break this navigation pattern.' },
      { name: 'Skip navigation', what: 'Checks for a "skip to content" link.', why: 'Keyboard users need a way to skip repetitive navigation links on every page.' },
    ]
  },
];

function Section({ cat, isOpen, toggle }: { cat: typeof checks[0]; isOpen: boolean; toggle: () => void }) {
  const Icon = cat.icon;
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={toggle} className="w-full flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors text-left">
        <div className={`w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center ${cat.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{cat.category}</h2>
          <p className="text-xs text-white/40">{cat.items.length} checks · {cat.weight} of total score</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-white/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="border-t border-white/[0.06] p-5 space-y-4">
          {cat.items.map((item, i) => (
            <div key={i} className="pl-4 border-l-2 border-white/[0.08]">
              <h3 className="text-sm font-medium text-white mb-1">{item.name}</h3>
              <p className="text-xs text-white/50 mb-1"><span className="text-accent-400 font-medium">What we check:</span> {item.what}</p>
              <p className="text-xs text-white/50"><span className="text-emerald-400 font-medium">Why it matters:</span> {item.why}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MethodologyPage() {
  const { t } = useLocale();
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const totalChecks = checks.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            How We Score Your SEO
          </h1>
          <p className="text-white/50 max-w-xl mx-auto">
            SEO Snapshot runs {totalChecks} individual checks across 10 categories.
            Each category has a weight in the final score. Here&apos;s exactly what we check and why.
          </p>
        </div>

        {/* Score Formula */}
        <div className="border border-white/[0.06] rounded-xl p-6 mb-8 bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white mb-4">Score Formula</h2>
          <p className="text-sm text-white/50 mb-4">
            Your SEO score (0-100) is a weighted average of 7 category scores:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { name: 'Meta', weight: '25%', color: 'text-blue-400' },
              { name: 'Technical', weight: '20%', color: 'text-orange-400' },
              { name: 'Security', weight: '15%', color: 'text-red-400' },
              { name: 'Performance', weight: '15%', color: 'text-yellow-400' },
              { name: 'Content', weight: '10%', color: 'text-emerald-400' },
              { name: 'Social', weight: '10%', color: 'text-purple-400' },
              { name: 'Mobile + A11y', weight: '5%', color: 'text-sky-400' },
            ].map((w, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className={`text-lg font-bold ${w.color}`}>{w.weight}</div>
                <div className="text-xs text-white/40">{w.name}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-4">
            Penalties are applied for critical issues (broken links, no HTTPS, noindex).
            Impact scores show how many points each fix would add to your score.
          </p>
        </div>

        {/* Grading Scale */}
        <div className="border border-white/[0.06] rounded-xl p-6 mb-8 bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white mb-4">Score Scale</h2>
          <div className="flex gap-2">
            {[
              { range: '90-100', label: 'Excellent', color: 'bg-emerald-500' },
              { range: '70-89', label: 'Good', color: 'bg-emerald-400' },
              { range: '50-69', label: 'Needs Work', color: 'bg-amber-400' },
              { range: '0-49', label: 'Poor', color: 'bg-red-400' },
            ].map((s, i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`h-2 rounded-full ${s.color} mb-2`} />
                <div className="text-sm font-medium text-white">{s.range}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* All Checks */}
        <h2 className="text-xl font-semibold text-white mb-4">{totalChecks} Checks in Detail</h2>
        <div className="space-y-3">
          {checks.map((cat, i) => (
            <Section key={i} cat={cat} isOpen={openSections.has(i)} toggle={() => toggle(i)} />
          ))}
        </div>

        {/* Limitations */}
        <div className="border border-white/[0.06] rounded-xl p-6 mt-8 bg-white/[0.02]">
          <h2 className="text-lg font-semibold text-white mb-3">What We Don&apos;t Check</h2>
          <p className="text-sm text-white/50 mb-3">
            Some SEO factors require data we can&apos;t access from a single page analysis:
          </p>
          <ul className="text-sm text-white/40 space-y-1.5">
            <li>Backlink profile (requires crawl index like Ahrefs/Moz)</li>
            <li>Keyword rankings (requires SERP tracking)</li>
            <li>Domain authority (requires link database)</li>
            <li>JavaScript-rendered content (we analyze raw HTML, not browser-rendered DOM)</li>
            <li>Core Web Vitals field data (requires Chrome UX Report API key)</li>
            <li>Cross-page duplicate content (requires full-site crawl)</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent-500 text-white font-medium hover:bg-accent-600 transition-colors">
            Analyze your site now
          </a>
        </div>
      </div>
    </div>
  );
}
