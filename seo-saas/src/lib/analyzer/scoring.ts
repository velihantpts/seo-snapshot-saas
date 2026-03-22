import type { Issue } from './types';

interface ScoringInput {
  titleLen: number; descLen: number; h1Count: number; canonical: string; lang: string;
  isHttps: boolean; viewportMeta: string; robotsExists: boolean; sitemapExists: boolean;
  redirectChainLen: number; hasDoctype: boolean; fetchTime: number; renderBlocking: number;
  notLazy: number; inlineScriptKB: number; hstsHeader: string | null; cspHeader: string;
  headers: Record<string, string | null>; mixedContentCount: number; noSriCount: number;
  setCookieHeader: string | null; wordCount: number; readScore: number; kwInTitle: boolean;
  kwInH1: boolean; ogCount: number; schemas: any[]; twCard: string;
  noLabel: number; altRatio: number; skippedH: number;
  isNoindex: boolean; brokenLinksCount: number;
  badFontDisplay: number; urlPath: string; textToHtmlRatio: number;
  titlePixelWidth: number; titleTags: number; descTags: number;
  hasCompression: boolean; hasCacheControl: boolean; noopenerMissing: number;
  kwInUrl?: boolean; kwInDesc?: boolean; eeatScore?: number;
  spamLinks?: number; totalRequests?: number; estimatedPageWeight?: number;
  isEnglish?: boolean; headingCount?: number;
}

export function calculateScore(input: ScoringInput, issues: Issue[]) {
  // ===== META & ON-PAGE: 25pt =====
  let metaScore = 0;
  metaScore += input.titleLen >= 30 && input.titleLen <= 60 ? 8 : input.titleLen > 0 ? 4 : 0;
  metaScore += input.descLen >= 120 && input.descLen <= 160 ? 8 : input.descLen > 0 ? 4 : 0;
  metaScore += input.h1Count === 1 ? 4 : input.h1Count > 0 ? 2 : 0;
  metaScore += input.canonical ? 3 : 0;
  metaScore += input.lang ? 2 : 0;

  // ===== TECHNICAL: 17pt =====
  let techScore = 0;
  techScore += input.isHttps ? 5 : 0;
  techScore += input.viewportMeta ? 3 : 0;
  techScore += input.robotsExists ? 3 : 0;
  techScore += input.sitemapExists ? 2 : 0;
  techScore += input.redirectChainLen <= 1 ? 2 : input.redirectChainLen <= 3 ? 1 : 0;
  techScore += input.hasDoctype ? 2 : 0;

  // ===== PERFORMANCE: 15pt =====
  // NOTE: fetchTime is measured from our server, not end-user. Treat as relative indicator.
  let perfScore = 0;
  perfScore += input.fetchTime < 1000 ? 4 : input.fetchTime < 2000 ? 2 : input.fetchTime < 3000 ? 1 : 0;
  perfScore += input.renderBlocking <= 2 ? 3 : input.renderBlocking <= 5 ? 1 : 0;
  perfScore += input.notLazy <= 2 ? 2 : input.notLazy <= 5 ? 1 : 0;
  perfScore += input.inlineScriptKB < 30 ? 1.5 : input.inlineScriptKB < 80 ? 0.5 : 0;
  perfScore += input.hasCompression ? 1.5 : 0;
  perfScore += input.hasCacheControl ? 1 : 0;
  perfScore += (input.totalRequests || 0) <= 50 ? 1 : (input.totalRequests || 0) <= 80 ? 0.5 : 0;
  perfScore += (input.estimatedPageWeight || 0) <= 1500 ? 1 : (input.estimatedPageWeight || 0) <= 3000 ? 0.5 : 0;

  // ===== SECURITY: 10pt (reduced — only HTTPS is confirmed ranking factor) =====
  let secCalcScore = 0;
  secCalcScore += input.isHttps ? 4 : 0;  // HTTPS = confirmed ranking signal
  secCalcScore += (input.hstsHeader && parseInt(input.hstsHeader.match(/max-age=(\d+)/)?.[1] || '0') >= 31536000) ? 1.5 : input.hstsHeader ? 0.5 : 0;
  secCalcScore += input.cspHeader && !input.cspHeader.includes('unsafe-inline') ? 1.5 : input.cspHeader ? 0.5 : 0;
  secCalcScore += input.headers['x-frame-options'] ? 0.5 : 0;
  secCalcScore += input.headers['x-content-type-options'] ? 0.5 : 0;
  secCalcScore += input.headers['referrer-policy'] ? 0.5 : 0;
  secCalcScore += input.mixedContentCount === 0 ? 1 : 0;
  secCalcScore += (!input.setCookieHeader || (input.setCookieHeader.toLowerCase().includes('httponly') && input.setCookieHeader.toLowerCase().includes('secure'))) ? 0.5 : 0;

  // ===== CONTENT QUALITY: 18pt (Google's #1 factor at ~26%) =====
  let contentScore = 0;
  // Word count (depth indicator)
  contentScore += input.wordCount >= 1000 ? 5 : input.wordCount >= 500 ? 4 : input.wordCount >= 300 ? 3 : input.wordCount >= 100 ? 1 : 0;
  // Readability — FIX: neutral score for non-English content
  const effectiveReadScore = (input.isEnglish === false && input.readScore === 0) ? 55 : input.readScore;
  contentScore += effectiveReadScore >= 60 ? 2.5 : effectiveReadScore >= 40 ? 1.5 : effectiveReadScore > 0 ? 0.5 : 0;
  // Keyword placement
  contentScore += input.kwInTitle ? 1.5 : 0;
  contentScore += input.kwInH1 ? 1 : 0;
  contentScore += input.kwInUrl ? 0.5 : 0;
  contentScore += input.kwInDesc ? 0.5 : 0;
  // Heading diversity (content structure)
  const hCount = input.headingCount || 0;
  contentScore += hCount >= 5 ? 2 : hCount >= 3 ? 1.5 : hCount >= 1 ? 1 : 0;
  // E-E-A-T signals (up to 3pt)
  const eeat = input.eeatScore || 0;
  contentScore += eeat >= 5 ? 3 : eeat >= 3 ? 2 : eeat >= 1 ? 1 : 0;
  // Text-to-HTML ratio bonus
  contentScore += input.textToHtmlRatio >= 25 ? 1 : input.textToHtmlRatio >= 15 ? 0.5 : 0;

  // ===== SOCIAL & SCHEMA: 8pt (reduced — OG not a ranking factor) =====
  let socialScore = 0;
  socialScore += input.ogCount >= 4 ? 2.5 : input.ogCount >= 2 ? 1.5 : 0;  // OG = click-through, not ranking
  socialScore += input.schemas.length > 0 && input.schemas.some((s: any) => s.valid) ? 4 : input.schemas.length > 0 ? 2 : 0;  // Schema = rich results
  socialScore += input.twCard ? 1.5 : 0;

  // ===== ACCESSIBILITY: 7pt (increased — Google cares about UX) =====
  let a11yCalcScore = 0;
  a11yCalcScore += input.noLabel === 0 ? 2 : 0;
  a11yCalcScore += input.altRatio >= 0.9 ? 2.5 : input.altRatio >= 0.5 ? 1.5 : 0;
  a11yCalcScore += input.skippedH === 0 ? 1.5 : 0;
  a11yCalcScore += input.lang ? 1 : 0;  // lang attr = a11y + SEO

  // ===== PENALTIES (capped to prevent extreme scores) =====
  let penalty = 0;
  penalty += Math.min(input.brokenLinksCount * 2, 10);  // FIX: cap at 10pt max
  penalty += input.isNoindex ? 10 : 0;
  penalty += input.mixedContentCount > 0 ? 3 : 0;
  if (input.badFontDisplay > 0) penalty += 1;
  if (input.urlPath.length > 115) penalty += 0.5;
  if (/[A-Z]/.test(input.urlPath)) penalty += 0.5;
  if (input.textToHtmlRatio < 10) penalty += 1;
  if (input.titleTags > 1) penalty += 1;
  if (input.descTags > 1) penalty += 1;
  if (input.titlePixelWidth > 580) penalty += 0.5;
  if (input.noSriCount > 0) penalty += 0.5;
  if (input.noopenerMissing > 0) penalty += 0.5;
  if (!input.hasCompression) penalty += 1;
  if ((input.spamLinks || 0) > 0) penalty += 5;
  if ((input.totalRequests || 0) > 100) penalty += 1;
  if ((input.estimatedPageWeight || 0) > 5000) penalty += 1.5;
  // Cap total penalty at 30 to prevent unreasonably low scores
  penalty = Math.min(penalty, 30);

  // Total: 25 + 17 + 15 + 10 + 18 + 8 + 7 = 100
  const rawScore = metaScore + techScore + perfScore + secCalcScore + contentScore + socialScore + a11yCalcScore - penalty;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  const categoryScores = {
    meta: Math.round((metaScore / 25) * 100),
    technical: Math.round((techScore / 17) * 100),
    performance: Math.round((perfScore / 15) * 100),
    security: Math.round((secCalcScore / 10) * 100),
    content: Math.round((contentScore / 18) * 100),
    social: Math.round((socialScore / 8) * 100),
    accessibility: Math.round((a11yCalcScore / 7) * 100),
  };

  // Impact score per issue
  const impactMap: Record<string, number> = {
    'title': 15, 'meta description': 15, 'h1': 10, 'heading': 5, 'alt': 8,
    'https': 10, 'canonical': 5, 'og': 6, 'structured data': 5, 'json-ld': 5,
    'lang': 5, 'viewport': 5, 'content': 8, 'word': 8,
    'hsts': 3, 'csp': 3, 'x-frame': 2, 'nosniff': 2, 'referrer': 2,
    'redirect': 4, 'broken link': 5, 'mixed content': 6, 'noindex': 15,
    'lazy': 3, 'webp': 3, 'render-blocking': 4, 'cookie': 2, 'sri': 1,
    'hreflang': 3, 'sitemap': 3, 'robots': 3, 'image': 4,
    'author': 3, 'about': 2, 'privacy': 2, 'contact': 2, 'publish': 2,
    'keyword': 3, 'density': 3, 'stuffing': 5, 'spam': 8,
    'compression': 4, 'cache-control': 2, 'x-powered': 2,
    'deprecated': 2, 'email': 2, 'copyright': 1, 'meta refresh': 3,
    'request': 3, 'page weight': 3, 'preconnect': 2, 'srcset': 2,
    'font size': 2, 'noopener': 2, 'e-e-a-t': 5,
  };
  issues.forEach(issue => {
    const key = Object.keys(impactMap).find(k => issue.problem.toLowerCase().includes(k));
    issue.impact = key ? impactMap[key] : (issue.severity === 'critical' ? 8 : 3);
  });

  // Category auto-assign
  const categoryMap: Record<string, string> = {
    'title': 'Meta', 'description': 'Meta', 'canonical': 'Meta', 'lang': 'Meta', 'viewport': 'Meta',
    'favicon': 'Meta', 'doctype': 'Meta', 'charset': 'Meta',
    'H1': 'Content', 'heading': 'Content', 'alt': 'Content', 'image': 'Content', 'word': 'Content',
    'keyword': 'Content', 'readab': 'Content', 'paragraph': 'Content', 'author': 'Content',
    'about': 'Content', 'privacy': 'Content', 'contact': 'Content', 'copyright': 'Content',
    'publish': 'Content', 'e-e-a-t': 'Content',
    'OG': 'Social', 'og:': 'Social', 'structured': 'Social', 'JSON-LD': 'Social', 'twitter': 'Social',
    'HSTS': 'Security', 'CSP': 'Security', 'X-Frame': 'Security', 'nosniff': 'Security',
    'cookie': 'Security', 'SRI': 'Security', 'mixed content': 'Security', 'X-Powered': 'Security',
    'email': 'Security', 'spam': 'Security', 'noopener': 'Security',
    'script': 'Performance', 'render-blocking': 'Performance', 'lazy': 'Performance',
    'compression': 'Performance', 'cache': 'Performance', 'request': 'Performance',
    'page weight': 'Performance', 'preconnect': 'Performance', 'font-display': 'Performance',
    'inline': 'Performance', 'srcset': 'Performance',
    'mobile': 'Mobile', 'zoom': 'Mobile', 'scalable': 'Mobile', 'font size': 'Mobile',
    'robots': 'Technical', 'sitemap': 'Technical', 'redirect': 'Technical', 'noindex': 'Technical',
    'hreflang': 'Technical', 'deprecated': 'Technical', 'meta refresh': 'Technical',
    'URL': 'Technical', 'url': 'Technical',
  };
  issues.forEach(issue => {
    if (!issue.category) {
      const key = Object.keys(categoryMap).find(k => issue.problem.toLowerCase().includes(k.toLowerCase()));
      issue.category = key ? categoryMap[key] : 'Other';
    }
  });

  // Potential score
  const criticalImpact = issues.filter(i => i.severity === 'critical').reduce((sum, i) => sum + (i.impact || 5), 0);
  const potentialScore = Math.min(100, finalScore + criticalImpact);

  // Sort by impact
  issues.sort((a, b) => (b.impact || 0) - (a.impact || 0));

  return { score: finalScore, potentialScore, categoryScores };
}
