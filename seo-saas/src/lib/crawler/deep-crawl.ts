import * as cheerio from 'cheerio';
import { validatePublicURL } from '../ssrf-protection';

// Link-following deep crawler. Unlike reading the sitemap, this walks the site
// the way Googlebot does — following internal links from the homepage — so it
// can surface STRUCTURAL issues that single-page/sitemap analysis misses:
// orphan pages, click-depth, site-wide broken internal links, parameter bloat.

export interface DeepCrawlResult {
  domain: string;
  pagesScanned: number;
  capped: boolean;
  maxDepthReached: number;
  depthHistogram: { depth: number; count: number }[];
  deepPages: { url: string; depth: number }[];       // >= 4 clicks from home
  orphanPages: string[];                             // in sitemap, never linked
  brokenInternalLinks: { url: string; status: number; linkedFrom: string }[];
  paramUrlCount: number;                             // URLs with query strings
  totalInternalLinks: number;
  sitemapCount: number;
  topLinkedPages: { url: string; inlinks: number }[];
}

function normalize(u: string): string {
  try {
    const url = new URL(u);
    url.hash = '';
    // Drop trailing slash (except root) for dedup
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch { return u; }
}

async function fetchSitemapUrls(origin: string): Promise<string[]> {
  const urls: string[] = [];
  try {
    const r = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(6000) });
    if (!r.ok) return urls;
    const xml = await r.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    // Sitemap index → pull first child
    const children = $('sitemap > loc').map((_, el) => $(el).text().trim()).get();
    if (children.length > 0) {
      const cr = await fetch(children[0], { signal: AbortSignal.timeout(6000) });
      if (cr.ok) {
        const c$ = cheerio.load(await cr.text(), { xmlMode: true });
        c$('url > loc').each((_, el) => { urls.push(normalize(c$(el).text().trim())); });
      }
    } else {
      $('url > loc').each((_, el) => { urls.push(normalize($(el).text().trim())); });
    }
  } catch { /* ignore */ }
  return urls;
}

export async function deepCrawl(
  startUrl: string,
  opts: { maxUrls?: number; maxDepth?: number; concurrency?: number } = {}
): Promise<DeepCrawlResult> {
  const maxUrls = opts.maxUrls ?? 250;
  const maxDepth = opts.maxDepth ?? 6;
  const concurrency = opts.concurrency ?? 3;

  const base = await validatePublicURL(startUrl);
  if (!base.valid || !base.url) throw new Error(base.error || 'Invalid start URL');
  const origin = base.url.origin;
  const domain = base.url.hostname;

  const start = normalize(base.url.toString());
  const depthOf = new Map<string, number>([[start, 0]]);
  const linkedFrom = new Map<string, string>();
  const inlinks = new Map<string, number>();
  const seen = new Set<string>([start]);   // every internal URL discovered as a link target
  const visited = new Set<string>();       // pages actually fetched
  const statusOf = new Map<string, number>();
  const broken: { url: string; status: number; linkedFrom: string }[] = [];
  let totalInternalLinks = 0;

  const queue: string[] = [start];
  let cursor = 0;

  async function fetchAndParse(url: string): Promise<void> {
    const check = await validatePublicURL(url);
    if (!check.valid || !check.url) return;
    let res: Response;
    try {
      res = await fetch(check.url.toString(), {
        headers: { 'User-Agent': 'SEOSnapshotBot/1.0 (+https://seosnapshot.dev)' },
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
      });
    } catch { statusOf.set(url, 0); return; }

    statusOf.set(url, res.status);
    if (res.status >= 400) {
      broken.push({ url, status: res.status, linkedFrom: linkedFrom.get(url) || '(entry)' });
      return;
    }
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html')) return;

    let html: string;
    try { html = await res.text(); } catch { return; }
    const $ = cheerio.load(html);
    const depth = depthOf.get(url) ?? 0;

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
      let target: string;
      try {
        const abs = new URL(href, url);
        if (abs.hostname !== domain) return; // internal only
        if (!/^https?:$/.test(abs.protocol)) return;
        target = normalize(abs.toString());
      } catch { return; }

      totalInternalLinks++;
      inlinks.set(target, (inlinks.get(target) || 0) + 1);
      if (!seen.has(target)) {
        seen.add(target);
        linkedFrom.set(target, url);
        depthOf.set(target, depth + 1);
        if (seen.size <= maxUrls && depth + 1 <= maxDepth) queue.push(target);
      }
    });
  }

  // Concurrency-limited BFS. Workers pull from a shared queue that grows as
  // pages are parsed; a worker only terminates when the queue is exhausted AND
  // no other worker is still fetching (which could enqueue more).
  let active = 0;
  async function worker() {
    while (visited.size < maxUrls) {
      if (cursor >= queue.length) {
        if (active === 0) return;            // nothing left and nobody producing
        await new Promise((r) => setTimeout(r, 30));
        continue;
      }
      const url = queue[cursor++];
      if (!url || visited.has(url)) continue;
      visited.add(url);
      active++;
      try { await fetchAndParse(url); } finally { active--; }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));

  // Sitemap comparison for orphans
  const sitemapUrls = await fetchSitemapUrls(origin);
  const orphanPages = sitemapUrls.filter((u) => !seen.has(u)).slice(0, 100);

  // Aggregate
  const depthCounts = new Map<number, number>();
  const deepPages: { url: string; depth: number }[] = [];
  let maxDepthReached = 0;
  let paramUrlCount = 0;
  for (const u of Array.from(seen)) {
    const d = depthOf.get(u) ?? 0;
    depthCounts.set(d, (depthCounts.get(d) || 0) + 1);
    if (d > maxDepthReached) maxDepthReached = d;
    if (d >= 4) deepPages.push({ url: u, depth: d });
    if (u.includes('?')) paramUrlCount++;
  }
  const depthHistogram = Array.from(depthCounts.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([depth, count]) => ({ depth, count }));
  const topLinkedPages = Array.from(inlinks.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([url, n]) => ({ url, inlinks: n }));

  return {
    domain,
    pagesScanned: visited.size,
    capped: seen.size > maxUrls,
    maxDepthReached,
    depthHistogram,
    deepPages: deepPages.sort((a, b) => b.depth - a.depth).slice(0, 50),
    orphanPages,
    brokenInternalLinks: broken.slice(0, 100),
    paramUrlCount,
    totalInternalLinks,
    sitemapCount: sitemapUrls.length,
    topLinkedPages,
  };
}
