import { calculateScore } from '../src/lib/analyzer/scoring';

function makeInput(overrides: Partial<Parameters<typeof calculateScore>[0]> = {}) {
  return {
    titleLen: 55, descLen: 150, h1Count: 1, canonical: 'https://example.com',
    lang: 'en', isHttps: true, viewportMeta: 'width=device-width', robotsExists: true,
    sitemapExists: true, redirectChainLen: 0, hasDoctype: true, fetchTime: 500,
    renderBlocking: 1, notLazy: 0, inlineScriptKB: 10, hstsHeader: 'max-age=31536000',
    cspHeader: "default-src 'self'", headers: { 'x-frame-options': 'DENY', 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin' },
    mixedContentCount: 0, noSriCount: 0, setCookieHeader: null, wordCount: 1200,
    readScore: 70, kwInTitle: true, kwInH1: true, ogCount: 4, schemas: [{ type: 'Organization', valid: true }],
    twCard: 'summary_large_image', noLabel: 0, altRatio: 1, skippedH: 0,
    isNoindex: false, brokenLinksCount: 0, badFontDisplay: 0, urlPath: '/about',
    textToHtmlRatio: 30, titlePixelWidth: 450, titleTags: 1, descTags: 1,
    hasCompression: true, hasCacheControl: true, noopenerMissing: 0,
    kwInUrl: true, kwInDesc: true, eeatScore: 5, spamLinks: 0,
    totalRequests: 30, estimatedPageWeight: 800, isEnglish: true, headingCount: 6,
    ...overrides,
  };
}

describe('Scoring Engine', () => {
  test('perfect site scores 85+', () => {
    const { score } = calculateScore(makeInput(), []);
    expect(score).toBeGreaterThanOrEqual(85);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('missing title drops score significantly', () => {
    const perfect = calculateScore(makeInput(), []);
    const noTitle = calculateScore(makeInput({ titleLen: 0 }), []);
    expect(perfect.score - noTitle.score).toBeGreaterThanOrEqual(5);
  });

  test('missing meta description drops score', () => {
    const perfect = calculateScore(makeInput(), []);
    const noDesc = calculateScore(makeInput({ descLen: 0 }), []);
    expect(perfect.score - noDesc.score).toBeGreaterThanOrEqual(5);
  });

  test('no HTTPS drops score heavily', () => {
    const perfect = calculateScore(makeInput(), []);
    const noHttps = calculateScore(makeInput({ isHttps: false }), []);
    expect(perfect.score - noHttps.score).toBeGreaterThanOrEqual(4);
  });

  test('noindex applies 10pt penalty', () => {
    const normal = calculateScore(makeInput(), []);
    const noindex = calculateScore(makeInput({ isNoindex: true }), []);
    expect(normal.score - noindex.score).toBe(10);
  });

  test('broken links capped at 10pt penalty', () => {
    const clean = calculateScore(makeInput(), []);
    const broken5 = calculateScore(makeInput({ brokenLinksCount: 5 }), []);
    const broken50 = calculateScore(makeInput({ brokenLinksCount: 50 }), []);
    expect(clean.score - broken5.score).toBe(10);
    expect(clean.score - broken50.score).toBe(10); // capped
  });

  test('spam links apply 5pt penalty', () => {
    const clean = calculateScore(makeInput(), []);
    const spam = calculateScore(makeInput({ spamLinks: 3 }), []);
    expect(clean.score - spam.score).toBe(5);
  });

  test('score never below 0 or above 100', () => {
    const worst = calculateScore(makeInput({
      titleLen: 0, descLen: 0, h1Count: 0, canonical: '', lang: '',
      isHttps: false, viewportMeta: '', robotsExists: false, sitemapExists: false,
      redirectChainLen: 5, hasDoctype: false, fetchTime: 10000, renderBlocking: 20,
      notLazy: 20, inlineScriptKB: 200, hstsHeader: null, cspHeader: '',
      headers: {}, mixedContentCount: 10, noSriCount: 10, wordCount: 10,
      readScore: 0, kwInTitle: false, kwInH1: false, ogCount: 0, schemas: [],
      twCard: '', noLabel: 10, altRatio: 0, skippedH: 5, isNoindex: true,
      brokenLinksCount: 50, badFontDisplay: 5, urlPath: '/A'.repeat(120),
      textToHtmlRatio: 2, titlePixelWidth: 700, titleTags: 3, descTags: 3,
      hasCompression: false, hasCacheControl: false, noopenerMissing: 5,
      spamLinks: 10, totalRequests: 200, estimatedPageWeight: 10000,
    }), []);
    expect(worst.score).toBeGreaterThanOrEqual(0);
    expect(worst.score).toBeLessThanOrEqual(100);
  });

  test('category scores are percentages 0-100', () => {
    const { categoryScores } = calculateScore(makeInput(), []);
    for (const [, value] of Object.entries(categoryScores)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });

  test('slow response time reduces performance score', () => {
    const fast = calculateScore(makeInput({ fetchTime: 300 }), []);
    const slow = calculateScore(makeInput({ fetchTime: 5000 }), []);
    expect(fast.categoryScores.performance).toBeGreaterThan(slow.categoryScores.performance);
  });

  test('non-English content gets neutral readability', () => {
    const en = calculateScore(makeInput({ isEnglish: true, readScore: 70 }), []);
    const nonEn = calculateScore(makeInput({ isEnglish: false, readScore: 0 }), []);
    // Non-English should get neutral score (55), not 0
    expect(nonEn.score).toBeGreaterThan(
      calculateScore(makeInput({ isEnglish: true, readScore: 0 }), []).score
    );
  });

  test('issues get impact scores assigned', () => {
    const issues = [
      { severity: 'critical', problem: 'Title tag is missing', fix: 'Add title' },
      { severity: 'warning', problem: 'No HSTS header', fix: 'Add HSTS' },
    ];
    calculateScore(makeInput(), issues);
    expect(issues[0].impact).toBe(15); // title = 15
    expect(issues[1].impact).toBe(3); // HSTS = 3
  });

  test('issues get categories assigned', () => {
    const issues = [
      { severity: 'critical', problem: 'Title tag is missing', fix: 'Add title' },
      { severity: 'warning', problem: 'render-blocking scripts found', fix: 'Defer' },
      { severity: 'warning', problem: 'No HSTS header', fix: 'Add HSTS' },
    ];
    calculateScore(makeInput(), issues);
    expect(issues.find(i => i.problem.includes('Title'))?.category).toBe('Meta');
    expect(issues.find(i => i.problem.includes('render-blocking'))?.category).toBe('Performance');
    expect(issues.find(i => i.problem.includes('HSTS'))?.category).toBe('Security');
  });

  test('potentialScore >= score', () => {
    const issues = [
      { severity: 'critical', problem: 'Title tag is missing', fix: 'Add title' },
    ];
    const { score, potentialScore } = calculateScore(makeInput({ titleLen: 0 }), issues);
    expect(potentialScore).toBeGreaterThanOrEqual(score);
  });
});
