// Google PageSpeed Insights API integration (free tier)

export interface PageSpeedResult {
  performanceScore: number;
  fcp: number;       // First Contentful Paint (ms)
  lcp: number;       // Largest Contentful Paint (ms)
  cls: number;       // Cumulative Layout Shift
  tbt: number;       // Total Blocking Time (ms)
  si: number;        // Speed Index (ms)
  tti: number;       // Time to Interactive (ms)
  available: boolean;
}

const EMPTY_RESULT: PageSpeedResult = {
  performanceScore: 0, fcp: 0, lcp: 0, cls: 0, tbt: 0, si: 0, tti: 0, available: false,
};

// CrUX API — free, no key needed, returns real user data
export interface CrUXData {
  lcp: { p75: number; rating: string } | null;
  fid: { p75: number; rating: string } | null;
  cls: { p75: number; rating: string } | null;
  inp: { p75: number; rating: string } | null;
  ttfb: { p75: number; rating: string } | null;
  available: boolean;
}

export async function getCrUXData(url: string): Promise<CrUXData> {
  const empty: CrUXData = { lcp: null, fid: null, cls: null, inp: null, ttfb: null, available: false };
  try {
    const origin = new URL(url).origin;
    const apiKey = process.env.PAGESPEED_API_KEY || process.env.CRUX_API_KEY;
    if (!apiKey) return empty;

    const res = await fetch(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return empty;
    const data = await res.json();
    const metrics = data.record?.metrics;
    if (!metrics) return empty;

    const extract = (key: string) => {
      const m = metrics[key];
      if (!m) return null;
      const p75 = m.percentiles?.p75 || 0;
      const good = m.histogram?.[0]?.density || 0;
      return { p75, rating: good > 0.75 ? 'good' : good > 0.5 ? 'needs-improvement' : 'poor' };
    };

    return {
      lcp: extract('largest_contentful_paint'),
      fid: extract('first_input_delay'),
      cls: extract('cumulative_layout_shift'),
      inp: extract('interaction_to_next_paint'),
      ttfb: extract('experimental_time_to_first_byte'),
      available: true,
    };
  } catch { return empty; }
}

export async function getPageSpeedData(url: string): Promise<PageSpeedResult> {
  const apiKey = process.env.PAGESPEED_API_KEY;

  // PageSpeed API is optional — if no key, skip
  if (!apiKey) return EMPTY_RESULT;

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&category=performance&strategy=mobile`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return EMPTY_RESULT;

    const data = await response.json();
    const lhr = data.lighthouseResult;

    if (!lhr) return EMPTY_RESULT;

    return {
      performanceScore: Math.round((lhr.categories?.performance?.score || 0) * 100),
      fcp: lhr.audits?.['first-contentful-paint']?.numericValue || 0,
      lcp: lhr.audits?.['largest-contentful-paint']?.numericValue || 0,
      cls: lhr.audits?.['cumulative-layout-shift']?.numericValue || 0,
      tbt: lhr.audits?.['total-blocking-time']?.numericValue || 0,
      si: lhr.audits?.['speed-index']?.numericValue || 0,
      tti: lhr.audits?.['interactive']?.numericValue || 0,
      available: true,
    };
  } catch {
    return EMPTY_RESULT;
  }
}
