import * as cheerio from 'cheerio';
import { getPageSpeedData } from '../pagespeed';
import type { Issue } from './types';

export interface FetchResult {
  response: Response;
  html: string;
  $: cheerio.CheerioAPI;
  fetchTime: number;
  redirectChain: { url: string; status: number }[];
  issues: Issue[];
  robots: { exists: boolean; disallowCount: number; hasSitemapRef: boolean; userAgents: string[]; };
  sitemap: { exists: boolean; urls: string[]; };
  pageSpeed: any;
}

export async function fetchPage(targetUrl: string): Promise<FetchResult> {
  const startTime = Date.now();
  const issues: Issue[] = [];
  const redirectChain: { url: string; status: number }[] = [];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let response: Response = null as any;
  let currentUrl = targetUrl;

  try {
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
    if (!response) {
      response = await fetch(currentUrl, {
        headers: { 'User-Agent': 'SEOSnapshotBot/1.0 (+https://seosnapshot.dev)' },
        signal: controller.signal,
        redirect: 'follow',
      });
    }
  } finally { clearTimeout(timeout); }

  if (redirectChain.length > 2) {
    issues.push({ severity: 'warning', problem: `Redirect chain: ${redirectChain.length} hops`, fix: `Reduce redirect chain. Point directly to final URL to save crawl budget.`, category: 'Technical' });
  }
  if (redirectChain.some(r => r.status === 302)) {
    issues.push({ severity: 'warning', problem: 'Temporary redirect (302) detected', fix: 'Use 301 (permanent) redirect instead of 302 if this is a permanent URL change.', category: 'Technical' });
  }
  // Loop detection
  const visitedUrls = redirectChain.map(r => r.url);
  const hasLoop = visitedUrls.length !== new Set(visitedUrls).size;
  if (hasLoop) {
    issues.push({ severity: 'critical', problem: 'Redirect loop detected', fix: 'Your URL creates a redirect loop. Fix server configuration.', category: 'Technical' });
  }

  const fetchTime = Date.now() - startTime;
  const html = await response.text();
  const $ = cheerio.load(html);
  const parsedUrl = new URL(targetUrl);

  // Parallel: robots.txt, sitemap.xml, PageSpeed
  const [robotsResult, sitemapResult, pageSpeedResult] = await Promise.all([
    fetchRobots(parsedUrl.origin),
    fetchSitemap(parsedUrl.origin, $),
    getPageSpeedData(targetUrl),
  ]);

  return { response, html, $, fetchTime, redirectChain, issues, robots: robotsResult, sitemap: sitemapResult, pageSpeed: pageSpeedResult };
}

async function fetchRobots(origin: string) {
  try {
    const r = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(5000) });
    if (r.ok) {
      const txt = await r.text();
      return {
        exists: true,
        disallowCount: (txt.match(/disallow:/gi) || []).length,
        hasSitemapRef: /sitemap:/i.test(txt),
        userAgents: Array.from(new Set((txt.match(/user-agent:\s*.+/gi) || []).map((l: string) => l.split(':')[1].trim()))).slice(0, 5) as string[],
      };
    }
  } catch (e) { if (typeof console !== "undefined") console.error(e); }
  return { exists: false, disallowCount: 0, hasSitemapRef: false, userAgents: [] as string[] };
}

async function fetchSitemap(origin: string, $: cheerio.CheerioAPI) {
  let urls: string[] = [];
  let exists = false;
  try {
    const r = await fetch(`${origin}/sitemap.xml`, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    exists = r.ok;
    if (exists) {
      const full = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
      if (full.ok) {
        const xml = await full.text();
        const sm$ = cheerio.load(xml, { xmlMode: true });
        sm$('url > loc').each((_, el) => { urls.push(sm$(el).text().trim()); });
        urls = urls.slice(0, 50);
      }
    }
  } catch (e) { if (typeof console !== "undefined") console.error(e); }
  return { exists, urls };
}
