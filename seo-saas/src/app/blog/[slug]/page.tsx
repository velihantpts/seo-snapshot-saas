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
