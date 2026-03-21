import { fetchPage } from './analyzer/fetch';
import { runChecks } from './analyzer/checks';
import { runSecurityChecks, checkBrokenLinks, checkOgImage } from './analyzer/security';
import { calculateScore } from './analyzer/scoring';
import { detectTechStack } from './analyzer/tech-stack';
import { getCrUXData } from './pagespeed';
import { logger } from './logger';
import type { Issue } from './analyzer/types';

// Re-export types
export type { SEOResult } from './analyzer/types';

export async function analyzeURL(targetUrl: string) {
  const issues: Issue[] = [];

  // 1. Fetch page + parallel resources (robots, sitemap, pagespeed)
  const fetchResult = await fetchPage(targetUrl);
  issues.push(...fetchResult.issues);

  // 2. Run all HTML-based checks
  const checkResult = runChecks(fetchResult.html, fetchResult.$, fetchResult.response, targetUrl, issues);

  // 3. Run security checks
  const secResult = runSecurityChecks(fetchResult.$, fetchResult.html, fetchResult.response, checkResult.isHttps, issues);

  // 4. Broken links + OG image + CrUX (parallel)
  const [brokenLinks, , cruxData] = await Promise.all([
    checkBrokenLinks(checkResult.linkUrls, issues),
    checkOgImage(checkResult.og.image, issues),
    getCrUXData(targetUrl),
  ]);

  // 5. Tech stack detection
  const techStack = detectTechStack(fetchResult.html, fetchResult.$, checkResult.schemas, issues);

  // 6. Robots/sitemap issues
  if (!fetchResult.robots.exists) issues.push({ severity: 'warning', problem: 'No robots.txt found', fix: 'Create /robots.txt with crawl directives.' });
  if (!fetchResult.sitemap.exists) issues.push({ severity: 'warning', problem: 'No sitemap.xml found', fix: 'Create /sitemap.xml listing all important pages.' });
  const urlBlockedByRobots = fetchResult.robots.exists && fetchResult.robots.disallowCount > 5;
  if (urlBlockedByRobots) issues.push({ severity: 'warning', problem: `robots.txt has ${fetchResult.robots.disallowCount} disallow rules`, fix: 'Verify important pages are not blocked.' });

  // 7. Calculate score
  const altRatio = checkResult.images.total > 0 ? (checkResult.images.total - checkResult.missingAlt) / checkResult.images.total : 1;
  const scoring = calculateScore({
    titleLen: checkResult.titleLen, descLen: checkResult.descLen,
    h1Count: checkResult.headings.h1.count, canonical: checkResult.meta.canonical,
    lang: checkResult.meta.lang, isHttps: checkResult.isHttps,
    viewportMeta: checkResult.meta.viewport, robotsExists: fetchResult.robots.exists,
    sitemapExists: fetchResult.sitemap.exists, redirectChainLen: fetchResult.redirectChain.length,
    hasDoctype: checkResult.meta.hasDoctype, fetchTime: fetchResult.fetchTime,
    renderBlocking: checkResult.performance.renderBlocking, notLazy: checkResult.images.notLazy,
    inlineScriptKB: checkResult.inlineScriptKB, hstsHeader: secResult.hstsHeader,
    cspHeader: secResult.cspHeader || '', headers: secResult.security.headers,
    mixedContentCount: secResult.mixedContentCount, noSriCount: secResult.noSriCount,
    setCookieHeader: secResult.setCookieHeader, wordCount: checkResult.wordCount,
    readScore: checkResult.readScore, kwInTitle: checkResult.kwInTitle, kwInH1: checkResult.kwInH1,
    ogCount: Object.values(checkResult.og).filter(Boolean).length,
    schemas: checkResult.schemas, twCard: checkResult.twitter.card,
    noLabel: checkResult.noLabel, altRatio, skippedH: checkResult.skippedH,
    isNoindex: checkResult.meta.isNoindex, brokenLinksCount: brokenLinks.length,
    badFontDisplay: checkResult.badFontDisplay, urlPath: checkResult.urlPath,
    textToHtmlRatio: checkResult.textToHtmlRatio, titlePixelWidth: checkResult.titlePixelWidth,
    titleTags: checkResult.titleTags, descTags: checkResult.descTags,
    hasCompression: !!(secResult.encoding), hasCacheControl: !!(secResult.cacheControl),
    noopenerMissing: 0,
  }, issues);

  logger.debug('analysis.complete', { url: targetUrl, score: scoring.score, issues: issues.length });

  return {
    url: targetUrl,
    score: scoring.score,
    potentialScore: scoring.potentialScore,
    categoryScores: scoring.categoryScores,
    fetchTime: fetchResult.fetchTime,
    statusCode: fetchResult.response.status,
    redirectChain: fetchResult.redirectChain,
    meta: checkResult.meta,
    headings: checkResult.headings,
    images: checkResult.images,
    links: { ...checkResult.links, brokenLinks },
    wordCount: checkResult.wordCount,
    topKeywords: checkResult.topKeywords,
    og: checkResult.og,
    twitter: checkResult.twitter,
    schemas: checkResult.schemas,
    hreflang: checkResult.hreflang,
    techStack,
    security: secResult.security,
    performance: { ...checkResult.performance, responseTime: fetchResult.fetchTime },
    mobile: checkResult.mobile,
    accessibility: checkResult.accessibility,
    contentQuality: checkResult.contentQuality,
    robots: { ...fetchResult.robots, urlBlocked: urlBlockedByRobots },
    sitemap: fetchResult.sitemap,
    pageSpeed: fetchResult.pageSpeed,
    crux: cruxData,
    issues,
  };
}
