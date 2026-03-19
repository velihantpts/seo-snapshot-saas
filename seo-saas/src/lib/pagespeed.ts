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
