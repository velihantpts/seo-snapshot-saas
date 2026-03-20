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
}

export function calculateScore(input: ScoringInput, issues: Issue[]) {
  // Meta & Content: 25pt
  let metaScore = 0;
  metaScore += input.titleLen >= 30 && input.titleLen <= 60 ? 8 : input.titleLen > 0 ? 4 : 0;
  metaScore += input.descLen >= 120 && input.descLen <= 160 ? 8 : input.descLen > 0 ? 4 : 0;
  metaScore += input.h1Count === 1 ? 4 : input.h1Count > 0 ? 2 : 0;
  metaScore += input.canonical ? 3 : 0;
  metaScore += input.lang ? 2 : 0;

  // Technical: 20pt
  let techScore = 0;
  techScore += input.isHttps ? 6 : 0;
  techScore += input.viewportMeta ? 3 : 0;
  techScore += input.robotsExists ? 3 : 0;
  techScore += input.sitemapExists ? 3 : 0;
  techScore += input.redirectChainLen <= 1 ? 3 : input.redirectChainLen <= 3 ? 1 : 0;
  techScore += input.hasDoctype ? 2 : 0;

  // Performance: 15pt
  let perfScore = 0;
  perfScore += input.fetchTime < 1000 ? 5 : input.fetchTime < 2000 ? 3 : input.fetchTime < 3000 ? 1 : 0;
  perfScore += input.renderBlocking <= 2 ? 4 : input.renderBlocking <= 5 ? 2 : 0;
  perfScore += input.notLazy <= 2 ? 3 : input.notLazy <= 5 ? 1 : 0;
  perfScore += input.inlineScriptKB < 30 ? 3 : input.inlineScriptKB < 80 ? 1 : 0;

  // Security: 15pt
  let secCalcScore = 0;
  secCalcScore += input.isHttps ? 5 : 0;
  secCalcScore += (input.hstsHeader && parseInt(input.hstsHeader.match(/max-age=(\d+)/)?.[1] || '0') >= 31536000) ? 3 : input.hstsHeader ? 1 : 0;
  secCalcScore += input.cspHeader && !input.cspHeader.includes('unsafe-inline') ? 2 : input.cspHeader ? 1 : 0;
  secCalcScore += input.headers['x-frame-options'] ? 1 : 0;
  secCalcScore += input.headers['x-content-type-options'] ? 1 : 0;
  secCalcScore += input.headers['referrer-policy'] ? 1 : 0;
  secCalcScore += input.mixedContentCount === 0 ? 1 : 0;
  secCalcScore += input.noSriCount === 0 ? 0.5 : 0;
  secCalcScore += (!input.setCookieHeader || (input.setCookieHeader.toLowerCase().includes('httponly') && input.setCookieHeader.toLowerCase().includes('secure'))) ? 0.5 : 0;

  // Content Quality: 10pt
  let contentScore = 0;
  contentScore += input.wordCount >= 300 ? 4 : input.wordCount >= 100 ? 2 : 0;
  contentScore += input.readScore >= 60 ? 3 : input.readScore >= 40 ? 1 : 0;
  contentScore += input.kwInTitle ? 1.5 : 0;
  contentScore += input.kwInH1 ? 1.5 : 0;

  // Social & Schema: 10pt
  let socialScore = 0;
  socialScore += input.ogCount >= 4 ? 4 : input.ogCount >= 2 ? 2 : 0;
  socialScore += input.schemas.length > 0 && input.schemas.some((s: any) => s.valid) ? 4 : input.schemas.length > 0 ? 2 : 0;
  socialScore += input.twCard ? 2 : 0;

  // Accessibility: 5pt
  let a11yCalcScore = 0;
  a11yCalcScore += input.noLabel === 0 ? 2 : 0;
  a11yCalcScore += input.altRatio >= 0.9 ? 2 : input.altRatio >= 0.5 ? 1 : 0;
  a11yCalcScore += input.skippedH === 0 ? 1 : 0;

  // Penalties
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

  const rawScore = metaScore + techScore + perfScore + secCalcScore + contentScore + socialScore + a11yCalcScore - penalty;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  const categoryScores = {
    meta: Math.round((metaScore / 25) * 100),
    technical: Math.round((techScore / 20) * 100),
    performance: Math.round((perfScore / 15) * 100),
    security: Math.round((secCalcScore / 15) * 100),
    content: Math.round((contentScore / 10) * 100),
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
  };
  issues.forEach(issue => {
    const key = Object.keys(impactMap).find(k => issue.problem.toLowerCase().includes(k));
    issue.impact = key ? impactMap[key] : (issue.severity === 'critical' ? 8 : 3);
  });

  // Category auto-assign
  const categoryMap: Record<string, string> = {
    'title': 'Meta', 'description': 'Meta', 'canonical': 'Meta', 'lang': 'Meta', 'viewport': 'Meta',
    'H1': 'Content', 'heading': 'Content', 'alt': 'Content', 'image': 'Content', 'word': 'Content',
    'OG': 'Social', 'og:': 'Social', 'structured': 'Social', 'JSON-LD': 'Social',
    'HSTS': 'Security', 'CSP': 'Security', 'X-Frame': 'Security', 'nosniff': 'Security',
    'script': 'Performance', 'render-blocking': 'Performance', 'lazy': 'Performance',
    'mobile': 'Mobile', 'zoom': 'Mobile', 'scalable': 'Mobile',
    'robots': 'Technical', 'sitemap': 'Technical', 'redirect': 'Technical', 'noindex': 'Technical',
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
