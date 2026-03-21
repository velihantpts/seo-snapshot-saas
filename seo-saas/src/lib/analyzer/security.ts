import type * as cheerio from 'cheerio';
import type { Issue } from './types';

export function runSecurityChecks($: cheerio.CheerioAPI, html: string, response: Response, isHttps: boolean, issues: Issue[]) {
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
    issues.push({ severity: isHttps ? 'warning' : 'critical', problem: issue, fix: headerName === 'HSTS header' ? 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains.' : `Configure ${headerName} header for better security.` });
  });

  // Mixed content
  let mixedContentCount = 0;
  if (isHttps) {
    $('img[src^="http://"], script[src^="http://"], link[href^="http://"], iframe[src^="http://"]').each(() => { mixedContentCount++; });
    if (mixedContentCount > 0) issues.push({ severity: 'critical', problem: `${mixedContentCount} mixed content resources`, fix: 'Update all resource URLs from http:// to https://.', category: 'Security' });
  }

  // HSTS max-age
  const hstsHeader = headers['strict-transport-security'];
  if (hstsHeader) {
    const maxAge = parseInt(hstsHeader.match(/max-age=(\d+)/)?.[1] || '0');
    if (maxAge < 31536000) issues.push({ severity: 'warning', problem: `HSTS max-age too low (${maxAge}s)`, fix: 'Set max-age=31536000 for 1 year.', category: 'Security' });
  }

  // CSP unsafe
  const cspHeader = headers['content-security-policy'] || '';
  if (cspHeader.includes('unsafe-inline')) issues.push({ severity: 'warning', problem: 'CSP allows unsafe-inline scripts', fix: 'Use nonces or hashes instead.', category: 'Security' });
  if (cspHeader.includes('unsafe-eval')) issues.push({ severity: 'warning', problem: 'CSP allows unsafe-eval', fix: 'Remove unsafe-eval from CSP.', category: 'Security' });

  // Cookies
  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    const cl = setCookieHeader.toLowerCase();
    if (!cl.includes('httponly')) issues.push({ severity: 'warning', problem: 'Cookie missing HttpOnly flag', fix: 'Add HttpOnly to cookies.', category: 'Security' });
    if (isHttps && !cl.includes('secure')) issues.push({ severity: 'warning', problem: 'Cookie missing Secure flag', fix: 'Add Secure flag.', category: 'Security' });
    if (!cl.includes('samesite')) issues.push({ severity: 'warning', problem: 'Cookie missing SameSite', fix: 'Add SameSite=Lax.', category: 'Security' });
  }

  // SRI
  let noSriCount = 0;
  $('script[src*="cdn"], script[src*="jsdelivr"], script[src*="cloudflare"], link[href*="cdn"]').each((_, el) => {
    if (!$(el).attr('integrity')) noSriCount++;
  });
  if (noSriCount > 0) issues.push({ severity: 'warning', problem: `${noSriCount} CDN resource(s) without SRI`, fix: 'Add integrity attribute to CDN resources.', category: 'Security' });

  // Broken links (parallel)
  const brokenLinks: string[] = [];

  // Security grade
  let gradePoints = 0;
  if (isHttps) gradePoints += 20;
  if (hstsHeader && parseInt(hstsHeader.match(/max-age=(\d+)/)?.[1] || '0') >= 31536000) gradePoints += 15;
  if (hstsHeader?.includes('includeSubDomains')) gradePoints += 5;
  if (cspHeader && !cspHeader.includes('unsafe-inline') && !cspHeader.includes('unsafe-eval')) gradePoints += 15;
  else if (cspHeader) gradePoints += 5;
  if (headers['x-frame-options']) gradePoints += 10;
  if (headers['x-content-type-options']) gradePoints += 10;
  if (headers['referrer-policy']) gradePoints += 10;
  if (headers['permissions-policy']) gradePoints += 5;
  if (mixedContentCount === 0) gradePoints += 10;
  const grade = gradePoints >= 95 ? 'A+' : gradePoints >= 85 ? 'A' : gradePoints >= 70 ? 'B' : gradePoints >= 55 ? 'C' : gradePoints >= 40 ? 'D' : 'F';

  // ===== SERVER DETECTION =====
  const serverHeader = response.headers.get('server') || '';
  const poweredBy = response.headers.get('x-powered-by') || '';
  if (poweredBy) {
    issues.push({ severity: 'warning', problem: `X-Powered-By header exposes: "${poweredBy}"`, fix: 'Remove X-Powered-By header — it reveals server technology to attackers.', category: 'Security' });
  }

  // ===== RESPONSE COMPRESSION =====
  const encoding = response.headers.get('content-encoding') || '';
  if (!encoding) {
    issues.push({ severity: 'warning', problem: 'Response not compressed (no gzip/brotli)', fix: 'Enable gzip or brotli compression on your server. This can reduce transfer size by 60-80%.', category: 'Performance' });
  }

  // ===== CACHE-CONTROL =====
  const cacheControl = response.headers.get('cache-control') || '';
  if (!cacheControl) {
    issues.push({ severity: 'warning', problem: 'No Cache-Control header', fix: 'Add Cache-Control header for static assets: "public, max-age=31536000, immutable" for CSS/JS/images.', category: 'Performance' });
  } else if (cacheControl.includes('no-store') || cacheControl.includes('no-cache')) {
    // OK for HTML pages
  } else {
    const maxAgeMatch = cacheControl.match(/max-age=(\d+)/);
    if (maxAgeMatch && parseInt(maxAgeMatch[1]) < 60) {
      issues.push({ severity: 'warning', problem: `Very short cache duration (max-age=${maxAgeMatch[1]})`, fix: 'Consider longer cache for static content.', category: 'Performance' });
    }
  }

  // ===== PERMISSIONS-POLICY =====
  if (!headers['permissions-policy']) {
    issues.push({ severity: 'warning', problem: 'Missing Permissions-Policy header', fix: 'Add Permissions-Policy to control browser features: camera, microphone, geolocation.', category: 'Security' });
  }

  return {
    security: { https: isHttps, headers, mixedContent: mixedContentCount, score: secScore, grade, issues: secIssues },
    brokenLinks, noSriCount, hstsHeader, cspHeader, setCookieHeader, mixedContentCount,
    serverHeader, encoding, cacheControl,
  };
}

export async function checkBrokenLinks(linkUrls: string[], issues: Issue[]): Promise<string[]> {
  const brokenLinks: string[] = [];
  await Promise.allSettled(
    linkUrls.map(async (u) => {
      try {
        let r = await fetch(u, { method: 'HEAD', signal: AbortSignal.timeout(2000), redirect: 'follow' });
        if (r.status === 405 || r.status === 403) {
          r = await fetch(u, { method: 'GET', signal: AbortSignal.timeout(2000), redirect: 'follow' });
        }
        if (r.status >= 400 && r.status !== 403 && r.status !== 429) {
          brokenLinks.push(`${r.status}: ${u.length > 60 ? u.slice(0, 57) + '...' : u}`);
        }
      } catch (e) { if (typeof console !== "undefined") console.error(e); }
    })
  );
  if (brokenLinks.length > 0) {
    issues.push({ severity: 'critical', problem: `${brokenLinks.length} broken link(s) found`, fix: `Fix or remove: ${brokenLinks.slice(0, 3).join(', ')}`, category: 'Content' });
  }
  return brokenLinks;
}

export async function checkOgImage(ogImage: string, issues: Issue[]) {
  if (!ogImage) return;
  try {
    const r = await fetch(ogImage, { method: 'HEAD', signal: AbortSignal.timeout(2000) });
    if (!r.ok) issues.push({ severity: 'warning', problem: `og:image URL returns ${r.status}`, fix: 'Fix og:image URL.', category: 'Social' });
  } catch {
    issues.push({ severity: 'warning', problem: 'og:image URL is unreachable', fix: 'Verify og:image URL is accessible.', category: 'Social' });
  }
}
