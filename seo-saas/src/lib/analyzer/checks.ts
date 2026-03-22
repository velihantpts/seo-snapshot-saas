import type * as cheerio from 'cheerio';
import { Issue, GENERIC_ANCHORS, STOP_WORDS, estimatePixelWidth } from './types';

export function runChecks(html: string, $: cheerio.CheerioAPI, response: Response, targetUrl: string, issues: Issue[]) {
  const parsedUrl = new URL(targetUrl);

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

  if (titleLen === 0) issues.push({ severity: 'critical', problem: 'Title tag is missing', fix: 'Add a <title> tag with your primary keyword, 50-60 characters.', category: 'Meta' });
  else if (titleLen < 30) issues.push({ severity: 'warning', problem: `Title too short (${titleLen} chars)`, fix: `Your title "${title}" needs more detail. Add keywords to reach 50-60 chars.` });
  else if (titleLen > 60) issues.push({ severity: 'warning', problem: `Title may truncate in SERP (${titleLen} chars)`, fix: `Google shows ~60 chars. Move important keywords to the front.` });
  if (descLen === 0) issues.push({ severity: 'critical', problem: 'Meta description is missing', fix: 'Add <meta name="description" content="...">. Write a compelling 150-160 char summary.' });
  else if (descLen < 120) issues.push({ severity: 'warning', problem: `Meta description short (${descLen} chars)`, fix: `Add a call-to-action and more keywords. Aim for 150-160 chars.` });
  else if (descLen > 160) issues.push({ severity: 'warning', problem: `Meta description may truncate (${descLen} chars)`, fix: `Google cuts at ~160 chars. Trim and put key info first.` });

  // ===== HEADINGS =====
  const headings: Record<string, { count: number; texts: string[] }> = {};
  for (let i = 1; i <= 6; i++) {
    const els = $(`h${i}`);
    headings[`h${i}`] = { count: els.length, texts: els.slice(0, 5).map((_, el) => $(el).text().trim().substring(0, 100)).get() };
  }
  if (headings.h1.count === 0) issues.push({ severity: 'critical', problem: 'No H1 tag found', fix: 'Add exactly one <h1> tag with your primary keyword.' });
  else if (headings.h1.count > 1) issues.push({ severity: 'warning', problem: `Multiple H1 tags (${headings.h1.count})`, fix: `Keep only one H1: "${headings.h1.texts[0]}". Change others to <h2>.` });

  // ===== IMAGES =====
  const imgs = $('img');
  const missingAlt = imgs.filter((_, el) => { const a = $(el).attr('alt'); return a === undefined || a.trim() === ''; }).length;
  const withoutDims = imgs.filter((_, el) => !$(el).attr('width') && !$(el).attr('height')).length;
  if (missingAlt > 0) issues.push({ severity: 'warning', problem: `${missingAlt}/${imgs.length} images missing alt text`, fix: 'Add descriptive alt attributes to images.' });
  let notLazy = 0, noWebP = 0;
  imgs.each((_, el) => {
    const src = $(el).attr('src') || '';
    if (!$(el).attr('loading') && src && !src.startsWith('data:')) notLazy++;
    if (src && /\.(jpg|jpeg|png|gif|bmp)(\?|$)/i.test(src)) noWebP++;
  });
  if (notLazy > 3) issues.push({ severity: 'warning', problem: `${notLazy} images without lazy loading`, fix: 'Add loading="lazy" to below-the-fold images.' });
  if (noWebP > 3) issues.push({ severity: 'warning', problem: `${noWebP} images not using modern formats (WebP/AVIF)`, fix: 'Convert images to WebP or AVIF. This can reduce size by 30-50%.' });

  // ===== LINKS =====
  const allLinks = $('a[href]');
  let internal = 0, external = 0, nofollow = 0, emptyAnchor = 0, genericAnchor = 0;
  const uniqueInt = new Set<string>();
  const uniqueExt = new Set<string>();
  const linkUrls: string[] = [];
  allLinks.each((_, el) => {
    const href = $(el).attr('href') || '';
    try {
      const u = new URL(href, targetUrl);
      if (u.hostname === parsedUrl.hostname) { internal++; uniqueInt.add(u.pathname); }
      else if (u.protocol.startsWith('http')) { external++; uniqueExt.add(u.hostname); if (linkUrls.length < 20) linkUrls.push(u.toString()); }
    } catch (e) { if (typeof console !== "undefined") console.error(e); }
    if ($(el).attr('rel')?.includes('nofollow')) nofollow++;
    const text = $(el).text().trim().toLowerCase();
    if (!text && !$(el).find('img').length) emptyAnchor++;
    else if (GENERIC_ANCHORS.has(text)) genericAnchor++;
  });

  // ===== CONTENT =====
  let contentEl = $('main').length > 0 ? $('main') : $('article').length > 0 ? $('article') : null;
  if (!contentEl) {
    const bodyClone = $('body').clone();
    bodyClone.find('nav, header, footer, aside, script, style, noscript, .sidebar, .menu, .navigation').remove();
    contentEl = bodyClone;
  }
  const bodyText = contentEl.text().replace(/\s+/g, ' ').trim();
  const words = bodyText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const wordFreq: Record<string, number> = {};
  words.forEach(w => {
    const lower = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (lower.length > 2 && !STOP_WORDS.has(lower)) wordFreq[lower] = (wordFreq[lower] || 0) + 1;
  });
  const bigramFreq: Record<string, number> = {};
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i].toLowerCase().replace(/[^a-z0-9]/g, '');
    const b = words[i + 1].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (a.length > 2 && b.length > 2 && !STOP_WORDS.has(a) && !STOP_WORDS.has(b)) {
      bigramFreq[`${a} ${b}`] = (bigramFreq[`${a} ${b}`] || 0) + 1;
    }
  }
  const topUnigrams = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([word, count]) => ({ word, count, density: ((count / wordCount) * 100).toFixed(2) }));
  const topBigrams = Object.entries(bigramFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).filter(([_, c]) => c >= 2).map(([word, count]) => ({ word, count, density: ((count / wordCount) * 100).toFixed(2) }));
  const topKeywords = [...topUnigrams, ...topBigrams].sort((a, b) => b.count - a.count).slice(0, 15);
  if (wordCount < 300) issues.push({ severity: 'warning', problem: `Thin content: only ${wordCount} words`, fix: `Pages under 300 words struggle to rank. Need ${300 - wordCount}+ more words.` });

  // ===== SOCIAL =====
  const og: Record<string, string> = {};
  ['title', 'description', 'image', 'url', 'type', 'site_name'].forEach(key => { og[key] = $(`meta[property="og:${key}"]`).attr('content') || ''; });
  const missingOG = Object.entries(og).filter(([k, v]) => !v && ['title', 'description', 'image', 'url'].includes(k)).map(([k]) => `og:${k}`);
  if (missingOG.length > 0) issues.push({ severity: 'warning', problem: `Missing OG tags: ${missingOG.join(', ')}`, fix: `Add missing OG tags for better social sharing.` });
  const tw: Record<string, string> = {};
  ['card', 'title', 'description', 'image', 'site'].forEach(key => { tw[key] = $(`meta[name="twitter:${key}"]`).attr('content') || ''; });

  // ===== SCHEMAS =====
  const schemas: { type: string; valid: boolean; issues: string[] }[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || '');
      const type = data['@type'] || (Array.isArray(data['@graph']) ? 'Graph' : 'Unknown');
      const si: string[] = [];
      if (!data['@context']) si.push('Missing @context');
      if (type === 'Article' && !data.headline) si.push('Missing headline');
      if (type === 'Product' && !data.offers) si.push('Missing offers');
      schemas.push({ type, valid: si.length === 0, issues: si });
    } catch { schemas.push({ type: 'Invalid', valid: false, issues: ['Invalid JSON syntax'] }); }
  });
  if (schemas.length === 0) issues.push({ severity: 'warning', problem: 'No structured data (JSON-LD)', fix: 'Add JSON-LD schema for rich snippets.' });

  // ===== PERFORMANCE =====
  const scripts = $('script[src]');
  const deferScripts = $('script[defer]').length;
  const asyncScripts = $('script[async]').length;
  const inlineScripts = $('script:not([src])').length;
  const stylesheets = $('link[rel="stylesheet"]').length;
  const renderBlocking = scripts.filter((_, el) => !$(el).attr('async') && !$(el).attr('defer')).length;
  const renderBlockingList: string[] = [];
  scripts.each((_, el) => { if (!$(el).attr('async') && !$(el).attr('defer')) { const s = $(el).attr('src') || ''; if (s) renderBlockingList.push(s.length > 80 ? '...' + s.slice(-77) : s); } });
  if (renderBlocking > 3) issues.push({ severity: 'warning', problem: `${renderBlocking} render-blocking scripts`, fix: 'Add async or defer to non-critical scripts.' });
  let inlineScriptSize = 0;
  $('script:not([src])').each((_, el) => { inlineScriptSize += ($(el).html() || '').length; });
  const inlineScriptKB = Math.round(inlineScriptSize / 1024);
  if (inlineScriptKB > 50) issues.push({ severity: 'warning', problem: `${inlineScriptKB} KB of inline JavaScript`, fix: 'Move large inline scripts to external files.' });

  // ===== MOBILE =====
  const mobIssues: string[] = [];
  if (!viewportMeta) mobIssues.push('Missing viewport meta tag');
  const vpLower = viewportMeta.toLowerCase();
  const scalable = !vpLower.includes('user-scalable=no') && !vpLower.includes('maximum-scale=1');
  if (!scalable) mobIssues.push('Pinch-to-zoom disabled');
  let mobScore = 100;
  if (!viewportMeta) mobScore -= 30;
  if (!scalable) mobScore -= 15;
  mobIssues.forEach(i => issues.push({ severity: 'warning', problem: i, fix: i.includes('viewport') ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' : 'Remove user-scalable=no to allow zoom.' }));

  // ===== ACCESSIBILITY =====
  const a11yIssues: string[] = [];
  let noLabel = 0;
  $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea').each((_, el) => {
    const id = $(el).attr('id');
    if (!id || !$(`label[for="${id}"]`).length) { if (!$(el).attr('aria-label') && !$(el).closest('label').length) noLabel++; }
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
    const sentLens = allSentences.map(s => s.split(/\s+/).length);
    avgSentLen = Math.round(sentLens.reduce((a, b) => a + b, 0) / sentLens.length);
    longSent = sentLens.filter(l => l > 25).length;
    readGrade = 'N/A (non-English)';
  }

  // ===== PIXEL WIDTH + MISC =====
  const titlePixelWidth = estimatePixelWidth(title);
  const descPixelWidth = estimatePixelWidth(descEl);
  if (titlePixelWidth > 580) issues.push({ severity: 'warning', problem: `Title too wide for SERP (${titlePixelWidth}px, max ~580px)`, fix: 'Shorten title or move keywords to the front.', category: 'Meta' });
  if (descPixelWidth > 920) issues.push({ severity: 'warning', problem: `Description too wide for SERP (${descPixelWidth}px)`, fix: 'Put important info first.', category: 'Meta' });

  const topKw = topKeywords[0]?.word || '';
  const kwInTitle = topKw ? title.toLowerCase().includes(topKw) : true;
  const kwInH1 = topKw ? (headings.h1.texts[0] || '').toLowerCase().includes(topKw) : true;
  if (topKw && !kwInTitle) issues.push({ severity: 'warning', problem: `Top keyword "${topKw}" not found in title`, fix: `Include "${topKw}" in the title tag.`, category: 'Content' });
  if (topKw && !kwInH1 && headings.h1.count > 0) issues.push({ severity: 'warning', problem: `Top keyword "${topKw}" not found in H1`, fix: `Include "${topKw}" in your H1.`, category: 'Content' });
  const kwInUrl = topKw ? parsedUrl.pathname.toLowerCase().includes(topKw) : true;
  if (topKw && !kwInUrl && parsedUrl.pathname !== '/') issues.push({ severity: 'warning', problem: `Top keyword "${topKw}" not found in URL`, fix: `Include "${topKw}" in the URL slug for better relevance signal.`, category: 'Content' });
  const kwInDesc = topKw ? descEl.toLowerCase().includes(topKw) : true;
  if (topKw && !kwInDesc && descLen > 0) issues.push({ severity: 'warning', problem: `Top keyword "${topKw}" not found in meta description`, fix: `Include "${topKw}" in your meta description to improve relevance and click-through rate.`, category: 'Content' });
  const topKwDensity = topKw && wordCount > 0 ? ((topKeywords[0]?.count || 0) / wordCount) * 100 : 0;
  if (topKwDensity > 4) issues.push({ severity: 'warning', problem: `Keyword stuffing: "${topKw}" density ${topKwDensity.toFixed(1)}%`, fix: 'Keep keyword density under 3-4%. Use synonyms and related terms instead of repeating the same keyword.', category: 'Content' });

  // ===== SRCSET + ALT LENGTH =====
  let noSrcset = 0;
  imgs.each((_, el) => { if (!$(el).attr('srcset') && !$(el).parent('picture').length) noSrcset++; });
  if (noSrcset > 5) issues.push({ severity: 'warning', problem: `${noSrcset} images without srcset/responsive variants`, fix: 'Add srcset attribute or use <picture> element for responsive images. Serve appropriate sizes for each viewport.', category: 'Content' });
  let shortAlt = 0, longAlt = 0;
  imgs.each((_, el) => { const alt = $(el).attr('alt'); if (alt && alt.length > 0 && alt.length < 5) shortAlt++; if (alt && alt.length > 125) longAlt++; });
  if (shortAlt > 2) issues.push({ severity: 'warning', problem: `${shortAlt} images with very short alt text (<5 chars)`, fix: 'Write descriptive alt text (10-125 characters) that describes the image content.', category: 'Content' });
  if (longAlt > 0) issues.push({ severity: 'warning', problem: `${longAlt} images with overly long alt text (>125 chars)`, fix: 'Keep alt text under 125 characters. Move detailed descriptions to figcaption or surrounding text.', category: 'Content' });

  const hasFavicon = $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0;
  if (!hasFavicon) issues.push({ severity: 'warning', problem: 'No favicon found', fix: 'Add <link rel="icon" href="/favicon.ico">.', category: 'Meta' });
  const hasDoctype = html.trimStart().toLowerCase().startsWith('<!doctype');
  if (!hasDoctype) issues.push({ severity: 'warning', problem: 'Missing DOCTYPE declaration', fix: 'Add <!DOCTYPE html> at the start.', category: 'Technical' });
  const urlPath = parsedUrl.pathname;
  if (urlPath.length > 115) issues.push({ severity: 'warning', problem: `URL path is very long (${urlPath.length} chars)`, fix: 'Keep URL paths under 100 characters.', category: 'Technical' });
  if (/[A-Z]/.test(urlPath)) issues.push({ severity: 'warning', problem: 'URL contains uppercase letters', fix: 'Use lowercase URLs to avoid duplicate content.', category: 'Technical' });
  if (/[_]/.test(urlPath) && urlPath !== '/') issues.push({ severity: 'warning', problem: 'URL uses underscores instead of hyphens', fix: 'Use hyphens (-) instead of underscores (_).', category: 'Technical' });
  const textToHtmlRatio = html.length > 0 ? Math.round((bodyText.length / html.length) * 100) : 0;
  if (textToHtmlRatio < 10) issues.push({ severity: 'warning', problem: `Low text-to-HTML ratio (${textToHtmlRatio}%)`, fix: 'Aim for 25-70% ratio. Remove unused CSS/JS.', category: 'Content' });

  let badFontDisplay = 0;
  const fontFaceMatches = html.match(/@font-face\s*\{[^}]*\}/gi) || [];
  fontFaceMatches.forEach(ff => { if (!ff.includes('font-display')) badFontDisplay++; });
  if (badFontDisplay > 0) issues.push({ severity: 'warning', problem: `${badFontDisplay} @font-face without font-display`, fix: 'Add font-display: swap to @font-face rules.', category: 'Performance' });

  if (!canonical) issues.push({ severity: 'warning', problem: 'No canonical URL', fix: `Add <link rel="canonical" href="${targetUrl}">.` });
  if (!lang) issues.push({ severity: 'warning', problem: 'Missing language attribute', fix: 'Add lang="en" to <html> tag.' });
  const isHttps = parsedUrl.protocol === 'https:';
  if (!isHttps) issues.push({ severity: 'critical', problem: 'Not using HTTPS', fix: 'Get an SSL certificate and redirect HTTP to HTTPS.' });
  if (!viewportMeta) issues.push({ severity: 'critical', problem: 'Missing viewport meta tag', fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.' });

  // Canonical deep analysis
  const canonicalSelfRef = canonical ? (new URL(canonical, targetUrl).toString() === targetUrl) : false;
  const canonicalHttpsMismatch = canonical ? (canonical.startsWith('http://') && isHttps) || (canonical.startsWith('https://') && !isHttps) : false;
  const canonicalOgMismatch = canonical && og.url ? (new URL(canonical, targetUrl).toString() !== new URL(og.url, targetUrl).toString()) : false;
  if (canonicalHttpsMismatch) issues.push({ severity: 'critical', problem: 'Canonical URL protocol mismatch', fix: 'Update canonical to match HTTP/HTTPS.' });
  if (canonicalOgMismatch) issues.push({ severity: 'warning', problem: 'Canonical and og:url mismatch', fix: 'Make canonical and og:url point to the same URL.' });

  const isNoindex = robotsMeta.toLowerCase().includes('noindex') || !!response.headers.get('x-robots-tag')?.toLowerCase().includes('noindex');
  if (isNoindex) issues.push({ severity: 'critical', problem: 'Page is marked as noindex — will NOT appear in Google', fix: 'Remove noindex if you want this page indexed.' });

  // Duplicate meta
  if ($('title').length > 1) issues.push({ severity: 'warning', problem: `Multiple <title> tags found (${$('title').length})`, fix: 'Keep only one <title> tag.', category: 'Meta' });
  if ($('meta[name="description"]').length > 1) issues.push({ severity: 'warning', problem: `Multiple meta descriptions found`, fix: 'Keep only one <meta name="description">.', category: 'Meta' });

  // Hreflang
  const hreflangTags: { lang: string; url: string }[] = [];
  $('link[rel="alternate"][hreflang]').each((_, el) => {
    const l = $(el).attr('hreflang') || ''; const h = $(el).attr('href') || '';
    if (l && h) hreflangTags.push({ lang: l, url: h });
  });
  const linkHeader = response.headers.get('link') || '';
  if (linkHeader) {
    const m = linkHeader.match(/<([^>]+)>;\s*rel="alternate";\s*hreflang="([^"]+)"/gi) || [];
    m.forEach(match => { const u = match.match(/<([^>]+)>/); const l = match.match(/hreflang="([^"]+)"/); if (u && l) hreflangTags.push({ lang: l[1], url: u[1] }); });
  }
  const hasXDefault = hreflangTags.some(h => h.lang === 'x-default');
  const hreflangIssues: string[] = [];
  if (hreflangTags.length > 0 && !hasXDefault) { hreflangIssues.push('Missing x-default'); issues.push({ severity: 'warning', problem: 'Missing x-default hreflang', fix: 'Add hreflang x-default as fallback.' }); }
  // Hreflang lang code validation
  const validLangCodes = /^(x-default|[a-z]{2}(-[A-Z]{2})?)$/;
  hreflangTags.forEach(h => { if (!validLangCodes.test(h.lang)) issues.push({ severity: 'warning', problem: `Invalid hreflang language code: "${h.lang}"`, fix: `Use valid ISO 639-1 codes like "en", "tr", "de-DE". "${h.lang}" is not recognized.`, category: 'Technical' }); });
  // Self-referencing hreflang
  if (hreflangTags.length > 0 && !hreflangTags.some(h => { try { return new URL(h.url, targetUrl).toString() === targetUrl; } catch { return false; } })) {
    issues.push({ severity: 'warning', problem: 'Missing self-referencing hreflang tag', fix: 'Add a hreflang tag that points to this page itself.', category: 'Technical' });
  }

  // ===== MOBILE TAP TARGET + FONT SIZE =====
  let smallTapTargets = 0;
  $('a, button, input, select, textarea').each((_, el) => {
    const style = $(el).attr('style') || '';
    const cls = $(el).attr('class') || '';
    const sizeMatch = style.match(/(?:width|height)\s*:\s*(\d+)/);
    if (sizeMatch && parseInt(sizeMatch[1]) < 44) smallTapTargets++;
    if (cls.includes('text-[10px]') || cls.includes('text-[8px]')) smallTapTargets++;
  });
  const baseFontSize = $('body').css('font-size') || '';
  const htmlFontMatch = html.match(/body\s*{[^}]*font-size\s*:\s*(\d+)/);
  if (htmlFontMatch && parseInt(htmlFontMatch[1]) < 14) {
    issues.push({ severity: 'warning', problem: `Base font size too small (${htmlFontMatch[1]}px)`, fix: 'Use at least 16px base font size for readability on mobile devices.', category: 'Mobile' });
  }

  // ===== SPAM DOMAIN DETECTION =====
  const spamDomains = ['casino', 'poker', 'viagra', 'cialis', 'payday', 'loan-shark', 'xxx', 'porn'];
  let spamLinks = 0;
  $('a[href]').each((_, el) => { const href = ($(el).attr('href') || '').toLowerCase(); spamDomains.forEach(s => { if (href.includes(s)) spamLinks++; }); });
  if (spamLinks > 0) issues.push({ severity: 'critical', problem: `${spamLinks} link(s) to potentially spammy domains`, fix: 'Remove or add rel="nofollow" to links pointing to spam/gambling/adult domains. These hurt your SEO.', category: 'Security' });

  // ===== STRUCTURED DATA DEEP VALIDATION =====
  schemas.forEach(s => {
    if (s.type === 'Article') {
      if (!s.issues.includes('Missing headline')) { /* already checked */ }
      // Check for recommended Article fields
    }
    if (s.type === 'Product' && s.valid) {
      // Additional product checks would go here
    }
    if (s.type === 'FAQ') {
      // FAQ schema found — good for rich results
    }
  });
  // Check for FAQ page without FAQ schema
  if ($('*[itemscope][itemtype*="FAQPage"]').length > 0 && !schemas.some(s => s.type === 'FAQPage')) {
    issues.push({ severity: 'warning', problem: 'FAQ content detected but no FAQPage schema', fix: 'Add FAQPage JSON-LD schema to qualify for FAQ rich results in Google.', category: 'Social' });
  }

  // ===== CHARSET VALIDATION =====
  if (!charsetMeta && !html.toLowerCase().includes('charset=utf-8') && !html.toLowerCase().includes('charset="utf-8"')) {
    issues.push({ severity: 'warning', problem: 'No charset declaration found', fix: 'Add <meta charset="UTF-8"> as the first element in <head>.', category: 'Technical' });
  } else if (charsetMeta && charsetMeta.toLowerCase() !== 'utf-8') {
    issues.push({ severity: 'warning', problem: `Non-UTF-8 charset: ${charsetMeta}`, fix: 'Use UTF-8 encoding: <meta charset="UTF-8">.', category: 'Technical' });
  }

  // ===== LANG VALUE VALIDATION =====
  const validLangs = ['en','es','fr','de','it','pt','nl','ru','ja','ko','zh','ar','hi','tr','pl','sv','da','fi','no','cs','hu','ro','bg','uk','el','he','th','vi','id','ms','tl'];
  if (lang && !validLangs.some(l => lang.toLowerCase().startsWith(l))) {
    issues.push({ severity: 'warning', problem: `Unusual lang attribute: "${lang}"`, fix: 'Use a valid ISO 639-1 language code like "en", "tr", "de".', category: 'Technical' });
  }

  // ===== META ROBOTS NOFOLLOW =====
  if (robotsMeta.toLowerCase().includes('nofollow')) {
    issues.push({ severity: 'warning', problem: 'Page has meta robots nofollow — links won\'t pass authority', fix: 'Remove nofollow from <meta name="robots"> if you want links to pass PageRank.', category: 'Technical' });
  }

  // ===== EMPTY HEADINGS =====
  let emptyHeadings = 0;
  $('h1,h2,h3,h4,h5,h6').each((_, el) => { if (!$(el).text().trim()) emptyHeadings++; });
  if (emptyHeadings > 0) issues.push({ severity: 'warning', problem: `${emptyHeadings} empty heading tag(s)`, fix: 'Remove empty heading tags or add content to them.', category: 'Content' });

  // ===== DUPLICATE H2 CONTENT =====
  const h2Texts = $('h2').map((_, el) => $(el).text().trim().toLowerCase()).get();
  const h2Dupes = h2Texts.filter((t, i) => t && h2Texts.indexOf(t) !== i);
  if (h2Dupes.length > 0) issues.push({ severity: 'warning', problem: `${h2Dupes.length} duplicate H2 heading(s)`, fix: 'Make each H2 unique to help search engines understand page structure.', category: 'Content' });

  // ===== DEPRECATED HTML TAGS =====
  const deprecatedTags = ['center', 'font', 'marquee', 'blink', 'strike', 'big', 'tt'];
  const foundDeprecated: string[] = [];
  deprecatedTags.forEach(tag => { if ($(tag).length > 0) foundDeprecated.push(`<${tag}> (${$(tag).length})`); });
  if (foundDeprecated.length > 0) issues.push({ severity: 'warning', problem: `Deprecated HTML tags: ${foundDeprecated.join(', ')}`, fix: 'Replace deprecated tags with CSS. <center> → text-align:center, <font> → CSS font properties.', category: 'Technical' });

  // ===== IFRAME DETECTION =====
  const iframeCount = $('iframe').length;
  if (iframeCount > 3) issues.push({ severity: 'warning', problem: `${iframeCount} iframes detected — may slow page load`, fix: 'Reduce iframe usage. Use lazy loading for iframes: <iframe loading="lazy">.', category: 'Performance' });

  // ===== EMAIL EXPOSURE =====
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const bodyHtml = $('body').html() || '';
  const exposedEmails = (bodyHtml.match(emailRegex) || []).filter(e => !e.includes('schema.org') && !e.includes('example.com'));
  if (exposedEmails.length > 0) issues.push({ severity: 'warning', problem: `${exposedEmails.length} email address(es) exposed in HTML`, fix: 'Use contact forms instead of plaintext emails to prevent spam harvesting.', category: 'Security' });

  // ===== SOCIAL MEDIA LINKS =====
  const socialDomains = ['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'tiktok.com', 'github.com'];
  const foundSocial: string[] = [];
  allLinks.each((_, el) => {
    const href = $(el).attr('href') || '';
    socialDomains.forEach(d => { if (href.includes(d) && !foundSocial.includes(d)) foundSocial.push(d); });
  });

  // ===== DNS PREFETCH / PRECONNECT =====
  const hasPrefetch = $('link[rel="dns-prefetch"], link[rel="preconnect"]').length > 0;
  const externalDomains = $('script[src], link[href]').map((_, el) => {
    const src = $(el).attr('src') || $(el).attr('href') || '';
    try { const u = new URL(src); return u.hostname !== parsedUrl.hostname ? u.hostname : null; } catch { return null; }
  }).get().filter(Boolean);
  if (externalDomains.length > 3 && !hasPrefetch) {
    issues.push({ severity: 'warning', problem: `${externalDomains.length} external domains loaded without dns-prefetch`, fix: 'Add <link rel="preconnect" href="https://cdn.example.com"> for external domains to speed up connections.', category: 'Performance' });
  }

  // ===== TWITTER CARD VALIDATION =====
  if (tw.card && !['summary', 'summary_large_image', 'app', 'player'].includes(tw.card)) {
    issues.push({ severity: 'warning', problem: `Invalid Twitter card type: "${tw.card}"`, fix: 'Use a valid type: summary, summary_large_image, app, or player.', category: 'Social' });
  }
  if (!tw.card && og.title) {
    issues.push({ severity: 'warning', problem: 'OG tags present but no Twitter Card', fix: 'Add <meta name="twitter:card" content="summary_large_image"> to show rich previews on Twitter/X.', category: 'Social' });
  }

  // ===== PRINT STYLESHEET =====
  const hasPrintCSS = $('link[media="print"]').length > 0 || html.includes('@media print');

  // ===== PAGE SIZE WARNING =====
  const htmlSizeKB = Math.round(html.length / 1024);
  if (htmlSizeKB > 500) {
    issues.push({ severity: 'warning', problem: `Large HTML document (${htmlSizeKB} KB)`, fix: 'HTML over 500KB is heavy. Optimize by removing unused code, inlining less CSS/JS.', category: 'Performance' });
  }

  // ===== TAB/FORM AUTOCOMPLETE =====
  const passwordInputs = $('input[type="password"]').length;
  const noAutocomplete = $('input[type="password"]:not([autocomplete])').length;
  if (noAutocomplete > 0) {
    issues.push({ severity: 'warning', problem: 'Password input without autocomplete attribute', fix: 'Add autocomplete="current-password" or autocomplete="new-password" for better UX and security.', category: 'Technical' });
  }

  // ===== HEADING BEFORE CONTENT =====
  const firstH1Index = html.indexOf('<h1');
  const firstPIndex = html.indexOf('<p');
  if (firstPIndex > 0 && firstH1Index > firstPIndex) {
    issues.push({ severity: 'warning', problem: 'Content appears before H1 heading', fix: 'Place your H1 before the main content paragraphs for better SEO structure.', category: 'Content' });
  }

  // ===== MULTIPLE CANONICAL TAGS =====
  const canonicalTags = $('link[rel="canonical"]').length;
  if (canonicalTags > 1) {
    issues.push({ severity: 'warning', problem: `Multiple canonical tags found (${canonicalTags})`, fix: 'Keep only one <link rel="canonical">. Multiple canonicals confuse search engines.', category: 'Meta' });
  }

  // ===== REL=NOOPENER ON EXTERNAL LINKS =====
  let noopenerMissing = 0;
  $('a[target="_blank"]').each((_, el) => {
    const rel = $(el).attr('rel') || '';
    if (!rel.includes('noopener') && !rel.includes('noreferrer')) noopenerMissing++;
  });
  if (noopenerMissing > 0) issues.push({ severity: 'warning', problem: `${noopenerMissing} external link(s) with target="_blank" missing rel="noopener"`, fix: 'Add rel="noopener noreferrer" to all target="_blank" links to prevent security vulnerability.', category: 'Security' });

  // ===== META REFRESH REDIRECT =====
  const metaRefresh = $('meta[http-equiv="refresh"]').attr('content') || '';
  if (metaRefresh) issues.push({ severity: 'warning', problem: 'Meta refresh redirect detected', fix: 'Use server-side 301 redirect instead of <meta http-equiv="refresh">. Meta refresh hurts SEO and UX.', category: 'Technical' });

  // ===== SELF-LINKING ANCHORS =====
  let selfLinks = 0;
  allLinks.each((_, el) => {
    const href = $(el).attr('href') || '';
    try { if (new URL(href, targetUrl).toString() === targetUrl) selfLinks++; } catch (e) { if (typeof console !== "undefined") console.error(e); }
  });
  if (selfLinks > 3) issues.push({ severity: 'warning', problem: `${selfLinks} self-referencing links on page`, fix: 'Reduce self-linking. Too many links to the same page waste crawl budget.', category: 'Content' });

  // ===== PARAGRAPH LENGTH =====
  let longParagraphs = 0;
  $('p').each((_, el) => { if ($(el).text().trim().split(/\s+/).length > 200) longParagraphs++; });
  if (longParagraphs > 0) issues.push({ severity: 'warning', problem: `${longParagraphs} very long paragraph(s) (200+ words)`, fix: 'Break long paragraphs into shorter ones (3-5 sentences). Use subheadings, lists, and images for scannability.', category: 'Content' });

  // ===== LIST USAGE =====
  const hasLists = $('ul, ol').length > 0;
  if (wordCount > 500 && !hasLists) issues.push({ severity: 'warning', problem: 'No lists (ul/ol) found in long content', fix: 'Use bullet or numbered lists to improve readability and qualify for featured snippets.', category: 'Content' });

  // ===== CONTENT UNIQUENESS =====
  const uniqueWords = Object.keys(wordFreq).length;
  const uniqueRatio = wordCount > 0 ? Math.round((uniqueWords / wordCount) * 100) : 0;
  if (wordCount > 100 && uniqueRatio < 20) issues.push({ severity: 'warning', problem: `Low content uniqueness (${uniqueRatio}% unique words)`, fix: 'Your content is repetitive. Use more varied vocabulary and expand on subtopics.', category: 'Content' });

  // ===== TABLE ACCESSIBILITY =====
  const tables = $('table');
  if (tables.length > 0) {
    let badTables = 0;
    tables.each((_, el) => { if (!$(el).find('th').length && !$(el).find('[scope]').length) badTables++; });
    if (badTables > 0) issues.push({ severity: 'warning', problem: `${badTables} table(s) without header cells (th)`, fix: 'Add <th> elements with scope="col" or scope="row" for screen reader accessibility.', category: 'Content' });
  }

  // ===== SKIP NAV LINK =====
  const hasSkipNav = $('a[href="#main-content"], a[href="#content"], a[href="#main"], .skip-nav, .skip-link, [class*="skip"]').length > 0;
  if (!hasSkipNav) issues.push({ severity: 'warning', problem: 'No skip navigation link found', fix: 'Add <a href="#main-content" class="sr-only">Skip to content</a> as first element in body for keyboard users.', category: 'Content' });

  // ===== ARIA LANDMARKS =====
  const hasMainRole = $('main, [role="main"]').length > 0;
  const hasNavRole = $('nav, [role="navigation"]').length > 0;
  if (!hasMainRole) issues.push({ severity: 'warning', problem: 'No <main> landmark element', fix: 'Wrap main content in <main> tag for screen readers and SEO.', category: 'Content' });
  if (!hasNavRole) issues.push({ severity: 'warning', problem: 'No <nav> landmark element', fix: 'Wrap navigation in <nav> tag for accessibility.', category: 'Content' });

  // ===== ANCHOR TEXT LENGTH =====
  let shortAnchors = 0, longAnchors = 0;
  allLinks.each((_, el) => {
    const text = $(el).text().trim();
    if (text.length === 1) shortAnchors++;
    if (text.length > 100) longAnchors++;
  });
  if (shortAnchors > 3) issues.push({ severity: 'warning', problem: `${shortAnchors} links with very short anchor text (1 char)`, fix: 'Use descriptive anchor text for better SEO. Avoid single-character link text.', category: 'Content' });

  // ===== HEADING KEYWORD RELEVANCE =====
  if (topKw) {
    const h2WithKw = h2Texts.filter(t => t.includes(topKw)).length;
    const h3Texts = $('h3').map((_, el) => $(el).text().trim().toLowerCase()).get();
    const h3WithKw = h3Texts.filter(t => t.includes(topKw)).length;
    if (headings.h2.count > 2 && h2WithKw === 0 && h3WithKw === 0) {
      issues.push({ severity: 'warning', problem: `Top keyword "${topKw}" not found in any H2/H3`, fix: `Include "${topKw}" naturally in at least one subheading for better topic relevance.`, category: 'Content' });
    }
  }

  // ===== VIDEO WITHOUT TRANSCRIPT =====
  const videos = $('video');
  if (videos.length > 0) {
    let noTrack = 0;
    videos.each((_, el) => { if (!$(el).find('track').length) noTrack++; });
    if (noTrack > 0) issues.push({ severity: 'warning', problem: `${noTrack} video(s) without captions/subtitles`, fix: 'Add <track kind="captions" src="captions.vtt"> for accessibility and SEO.', category: 'Content' });
  }

  // ===== FORM METHOD CHECK =====
  $('form').each((_, el) => {
    const method = ($(el).attr('method') || 'get').toLowerCase();
    const hasPassword = $(el).find('input[type="password"]').length > 0;
    if (method === 'get' && hasPassword) {
      issues.push({ severity: 'critical', problem: 'Login form uses GET method — passwords exposed in URL', fix: 'Change form method to POST: <form method="POST">.', category: 'Security' });
    }
  });

  // ===== OVERSIZED IMAGE DIMENSIONS =====
  let oversizedImages = 0;
  imgs.each((_, el) => {
    const w = parseInt($(el).attr('width') || '0');
    const h = parseInt($(el).attr('height') || '0');
    if (w > 2000 || h > 2000) oversizedImages++;
  });
  if (oversizedImages > 0) issues.push({ severity: 'warning', problem: `${oversizedImages} image(s) with very large dimensions (2000px+)`, fix: 'Resize images to their display size. Serve responsive images with srcset.', category: 'Performance' });

  // ===== PRELOAD KEY RESOURCES =====
  const hasPreload = $('link[rel="preload"]').length > 0;
  if (!hasPreload && imgs.length > 0) {
    issues.push({ severity: 'warning', problem: 'No resource preloading detected', fix: 'Preload your LCP image: <link rel="preload" as="image" href="hero.jpg">. This improves Largest Contentful Paint.', category: 'Performance' });
  }

  // ===== LINK TITLE ATTRIBUTE =====
  let linksWithoutTitle = 0;
  $('a[href]:not([title]):not([aria-label])').each((_, el) => {
    const text = $(el).text().trim();
    if (!text && !$(el).find('img[alt]').length) linksWithoutTitle++;
  });
  if (linksWithoutTitle > 5) issues.push({ severity: 'warning', problem: `${linksWithoutTitle} links without accessible text or title`, fix: 'Add title or aria-label to image-only links for screen readers.', category: 'Content' });

  // ===== COMPRESSION CHECK =====
  const contentEncoding = response.headers.get('content-encoding') || '';
  const hasCompression = contentEncoding.includes('gzip') || contentEncoding.includes('br') || contentEncoding.includes('deflate');
  if (!hasCompression) issues.push({ severity: 'warning', problem: 'No gzip/brotli compression detected', fix: 'Enable gzip or brotli compression. Reduces page size by 60-80%.', category: 'Performance' });

  // ===== CACHE-CONTROL CHECK =====
  const cacheControl = response.headers.get('cache-control') || '';
  if (!cacheControl) issues.push({ severity: 'warning', problem: 'No Cache-Control header', fix: 'Add Cache-Control for static assets: public, max-age=31536000, immutable', category: 'Performance' });

  // ===== X-POWERED-BY =====
  const xPoweredBy = response.headers.get('x-powered-by') || '';
  if (xPoweredBy) issues.push({ severity: 'warning', problem: `X-Powered-By header exposes: "${xPoweredBy}"`, fix: 'Remove X-Powered-By header — it reveals server technology to attackers.', category: 'Security' });

  // ===== PAGE WEIGHT =====
  const estimatedPageWeight = Math.round(html.length / 1024) + (scripts.length * 30) + (stylesheets * 15);
  if (estimatedPageWeight > 3000) issues.push({ severity: 'warning', problem: `Estimated page weight: ${estimatedPageWeight} KB`, fix: 'Reduce total page weight. Compress images, minify CSS/JS, remove unused code.', category: 'Performance' });

  // ===== TOTAL REQUESTS =====
  const totalRequests = scripts.length + stylesheets + imgs.length + iframeCount;
  if (totalRequests > 80) issues.push({ severity: 'warning', problem: `High request count: ${totalRequests} requests`, fix: 'Reduce HTTP requests. Combine CSS/JS files, use image sprites or SVG, lazy-load below-fold resources.', category: 'Performance' });

  // ===== PRECONNECT/DNS-PREFETCH =====
  const preconnects = $('link[rel="preconnect"]').length;
  const dnsPrefetch = $('link[rel="dns-prefetch"]').length;


  // ===== E-E-A-T SIGNALS =====
  const hasAuthorMeta = !!($('meta[name="author"]').attr('content'));
  const hasAuthorSchema = schemas.some(s => (s as any).author || (s as any).creator);
  const hasAboutLink = $('a[href*="/about"], a[href*="about-us"], a[href*="about_us"]').length > 0;
  const hasPrivacyLink = $('a[href*="/privacy"], a[href*="privacy-policy"]').length > 0;
  const hasTermsLink = $('a[href*="/terms"], a[href*="terms-of-service"], a[href*="tos"]').length > 0;
  const hasContactLink = $('a[href*="/contact"], a[href*="contact-us"], a[href*="mailto:"]').length > 0;
  const hasDatePublished = $('time[datetime]').length > 0 || schemas.some(s => (s as any).datePublished);
  const hasDateModified = schemas.some(s => (s as any).dateModified);

  const eeatSignals = [hasAuthorMeta || hasAuthorSchema, hasAboutLink, hasPrivacyLink, hasTermsLink, hasContactLink, hasDatePublished].filter(Boolean).length;
  const eeatIssues: string[] = [];
  if (!hasAuthorMeta && !hasAuthorSchema) { eeatIssues.push('No author information'); issues.push({ severity: 'warning', problem: 'No author information found', fix: 'Add <meta name="author" content="Your Name"> or author field in JSON-LD schema. Google uses authorship for E-E-A-T evaluation.', category: 'Content' }); }
  if (!hasAboutLink) { eeatIssues.push('No About page link'); issues.push({ severity: 'warning', problem: 'No "About" page link found', fix: 'Add a link to an About page. It helps establish E-E-A-T (Experience, Expertise, Authority, Trust) with Google.', category: 'Content' }); }
  if (!hasPrivacyLink) { eeatIssues.push('No Privacy Policy link'); issues.push({ severity: 'warning', problem: 'No privacy policy link found', fix: 'Add a link to your privacy policy in the footer. Required by GDPR and helps build trust.', category: 'Content' }); }
  if (!hasContactLink) { eeatIssues.push('No contact information'); issues.push({ severity: 'warning', problem: 'No contact page or email link found', fix: 'Add a Contact page or mailto: link. Google values sites that provide ways to reach the author/business.', category: 'Content' }); }
  if (!hasDatePublished && wordCount > 300) { eeatIssues.push('No publish date'); issues.push({ severity: 'warning', problem: 'No publish or modified date found', fix: 'Add <time datetime="2026-01-15"> or datePublished in JSON-LD. Content freshness is a Google ranking signal.', category: 'Content' }); }

  // ===== OPEN GRAPH COMPLETENESS SCORE =====
  const ogCompleteness = Object.values(og).filter(Boolean).length;
  if (ogCompleteness > 0 && ogCompleteness < 4) {
    issues.push({ severity: 'warning', problem: `Incomplete OG tags (${ogCompleteness}/6)`, fix: 'Add all recommended OG tags: og:title, og:description, og:image, og:url, og:type, og:site_name.', category: 'Social' });
  }

  return {
    meta: { title: { text: title, length: titleLen, status: titleLen >= 30 && titleLen <= 60 ? 'good' : titleLen > 0 ? 'warning' : 'missing' }, description: { text: descEl, length: descLen, status: descLen >= 120 && descLen <= 160 ? 'good' : descLen > 0 ? 'warning' : 'missing' }, titlePixelWidth, descPixelWidth, canonical, canonicalAnalysis: { selfReferencing: canonicalSelfRef, httpsMismatch: canonicalHttpsMismatch, ogUrlMismatch: canonicalOgMismatch }, robots: robotsMeta, lang, charset: charsetMeta, viewport: viewportMeta, isNoindex, hasFavicon, hasDoctype, textToHtmlRatio },
    headings, images: { total: imgs.length, missingAlt, withoutDimensions: withoutDims, largeCount: 0, notLazy, noWebP },
    links: { total: allLinks.length, internal, external, nofollow, broken: [], brokenLinks: [] as string[], uniqueInternal: uniqueInt.size, uniqueExternal: uniqueExt.size, emptyAnchor, genericAnchor },
    wordCount, topKeywords, og, twitter: tw, schemas,
    hreflang: { tags: hreflangTags, hasXDefault, issues: hreflangIssues },
    performance: { responseTime: 0, htmlSize: Math.round(html.length / 1024), totalScripts: scripts.length, totalStylesheets: stylesheets, deferScripts, asyncScripts, inlineScripts, inlineScriptSize: inlineScriptKB, renderBlocking, renderBlockingList },
    mobile: { viewport: !!viewportMeta, scalable, score: mobScore, issues: mobIssues },
    accessibility: { score: a11yScore, issues: a11yIssues },
    contentQuality: { readabilityScore: readScore, readabilityGrade: readGrade, avgSentenceLength: avgSentLen, totalSentences: allSentences.length, longSentences: longSent },
    linkUrls, kwInTitle, kwInH1, isHttps, noLabel, missingAlt, skippedH, readScore, badFontDisplay, titlePixelWidth, urlPath, textToHtmlRatio, inlineScriptKB, noSriCount: 0, titleLen, descLen, titleTags: $('title').length, descTags: $('meta[name="description"]').length,
    // New technical data
    serverInfo: { contentEncoding, cacheControl, xPoweredBy, server: response.headers.get('server') || '' },
    pageWeight: { estimated: estimatedPageWeight, totalRequests, iframeCount, preconnects, dnsPrefetch, externalDomains: externalDomains.length },
    socialLinks: foundSocial, exposedEmails, noopenerMissing, foundDeprecated, metaRefresh: !!metaRefresh,
    kwInUrl, kwInDesc, topKwDensity, noSrcset, shortAlt, longAlt, smallTapTargets, spamLinks,
    eeat: { score: eeatSignals, total: 6, hasAuthor: hasAuthorMeta || hasAuthorSchema, hasAbout: hasAboutLink, hasPrivacy: hasPrivacyLink, hasTerms: hasTermsLink, hasContact: hasContactLink, hasDate: hasDatePublished, issues: eeatIssues },
  };
}
