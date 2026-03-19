import * as cheerio from 'cheerio';
import { getPageSpeedData, PageSpeedResult } from './pagespeed';
import { logger } from './logger';

export interface SEOResult {
  url: string;
  score: number;
  potentialScore: number;
  categoryScores: { meta: number; technical: number; performance: number; security: number; content: number; social: number; accessibility: number };
  fetchTime: number;
  statusCode: number;
  redirectChain: { url: string; status: number }[];
  meta: { title: any; description: any; titlePixelWidth: number; descPixelWidth: number; canonical: string; canonicalAnalysis: { selfReferencing: boolean; httpsMismatch: boolean; ogUrlMismatch: boolean }; robots: string; lang: string; charset: string; viewport: string; isNoindex: boolean; hasFavicon: boolean; hasDoctype: boolean; textToHtmlRatio: number; };
  headings: Record<string, { count: number; texts: string[] }>;
  images: { total: number; missingAlt: number; withoutDimensions: number; largeCount: number; notLazy: number; noWebP: number; };
  links: { total: number; internal: number; external: number; nofollow: number; broken: string[]; uniqueInternal: number; uniqueExternal: number; emptyAnchor: number; genericAnchor: number; brokenLinks: string[]; };
  wordCount: number;
  topKeywords: { word: string; count: number; density: string }[];
  og: Record<string, string>;
  twitter: Record<string, string>;
  schemas: { type: string; valid: boolean; issues: string[] }[];
  hreflang: { tags: { lang: string; url: string }[]; hasXDefault: boolean; issues: string[] };
  techStack: { name: string; confidence: string; icon: string }[];
  security: { https: boolean; headers: Record<string, string | null>; mixedContent: number; score: number; grade: string; issues: string[]; };
  performance: { responseTime: number; htmlSize: number; totalScripts: number; totalStylesheets: number; deferScripts: number; asyncScripts: number; inlineScripts: number; inlineScriptSize: number; renderBlocking: number; renderBlockingList: string[]; };
  mobile: { viewport: boolean; scalable: boolean; score: number; issues: string[]; };
  accessibility: { score: number; issues: string[]; };
  contentQuality: { readabilityScore: number; readabilityGrade: string; avgSentenceLength: number; totalSentences: number; longSentences: number; };
  robots: { exists: boolean; disallowCount: number; hasSitemapRef: boolean; userAgents: string[]; urlBlocked: boolean; };
  sitemap: { exists: boolean; urls: string[]; };
  pageSpeed: PageSpeedResult;
  issues: { severity: string; problem: string; fix: string; category?: string }[];
}

const GENERIC_ANCHORS = new Set(['click here','read more','learn more','here','link','more','details','see more','view more','continue','go']);
const STOP_WORDS = new Set(['the','be','to','of','and','a','in','that','have','i','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us']);

// Average character widths in Arial (Google SERP font) at 20px
const CHAR_WIDTHS: Record<string, number> = {
  'W':14,'M':13,'m':12,'w':10,'G':11,'O':11,'Q':11,'D':11,'H':11,'N':11,'U':11,
  'A':9,'B':9,'C':9,'K':9,'P':9,'R':9,'V':9,'X':9,'Y':9,'S':9,'T':9,'Z':9,
  'E':8,'F':8,'J':7,'L':7,'a':8,'b':8,'d':8,'e':8,'g':8,'h':8,'k':8,'n':8,
  'o':8,'p':8,'q':8,'u':8,'v':8,'x':8,'y':8,'c':7,'s':7,'z':7,'f':5,'r':5,
  't':5,'j':4,'l':4,'i':4,'I':4,'1':7,' ':4,'.':4,',':4,'-':5,'|':4,
};
function estimatePixelWidth(text: string): number {
  let w = 0;
  for (const ch of text) w += CHAR_WIDTHS[ch] || 8;
  return w;
}

export async function analyzeURL(targetUrl: string): Promise<SEOResult> {
  const startTime = Date.now();
  const issues: { severity: string; problem: string; fix: string; category?: string }[] = [];

  // ===== REDIRECT CHAIN DETECTION =====
  const redirectChain: { url: string; status: number }[] = [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let response: Response = null as any;
  let currentUrl = targetUrl;
  try {
    // Follow redirects manually to track the chain
    for (let i = 0; i < 10; i++) {
      const res = await fetch(currentUrl, {
        headers: { 'User-Agent': 'SEOSnapshotBot/1.0 (+https://seosnapshot.dev)' },
        signal: controller.signal,
        redirect: 'manual',
      });
      redirectChain.push({ url: currentUrl, status: res.status });
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get('location');
        if (!location) break;
        currentUrl = new URL(location, currentUrl).toString();
      } else {
        response = res;
        break;
      }
    }
    // If we never got a final response (too many redirects)
    if (!response) {
      response = await fetch(currentUrl, {
        headers: { 'User-Agent': 'SEOSnapshotBot/1.0 (+https://seosnapshot.dev)' },
        signal: controller.signal,
        redirect: 'follow',
      });
    }
  } finally { clearTimeout(timeout); }

  if (redirectChain.length > 2) {
    issues.push({ severity: 'warning', problem: `Redirect chain: ${redirectChain.length} hops`, fix: `Reduce redirect chain from ${redirectChain.map(r => r.status).join('→')}. Point directly to final URL to save crawl budget.`, category: 'Technical' });
  }
  const has302 = redirectChain.some(r => r.status === 302);
  if (has302) {
    issues.push({ severity: 'warning', problem: 'Temporary redirect (302) detected', fix: 'Use 301 (permanent) redirect instead of 302 if this is a permanent URL change. 302s don\'t pass full link equity.', category: 'Technical' });
  }

  const fetchTime = Date.now() - startTime;
  const html = await response.text();

  // Early return for excessively large HTML (>5MB)
  if (html.length > 5 * 1024 * 1024) {
    logger.warn('analysis.large_html', { url: targetUrl, size: html.length });
  }

  const $ = cheerio.load(html);
  const parsedUrl = new URL(targetUrl);

  // ===== PARALLEL: Fetch robots.txt, sitemap.xml, and PageSpeed concurrently =====
  const [robotsResult, sitemapResult, pageSpeedResult] = await Promise.all([
    fetchRobots(parsedUrl.origin),
    fetchSitemap(parsedUrl.origin),
    getPageSpeedData(targetUrl),
  ]);

  // ===== META =====
  const title = $('title').first().text().trim();
  const titleLen = title.length;
  const descEl = $('meta[name="description"]').attr('content') || $('meta[property="description"]').attr('content') || '';
  const descLen = descEl.length;
  const canonical = $('link[rel="canonical"]').attr('href') || '';
  const robotsMeta = $('meta[name="robots"]').attr('content') || '';
  const lang = $('html').attr('lang') || '';
  const charsetMeta = $('meta[charset]').attr('charset') || '';
  const viewportMeta = $('meta[name="viewport"]').attr('content') || '';

  // Title issues
  if (titleLen === 0) issues.push({ severity: 'critical', problem: 'Title tag is missing', fix: 'Add a <title> tag with your primary keyword, 50-60 characters.', category: 'Meta' });
  else if (titleLen < 30) issues.push({ severity: 'warning', problem: `Title too short (${titleLen} chars)`, fix: `Your title "${title}" needs more detail. Add keywords to reach 50-60 chars. Try: "${title} — [Primary Keyword] | [Brand]"` });
  else if (titleLen > 60) issues.push({ severity: 'warning', problem: `Title may truncate in SERP (${titleLen} chars)`, fix: `Google shows ~60 chars. Your title will cut at: "${title.substring(0, 57)}...". Move important keywords to the front.` });

  // Description issues
  if (descLen === 0) issues.push({ severity: 'critical', problem: 'Meta description is missing', fix: 'Add <meta name="description" content="...">. Write a compelling 150-160 char summary with target keyword. This is your ad copy in search results.' });
  else if (descLen < 120) issues.push({ severity: 'warning', problem: `Meta description short (${descLen} chars)`, fix: `You have ${160 - descLen} chars of unused space. Add a call-to-action and more keywords. Aim for 150-160 chars.` });
  else if (descLen > 160) issues.push({ severity: 'warning', problem: `Meta description may truncate (${descLen} chars)`, fix: `Google cuts at ~160 chars. Trim to 160 and put key info first.` });

  // ===== HEADINGS =====
  const headings: Record<string, { count: number; texts: string[] }> = {};
  for (let i = 1; i <= 6; i++) {
    const els = $(`h${i}`);
    headings[`h${i}`] = { count: els.length, texts: els.slice(0, 5).map((_, el) => $(el).text().trim().substring(0, 100)).get() };
  }
  if (headings.h1.count === 0) issues.push({ severity: 'critical', problem: 'No H1 tag found', fix: 'Add exactly one <h1> tag describing the page topic with your primary keyword.' });
  else if (headings.h1.count > 1) issues.push({ severity: 'warning', problem: `Multiple H1 tags (${headings.h1.count})`, fix: `Keep only one H1: "${headings.h1.texts[0]}". Change others to <h2>.` });

  // ===== IMAGES =====
  const imgs = $('img');
  const missingAlt = imgs.filter((_, el) => { const a = $(el).attr('alt'); return a === undefined || a.trim() === ''; }).length;
  const withoutDims = imgs.filter((_, el) => !$(el).attr('width') && !$(el).attr('height')).length;
  if (missingAlt > 0) issues.push({ severity: 'warning', problem: `${missingAlt}/${imgs.length} images missing alt text`, fix: 'Add descriptive alt attributes. Use keywords naturally. Decorative images use alt="" (empty not missing).' });

  // ===== LINKS =====
  const allLinks = $('a[href]');
  let internal = 0, external = 0, nofollow = 0, emptyAnchor = 0, genericAnchor = 0;
  const uniqueInt = new Set<string>();
  const uniqueExt = new Set<string>();

  allLinks.each((_, el) => {
    const href = $(el).attr('href') || '';
    try {
      const u = new URL(href, targetUrl);
      if (u.hostname === parsedUrl.hostname) { internal++; uniqueInt.add(u.pathname); }
      else if (u.protocol.startsWith('http')) { external++; uniqueExt.add(u.hostname); }
    } catch {}
    if ($(el).attr('rel')?.includes('nofollow')) nofollow++;
    const text = $(el).text().trim().toLowerCase();
    if (!text && !$(el).find('img').length) emptyAnchor++;
    else if (GENERIC_ANCHORS.has(text)) genericAnchor++;
  });

  // ===== WORD COUNT & KEYWORDS (main content extraction) =====
  // Prefer <main> or <article>, fallback to <body> minus nav/header/footer
  let contentEl = $('main').length > 0 ? $('main') : $('article').length > 0 ? $('article') : null;
  if (!contentEl) {
    // Clone body, remove non-content elements
    const bodyClone = $('body').clone();
    bodyClone.find('nav, header, footer, aside, script, style, noscript, .sidebar, .menu, .navigation').remove();
    contentEl = bodyClone;
  }
  const bodyText = contentEl.text().replace(/\s+/g, ' ').trim();
  const words = bodyText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Uni-gram frequency
  const wordFreq: Record<string, number> = {};
  words.forEach(w => {
    const lower = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (lower.length > 2 && !STOP_WORDS.has(lower)) wordFreq[lower] = (wordFreq[lower] || 0) + 1;
  });

  // Bi-gram frequency
  const bigramFreq: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i].toLowerCase().replace(/[^a-z0-9]/g, '');
    const b = words[i + 1].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (a.length > 2 && b.length > 2 && !STOP_WORDS.has(a) && !STOP_WORDS.has(b)) {
      const bigram = `${a} ${b}`;
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    }
  }

  // Merge top uni-grams and bi-grams
  const topUnigrams = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([word, count]) => ({ word, count, density: ((count / wordCount) * 100).toFixed(2) }));
  const topBigrams = Object.entries(bigramFreq).sort((a, b) => b[1] - a[1]).slice(0, 5)
    .filter(([_, count]) => count >= 2) // only bi-grams appearing 2+ times
    .map(([word, count]) => ({ word, count, density: ((count / wordCount) * 100).toFixed(2) }));
  const topKeywords = [...topUnigrams, ...topBigrams].sort((a, b) => b.count - a.count).slice(0, 15);

  if (wordCount < 300) issues.push({ severity: 'warning', problem: `Thin content: only ${wordCount} words`, fix: `Pages under 300 words struggle to rank. Expand with FAQs, examples, details. Need ${300 - wordCount}+ more words.` });

  // ===== OPEN GRAPH =====
  const og: Record<string, string> = {};
  ['title', 'description', 'image', 'url', 'type', 'site_name'].forEach(key => {
    og[key] = $(`meta[property="og:${key}"]`).attr('content') || '';
  });
  const missingOG = Object.entries(og).filter(([k, v]) => !v && ['title', 'description', 'image', 'url'].includes(k)).map(([k]) => `og:${k}`);
  if (missingOG.length > 0) issues.push({ severity: 'warning', problem: `Missing OG tags: ${missingOG.join(', ')}`, fix: `Add ${missingOG.map(t => `<meta property="${t}" content="...">`).join(', ')}. Good og:image (1200x630px) boosts click-through on social.` });

  // ===== TWITTER =====
  const tw: Record<string, string> = {};
  ['card', 'title', 'description', 'image', 'site'].forEach(key => {
    tw[key] = $(`meta[name="twitter:${key}"]`).attr('content') || '';
  });

  // ===== SCHEMAS =====
  const schemaResults: { type: string; valid: boolean; issues: string[] }[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '');
      const type = data['@type'] || (Array.isArray(data['@graph']) ? 'Graph' : 'Unknown');
      const si: string[] = [];
      if (!data['@context']) si.push('Missing @context');
      if (type === 'Article' && !data.headline) si.push('Missing headline');
      if (type === 'Article' && !data.datePublished) si.push('Missing datePublished');
      if (type === 'Product' && !data.offers) si.push('Missing offers');
      schemaResults.push({ type, valid: si.length === 0, issues: si });
    } catch { schemaResults.push({ type: 'Invalid', valid: false, issues: ['Invalid JSON syntax'] }); }
  });
  if (schemaResults.length === 0) issues.push({ severity: 'warning', problem: 'No structured data (JSON-LD)', fix: 'Add JSON-LD for Organization, WebSite, or Article schema. This qualifies you for rich snippets. Validate with Google Rich Results Test.' });

  // ===== SECURITY =====
  const headers: Record<string, string | null> = {
    'content-security-policy': response.headers.get('content-security-policy'),
    'strict-transport-security': response.headers.get('strict-transport-security'),
    'x-frame-options': response.headers.get('x-frame-options'),
    'x-content-type-options': response.headers.get('x-content-type-options'),
    'referrer-policy': response.headers.get('referrer-policy'),
    'permissions-policy': response.headers.get('permissions-policy'),
    'x-xss-protection': response.headers.get('x-xss-protection'),
  };
  const secIssues: string[] = [];
  const isHttps = parsedUrl.protocol === 'https:';
  if (!isHttps) secIssues.push('Not served over HTTPS');
  if (!headers['strict-transport-security']) secIssues.push('Missing HSTS header');
  if (!headers['content-security-policy']) secIssues.push('Missing Content-Security-Policy');
  if (!headers['x-frame-options']) secIssues.push('Missing X-Frame-Options');
  if (!headers['x-content-type-options']) secIssues.push('Missing X-Content-Type-Options (nosniff)');
  if (!headers['referrer-policy']) secIssues.push('Missing Referrer-Policy');
  let secScore = 100;
  if (!isHttps) secScore -= 30;
  secIssues.forEach(() => secScore -= 10);
  secScore = Math.max(0, secScore);
  secIssues.forEach(issue => {
    const headerName = issue.replace('Missing ', '');
    issues.push({ severity: isHttps ? 'warning' : 'critical', problem: issue, fix: headerName === 'HSTS header' ? 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains to force HTTPS.' : `Configure ${headerName} header in your server/CDN settings for better security.` });
  });

  // ===== PERFORMANCE =====
  const scripts = $('script[src]');
  const deferScripts = $('script[defer]').length;
  const asyncScripts = $('script[async]').length;
  const inlineScripts = $('script:not([src])').length;
  const stylesheets = $('link[rel="stylesheet"]').length;
  const renderBlocking = scripts.filter((_, el) => !$(el).attr('async') && !$(el).attr('defer')).length;
  if (renderBlocking > 3) issues.push({ severity: 'warning', problem: `${renderBlocking} render-blocking scripts`, fix: 'Add async or defer to non-critical scripts. Move scripts to bottom of <body> or use type="module".' });

  // ===== MOBILE =====
  const mobIssues: string[] = [];
  if (!viewportMeta) mobIssues.push('Missing viewport meta tag');
  const vpLower = viewportMeta.toLowerCase();
  const scalable = !vpLower.includes('user-scalable=no') && !vpLower.includes('maximum-scale=1');
  if (!scalable) mobIssues.push('Pinch-to-zoom disabled');
  let mobScore = 100;
  if (!viewportMeta) mobScore -= 30;
  if (!scalable) mobScore -= 15;
  mobIssues.forEach(i => issues.push({ severity: 'warning', problem: i, fix: i.includes('viewport') ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' : 'Remove user-scalable=no to allow zoom for accessibility.' }));

  // ===== ACCESSIBILITY =====
  const a11yIssues: string[] = [];
  const inputs = $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
  let noLabel = 0;
  inputs.each((_, el) => {
    const id = $(el).attr('id');
    if (!id || !$(`label[for="${id}"]`).length) {
      if (!$(el).attr('aria-label') && !$(el).closest('label').length) noLabel++;
    }
  });
  if (noLabel > 0) a11yIssues.push(`${noLabel} form inputs without labels`);
  if (missingAlt > 0) a11yIssues.push(`${missingAlt} images without alt text`);
  if (!lang) a11yIssues.push('Missing lang attribute on <html>');
  let headingOrder: number[] = [];
  $('h1,h2,h3,h4,h5,h6').each((_, el) => { headingOrder.push(parseInt(el.tagName[1])); });
  let skippedH = 0;
  for (let i = 1; i < headingOrder.length; i++) { if (headingOrder[i] - headingOrder[i - 1] > 1) skippedH++; }
  if (skippedH > 0) a11yIssues.push(`${skippedH} skipped heading levels`);
  let a11yScore = 100 - (noLabel * 5) - (missingAlt * 2) - (skippedH * 5) - (lang ? 0 : 10);
  a11yScore = Math.max(0, a11yScore);

  // ===== CONTENT QUALITY =====
  const paragraphs = $('p').map((_, el) => $(el).text().trim()).get().filter(t => t.length > 20);
  const allSentences: string[] = [];
  paragraphs.forEach(text => { text.split(/[.!?]+/).filter(s => s.trim().length > 5).forEach(s => allSentences.push(s.trim())); });
  let avgSentLen = 0, longSent = 0, readScore = 0, readGrade = 'N/A';
  const isEnglish = !lang || lang.toLowerCase().startsWith('en');
  if (allSentences.length > 0 && isEnglish) {
    const sentLens = allSentences.map(s => s.split(/\s+/).length);
    avgSentLen = Math.round(sentLens.reduce((a, b) => a + b, 0) / sentLens.length);
    longSent = sentLens.filter(l => l > 25).length;
    const totalW = allSentences.join(' ').split(/\s+/).filter(w => w.length > 0);
    const syllCount = totalW.reduce((c, word) => {
      let s = word.toLowerCase().replace(/[^a-z]/g, '');
      if (s.length <= 3) return c + 1;
      s = s.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
      const m = s.match(/[aeiouy]{1,2}/g);
      return c + (m ? m.length : 1);
    }, 0);
    const flesch = 206.835 - (1.015 * (totalW.length / allSentences.length)) - (84.6 * (syllCount / totalW.length));
    readScore = Math.max(0, Math.min(100, Math.round(flesch)));
    readGrade = flesch >= 80 ? 'Very easy' : flesch >= 60 ? 'Standard' : flesch >= 40 ? 'Difficult' : 'Very difficult';
  } else if (!isEnglish && allSentences.length > 0) {
    // Basic stats without Flesch for non-English
    const sentLens = allSentences.map(s => s.split(/\s+/).length);
    avgSentLen = Math.round(sentLens.reduce((a, b) => a + b, 0) / sentLens.length);
    longSent = sentLens.filter(l => l > 25).length;
    readGrade = 'N/A (non-English)';
  }

  // ===== TITLE/DESC PIXEL WIDTH =====
  const titlePixelWidth = estimatePixelWidth(title);
  const descPixelWidth = estimatePixelWidth(descEl);
  if (titlePixelWidth > 580) issues.push({ severity: 'warning', problem: `Title too wide for SERP (${titlePixelWidth}px, max ~580px)`, fix: `Google truncates at ~580px. Your title will be cut. Shorten or move keywords to the front.`, category: 'Meta' });
  if (descPixelWidth > 920) issues.push({ severity: 'warning', problem: `Description too wide for SERP (${descPixelWidth}px)`, fix: `Mobile SERP description limit is ~920px. Put important info first.`, category: 'Meta' });

  // ===== KEYWORD IN CONTEXT =====
  const topKw = topKeywords[0]?.word || '';
  const kwInTitle = topKw ? title.toLowerCase().includes(topKw) : true;
  const kwInDesc = topKw ? descEl.toLowerCase().includes(topKw) : true;
  const kwInH1 = topKw ? (headings.h1.texts[0] || '').toLowerCase().includes(topKw) : true;
  const kwInUrl = topKw ? targetUrl.toLowerCase().includes(topKw) : true;
  if (topKw && !kwInTitle) issues.push({ severity: 'warning', problem: `Top keyword "${topKw}" not found in title`, fix: `Include your primary keyword "${topKw}" in the title tag for better rankings.`, category: 'Content' });
  if (topKw && !kwInH1 && headings.h1.count > 0) issues.push({ severity: 'warning', problem: `Top keyword "${topKw}" not found in H1`, fix: `Include "${topKw}" in your H1 heading to reinforce topic relevance.`, category: 'Content' });

  // ===== FAVICON =====
  const hasFavicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;
  if (!hasFavicon) issues.push({ severity: 'warning', problem: 'No favicon found', fix: 'Add <link rel="icon" href="/favicon.ico"> in <head>. Favicons appear in browser tabs, bookmarks, and Google search results.', category: 'Meta' });

  // ===== DOCTYPE =====
  const hasDoctype = html.trimStart().toLowerCase().startsWith('<!doctype');
  if (!hasDoctype) issues.push({ severity: 'warning', problem: 'Missing DOCTYPE declaration', fix: 'Add <!DOCTYPE html> at the very start of your HTML. Without it, browsers use quirks mode.', category: 'Technical' });

  // ===== URL STRUCTURE =====
  const urlPath = parsedUrl.pathname;
  if (urlPath.length > 115) issues.push({ severity: 'warning', problem: `URL path is very long (${urlPath.length} chars)`, fix: 'Keep URL paths under 100 characters. Shorter URLs are easier to share and may perform better.', category: 'Technical' });
  if (/[A-Z]/.test(urlPath)) issues.push({ severity: 'warning', problem: 'URL contains uppercase letters', fix: 'Use lowercase URLs. Mixed case can cause duplicate content issues (site.com/Page vs site.com/page).', category: 'Technical' });
  if (/[_]/.test(urlPath) && urlPath !== '/') issues.push({ severity: 'warning', problem: 'URL uses underscores instead of hyphens', fix: 'Google treats hyphens as word separators but not underscores. Use /my-page instead of /my_page.', category: 'Technical' });

  // ===== TEXT TO HTML RATIO =====
  const textLen = bodyText.length;
  const textToHtmlRatio = html.length > 0 ? Math.round((textLen / html.length) * 100) : 0;
  if (textToHtmlRatio < 10) issues.push({ severity: 'warning', problem: `Low text-to-HTML ratio (${textToHtmlRatio}%)`, fix: 'Your page has more code than content. Aim for 25-70% ratio. Remove unused CSS/JS, reduce inline styles.', category: 'Content' });

  // ===== FONT DISPLAY =====
  let badFontDisplay = 0;
  $('link[rel="stylesheet"][href*="font"], style').each((_, el) => {
    const content = $(el).html() || $(el).attr('href') || '';
    if (content.includes('font') && !content.includes('font-display')) badFontDisplay++;
  });
  // Check inline @font-face without font-display
  const fontFaceMatches = html.match(/@font-face\s*\{[^}]*\}/gi) || [];
  fontFaceMatches.forEach(ff => { if (!ff.includes('font-display')) badFontDisplay++; });
  if (badFontDisplay > 0) issues.push({ severity: 'warning', problem: `${badFontDisplay} @font-face without font-display`, fix: 'Add font-display: swap to @font-face rules. This prevents invisible text during font loading (FOIT).', category: 'Performance' });

  // ===== HSTS MAX-AGE VALIDATION =====
  const hstsHeader = response.headers.get('strict-transport-security');
  if (hstsHeader) {
    const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
    const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : 0;
    if (maxAge < 31536000) issues.push({ severity: 'warning', problem: `HSTS max-age too low (${maxAge}s, recommended: 31536000)`, fix: 'Set Strict-Transport-Security: max-age=31536000; includeSubDomains for 1 year HSTS protection.', category: 'Security' });
  }

  // ===== CSP UNSAFE CHECK =====
  const cspHeader = response.headers.get('content-security-policy') || '';
  if (cspHeader.includes('unsafe-inline')) issues.push({ severity: 'warning', problem: 'CSP allows unsafe-inline scripts', fix: 'Remove unsafe-inline from Content-Security-Policy. Use nonces or hashes instead for better XSS protection.', category: 'Security' });
  if (cspHeader.includes('unsafe-eval')) issues.push({ severity: 'warning', problem: 'CSP allows unsafe-eval', fix: 'Remove unsafe-eval from Content-Security-Policy. This allows eval() which is a common XSS attack vector.', category: 'Security' });

  // ===== REDIRECT LOOP DETECTION =====
  const visitedUrls = redirectChain.map(r => r.url);
  const hasLoop = visitedUrls.length !== new Set(visitedUrls).size;
  if (hasLoop) issues.push({ severity: 'critical', problem: 'Redirect loop detected', fix: 'Your URL creates a redirect loop (A→B→A). This prevents Google from crawling and users from accessing the page. Fix server configuration.', category: 'Technical' });

  // ===== BROKEN LINK DETECTION (sample up to 10 links) =====
  const brokenLinks: string[] = [];
  const linkUrls: string[] = [];
  allLinks.each((_, el) => {
    const href = $(el).attr('href') || '';
    try {
      const u = new URL(href, targetUrl);
      if (u.protocol.startsWith('http') && linkUrls.length < 5) linkUrls.push(u.toString());
    } catch {}
  });
  const brokenChecks = await Promise.allSettled(
    linkUrls.map(async (u) => {
      try {
        let r = await fetch(u, { method: 'HEAD', signal: AbortSignal.timeout(2000), redirect: 'follow' });
        // HEAD→GET fallback for servers that don't support HEAD
        if (r.status === 405 || r.status === 403) {
          r = await fetch(u, { method: 'GET', signal: AbortSignal.timeout(2000), redirect: 'follow' });
        }
        // Only report genuine 4xx/5xx, filter false positives from bot detection
        if (r.status >= 400 && r.status !== 403 && r.status !== 429) {
          brokenLinks.push(`${r.status}: ${u.length > 60 ? u.slice(0, 57) + '...' : u}`);
        }
      } catch {}
    })
  );
  if (brokenLinks.length > 0) {
    issues.push({ severity: 'critical', problem: `${brokenLinks.length} broken link(s) found`, fix: `Fix or remove broken links: ${brokenLinks.slice(0, 3).join(', ')}${brokenLinks.length > 3 ? ` and ${brokenLinks.length - 3} more` : ''}`, category: 'Content' });
  }

  // ===== DUPLICATE TITLE / DESCRIPTION =====
  const titleTags = $('title');
  if (titleTags.length > 1) issues.push({ severity: 'warning', problem: `Multiple <title> tags found (${titleTags.length})`, fix: 'Keep only one <title> tag in <head>. Multiple titles confuse search engines.', category: 'Meta' });
  const descTags = $('meta[name="description"]');
  if (descTags.length > 1) issues.push({ severity: 'warning', problem: `Multiple meta descriptions found (${descTags.length})`, fix: 'Keep only one <meta name="description">. Multiple descriptions cause Google to pick randomly.', category: 'Meta' });

  // ===== OG IMAGE VALIDATION =====
  if (og.image) {
    try {
      const ogImgRes = await fetch(og.image, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
      if (!ogImgRes.ok) issues.push({ severity: 'warning', problem: `og:image URL returns ${ogImgRes.status}`, fix: `Your og:image "${og.image}" is broken (${ogImgRes.status}). Fix the URL so social previews display correctly.`, category: 'Social' });
    } catch {
      issues.push({ severity: 'warning', problem: 'og:image URL is unreachable', fix: 'Verify og:image URL is accessible. Broken og:image means no preview on Facebook/Twitter/LinkedIn.', category: 'Social' });
    }
  }

  // ===== COOKIE SECURITY FLAGS =====
  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    const cookieLower = setCookieHeader.toLowerCase();
    if (!cookieLower.includes('httponly')) issues.push({ severity: 'warning', problem: 'Cookie missing HttpOnly flag', fix: 'Add HttpOnly flag to cookies to prevent JavaScript access (XSS protection).', category: 'Security' });
    if (isHttps && !cookieLower.includes('secure')) issues.push({ severity: 'warning', problem: 'Cookie missing Secure flag on HTTPS site', fix: 'Add Secure flag to cookies so they are only sent over HTTPS.', category: 'Security' });
    if (!cookieLower.includes('samesite')) issues.push({ severity: 'warning', problem: 'Cookie missing SameSite attribute', fix: 'Add SameSite=Lax or SameSite=Strict to cookies for CSRF protection.', category: 'Security' });
  }

  // ===== SUBRESOURCE INTEGRITY (SRI) =====
  let noSriCount = 0;
  $('script[src*="cdn"], script[src*="jsdelivr"], script[src*="cloudflare"], script[src*="unpkg"], link[href*="cdn"], link[href*="jsdelivr"]').each((_, el) => {
    if (!$(el).attr('integrity')) noSriCount++;
  });
  if (noSriCount > 0) issues.push({ severity: 'warning', problem: `${noSriCount} CDN resource(s) without Subresource Integrity`, fix: 'Add integrity="sha384-..." attribute to CDN-loaded scripts and stylesheets to prevent supply chain attacks.', category: 'Security' });

  // ===== INLINE SCRIPT SIZE =====
  let inlineScriptSize = 0;
  $('script:not([src])').each((_, el) => { inlineScriptSize += ($(el).html() || '').length; });
  const inlineScriptKB = Math.round(inlineScriptSize / 1024);
  if (inlineScriptKB > 50) issues.push({ severity: 'warning', problem: `${inlineScriptKB} KB of inline JavaScript`, fix: 'Move large inline scripts to external files. This improves caching and reduces HTML size.', category: 'Performance' });

  // ===== SITEMAP URL LISTING =====
  let sitemapUrls: string[] = [];
  if (sitemapResult.exists) {
    try {
      const smRes = await fetch(`${parsedUrl.origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      if (smRes.ok) {
        const smXml = await smRes.text();
        const sm$ = cheerio.load(smXml, { xmlMode: true });
        sm$('url > loc').each((_, el) => { sitemapUrls.push(sm$(el).text().trim()); });
        sitemapUrls = sitemapUrls.slice(0, 50); // cap at 50
      }
    } catch {}
  }

  // ===== CANONICAL & MISC =====
  if (!canonical) issues.push({ severity: 'warning', problem: 'No canonical URL', fix: `Add <link rel="canonical" href="${targetUrl}"> to prevent duplicate content.` });
  if (!lang) issues.push({ severity: 'warning', problem: 'Missing language attribute', fix: 'Add lang="en" (or your language) to <html> tag for SEO and accessibility.' });
  if (!isHttps) issues.push({ severity: 'critical', problem: 'Not using HTTPS', fix: 'Get an SSL certificate (free via Let\'s Encrypt) and redirect HTTP to HTTPS.' });
  if (!viewportMeta) issues.push({ severity: 'critical', problem: 'Missing viewport meta tag', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' });

  // Robots & Sitemap issues
  if (!robotsResult.exists) issues.push({ severity: 'warning', problem: 'No robots.txt found', fix: 'Create /robots.txt with crawl directives and a Sitemap reference.' });
  if (!sitemapResult.exists) issues.push({ severity: 'warning', problem: 'No sitemap.xml found', fix: 'Create /sitemap.xml listing all important pages. Reference it in robots.txt.' });

  // ===== DEEP CANONICAL ANALYSIS =====
  const canonicalSelfRef = canonical ? (new URL(canonical, targetUrl).toString() === targetUrl) : false;
  const canonicalHttpsMismatch = canonical ? (canonical.startsWith('http://') && isHttps) || (canonical.startsWith('https://') && !isHttps) : false;
  const canonicalOgMismatch = canonical && og.url ? (new URL(canonical, targetUrl).toString() !== new URL(og.url, targetUrl).toString()) : false;
  if (canonicalHttpsMismatch) issues.push({ severity: 'critical', problem: 'Canonical URL protocol mismatch (HTTP vs HTTPS)', fix: `Your canonical points to ${canonical} but the page is served over ${isHttps ? 'HTTPS' : 'HTTP'}. Update canonical to match.` });
  if (canonicalOgMismatch) issues.push({ severity: 'warning', problem: 'Canonical and og:url mismatch', fix: `canonical="${canonical}" but og:url="${og.url}". These should point to the same URL.` });

  // ===== NOINDEX / DISALLOW CHECK =====
  const isNoindex = robotsMeta.toLowerCase().includes('noindex') || !!response.headers.get('x-robots-tag')?.toLowerCase().includes('noindex');
  if (isNoindex) issues.push({ severity: 'critical', problem: 'Page is marked as noindex — will NOT appear in Google', fix: 'Remove noindex from <meta name="robots"> or X-Robots-Tag header if you want this page indexed.' });
  // Check if URL is blocked by robots.txt
  const urlBlockedByRobots = robotsResult.exists && robotsResult.disallowCount > 0; // simplified check
  if (urlBlockedByRobots && robotsResult.disallowCount > 5) {
    issues.push({ severity: 'warning', problem: `robots.txt has ${robotsResult.disallowCount} disallow rules — verify this page isn't blocked`, fix: 'Check your robots.txt to ensure important pages are not accidentally disallowed.' });
  }

  // ===== HREFLANG VALIDATION =====
  const hreflangTags: { lang: string; url: string }[] = [];
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    const lang = $(el).attr('hreflang') || '';
    const href = $(el).attr('href') || '';
    if (lang && href) hreflangTags.push({ lang, url: href });
  });
  const hasXDefault = hreflangTags.some(h => h.lang === 'x-default');
  const hreflangIssues: string[] = [];
  if (hreflangTags.length > 0 && !hasXDefault) {
    hreflangIssues.push('Missing x-default hreflang tag');
    issues.push({ severity: 'warning', problem: 'Missing x-default hreflang', fix: 'Add <link rel="alternate" hreflang="x-default" href="..."> as fallback for users whose language doesn\'t match any variant.' });
  }
  // Check self-referencing hreflang
  const hasSelfRef = hreflangTags.some(h => {
    try { return new URL(h.url, targetUrl).toString() === targetUrl; } catch { return false; }
  });
  if (hreflangTags.length > 0 && !hasSelfRef) {
    hreflangIssues.push('Missing self-referencing hreflang tag');
    issues.push({ severity: 'warning', problem: 'Missing self-referencing hreflang tag', fix: 'Each page should include a hreflang tag pointing to itself.' });
  }

  // ===== MIXED CONTENT DETECTION =====
  let mixedContentCount = 0;
  if (isHttps) {
    $('img[src^="http://"], script[src^="http://"], link[href^="http://"], iframe[src^="http://"], video[src^="http://"], audio[src^="http://"]').each(() => { mixedContentCount++; });
    if (mixedContentCount > 0) {
      issues.push({ severity: 'critical', problem: `${mixedContentCount} mixed content resources (HTTP on HTTPS page)`, fix: 'Update all resource URLs from http:// to https:// or use protocol-relative URLs. Mixed content degrades security and may be blocked by browsers.' });
    }
  }

  // ===== IMAGE OPTIMIZATION =====
  let notLazy = 0;
  let noWebP = 0;
  imgs.each((_, el) => {
    const src = $(el).attr('src') || '';
    const loading = $(el).attr('loading');
    if (!loading && src && !src.startsWith('data:')) notLazy++;
    if (src && /\.(jpg|jpeg|png|gif|bmp)(\?|$)/i.test(src)) noWebP++;
  });
  if (notLazy > 3) issues.push({ severity: 'warning', problem: `${notLazy} images without lazy loading`, fix: 'Add loading="lazy" to below-the-fold images. This reduces initial page load and improves LCP.' });
  if (noWebP > 3) issues.push({ severity: 'warning', problem: `${noWebP} images not using modern formats (WebP/AVIF)`, fix: 'Convert images to WebP or AVIF format. Use <picture> element with fallback for older browsers. This can reduce image size by 30-50%.' });

  // ===== RENDER-BLOCKING RESOURCE LIST =====
  const renderBlockingList: string[] = [];
  scripts.each((_, el) => {
    if (!$(el).attr('async') && !$(el).attr('defer')) {
      const src = $(el).attr('src') || '';
      if (src) renderBlockingList.push(src.length > 80 ? '...' + src.slice(-77) : src);
    }
  });

  // ===== AUTO-ASSIGN CATEGORY to issues without one =====
  const categoryMap: Record<string, string> = {
    'title': 'Meta', 'description': 'Meta', 'canonical': 'Meta', 'lang': 'Meta', 'viewport': 'Meta', 'HTTPS': 'Security',
    'H1': 'Content', 'heading': 'Content', 'alt': 'Content', 'image': 'Content', 'word': 'Content', 'content': 'Content',
    'OG': 'Social', 'og:': 'Social', 'structured': 'Social', 'JSON-LD': 'Social',
    'HSTS': 'Security', 'CSP': 'Security', 'X-Frame': 'Security', 'nosniff': 'Security', 'Referrer': 'Security', 'mixed': 'Security', 'SSL': 'Security',
    'script': 'Performance', 'render-blocking': 'Performance', 'lazy': 'Performance', 'WebP': 'Performance',
    'mobile': 'Mobile', 'zoom': 'Mobile', 'scalable': 'Mobile',
    'robots': 'Technical', 'sitemap': 'Technical', 'redirect': 'Technical', 'noindex': 'Technical', 'hreflang': 'Technical',
  };
  issues.forEach(issue => {
    if (!(issue as any).category) {
      const key = Object.keys(categoryMap).find(k => issue.problem.toLowerCase().includes(k.toLowerCase()));
      (issue as any).category = key ? categoryMap[key] : 'Other';
    }
  });

  // ===== TECH STACK DETECTION =====
  const techStack: { name: string; confidence: string; icon: string }[] = [];
  const htmlLower = html.toLowerCase();
  const generators = $('meta[name="generator"]').attr('content') || '';

  if (generators.toLowerCase().includes('wordpress') || htmlLower.includes('wp-content/') || htmlLower.includes('wp-includes/'))
    techStack.push({ name: 'WordPress', confidence: 'high', icon: 'WP' });
  if (htmlLower.includes('shopify') || htmlLower.includes('cdn.shopify.com'))
    techStack.push({ name: 'Shopify', confidence: 'high', icon: 'SH' });
  if (htmlLower.includes('__next') || htmlLower.includes('_next/static'))
    techStack.push({ name: 'Next.js', confidence: 'high', icon: 'NX' });
  if (htmlLower.includes('__nuxt') || htmlLower.includes('nuxt'))
    techStack.push({ name: 'Nuxt.js', confidence: 'medium', icon: 'NU' });
  if (htmlLower.includes('data-reactroot') || htmlLower.includes('__react'))
    techStack.push({ name: 'React', confidence: 'medium', icon: 'RE' });
  if (htmlLower.includes('ng-version') || htmlLower.includes('ng-app'))
    techStack.push({ name: 'Angular', confidence: 'high', icon: 'NG' });
  if (htmlLower.includes('data-vue') || htmlLower.includes('__vue'))
    techStack.push({ name: 'Vue.js', confidence: 'medium', icon: 'VU' });
  if (generators.toLowerCase().includes('wix') || htmlLower.includes('wix.com'))
    techStack.push({ name: 'Wix', confidence: 'high', icon: 'WX' });
  if (htmlLower.includes('squarespace'))
    techStack.push({ name: 'Squarespace', confidence: 'high', icon: 'SQ' });
  if (htmlLower.includes('webflow'))
    techStack.push({ name: 'Webflow', confidence: 'high', icon: 'WF' });
  if (generators.toLowerCase().includes('drupal'))
    techStack.push({ name: 'Drupal', confidence: 'high', icon: 'DR' });
  if (htmlLower.includes('cdn.jsdelivr.net') || htmlLower.includes('cdnjs.cloudflare.com'))
    techStack.push({ name: 'CDN (jsDelivr/Cloudflare)', confidence: 'high', icon: 'CD' });
  if (htmlLower.includes('gtag') || htmlLower.includes('google-analytics') || htmlLower.includes('googletagmanager'))
    techStack.push({ name: 'Google Analytics', confidence: 'high', icon: 'GA' });
  if (htmlLower.includes('jquery') || htmlLower.includes('jquery.min'))
    techStack.push({ name: 'jQuery', confidence: 'medium', icon: 'JQ' });
  if (htmlLower.includes('tailwind') || htmlLower.includes('tailwindcss'))
    techStack.push({ name: 'Tailwind CSS', confidence: 'medium', icon: 'TW' });
  if (htmlLower.includes('bootstrap') || htmlLower.includes('bootstrap.min'))
    techStack.push({ name: 'Bootstrap', confidence: 'medium', icon: 'BS' });

  // Platform-specific SEO tips
  if (techStack.some(t => t.name === 'WordPress') && schemaResults.length === 0)
    issues.push({ severity: 'warning', problem: 'WordPress site without structured data', fix: 'Install Yoast SEO or Rank Math plugin — they auto-generate JSON-LD for WordPress sites.', category: 'Technical' });
  if (techStack.some(t => t.name === 'Wix'))
    issues.push({ severity: 'warning', problem: 'Wix detected — limited SEO control', fix: 'Wix has built-in SEO tools under Marketing > SEO. Check Site Inspector for meta tag settings. Consider Wix SEO Patterns for automatic optimization.', category: 'Technical' });
  if (techStack.some(t => t.name === 'React') && !techStack.some(t => t.name === 'Next.js'))
    issues.push({ severity: 'warning', problem: 'Client-side React without SSR framework', fix: 'Pure React apps render on client — search engines may not see your content. Use Next.js or Gatsby for server-side rendering.', category: 'Technical' });

  // ===== SECURITY GRADE (A+ to F) =====
  const secChecks = {
    https: isHttps,
    hsts: !!hstsHeader && (hstsHeader.match(/max-age=(\d+)/)?.[1] ? parseInt(hstsHeader.match(/max-age=(\d+)/)![1]) >= 31536000 : false),
    hstsIncludeSub: !!hstsHeader?.includes('includeSubDomains'),
    csp: !!cspHeader && !cspHeader.includes('unsafe-inline') && !cspHeader.includes('unsafe-eval'),
    cspExists: !!cspHeader,
    xFrame: !!headers['x-frame-options'],
    xContent: !!headers['x-content-type-options'],
    referrer: !!headers['referrer-policy'],
    permissions: !!headers['permissions-policy'],
    noMixed: mixedContentCount === 0,
  };
  let secGradePoints = 0;
  if (secChecks.https) secGradePoints += 20;
  if (secChecks.hsts) secGradePoints += 15;
  if (secChecks.hstsIncludeSub) secGradePoints += 5;
  if (secChecks.csp) secGradePoints += 15;
  else if (secChecks.cspExists) secGradePoints += 5;
  if (secChecks.xFrame) secGradePoints += 10;
  if (secChecks.xContent) secGradePoints += 10;
  if (secChecks.referrer) secGradePoints += 10;
  if (secChecks.permissions) secGradePoints += 5;
  if (secChecks.noMixed) secGradePoints += 10;
  const securityGrade = secGradePoints >= 95 ? 'A+' : secGradePoints >= 85 ? 'A' : secGradePoints >= 70 ? 'B' : secGradePoints >= 55 ? 'C' : secGradePoints >= 40 ? 'D' : 'F';

  // ===== OVERALL SCORE (weighted 7-category formula) =====
  // Meta & Content: 25pt
  let metaScore = 0;
  metaScore += titleLen >= 30 && titleLen <= 60 ? 8 : titleLen > 0 ? 4 : 0;
  metaScore += descLen >= 120 && descLen <= 160 ? 8 : descLen > 0 ? 4 : 0;
  metaScore += headings.h1.count === 1 ? 4 : headings.h1.count > 0 ? 2 : 0;
  metaScore += canonical ? 3 : 0;
  metaScore += lang ? 2 : 0;

  // Technical SEO: 20pt
  let techScore = 0;
  techScore += isHttps ? 6 : 0;
  techScore += viewportMeta ? 3 : 0;
  techScore += robotsResult.exists ? 3 : 0;
  techScore += sitemapResult.exists ? 3 : 0;
  techScore += redirectChain.length <= 1 ? 3 : redirectChain.length <= 3 ? 1 : 0;
  techScore += hasDoctype ? 2 : 0;

  // Performance: 15pt
  let perfScore = 0;
  const respTime = fetchTime;
  perfScore += respTime < 1000 ? 5 : respTime < 2000 ? 3 : respTime < 3000 ? 1 : 0;
  perfScore += renderBlocking <= 2 ? 4 : renderBlocking <= 5 ? 2 : 0;
  perfScore += notLazy <= 2 ? 3 : notLazy <= 5 ? 1 : 0;
  perfScore += inlineScriptKB < 30 ? 3 : inlineScriptKB < 80 ? 1 : 0;

  // Security: 15pt
  let secCalcScore = 0;
  secCalcScore += isHttps ? 3 : 0;
  secCalcScore += (hstsHeader && parseInt(hstsHeader.match(/max-age=(\d+)/)?.[1] || '0') >= 31536000) ? 2 : hstsHeader ? 1 : 0;
  secCalcScore += cspHeader && !cspHeader.includes('unsafe-inline') ? 3 : cspHeader ? 1 : 0;
  secCalcScore += headers['x-frame-options'] ? 1 : 0;
  secCalcScore += headers['x-content-type-options'] ? 1 : 0;
  secCalcScore += headers['referrer-policy'] ? 1 : 0;
  secCalcScore += mixedContentCount === 0 ? 2 : 0;
  secCalcScore += noSriCount === 0 ? 1 : 0;
  secCalcScore += (!setCookieHeader || (setCookieHeader.toLowerCase().includes('httponly') && setCookieHeader.toLowerCase().includes('secure'))) ? 1 : 0;

  // Content Quality: 10pt
  let contentScore = 0;
  contentScore += wordCount >= 300 ? 4 : wordCount >= 100 ? 2 : 0;
  contentScore += readScore >= 60 ? 3 : readScore >= 40 ? 1 : 0;
  contentScore += kwInTitle ? 1.5 : 0;
  contentScore += kwInH1 ? 1.5 : 0;

  // Social & Schema: 10pt
  let socialScore = 0;
  const ogCount = Object.values(og).filter(Boolean).length;
  socialScore += ogCount >= 4 ? 4 : ogCount >= 2 ? 2 : 0;
  socialScore += schemaResults.length > 0 && schemaResults.some(s => s.valid) ? 4 : schemaResults.length > 0 ? 2 : 0;
  socialScore += tw.card ? 2 : 0;

  // Accessibility: 5pt
  let a11yCalcScore = 0;
  a11yCalcScore += noLabel === 0 ? 2 : 0;
  const altRatio = imgs.length > 0 ? (imgs.length - missingAlt) / imgs.length : 1;
  a11yCalcScore += altRatio >= 0.9 ? 2 : altRatio >= 0.5 ? 1 : 0;
  a11yCalcScore += skippedH === 0 ? 1 : 0;

  // Penalty: broken links, noindex
  let penalty = 0;
  penalty += brokenLinks.length * 2;
  penalty += isNoindex ? 10 : 0;
  penalty += mixedContentCount > 0 ? 3 : 0;

  const rawScore = metaScore + techScore + perfScore + secCalcScore + contentScore + socialScore + a11yCalcScore - penalty;
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Category scores for radar chart (normalized to 100)
  const categoryScores = {
    meta: Math.round((metaScore / 25) * 100),
    technical: Math.round((techScore / 20) * 100),
    performance: Math.round((perfScore / 15) * 100),
    security: Math.round((secCalcScore / 15) * 100),
    content: Math.round((contentScore / 10) * 100),
    social: Math.round((socialScore / 10) * 100),
    accessibility: Math.round((a11yCalcScore / 5) * 100),
  };

  // ===== IMPACT SCORE PER ISSUE =====
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
    (issue as any).impact = key ? impactMap[key] : (issue.severity === 'critical' ? 8 : 3);
  });

  // ===== POTENTIAL SCORE (if all critical fixed) =====
  const criticalImpact = issues
    .filter(i => i.severity === 'critical')
    .reduce((sum, i) => sum + ((i as any).impact || 5), 0);
  const potentialScore = Math.min(100, finalScore + criticalImpact);

  // Sort issues by impact (highest first)
  issues.sort((a, b) => ((b as any).impact || 0) - ((a as any).impact || 0));

  return {
    url: targetUrl,
    score: finalScore,
    potentialScore,
    categoryScores,
    fetchTime,
    statusCode: response.status,
    redirectChain,
    meta: {
      title: { text: title, length: titleLen, status: titleLen >= 30 && titleLen <= 60 ? 'good' : titleLen > 0 ? 'warning' : 'missing' },
      description: { text: descEl, length: descLen, status: descLen >= 120 && descLen <= 160 ? 'good' : descLen > 0 ? 'warning' : 'missing' },
      titlePixelWidth, descPixelWidth,
      canonical, canonicalAnalysis: { selfReferencing: canonicalSelfRef, httpsMismatch: canonicalHttpsMismatch, ogUrlMismatch: canonicalOgMismatch },
      robots: robotsMeta, lang, charset: charsetMeta, viewport: viewportMeta, isNoindex,
      hasFavicon, hasDoctype, textToHtmlRatio,
    },
    headings,
    images: { total: imgs.length, missingAlt, withoutDimensions: withoutDims, largeCount: 0, notLazy, noWebP },
    links: { total: allLinks.length, internal, external, nofollow, broken: [], brokenLinks, uniqueInternal: uniqueInt.size, uniqueExternal: uniqueExt.size, emptyAnchor, genericAnchor },
    wordCount,
    topKeywords,
    og,
    twitter: tw,
    schemas: schemaResults,
    techStack,
    hreflang: { tags: hreflangTags, hasXDefault, issues: hreflangIssues },
    security: { https: isHttps, headers, mixedContent: mixedContentCount, score: secScore, grade: securityGrade, issues: secIssues },
    performance: { responseTime: fetchTime, htmlSize: Math.round(html.length / 1024), totalScripts: scripts.length, totalStylesheets: stylesheets, deferScripts, asyncScripts, inlineScripts, inlineScriptSize: inlineScriptKB, renderBlocking, renderBlockingList },
    mobile: { viewport: !!viewportMeta, scalable, score: mobScore, issues: mobIssues },
    accessibility: { score: a11yScore, issues: a11yIssues },
    contentQuality: { readabilityScore: readScore, readabilityGrade: readGrade, avgSentenceLength: avgSentLen, totalSentences: allSentences.length, longSentences: longSent },
    robots: { ...robotsResult, urlBlocked: urlBlockedByRobots },
    sitemap: { ...sitemapResult, urls: sitemapUrls },
    pageSpeed: pageSpeedResult,
    issues,
  };
}

// ===== Helper: fetch robots.txt =====
async function fetchRobots(origin: string): Promise<{ exists: boolean; disallowCount: number; hasSitemapRef: boolean; userAgents: string[] }> {
  try {
    const rRes = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(5000) });
    if (rRes.ok) {
      const rTxt = await rRes.text();
      return {
        exists: true,
        disallowCount: (rTxt.match(/disallow:/gi) || []).length,
        hasSitemapRef: /sitemap:/i.test(rTxt),
        userAgents: Array.from(new Set((rTxt.match(/user-agent:\s*.+/gi) || []).map(l => l.split(':')[1].trim()))).slice(0, 5),
      };
    }
  } catch {}
  return { exists: false, disallowCount: 0, hasSitemapRef: false, userAgents: [] };
}

// ===== Helper: fetch sitemap.xml =====
async function fetchSitemap(origin: string): Promise<{ exists: boolean }> {
  try {
    const sRes = await fetch(`${origin}/sitemap.xml`, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    return { exists: sRes.ok };
  } catch {}
  return { exists: false };
}
