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
  // New inputs
  kwInUrl?: boolean; kwInDesc?: boolean; eeatScore?: number;
  spamLinks?: number; totalRequests?: number; estimatedPageWeight?: number;
}

export function calculateScore(input: ScoringInput, issues: Issue[]) {
  // ===== META & ON-PAGE: 25pt =====
  let metaScore = 0;
  metaScore += input.titleLen >= 30 && input.titleLen <= 60 ? 8 : input.titleLen > 0 ? 4 : 0;
  metaScore += input.descLen >= 120 && input.descLen <= 160 ? 8 : input.descLen > 0 ? 4 : 0;
  metaScore += input.h1Count === 1 ? 4 : input.h1Count > 0 ? 2 : 0;
  metaScore += input.canonical ? 3 : 0;
  metaScore += input.lang ? 2 : 0;

  // ===== TECHNICAL: 18pt =====
  let techScore = 0;
  techScore += input.isHttps ? 5 : 0;
  techScore += input.viewportMeta ? 3 : 0;
  techScore += input.robotsExists ? 3 : 0;
  techScore += input.sitemapExists ? 3 : 0;
  techScore += input.redirectChainLen <= 1 ? 2 : input.redirectChainLen <= 3 ? 1 : 0;
  techScore += input.hasDoctype ? 2 : 0;

  // ===== PERFORMANCE: 15pt =====
  let perfScore = 0;
  perfScore += input.fetchTime < 1000 ? 4 : input.fetchTime < 2000 ? 2 : input.fetchTime < 3000 ? 1 : 0;
  perfScore += input.renderBlocking <= 2 ? 3 : input.renderBlocking <= 5 ? 1 : 0;
  perfScore += input.notLazy <= 2 ? 2 : input.notLazy <= 5 ? 1 : 0;
  perfScore += input.inlineScriptKB < 30 ? 1.5 : input.inlineScriptKB < 80 ? 0.5 : 0;
  perfScore += input.hasCompression ? 1.5 : 0;
  perfScore += input.hasCacheControl ? 1 : 0;
  perfScore += (input.totalRequests || 0) <= 50 ? 1 : (input.totalRequests || 0) <= 80 ? 0.5 : 0;
  perfScore += (input.estimatedPageWeight || 0) <= 1500 ? 1 : (input.estimatedPageWeight || 0) <= 3000 ? 0.5 : 0;

  // ===== SECURITY: 12pt =====
  let secCalcScore = 0;
  secCalcScore += input.isHttps ? 4 : 0;
  secCalcScore += (input.hstsHeader && parseInt(input.hstsHeader.match(/max-age=(\d+)/)?.[1] || '0') >= 31536000) ? 2 : input.hstsHeader ? 1 : 0;
  secCalcScore += input.cspHeader && !input.cspHeader.includes('unsafe-inline') ? 2 : input.cspHeader ? 1 : 0;
  secCalcScore += input.headers['x-frame-options'] ? 1 : 0;
  secCalcScore += input.headers['x-content-type-options'] ? 1 : 0;
  secCalcScore += input.headers['referrer-policy'] ? 0.5 : 0;
  secCalcScore += input.mixedContentCount === 0 ? 1 : 0;
  secCalcScore += (!input.setCookieHeader || (input.setCookieHeader.toLowerCase().includes('httponly') && input.setCookieHeader.toLowerCase().includes('secure'))) ? 0.5 : 0;

  // ===== CONTENT QUALITY: 15pt (increased — Google's #1 factor) =====
  let contentScore = 0;
  contentScore += input.wordCount >= 800 ? 4 : input.wordCount >= 300 ? 3 : input.wordCount >= 100 ? 1 : 0;
  contentScore += input.readScore >= 60 ? 2.5 : input.readScore >= 40 ? 1 : 0;
  contentScore += input.kwInTitle ? 2 : 0;
  contentScore += input.kwInH1 ? 1.5 : 0;
  contentScore += input.kwInUrl ? 1 : 0;
  contentScore += input.kwInDesc ? 1 : 0;
  // E-E-A-T bonus (up to 3pt)
  const eeat = input.eeatScore || 0;
  contentScore += eeat >= 5 ? 3 : eeat >= 3 ? 2 : eeat >= 1 ? 1 : 0;

  // ===== SOCIAL & SCHEMA: 10pt =====
  let socialScore = 0;
  socialScore += input.ogCount >= 4 ? 4 : input.ogCount >= 2 ? 2 : 0;
  socialScore += input.schemas.length > 0 && input.schemas.some((s: any) => s.valid) ? 4 : input.schemas.length > 0 ? 2 : 0;
  socialScore += input.twCard ? 2 : 0;

  // ===== ACCESSIBILITY: 5pt =====
  let a11yCalcScore = 0;
  a11yCalcScore += input.noLabel === 0 ? 2 : 0;
  a11yCalcScore += input.altRatio >= 0.9 ? 2 : input.altRatio >= 0.5 ? 1 : 0;
  a11yCalcScore += input.skippedH === 0 ? 1 : 0;

  // ===== PENALTIES =====
  let penalty = 0;
  penalty += input.brokenLinksCount * 2;
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
  // New penalties
  if ((input.spamLinks || 0) > 0) penalty += 5;
  if ((input.totalRequests || 0) > 100) penalty += 1;
  if ((input.estimatedPageWeight || 0) > 5000) penalty += 1.5;

  // Total: 25 + 18 + 15 + 12 + 15 + 10 + 5 = 100
  const rawScore = metaScore + techScore + perfScore + secCalcScore + contentScore + socialScore + a11yCalcScore - penalty;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  const categoryScores = {
    meta: Math.round((metaScore / 25) * 100),
    technical: Math.round((techScore / 18) * 100),
    performance: Math.round((perfScore / 15) * 100),
    security: Math.round((secCalcScore / 12) * 100),
    content: Math.round((contentScore / 15) * 100),
    social: Math.round((socialScore / 10) * 100),
    accessibility: Math.round((a11yCalcScore / 5) * 100),
  };

  // Impact score per issue
  const impactMap: Record<string, number> = {
    'title': 15, 'meta description': 15, 'h1': 10, 'heading': 5, 'alt': 8,
    'https': 10, 'canonical': 5, 'og': 8, 'structured data': 5, 'json-ld': 5,
    'lang': 5, 'viewport': 5, 'content': 8, 'word': 8,
    'hsts': 3, 'csp': 3, 'x-frame': 2, 'nosniff': 2, 'referrer': 2,
    'redirect': 4, 'broken link': 5, 'mixed content': 6, 'noindex': 15,
    'lazy': 3, 'webp': 3, 'render-blocking': 4, 'cookie': 2, 'sri': 1,
    'hreflang': 3, 'sitemap': 3, 'robots': 3, 'image': 4,
    // New impact entries
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
