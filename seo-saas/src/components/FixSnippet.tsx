'use client';
import { useState } from 'react';
import { Copy, CheckCircle, Code } from 'lucide-react';

interface HighlightedLine {
  text: string;
  className: string;
}

function classifyLine(line: string): HighlightedLine {
  const trimmed = line.trimStart();
  if (trimmed.startsWith('<!--') || trimmed.startsWith('//'))
    return { text: line, className: 'text-white/25' };
  if (trimmed.startsWith('Why:') || trimmed.startsWith('Tip:'))
    return { text: line, className: 'text-white/30 italic' };
  if (trimmed.startsWith('#') && !line.includes('{'))
    return { text: line, className: 'text-white/25' };
  if (line.includes('<') && line.includes('>'))
    return { text: line, className: 'text-indigo-400' };
  return { text: line, className: 'text-accent-300/70' };
}

export function FixSnippet({ code, language = 'html' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2 rounded-lg overflow-hidden border border-white/[0.06]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/[0.04]">
        <div className="flex items-center gap-1.5">
          <Code className="w-3 h-3 text-accent-400" />
          <span className="text-[10px] text-white/30 uppercase tracking-wider">{language}</span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/70 transition-colors duration-150">
          {copied ? <><CheckCircle className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <pre className="p-3 text-xs font-mono overflow-x-auto scrollbar-thin bg-white/[0.02] leading-relaxed whitespace-pre-wrap break-all">
        {code.split('\n').map((line, i) => {
          const { className } = classifyLine(line);
          return <span key={i} className={className}>{line}{'\n'}</span>;
        })}
      </pre>
    </div>
  );
}

// ===== Smart Fix Code Generator =====
export function generateFixCode(issue: { problem: string; fix: string; severity: string; category?: string }, result: Record<string, any>): string | null {
  const problem = issue.problem?.toLowerCase() || '';
  const title = result.meta?.title?.text || '';
  const desc = result.meta?.description?.text || '';
  const url = result.url || '';
  const h1 = result.headings?.h1?.texts?.[0] || '';
  const domain = (() => { try { return new URL(url).hostname; } catch { return 'yoursite.com'; } })();
  const techStack = result.techStack || [];
  const isWordPress = techStack.some((t: { name: string }) => t.name === 'WordPress');
  const isNextJs = techStack.some((t: { name: string }) => t.name === 'Next.js');

  const topKw = result.topKeywords?.[0]?.word || '';
  const topKw2 = result.topKeywords?.[1]?.word || '';
  const topKw3 = result.topKeywords?.[2]?.word || '';
  const kwPhrase = [topKw, topKw2].filter(Boolean).join(' & ');
  const firstSentence = desc ? desc.split(/[.!?]/)[0]?.trim() : '';

  // ===== META FIXES =====
  if (problem.includes('title') && problem.includes('missing')) {
    const suggested = h1 || firstSentence?.slice(0, 50) || domain;
    return `<!-- No title found. Suggested based on your H1 and keywords: -->\n<title>${suggested}${topKw ? ` — ${topKw.charAt(0).toUpperCase() + topKw.slice(1)}` : ''} | ${domain}</title>\n\n<!-- Why: Title tags are the #1 ranking factor. Google shows them\n     as the clickable headline in search results. -->`;
  }

  if (problem.includes('title') && (problem.includes('short') || problem.includes('too short'))) {
    const expanded = topKw
      ? `${title} — ${topKw.charAt(0).toUpperCase() + topKw.slice(1)}${topKw2 ? ` & ${topKw2.charAt(0).toUpperCase() + topKw2.slice(1)}` : ''} | ${domain}`
      : `${title} — ${firstSentence?.slice(0, 35) || 'Your Primary Keyword'} | ${domain}`;
    return `<!-- Current: "${title}" (${title.length} chars) -->\n${topKw ? `<!-- Your top keyword: "${topKw}" (density: ${result.topKeywords?.[0]?.density || '?'}%) -->\n` : ''}<!-- Suggested (${expanded.length} chars): -->\n<title>${expanded.slice(0, 60)}</title>\n\n<!-- Why: Titles under 30 chars waste SERP real estate.\n     Aim for 50-60 chars with your primary keyword. -->`;
  }

  if (problem.includes('title') && (problem.includes('truncate') || problem.includes('long') || problem.includes('wide'))) {
    const trimmed = title.slice(0, 57);
    return `<!-- Current: "${title}" (${title.length} chars) -->\n<!-- Google will truncate to: "${trimmed}..." -->\n<!-- Suggested (move key info to front): -->\n<title>${topKw ? topKw.charAt(0).toUpperCase() + topKw.slice(1) + ' — ' : ''}${trimmed.slice(0, 50)}...</title>\n\n<!-- Why: Google shows ~580px width (~60 chars). Important\n     keywords should be at the beginning. -->`;
  }

  if (problem.includes('meta description') && problem.includes('missing')) {
    const kwList = [topKw, topKw2, topKw3].filter(Boolean);
    const suggested = h1 && kwList.length > 0
      ? `${h1}. ${kwList.length > 1 ? `Learn about ${kwList.join(', ')}` : `Everything about ${kwList[0]}`}. Get started today on ${domain}.`
      : firstSentence
        ? `${firstSentence}. ${kwList.length > 0 ? `Covering ${kwList.join(', ')}.` : ''} Explore more on ${domain}.`
        : `Discover ${kwPhrase || 'our content'} on ${domain}. Comprehensive resources, guides, and tools.`;
    return `<!-- Generated from your page content and top keywords: -->\n<meta name="description" content="${suggested.slice(0, 155)}">\n\n<!-- Why: Pages with descriptions get 5.8% higher CTR.\n     Google uses this as the snippet text in search results. -->`;
  }

  if (problem.includes('description') && problem.includes('short')) {
    const expansion = topKw ? ` Learn about ${topKw}${topKw2 ? ` and ${topKw2}` : ''}.` : '';
    return `<!-- Current: ${desc.length} chars (aim for 150-160) -->\n<meta name="description" content="${desc}${expansion} Explore more on ${domain}.">\n\n<!-- Why: Short descriptions waste SERP space. Google shows\n     up to 160 chars — use them all for higher CTR. -->`;
  }

  if (problem.includes('description') && problem.includes('truncate')) {
    return `<!-- Current: ${desc.length} chars — Google shows ~160 -->\n<!-- Will display as: "${desc.slice(0, 155)}..." -->\n<meta name="description" content="${desc.slice(0, 155)}">\n\n<!-- Why: Truncated descriptions look unprofessional.\n     Put the most important info in the first 150 chars. -->`;
  }

  if (problem.includes('no h1')) {
    const suggested = title || 'Your Page Heading';
    return `<h1>${suggested}</h1>`;
  }

  if (problem.includes('multiple h1')) {
    return `<!-- Keep only one H1. Change extras to H2: -->\n<h1>${h1}</h1>\n<!-- Change other H1s to: -->\n<h2>Secondary Heading</h2>`;
  }

  if (problem.includes('canonical')) {
    return `<link rel="canonical" href="${url}">`;
  }

  if (problem.includes('viewport') && problem.includes('missing')) {
    return `<meta name="viewport" content="width=device-width, initial-scale=1">`;
  }

  if (problem.includes('lang') && problem.includes('missing')) {
    return `<html lang="en">`;
  }

  if (problem.includes('noindex')) {
    return `<!-- Remove this to allow indexing: -->\n<!-- <meta name="robots" content="noindex"> -->\n\n<!-- Replace with: -->\n<meta name="robots" content="index, follow">`;
  }

  // ===== SOCIAL FIXES =====
  if (problem.includes('og') && problem.includes('missing')) {
    return `<meta property="og:title" content="${title || h1 || domain}">\n<meta property="og:description" content="${desc.slice(0, 200) || 'Your page description'}">\n<meta property="og:image" content="https://${domain}/og-image.png">\n<meta property="og:url" content="${url}">\n<meta property="og:type" content="website">\n<meta property="og:site_name" content="${domain}">`;
  }

  if (problem.includes('twitter') || (problem.includes('og') && problem.includes('twitter'))) {
    return `<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${title || h1}">\n<meta name="twitter:description" content="${desc.slice(0, 200) || 'Your page description'}">\n<meta name="twitter:image" content="https://${domain}/og-image.png">`;
  }

  if (problem.includes('structured data') || problem.includes('json-ld')) {
    return `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "${title || h1 || domain}",\n  "description": "${(desc || '').slice(0, 200)}",\n  "url": "${url}"\n}\n</script>`;
  }

  if (problem.includes('og:image') && (problem.includes('broken') || problem.includes('unreachable'))) {
    return `<!-- Fix your og:image URL: -->\n<meta property="og:image" content="https://${domain}/og-image.png">\n\n<!-- Recommended size: 1200x630px, PNG or JPG -->`;
  }

  // ===== TECHNICAL FIXES =====
  if (problem.includes('robots.txt') && problem.includes('not found')) {
    return `# robots.txt\nUser-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://${domain}/sitemap.xml`;
  }

  if (problem.includes('sitemap') && problem.includes('not found')) {
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://${domain}/</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
  }

  if (problem.includes('favicon')) {
    return `<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;
  }

  if (problem.includes('doctype')) {
    return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  ...\n</head>`;
  }

  if (problem.includes('hreflang') && problem.includes('x-default')) {
    return `<link rel="alternate" hreflang="x-default" href="${url}">\n<link rel="alternate" hreflang="en" href="${url}">`;
  }

  if (problem.includes('hreflang') && problem.includes('self-ref')) {
    return `<!-- Add self-referencing hreflang: -->\n<link rel="alternate" hreflang="en" href="${url}">`;
  }

  // ===== PERFORMANCE FIXES =====
  if (problem.includes('lazy')) {
    return `<!-- Add loading="lazy" to below-fold images: -->\n<img src="image.jpg" alt="Description" loading="lazy" width="800" height="600">\n\n<!-- First image (above fold) should NOT be lazy: -->\n<img src="hero.jpg" alt="Hero" fetchpriority="high">`;
  }

  if (problem.includes('webp') || problem.includes('modern format')) {
    return `<!-- Use <picture> for modern format with fallback: -->\n<picture>\n  <source srcset="image.avif" type="image/avif">\n  <source srcset="image.webp" type="image/webp">\n  <img src="image.jpg" alt="Description" width="800" height="600">\n</picture>`;
  }

  if (problem.includes('font-display')) {
    return `@font-face {\n  font-family: 'YourFont';\n  src: url('/fonts/font.woff2') format('woff2');\n  font-display: swap; /* prevents invisible text */\n}`;
  }

  if (problem.includes('render-blocking')) {
    return `<!-- Move scripts to end of body with defer: -->\n<script src="script.js" defer></script>\n\n<!-- Or use async for independent scripts: -->\n<script src="analytics.js" async></script>\n\n<!-- Or use type="module": -->\n<script type="module" src="app.js"></script>`;
  }

  if (problem.includes('inline') && problem.includes('javascript')) {
    return `<!-- Move inline JS to external file: -->\n<script src="/js/main.js" defer></script>\n\n<!-- Instead of: -->\n<!-- <script>...${result.performance?.inlineScriptSize || 0}KB of code...</script> -->`;
  }

  // ===== SECURITY FIXES (server config) =====
  if (problem.includes('hsts')) {
    if (isNextJs) return `// next.config.js\nconst nextConfig = {\n  headers: async () => [{\n    source: '/(.*)',\n    headers: [{\n      key: 'Strict-Transport-Security',\n      value: 'max-age=31536000; includeSubDomains; preload'\n    }]\n  }]\n};`;
    if (isWordPress) return `# .htaccess (Apache)\nHeader always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"`;
    return `# Nginx\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\n\n# Apache (.htaccess)\nHeader always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"\n\n# Vercel (vercel.json)\n{\n  "headers": [{\n    "source": "/(.*)",\n    "headers": [{ "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" }]\n  }]\n}`;
  }

  if (problem.includes('content-security-policy') || (problem.includes('csp') && !problem.includes('unsafe'))) {
    return `# Nginx\nadd_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;`;
  }

  if (problem.includes('x-frame')) {
    return isNextJs
      ? `// next.config.js headers\n{ key: 'X-Frame-Options', value: 'DENY' }`
      : `# Nginx\nadd_header X-Frame-Options "DENY" always;\n\n# Apache\nHeader always set X-Frame-Options "DENY"`;
  }

  if (problem.includes('x-content-type') || problem.includes('nosniff')) {
    return isNextJs
      ? `// next.config.js headers\n{ key: 'X-Content-Type-Options', value: 'nosniff' }`
      : `# Nginx\nadd_header X-Content-Type-Options "nosniff" always;`;
  }

  if (problem.includes('referrer-policy')) {
    return isNextJs
      ? `// next.config.js headers\n{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }`
      : `# Nginx\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;`;
  }

  if (problem.includes('cookie') && problem.includes('httponly')) {
    return `# Set secure cookie flags:\nSet-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/\n\n# In Express.js:\nres.cookie('session', value, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'lax'\n});`;
  }

  if (problem.includes('cookie') && (problem.includes('secure') || problem.includes('samesite'))) {
    return `Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax; Path=/`;
  }

  if (problem.includes('unsafe-inline')) {
    return `# Replace unsafe-inline with nonces:\nContent-Security-Policy: script-src 'self' 'nonce-abc123'\n\n# Then in HTML:\n<script nonce="abc123">...</script>`;
  }

  if (problem.includes('unsafe-eval')) {
    return `# Remove unsafe-eval from CSP:\nContent-Security-Policy: script-src 'self'\n\n# Replace eval() calls in your code with safer alternatives`;
  }

  if (problem.includes('subresource integrity') || problem.includes('sri')) {
    return `<!-- Add integrity attribute to CDN resources: -->\n<script\n  src="https://cdn.example.com/lib.js"\n  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8w"\n  crossorigin="anonymous"\n></script>\n\n<!-- Generate hash: openssl dgst -sha384 -binary lib.js | base64 -->`;
  }

  if (problem.includes('mixed content')) {
    return `<!-- Change HTTP resources to HTTPS: -->\n<!-- Before: -->\n<img src="http://example.com/image.jpg">\n\n<!-- After: -->\n<img src="https://example.com/image.jpg">\n\n<!-- Or use protocol-relative (not recommended): -->\n<img src="//example.com/image.jpg">`;
  }

  if (problem.includes('https') && problem.includes('not using')) {
    return `# Nginx - redirect HTTP to HTTPS:\nserver {\n  listen 80;\n  server_name ${domain};\n  return 301 https://$host$request_uri;\n}\n\n# Apache (.htaccess):\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`;
  }

  // ===== KEYWORD CONTEXT =====
  if (problem.includes('keyword') && problem.includes('not found in title') && topKw) {
    const newTitle = title
      ? `${topKw.charAt(0).toUpperCase() + topKw.slice(1)} — ${title}`
      : `${topKw.charAt(0).toUpperCase() + topKw.slice(1)} | ${domain}`;
    return `<!-- Your top keyword "${topKw}" is missing from the title -->\n<!-- Current: "${title}" -->\n<!-- Suggested: -->\n<title>${newTitle.slice(0, 60)}</title>\n\n<!-- Why: Pages with the target keyword in the title\n     rank 2x higher on average. -->`;
  }

  if (problem.includes('keyword') && problem.includes('not found in h1') && topKw) {
    const newH1 = h1
      ? `${h1} — ${topKw.charAt(0).toUpperCase() + topKw.slice(1)}`
      : topKw.charAt(0).toUpperCase() + topKw.slice(1);
    return `<!-- Your top keyword "${topKw}" is missing from H1 -->\n<!-- Current H1: "${h1 || 'none'}" -->\n<h1>${newH1}</h1>\n\n<!-- Why: H1 should contain your primary keyword.\n     It tells Google what the page is about. -->`;
  }

  // ===== PIXEL WIDTH =====
  if (problem.includes('description') && problem.includes('wide')) {
    const trimmedDesc = desc.slice(0, 150);
    return `<!-- Description too wide for mobile SERP (~920px limit) -->\n<!-- Trimmed version: -->\n<meta name="description" content="${trimmedDesc}">\n\n<!-- Why: On mobile, long descriptions get cut off.\n     Keep important info in the first 120 chars. -->`;
  }

  // ===== ACCESSIBILITY =====
  if (problem.includes('skip') && problem.includes('nav')) {
    return `<!-- Add as the first element inside <body>: -->\n<a href="#main-content" class="skip-link">\n  Skip to main content\n</a>\n\n<style>\n.skip-link {\n  position: absolute;\n  top: -100%;\n  left: 0;\n  padding: 8px 16px;\n  background: #000;\n  color: #fff;\n  z-index: 100;\n}\n.skip-link:focus {\n  top: 0;\n}\n</style>\n\n<main id="main-content">...</main>\n\n<!-- Why: Screen reader users need a way to skip\n     repetitive navigation links. WCAG 2.4.1 -->`;
  }

  if (problem.includes('aria') && problem.includes('landmark')) {
    return `<!-- Add ARIA landmarks to your layout: -->\n<header role="banner">...</header>\n<nav role="navigation" aria-label="Main">...</nav>\n<main role="main">...</main>\n<footer role="contentinfo">...</footer>\n\n<!-- Why: Landmarks help screen reader users navigate\n     your page structure. WCAG 1.3.1 -->`;
  }

  if (problem.includes('table') && problem.includes('accessibility')) {
    return `<!-- Add headers and scope to data tables: -->\n<table>\n  <caption>Monthly Sales Data</caption>\n  <thead>\n    <tr>\n      <th scope="col">Month</th>\n      <th scope="col">Revenue</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>January</td>\n      <td>$1,200</td>\n    </tr>\n  </tbody>\n</table>\n\n<!-- Why: Without <th> and scope, screen readers\n     can't associate cells with headers. WCAG 1.3.1 -->`;
  }

  if (problem.includes('form') && problem.includes('get')) {
    return `<!-- Change forms with sensitive data to POST: -->\n<form method="POST" action="/submit">\n  <input type="email" name="email">\n  <button type="submit">Submit</button>\n</form>\n\n<!-- Why: GET puts form data in the URL, visible in\n     browser history and server logs. Use POST for\n     any form with personal or sensitive data. -->`;
  }

  if (problem.includes('paragraph') && problem.includes('long')) {
    return `<!-- Break long paragraphs into shorter ones (3-4 sentences max) -->\n<!-- Add subheadings every 300 words: -->\n<h2>Section Title</h2>\n<p>First point in 2-3 sentences.</p>\n\n<h3>Sub-topic</h3>\n<p>Supporting detail in 2-3 sentences.</p>\n\n<!-- Use lists for scannable content: -->\n<ul>\n  <li>Key point one</li>\n  <li>Key point two</li>\n</ul>\n\n<!-- Why: 79% of users scan rather than read.\n     Short paragraphs improve readability by 58%. -->`;
  }

  // ===== REDIRECT =====
  if (problem.includes('redirect chain') || problem.includes('redirect loop')) {
    return isNextJs
      ? `// next.config.js — point directly to final URL:\nconst nextConfig = {\n  redirects: async () => [\n    {\n      source: '/old-page',\n      destination: '${url}',\n      permanent: true, // 301\n    }\n  ]\n};\n\n// Why: Each redirect hop adds 100-500ms latency\n// and dilutes link equity. Point directly to final URL.`
      : `# Nginx — single redirect to final URL:\nrewrite ^/old-page$ ${url} permanent;\n\n# Apache (.htaccess):\nRedirect 301 /old-page ${url}\n\n# Why: Redirect chains waste crawl budget\n# and slow down page load. Use direct 301s.`;
  }

  if (problem.includes('302') && problem.includes('redirect')) {
    return `# Change 302 (temporary) to 301 (permanent):\n\n# Nginx:\nrewrite ^/old$ /new permanent;  # 301\n# NOT: rewrite ^/old$ /new redirect;  # 302\n\n# Apache:\nRedirect 301 /old /new\n# NOT: Redirect 302 /old /new\n\n# Why: 302s don't pass full link equity (PageRank).\n# Use 301 for permanent URL changes.`;
  }

  // ===== CONTENT =====
  if (problem.includes('thin content')) {
    const kwSuggestions = [topKw, topKw2, topKw3].filter(Boolean);
    return `<!-- Your page has less than 300 words -->\n<!-- Expand with these content ideas based on your keywords: -->\n\n${kwSuggestions.length > 0 ? kwSuggestions.map(k => `<!-- Section: "${k.charAt(0).toUpperCase() + k.slice(1)}" -->\n<h2>What is ${k}?</h2>\n<p>Explain ${k} in detail... (aim for 100+ words per section)</p>\n`).join('\n') : '<!-- Add FAQ section: -->\n<h2>Frequently Asked Questions</h2>\n<h3>What is [topic]?</h3>\n<p>Answer...</p>'}\n<!-- Why: Pages under 300 words rarely rank.\n     Google considers them "thin content".\n     Aim for 800-1500 words for competitive topics. -->`;
  }

  // ===== IMAGE FIXES =====
  if (problem.includes('alt text') || problem.includes('missing alt')) {
    return `<!-- Add descriptive alt text to all images: -->\n<img src="photo.jpg" alt="Team meeting in modern office" width="800" height="600">\n\n<!-- For decorative images, use empty alt: -->\n<img src="divider.png" alt="" role="presentation">`;
  }

  // ===== WORDPRESS SPECIFIC =====
  if (problem.includes('wordpress') && problem.includes('structured data')) {
    return `<!-- Install a WordPress SEO plugin: -->\n\n<!-- Option 1: Yoast SEO (most popular) -->\n<!-- Dashboard → Plugins → Add New → Search "Yoast SEO" → Install → Activate -->\n\n<!-- Option 2: Rank Math (free + powerful) -->\n<!-- Dashboard → Plugins → Add New → Search "Rank Math" → Install → Activate -->\n\n<!-- Both auto-generate JSON-LD structured data -->`;
  }

  // ===== COMPLETE SECURITY CONFIG =====
  if (problem.includes('security') && (problem.includes('header') || problem.includes('grade'))) {
    if (isNextJs) return `// next.config.js — Complete security headers\nconst nextConfig = {\n  headers: async () => [{\n    source: '/(.*)',\n    headers: [\n      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },\n      { key: 'X-Frame-Options', value: 'DENY' },\n      { key: 'X-Content-Type-Options', value: 'nosniff' },\n      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },\n      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },\n    ]\n  }],\n  poweredByHeader: false, // removes X-Powered-By\n};\nmodule.exports = nextConfig;`;
    return `# Nginx — Complete security headers for ${domain}\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;\nadd_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;\nadd_header X-Frame-Options "DENY" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;\nadd_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;\nserver_tokens off; # hide nginx version\n\n# Apache (.htaccess)\nHeader always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"\nHeader always set X-Frame-Options "DENY"\nHeader always set X-Content-Type-Options "nosniff"\nHeader always set Referrer-Policy "strict-origin-when-cross-origin"\nHeader always set Permissions-Policy "camera=(), microphone=(), geolocation=()"`;
  }

  // ===== X-POWERED-BY =====
  if (problem.includes('x-powered-by')) {
    if (isNextJs) return `// next.config.js\nconst nextConfig = {\n  poweredByHeader: false, // removes X-Powered-By: Next.js\n};\nmodule.exports = nextConfig;`;
    return `# Nginx\nproxy_hide_header X-Powered-By;\n\n# Apache\nHeader unset X-Powered-By\n\n# Express.js\napp.disable('x-powered-by');`;
  }

  // ===== COMPRESSION =====
  if (problem.includes('compression') || problem.includes('gzip') || problem.includes('brotli')) {
    if (isNextJs) return `// Next.js enables compression by default.\n// If using a reverse proxy (nginx):\n\n# Nginx\ngzip on;\ngzip_types text/plain text/css application/json application/javascript text/xml;\ngzip_min_length 256;\n\n# Vercel — automatic, no config needed`;
    return `# Nginx — Enable gzip + brotli\ngzip on;\ngzip_vary on;\ngzip_min_length 256;\ngzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;\n\n# Apache (.htaccess)\nAddOutputFilterByType DEFLATE text/plain text/css application/json application/javascript text/xml`;
  }

  // ===== CACHE-CONTROL =====
  if (problem.includes('cache-control') || problem.includes('cache duration')) {
    return `# Nginx — Cache static assets for 1 year\nlocation ~* \\.(css|js|jpg|jpeg|png|gif|svg|woff2)$ {\n  add_header Cache-Control "public, max-age=31536000, immutable";\n}\n\n# HTML pages — short cache with revalidation\nlocation ~* \\.html$ {\n  add_header Cache-Control "public, max-age=0, must-revalidate";\n}\n\n# Next.js — automatic for _next/static/\n# Vercel — automatic caching headers`;
  }

  // ===== PRECONNECT FROM REAL DOMAINS =====
  if (problem.includes('preconnect') || problem.includes('dns-prefetch')) {
    const extDomains = result.pageWeight?.externalDomains || 0;
    return `<!-- Add preconnect hints for your ${extDomains} external domains: -->\n<!-- Put these in <head> before any external resources -->\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="dns-prefetch" href="https://www.google-analytics.com">\n\n<!-- Why: Each preconnect saves 100-300ms by establishing\n     the TCP+TLS connection before the browser needs it.\n     Only preconnect to domains used above the fold. -->`;
  }

  // ===== IMAGE ALT FROM FILENAME =====
  if (problem.includes('alt') && (problem.includes('short') || problem.includes('length'))) {
    return `<!-- Write descriptive alt text (10-125 characters): -->\n\n<!-- BAD: -->\n<img src="img1.jpg" alt="img">\n\n<!-- GOOD (describe what's IN the image): -->\n<img src="dashboard-analytics.jpg" alt="SEO analytics dashboard showing score trends and top issues">\n\n<!-- For decorative images: -->\n<img src="divider.svg" alt="" role="presentation">\n\n<!-- Tip: Don't start with "Image of..." or "Picture of..." -->\n<!-- Screen readers already announce it as an image. -->`;
  }

  // ===== SRCSET / RESPONSIVE IMAGES =====
  if (problem.includes('srcset') || problem.includes('responsive')) {
    return `<!-- Serve different sizes for different viewports: -->\n<img \n  src="photo-800.jpg"\n  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"\n  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"\n  alt="Descriptive alt text"\n  width="800" height="600"\n  loading="lazy"\n>\n\n<!-- Or use <picture> for art direction: -->\n<picture>\n  <source media="(max-width: 600px)" srcset="photo-mobile.webp">\n  <source media="(min-width: 601px)" srcset="photo-desktop.webp">\n  <img src="photo-fallback.jpg" alt="Description">\n</picture>\n\n<!-- Why: Serving 1200px images on 400px screens\n     wastes bandwidth and slows page load. -->`;
  }

  // ===== FORM LABEL FIX =====
  if (problem.includes('form') && problem.includes('label')) {
    return `<!-- Every input needs an associated label: -->\n\n<!-- Method 1: Wrapping -->\n<label>\n  Email address\n  <input type="email" name="email" autocomplete="email">\n</label>\n\n<!-- Method 2: for/id pairing -->\n<label for="email">Email address</label>\n<input type="email" id="email" name="email" autocomplete="email">\n\n<!-- Why: Labels help screen readers announce what\n     each form field is for. Required by WCAG 2.1. -->`;
  }

  // ===== AUTHOR / E-E-A-T FIXES =====
  if (problem.includes('author') && problem.includes('not found')) {
    return `<!-- Add author information: -->\n<meta name="author" content="Your Name">\n\n<!-- Better: Add author schema in JSON-LD: -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "author": {\n    "@type": "Person",\n    "name": "Your Name",\n    "url": "https://${domain}/about"\n  },\n  "headline": "${title}",\n  "datePublished": "${new Date().toISOString().slice(0, 10)}"\n}\n</script>\n\n<!-- Why: Google uses authorship for E-E-A-T evaluation.\n     Pages with identified authors rank better. -->`;
  }

  if (problem.includes('publish') && problem.includes('date')) {
    return `<!-- Add publish date with <time> element: -->\n<time datetime="${new Date().toISOString().slice(0, 10)}">March 22, 2026</time>\n\n<!-- Or in JSON-LD: -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "datePublished": "${new Date().toISOString().slice(0, 10)}",\n  "dateModified": "${new Date().toISOString().slice(0, 10)}"\n}\n</script>\n\n<!-- Why: Content freshness is a Google ranking signal.\n     Dated content shows it's actively maintained. -->`;
  }

  if (problem.includes('about') && problem.includes('page')) {
    return `<!-- Add an About page link in your footer: -->\n<footer>\n  <a href="/about">About Us</a>\n  <a href="/contact">Contact</a>\n  <a href="/privacy">Privacy Policy</a>\n</footer>\n\n<!-- Your About page should include: -->\n<!-- - Who you are / company background -->\n<!-- - Team members with real photos -->\n<!-- - Contact information -->\n<!-- - Social media links -->\n\n<!-- Why: Google's E-E-A-T guidelines value transparency.\n     About pages build trust with users and search engines. -->`;
  }

  if (problem.includes('privacy') && problem.includes('not found')) {
    return `<!-- Add a privacy policy link in your footer: -->\n<footer>\n  <a href="/privacy">Privacy Policy</a>\n  <a href="/terms">Terms of Service</a>\n</footer>\n\n<!-- Why: Required by GDPR, CCPA, and Google AdSense.\n     Builds trust — Google's E-E-A-T guidelines value\n     sites that are transparent about data practices. -->`;
  }

  // ===== EMAIL OBFUSCATION =====
  if (problem.includes('email') && problem.includes('exposed')) {
    return `<!-- Don't put plain emails in HTML: -->\n<!-- BAD: -->\n<p>Contact us at support@${domain}</p>\n\n<!-- GOOD: Use a contact form or obfuscate: -->\n<a href="/contact">Contact Us</a>\n\n<!-- Or JavaScript obfuscation: -->\n<script>\n  const e = 'support' + '@' + '${domain}';\n  document.getElementById('email').href = 'mailto:' + e;\n</script>\n\n<!-- Why: Spam bots scrape plain text emails.\n     Obfuscation reduces spam by 95%+. -->`;
  }

  // ===== NOOPENER =====
  if (problem.includes('noopener') || (problem.includes('target') && problem.includes('blank'))) {
    return `<!-- Add rel="noopener noreferrer" to external links: -->\n\n<!-- Before (security risk): -->\n<a href="https://example.com" target="_blank">Link</a>\n\n<!-- After (secure): -->\n<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>\n\n<!-- Why: Without rel="noopener", the linked page can\n     access your page via window.opener — potentially\n     redirecting your users to a phishing page. -->`;
  }

  // ===== PAGE WEIGHT =====
  if (problem.includes('page weight') || problem.includes('page size')) {
    return `<!-- Reduce page weight: -->\n\n<!-- 1. Compress images (biggest win): -->\n<!-- Use WebP/AVIF, resize to display size -->\n<!-- Tool: squoosh.app -->\n\n<!-- 2. Minify CSS/JS: -->\n<!-- Next.js/Vite do this automatically -->\n<!-- Otherwise: npm install terser cssnano -->\n\n<!-- 3. Remove unused code: -->\n<!-- Check with Chrome DevTools → Coverage tab -->\n\n<!-- 4. Lazy load below-fold content: -->\n<img loading="lazy" src="photo.jpg">\n<iframe loading="lazy" src="..."></iframe>\n\n<!-- Target: < 1.5MB total page weight -->`;
  }

  // ===== COPYRIGHT YEAR =====
  if (problem.includes('copyright') && problem.includes('year')) {
    return `<!-- Auto-update copyright year: -->\n\n<!-- HTML + JavaScript: -->\n<p>&copy; <span id="year"></span> ${domain}</p>\n<script>document.getElementById('year').textContent = new Date().getFullYear();</script>\n\n<!-- React/Next.js: -->\n<p>&copy; {new Date().getFullYear()} ${domain}</p>\n\n<!-- PHP: -->\n<p>&copy; <?= date('Y') ?> ${domain}</p>\n\n<!-- Why: Outdated copyright years make your site\n     look abandoned — hurting trust and credibility. -->`;
  }

  // ===== URL FIXES =====
  if (problem.includes('url') && problem.includes('uppercase')) {
    const fixedUrl = url.toLowerCase();
    return `# Redirect uppercase URL to lowercase:\n# Current: ${url}\n# Should be: ${fixedUrl}\n\n# Nginx:\nrewrite ^(.*)$ $1 lowercase;\n\n# Apache (.htaccess):\nRewriteRule [A-Z] - [E=HASCAPS:TRUE,S=1]\nRewriteRule ^ - [L]`;
  }

  if (problem.includes('url') && problem.includes('underscore')) {
    return `# Google treats hyphens as word separators, not underscores.\n# Change: /my_page → /my-page\n\n# Add redirect for old URL:\n# Nginx:\nrewrite ^/(.*)_(.*)$ /$1-$2 permanent;`;
  }

  return null;
}
