'use client';
import { useState } from 'react';
import { Copy, CheckCircle, Code } from 'lucide-react';

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
      <pre className="p-3 text-xs font-mono text-accent-300/80 overflow-x-auto scrollbar-thin bg-white/[0.02] leading-relaxed whitespace-pre-wrap break-all">
        {code}
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

  // ===== META FIXES =====
  if (problem.includes('title') && problem.includes('missing')) {
    const suggested = h1 || desc.split('.')[0]?.slice(0, 50) || domain;
    return `<title>${suggested} — ${domain}</title>`;
  }

  if (problem.includes('title') && (problem.includes('short') || problem.includes('too short'))) {
    const extra = desc ? desc.split(/[.!?]/)[0]?.trim().slice(0, 40) : 'Your Primary Keyword';
    return `<!-- Current: "${title}" (${title.length} chars) -->\n<!-- Suggested: -->\n<title>${title} — ${extra} | ${domain}</title>`;
  }

  if (problem.includes('title') && (problem.includes('truncate') || problem.includes('long'))) {
    const trimmed = title.slice(0, 57);
    return `<!-- Current: "${title}" (${title.length} chars) -->\n<!-- Trimmed to 60 chars: -->\n<title>${trimmed}...</title>`;
  }

  if (problem.includes('meta description') && problem.includes('missing')) {
    // Generate from page content
    const bodyWords = result.topKeywords?.slice(0, 3).map((k: { word: string }) => k.word).join(', ') || 'your topic';
    const suggested = h1 ? `${h1}. Learn about ${bodyWords}. Get started today.` : `Explore ${bodyWords} on ${domain}. Comprehensive resources and guides.`;
    return `<meta name="description" content="${suggested.slice(0, 155)}">`;
  }

  if (problem.includes('description') && problem.includes('short')) {
    return `<!-- Current: ${desc.length} chars. Add more detail: -->\n<meta name="description" content="${desc} Learn more about ${result.topKeywords?.[0]?.word || 'this topic'} and get actionable insights.">`;
  }

  if (problem.includes('description') && problem.includes('truncate')) {
    return `<!-- Current: ${desc.length} chars, will truncate. Trimmed: -->\n<meta name="description" content="${desc.slice(0, 155)}">`;
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

  // ===== IMAGE FIXES =====
  if (problem.includes('alt text') || problem.includes('missing alt')) {
    return `<!-- Add descriptive alt text to all images: -->\n<img src="photo.jpg" alt="Team meeting in modern office" width="800" height="600">\n\n<!-- For decorative images, use empty alt: -->\n<img src="divider.png" alt="" role="presentation">`;
  }

  // ===== WORDPRESS SPECIFIC =====
  if (problem.includes('wordpress') && problem.includes('structured data')) {
    return `<!-- Install a WordPress SEO plugin: -->\n\n<!-- Option 1: Yoast SEO (most popular) -->\n<!-- Dashboard → Plugins → Add New → Search "Yoast SEO" → Install → Activate -->\n\n<!-- Option 2: Rank Math (free + powerful) -->\n<!-- Dashboard → Plugins → Add New → Search "Rank Math" → Install → Activate -->\n\n<!-- Both auto-generate JSON-LD structured data -->`;
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
