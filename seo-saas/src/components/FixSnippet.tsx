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

// Generate fix code based on issue
export function generateFixCode(issue: any, result: any): string | null {
  const problem = issue.problem?.toLowerCase() || '';

  if (problem.includes('title') && problem.includes('missing')) {
    const suggested = result.og?.title || result.url?.split('/').pop() || 'Your Page Title';
    return `<title>${suggested} — Your Brand</title>`;
  }

  if (problem.includes('meta description') && problem.includes('missing')) {
    return `<meta name="description" content="Your compelling page description here. Include your target keyword. Aim for 150-160 characters for optimal display in search results.">`;
  }

  if (problem.includes('canonical')) {
    return `<link rel="canonical" href="${result.url}">`;
  }

  if (problem.includes('no h1')) {
    return `<h1>Your Primary Keyword — Page Topic</h1>`;
  }

  if (problem.includes('viewport') && problem.includes('missing')) {
    return `<meta name="viewport" content="width=device-width, initial-scale=1">`;
  }

  if (problem.includes('lang') && problem.includes('missing')) {
    return `<html lang="en">`;
  }

  if (problem.includes('structured data') || problem.includes('json-ld')) {
    const title = result.meta?.title?.text || 'Page Title';
    const desc = result.meta?.description?.text || 'Page description';
    return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${title}",
  "description": "${desc}",
  "url": "${result.url}"
}
</script>`;
  }

  if (problem.includes('og') && problem.includes('missing')) {
    const title = result.meta?.title?.text || 'Page Title';
    return `<meta property="og:title" content="${title}">
<meta property="og:description" content="Your page description">
<meta property="og:image" content="https://yoursite.com/og-image.png">
<meta property="og:url" content="${result.url}">
<meta property="og:type" content="website">`;
  }

  if (problem.includes('robots.txt') && problem.includes('not found')) {
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${new URL(result.url).origin}/sitemap.xml`;
  }

  if (problem.includes('favicon')) {
    return `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">`;
  }

  if (problem.includes('hsts')) {
    return `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`;
  }

  if (problem.includes('lazy')) {
    return `<img src="image.jpg" alt="Description" loading="lazy" width="800" height="600">`;
  }

  if (problem.includes('font-display')) {
    return `@font-face {
  font-family: 'YourFont';
  src: url('/fonts/your-font.woff2') format('woff2');
  font-display: swap;
}`;
  }

  return null;
}
