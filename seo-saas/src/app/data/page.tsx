import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { getBenchmarkReport } from '@/lib/benchmark';

const SITE = 'https://seosnapshot.dev';

// Reads the DB (via a 6h cache). Revalidate hourly so new benchmark rows show up
// without a rebuild, but we never full-scan on every hit.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'The State of SEO: What We Found Across Thousands of Real Sites',
  description:
    'We ran a full on-page SEO audit on thousands of real websites. Average scores, the weakest categories, security grades, and where most sites lose points. Real data, updated automatically.',
  alternates: { canonical: `${SITE}/data` },
  openGraph: {
    title: 'The State of SEO — real data from thousands of audited sites',
    description:
      'Average SEO score, weakest categories, and security grades across thousands of real websites we audited.',
    url: `${SITE}/data`,
    type: 'article',
  },
};

// Display metadata per category. Order on the page is by score (weakest first),
// so this is just labels + an optional "fix it" link to a relevant free tool.
const CATEGORY_META: Record<string, { label: string; note: string; href?: string; cta?: string }> = {
  social: { label: 'Social sharing', note: 'Open Graph & Twitter cards', href: '/tools/open-graph-preview', cta: 'Open Graph preview' },
  content: { label: 'Content', note: 'depth, headings, keyword focus', href: '/checks', cta: 'Content checks' },
  meta: { label: 'Meta tags', note: 'title & meta description', href: '/tools/meta-tag-generator', cta: 'Meta tag generator' },
  security: { label: 'Security headers', note: 'CSP, HSTS, X-Frame-Options', href: '/checks', cta: 'Security checks' },
  accessibility: { label: 'Accessibility', note: 'alt text, labels, contrast', href: '/checks', cta: 'Accessibility checks' },
  performance: { label: 'Performance', note: 'server response, page weight', href: '/checks', cta: 'Performance checks' },
  technical: { label: 'Technical', note: 'crawlability, sitemap, canonicals', href: '/tools/sitemap-generator', cta: 'Sitemap generator' },
};

const GRADE_ORDER = ['A+', 'A', 'B', 'C', 'D', 'F'];
const GRADE_COLOR: Record<string, string> = {
  'A+': 'bg-emerald-400',
  A: 'bg-emerald-400/80',
  B: 'bg-lime-400/80',
  C: 'bg-amber-400/80',
  D: 'bg-orange-400/80',
  F: 'bg-red-400/80',
};

function barColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400/80';
  if (score >= 60) return 'bg-lime-400/70';
  if (score >= 45) return 'bg-amber-400/80';
  return 'bg-red-400/70';
}

export default async function DataReportPage() {
  const report = await getBenchmarkReport();

  // Graceful fallback if the dataset ever comes back empty.
  if (!report) {
    return (
      <div className="min-h-screen bg-surface relative">
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-white/90">The State of SEO</h1>
          <p className="text-white/55 mt-4">The benchmark report is being generated. Check back shortly.</p>
          <Link href="/" className="btn-primary text-sm mt-6 inline-block">Analyze your site</Link>
        </div>
      </div>
    );
  }

  const { count, avgScore, avgTtfb, categoryAverages, gradeDistribution, buckets } = report;
  const countLabel = count.toLocaleString('en-US');

  // Sort categories weakest → strongest to lead with the story.
  const cats = Object.entries(categoryAverages)
    .filter(([k]) => CATEGORY_META[k])
    .sort((a, b) => a[1] - b[1]);

  // Share of sites scoring under 60 (the "needs work" line).
  const under60 = buckets.slice(0, 6).reduce((s, b) => s + b.count, 0);
  const under60Pct = Math.round((under60 / count) * 100);

  const maxBucket = Math.max(...buckets.map((b) => b.count), 1);
  const grades = GRADE_ORDER.filter((g) => gradeDistribution[g]).map((g) => ({ g, n: gradeDistribution[g] }));
  const maxGrade = Math.max(...grades.map((x) => x.n), 1);

  const weakest = cats[0] ? CATEGORY_META[cats[0][0]].label.toLowerCase() : 'social sharing';

  const datasetLd = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `On-page SEO benchmark across ${countLabel} websites`,
    description: `Aggregate on-page SEO scores from ${countLabel} real websites analyzed by SEO Snapshot: average score ${avgScore}/100, category averages, and security-header grade distribution.`,
    url: `${SITE}/data`,
    creator: { '@type': 'Organization', name: 'SEO Snapshot', url: SITE },
    variableMeasured: ['SEO score', 'Time to first byte', 'Security header grade', ...cats.map(([k]) => CATEGORY_META[k].label)],
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'SEO Data', item: `${SITE}/data` }],
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-[11px] font-medium mb-5">
            <BarChart3 className="w-3 h-3" /> Real data · {countLabel} sites
          </div>
          <h1 className="text-3xl sm:text-[2.5rem] font-semibold tracking-tight leading-[1.08] text-balance">
            The state of on-page SEO, across <span className="gradient-text">{countLabel} real sites</span>
          </h1>
          <p className="text-white/55 text-[15px] mt-4 leading-relaxed">
            We ran the same on-page audit our{' '}
            <Link href="/" className="text-accent-400 hover:text-accent-300">free analyzer</Link> runs on any URL against{' '}
            {countLabel} live websites, then aggregated the results. No survey, no estimates. These are the actual numbers,
            and they update as the dataset grows.
          </p>
        </div>

        {/* Headline stats */}
        <div className="grid grid-cols-3 gap-3 mb-14">
          <div className="glass-card rounded-xl p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-semibold text-white/90 tabular-nums">{avgScore}</div>
            <div className="text-[11px] sm:text-xs text-white/45 mt-1">Average score / 100</div>
          </div>
          <div className="glass-card rounded-xl p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-semibold text-white/90 tabular-nums">{under60Pct}%</div>
            <div className="text-[11px] sm:text-xs text-white/45 mt-1">Score below 60</div>
          </div>
          <div className="glass-card rounded-xl p-4 sm:p-5">
            <div className="text-2xl sm:text-3xl font-semibold text-white/90 tabular-nums">{avgTtfb ? `${avgTtfb}` : '—'}<span className="text-base font-normal text-white/40">{avgTtfb ? 'ms' : ''}</span></div>
            <div className="text-[11px] sm:text-xs text-white/45 mt-1">Avg. server response</div>
          </div>
        </div>

        {/* Category averages — the story */}
        <section className="mb-14">
          <h2 className="text-sm font-medium text-accent-400 uppercase tracking-wide mb-2">Where sites lose points</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Averaged by category, the pattern is consistent: sites handle the technical basics but neglect {weakest},
            content, and meta tags — the things that shape how they look in search and when shared.
          </p>
          <div className="space-y-4">
            {cats.map(([key, val]) => {
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
                  {meta.href && (
                    <div className="mt-1.5">
                      <Link href={meta.href} className="text-xs text-accent-400/80 hover:text-accent-300 transition">
                        Fix it → {meta.cta}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Score distribution */}
        <section className="mb-14">
          <h2 className="text-sm font-medium text-accent-400 uppercase tracking-wide mb-6">How scores are distributed</h2>
          <div className="glass-card rounded-xl p-5 sm:p-6">
            <div className="flex items-end justify-between gap-1.5 h-40">
              {buckets.map((b) => (
                <div key={b.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                  <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                    <div
                      className={`w-full rounded-t ${barColor((parseInt(b.label) || 0) + 5)}`}
                      style={{ height: `${Math.max(2, (b.count / maxBucket) * 100)}%` }}
                      title={`${b.count.toLocaleString('en-US')} sites`}
                    />
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-white/35 tabular-nums whitespace-nowrap">{b.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40 mt-4">Score range (0–100). Each bar is the number of sites in that band.</p>
          </div>
        </section>

        {/* Security grades */}
        {grades.length > 0 && (
          <section className="mb-14">
            <h2 className="text-sm font-medium text-accent-400 uppercase tracking-wide mb-6">Security header grades</h2>
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
            <p className="text-xs text-white/40 mt-3">
              Grade reflects response headers like Content-Security-Policy, HSTS, and X-Frame-Options. Most sites sit around C.
            </p>
          </section>
        )}

        {/* Takeaway + CTA */}
        <section className="glass-card rounded-xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-white/90 mb-2">Where does your site land?</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-5">
            The average is {avgScore}. If you have never checked, there is a good chance you are losing easy points on
            social cards, meta tags, or security headers, same as most of the {countLabel} sites here. The scan is free
            and takes a few seconds.
          </p>
          <Link href="/" className="btn-primary text-sm">Analyze your site free</Link>
        </section>

        <p className="text-[11px] text-white/30 mt-8 leading-relaxed">
          Methodology: each site was analyzed once with our on-page engine (the same one behind the public analyzer),
          scored 0–100 across seven categories, and stored anonymously. Figures update automatically as the dataset grows.
        </p>
      </div>
    </div>
  );
}
