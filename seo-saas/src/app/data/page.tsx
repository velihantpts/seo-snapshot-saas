import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, ArrowRight } from 'lucide-react';
import { getBenchmarkReport } from '@/lib/benchmark';

const SITE = 'https://seosnapshot.dev';

// Render on-demand, NOT at build time: this page reads the benchmark table and
// the DB isn't reachable during the Docker build (dummy DATABASE_URL), which
// would fail the static export. getBenchmarkReport() caches the aggregate for
// 6h, so the per-request cost is just the render, not a full table scan.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The State of On-Page SEO: What 4,000+ Real Sites Get Wrong',
  description:
    'A full on-page SEO audit of thousands of real websites: the average score, most-neglected areas, security grades, and where sites lose points.',
  alternates: { canonical: `${SITE}/data` },
  openGraph: {
    title: 'The State of On-Page SEO — real data from thousands of audited sites',
    description:
      'Average score, weakest categories, security grades and server speed across thousands of real websites we audited.',
    url: `${SITE}/data`,
    type: 'article',
  },
};

// Labels + a one-line "what it means" + a link to the free fix for each category.
const CATEGORY_META: Record<string, { label: string; note: string; why: string; href: string; cta: string }> = {
  social: {
    label: 'Social sharing', note: 'Open Graph & Twitter cards',
    why: 'With no Open Graph tags, a link shared to Slack, X, LinkedIn or iMessage shows up as a bare URL with no image or title. It looks broken, and broken-looking links get a fraction of the clicks.',
    href: '/tools/open-graph-preview', cta: 'Open Graph preview',
  },
  content: {
    label: 'Content', note: 'depth, headings, keyword focus',
    why: 'Thin pages, missing or duplicate H1s, no clear topic focus. Google has no shortage of pages to rank, and shallow content rarely takes the spot.',
    href: '/blog/content-depth-seo-guide', cta: 'Content depth guide',
  },
  meta: {
    label: 'Meta tags', note: 'title & meta description',
    why: 'Missing or duplicate titles and descriptions. This is the text people actually read in the results. Leave it blank and Google grabs a random sentence off the page.',
    href: '/tools/meta-tag-generator', cta: 'Meta tag generator',
  },
  accessibility: {
    label: 'Accessibility', note: 'alt text, labels, contrast',
    why: 'Images with no alt text, inputs with no labels. It shuts out real users and quietly costs you Google Images traffic.',
    href: '/blog/website-accessibility-seo-checklist', cta: 'Accessibility checklist',
  },
  performance: {
    label: 'Performance', note: 'server response, page weight',
    why: 'Slow first byte and heavy pages. Speed is a ranking signal and the very first thing a visitor feels, before they read a word.',
    href: '/blog/website-speed-optimization-guide', cta: 'Speed guide',
  },
  security: {
    label: 'Security headers', note: 'CSP, HSTS, X-Frame-Options',
    why: 'A few one-line headers block whole classes of attack. Most sites set none of them.',
    href: '/tools/security-header-checker', cta: 'Security header checker',
  },
  technical: {
    label: 'Technical', note: 'crawlability, sitemap, canonicals',
    why: 'HTTPS, a mobile viewport, a sitemap. This is the one area most sites actually get right.',
    href: '/tools/sitemap-generator', cta: 'Sitemap generator',
  },
};

const GRADE_ORDER = ['A+', 'A', 'B', 'C', 'D', 'F'];
const GRADE_COLOR: Record<string, string> = {
  'A+': 'bg-emerald-400', A: 'bg-emerald-400/80', B: 'bg-lime-400/80',
  C: 'bg-amber-400/80', D: 'bg-orange-400/80', F: 'bg-red-400/80',
};

function barColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400/80';
  if (score >= 60) return 'bg-lime-400/70';
  if (score >= 45) return 'bg-amber-400/80';
  return 'bg-red-400/70';
}

function Finding({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-xs text-accent-400/90 pt-1">{n}</span>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white/95 font-[family-name:var(--font-display)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default async function DataReportPage() {
  const report = await getBenchmarkReport();

  if (!report) {
    return (
      <div className="min-h-screen bg-surface relative">
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-white/90">The State of On-Page SEO</h1>
          <p className="text-white/55 mt-4">The benchmark report is being generated. Check back shortly.</p>
          <Link href="/" className="btn-primary text-sm mt-6 inline-block">Analyze your site</Link>
        </div>
      </div>
    );
  }

  const { count, avgScore, avgTtfb, categoryAverages, gradeDistribution, buckets } = report;
  const countLabel = count.toLocaleString('en-US');

  // Weakest -> strongest to lead with the story.
  const cats = Object.entries(categoryAverages).filter(([k]) => CATEGORY_META[k]).sort((a, b) => a[1] - b[1]);
  const weak = cats[0], strong = cats[cats.length - 1];
  const weakLabel = weak ? CATEGORY_META[weak[0]].label : 'social sharing';
  const strongLabel = strong ? CATEGORY_META[strong[0]].label : 'technical';

  const under60 = buckets.slice(0, 6).reduce((s, b) => s + b.count, 0);
  const under60Pct = Math.round((under60 / count) * 100);
  const greatPct = Math.round((((buckets[8]?.count || 0) + (buckets[9]?.count || 0)) / count) * 100);

  const maxBucket = Math.max(...buckets.map((b) => b.count), 1);
  const grades = GRADE_ORDER.filter((g) => gradeDistribution[g]).map((g) => ({ g, n: gradeDistribution[g] }));
  const maxGrade = Math.max(...grades.map((x) => x.n), 1);
  const topGrade = grades.slice().sort((a, b) => b.n - a.n)[0];
  const ttfbGood = avgTtfb != null && avgTtfb < 800;

  const datasetLd = {
    '@context': 'https://schema.org', '@type': 'Dataset',
    name: `On-page SEO benchmark across ${countLabel} websites`,
    description: `Aggregate on-page SEO scores from ${countLabel} real websites analyzed by SEO Snapshot: average score ${avgScore}/100, category averages, server response, and security-header grade distribution.`,
    url: `${SITE}/data`,
    creator: { '@type': 'Organization', name: 'SEO Snapshot', url: SITE },
    variableMeasured: ['SEO score', 'Time to first byte', 'Security header grade', ...cats.map(([k]) => CATEGORY_META[k].label)],
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'SEO Data', item: `${SITE}/data` }],
  };

  const findings = [
    `The average site scores ${avgScore} out of 100, and ${under60Pct}% would fail a basic on-page audit.`,
    `The most neglected area is ${weakLabel.toLowerCase()} (${weak ? weak[1] : ''}/100). Most sites simply don't set it up.`,
    `The technical basics are mostly handled (${strongLabel.toLowerCase()}, ${strong ? strong[1] : ''}/100), so the gap is in the things that shape how a site looks in search and when shared.`,
    `Only ${greatPct}% of sites score 80 or higher. The rest are losing easy, fixable points.`,
  ];

  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

        {/* Hero */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-[11px] font-medium mb-5">
            <BarChart3 className="w-3 h-3" /> Real data · {countLabel} sites · updates automatically
          </div>
          <h1 className="text-3xl sm:text-[2.75rem] font-semibold tracking-tight leading-[1.05] text-balance">
            The state of on-page SEO, across <span className="gradient-text">{countLabel} real sites</span>
          </h1>
          <p className="text-white/55 text-[15px] sm:text-base mt-5 leading-relaxed">
            We ran the same on-page audit our <Link href="/" className="text-accent-400 hover:text-accent-300">free analyzer</Link> runs on any URL against {countLabel} live websites and aggregated the results. No survey, no estimates. These are the actual numbers, and they update as the dataset grows.
          </p>
        </header>

        {/* Key findings */}
        <div className="glass-card rounded-2xl p-6 sm:p-7 mb-14 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.07] to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-wider text-accent-300/90 mb-4">The short version</div>
            <ul className="space-y-3">
              {findings.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] text-white/75 leading-relaxed">
                  <span className="text-accent-400 mt-1.5 flex-shrink-0"><ArrowRight className="w-3.5 h-3.5" /></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Headline stats */}
        <div className="grid grid-cols-3 gap-3 mb-16">
          {[
            { v: `${avgScore}`, sub: 'Average score / 100', ctx: 'out of a possible 100' },
            { v: `${under60Pct}%`, sub: 'Would fail an audit', ctx: 'scored below 60' },
            { v: avgTtfb ? `${avgTtfb}` : '—', unit: avgTtfb ? 'ms' : '', sub: 'Avg. server response', ctx: ttfbGood ? 'under Google’s 800ms target' : 'near Google’s 800ms limit' },
          ].map((s) => (
            <div key={s.sub} className="glass-card rounded-xl p-4 sm:p-5">
              <div className="text-2xl sm:text-[2rem] font-semibold text-white/90 tabular-nums leading-none font-[family-name:var(--font-display)]">{s.v}<span className="text-base font-normal text-white/40">{s.unit || ''}</span></div>
              <div className="text-[11px] sm:text-xs text-white/55 mt-2">{s.sub}</div>
              <div className="text-[10px] text-white/35 mt-0.5 hidden sm:block">{s.ctx}</div>
            </div>
          ))}
        </div>

        {/* Finding 01 — categories */}
        <Finding n="01" title="Where sites lose points">
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Averaged across all {countLabel} sites, the pattern barely changes: the technical baseline is handled, but the things that decide how a page looks in search and when it&apos;s shared are neglected. Weakest first.
          </p>

          {weak && (
            <div className="glass-card rounded-xl p-5 mb-6 border border-red-500/15 bg-red-500/[0.03]">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11px] uppercase tracking-wider text-red-400/80">Most neglected</span>
                <span className="text-2xl font-semibold text-white/90 tabular-nums font-[family-name:var(--font-display)]">{weak[1]}<span className="text-sm text-white/40">/100</span></span>
              </div>
              <div className="text-base font-medium text-white/90 mt-1">{CATEGORY_META[weak[0]].label}</div>
              <p className="text-[13px] text-white/55 leading-relaxed mt-2">{CATEGORY_META[weak[0]].why}</p>
              <Link href={CATEGORY_META[weak[0]].href} className="inline-flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 mt-3">Fix it with the {CATEGORY_META[weak[0]].cta} <ArrowRight className="w-3 h-3" /></Link>
            </div>
          )}

          <div className="space-y-4">
            {cats.map(([key, val], i) => {
              const meta = CATEGORY_META[key];
              return (
                <div key={key}>
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-sm font-medium text-white/85">{meta.label}</span>
                      <span className="text-xs text-white/40 truncate hidden sm:inline">{meta.note}</span>
                    </div>
                    <span className="text-sm tabular-nums text-white/70 flex-shrink-0">{val}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className={`h-full rounded-full ${barColor(val)}`} style={{ width: `${val}%` }} />
                  </div>
                  {/* Interpretation only for the two weakest, to keep it a report not a wall of text */}
                  {i > 0 && i <= 2 && (
                    <p className="text-[12.5px] text-white/45 leading-relaxed mt-2">
                      {meta.why} <Link href={meta.href} className="text-accent-400/80 hover:text-accent-300">{meta.cta} →</Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Finding>

        {/* Finding 02 — distribution */}
        <Finding n="02" title="Most sites are stuck in the middle">
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Scores cluster in the 50s and 60s. Only {greatPct}% of sites cracked 80, and the long tail below 60 is where the easy wins are hiding.
          </p>
          <div className="glass-card rounded-xl p-5 sm:p-6">
            <div className="flex items-end justify-between gap-1.5 h-40">
              {buckets.map((b) => (
                <div key={b.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                  <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                    <div className={`w-full rounded-t ${barColor((parseInt(b.label) || 0) + 5)}`} style={{ height: `${Math.max(2, (b.count / maxBucket) * 100)}%` }} title={`${b.count.toLocaleString('en-US')} sites`} />
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-white/35 tabular-nums whitespace-nowrap">{b.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-4">Score range (0–100). Each bar is the number of sites in that band.</p>
          </div>
        </Finding>

        {/* Finding 03 — security */}
        {grades.length > 0 && (
          <Finding n="03" title="Security headers are an afterthought">
            <p className="text-white/55 text-sm leading-relaxed mb-6">
              {topGrade ? `The most common grade is ${topGrade.g}.` : ''} A handful of one-line response headers (Content-Security-Policy, HSTS, X-Frame-Options) block whole categories of attack, and most sites ship without them.
            </p>
            <div className="glass-card rounded-xl p-5 sm:p-6 space-y-3">
              {grades.map(({ g, n }) => (
                <div key={g} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-medium text-white/70 tabular-nums flex-shrink-0">{g}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className={`h-full rounded-full ${GRADE_COLOR[g] || 'bg-white/30'}`} style={{ width: `${(n / maxGrade) * 100}%` }} />
                  </div>
                  <span className="w-14 text-right text-xs text-white/45 tabular-nums flex-shrink-0">{n.toLocaleString('en-US')}</span>
                </div>
              ))}
            </div>
            <Link href="/tools/security-header-checker" className="inline-flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 mt-3">Grade your own headers <ArrowRight className="w-3 h-3" /></Link>
          </Finding>
        )}

        {/* Takeaway */}
        <section className="glass-card rounded-2xl p-7 sm:p-9 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.09] to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-xl sm:text-2xl font-semibold text-white/95 mb-2 font-[family-name:var(--font-display)]">Where does your site land?</h2>
            <p className="text-white/55 text-sm sm:text-[15px] leading-relaxed mb-5 max-w-xl">
              The average is {avgScore}. If you have never checked, there is a good chance you are leaving easy points on social cards, meta tags, or security headers, the same as most of the {countLabel} sites here. The scan is free, takes a few seconds, and hands you the exact code for each fix.
            </p>
            <Link href="/" className="btn-primary text-sm inline-flex items-center gap-2">Analyze your site free <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>

        {/* Methodology */}
        <div className="mt-10 border-t border-white/[0.06] pt-6">
          <div className="text-[11px] uppercase tracking-wider text-white/40 mb-2">Methodology</div>
          <p className="text-[12.5px] text-white/40 leading-relaxed max-w-2xl">
            Each of the {countLabel} sites was fetched and analyzed once with our on-page engine, the same one behind the public analyzer. Every site is scored 0–100 across seven weighted categories (meta, technical, performance, security, content, social, accessibility), and the server response time and security-header grade are recorded. Results are stored anonymously in aggregate. No third-party data, no estimates. The figures on this page are computed live from that dataset and update automatically as it grows, so numbers may shift slightly over time.
          </p>
        </div>
      </div>
    </div>
  );
}
