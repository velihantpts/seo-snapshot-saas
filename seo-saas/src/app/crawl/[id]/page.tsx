'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, AlertTriangle, Layers, Link2, GitBranch, FileWarning } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';

interface Insights {
  pagesScanned: number;
  capped: boolean;
  maxDepthReached: number;
  depthHistogram: { depth: number; count: number }[];
  deepPages: { url: string; depth: number }[];
  orphanPages: string[];
  brokenInternalLinks: { url: string; status: number; linkedFrom: string }[];
  paramUrlCount: number;
  totalInternalLinks: number;
  sitemapCount: number;
  topLinkedPages: { url: string; inlinks: number }[];
}

interface CrawlData {
  id: string; domain: string; status: string; totalUrls: number; completedUrls: number;
  insights: Insights | null;
  analyses: { id: string; url: string; score: number }[];
  siteHealth: { avgScore: number | null; crossPageIssues: { problem: string; count: number }[] };
}

const short = (u: string) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');

export default function CrawlPage() {
  const params = useParams();
  const [crawl, setCrawl] = useState<CrawlData | null>(null);
  const [error, setError] = useState('');
  const timer = useRef<any>(null);

  useEffect(() => {
    const load = () => fetch(`/api/crawl/${params.id}`).then(r => r.json()).then(data => {
      if (data.error) { setError(data.error); return; }
      setCrawl(data);
      if (data.status === 'running' && !timer.current) {
        timer.current = setInterval(load, 3000);
      }
      if (data.status !== 'running' && timer.current) {
        clearInterval(timer.current); timer.current = null;
      }
    }).catch(() => setError('Failed to load crawl job'));
    load();
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [params.id]);

  if (error) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center"><p className="text-white/50 mb-4">{error}</p>
        <Link href="/dashboard" className="btn-primary text-sm">Go to Dashboard</Link></div>
    </div>
  );
  if (!crawl) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ins = crawl.insights;
  const avg = crawl.siteHealth?.avgScore || 0;
  const avgColor = avg >= 75 ? 'text-emerald-400' : avg >= 50 ? 'text-amber-400' : 'text-red-400';
  const maxDepthCount = ins ? Math.max(...ins.depthHistogram.map(d => d.count), 1) : 1;

  return (
    <div className="min-h-screen bg-surface relative">
      <ScrollProgress />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-40 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center"><Globe className="w-6 h-6 text-accent-400" /></div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">{crawl.domain}</h1>
            <p className="text-white/40 text-sm">Deep site crawl · follows internal links</p>
          </div>
          {avg > 0 && <div className={`ml-auto text-3xl font-bold ${avgColor}`}>{avg}<span className="text-lg text-white/30">/100</span></div>}
        </div>

        {crawl.status === 'running' && (
          <div className="glass-card rounded-xl p-6 mb-8 flex items-center gap-4">
            <div className="w-6 h-6 border-2 border-accent-400/40 border-t-accent-400 rounded-full animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm text-white/70">Crawling the site — following internal links like Googlebot…</p>
              <p className="text-xs text-white/35 mt-1">This walks up to 250 pages to map structure (orphans, click-depth, broken links). Refreshes automatically.</p>
            </div>
          </div>
        )}
        {crawl.status === 'failed' && (
          <div className="glass-card rounded-xl p-5 mb-8 text-sm text-red-400">Crawl failed. Try again from the dashboard.</div>
        )}

        {ins && (
          <>
            {/* Structural summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-8">
              {[
                { label: 'Pages crawled', value: ins.pagesScanned, icon: Globe },
                { label: 'Max click-depth', value: ins.maxDepthReached, icon: Layers },
                { label: 'Orphan pages', value: ins.orphanPages.length, icon: FileWarning, warn: ins.orphanPages.length > 0 },
                { label: 'Broken links', value: ins.brokenInternalLinks.length, icon: AlertTriangle, warn: ins.brokenInternalLinks.length > 0 },
                { label: 'Deep pages (4+)', value: ins.deepPages.length, icon: GitBranch, warn: ins.deepPages.length > 0 },
                { label: 'Param URLs', value: ins.paramUrlCount, icon: Link2, warn: ins.paramUrlCount > 20 },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-xl p-4 text-center">
                  <div className={`text-2xl font-semibold ${s.warn ? 'text-amber-400' : 'text-white/85'}`}>{s.value}</div>
                  <div className="text-[10px] text-white/40 mt-1 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>

            {ins.capped && <p className="text-xs text-white/30 mb-6">Crawl capped at 250 pages — larger sites are sampled from the homepage outward. Orphan/broken counts reflect the crawled portion.</p>}

            {/* Click-depth distribution */}
            <div className="glass-card rounded-xl p-5 mb-6">
              <h2 className="text-sm font-medium text-white/80 mb-1 flex items-center gap-2"><Layers className="w-4 h-4 text-accent-400" /> Click-depth distribution</h2>
              <p className="text-xs text-white/30 mb-4">How many clicks from the homepage each page is. Pages 4+ deep are crawled rarely by Google.</p>
              <div className="space-y-1.5">
                {ins.depthHistogram.map(d => (
                  <div key={d.depth} className="flex items-center gap-3 text-xs">
                    <span className="w-16 text-white/40">Depth {d.depth}</span>
                    <div className="flex-1 h-4 bg-white/[0.03] rounded overflow-hidden">
                      <div className={`h-full rounded ${d.depth >= 4 ? 'bg-amber-400/70' : 'bg-accent-400/70'}`} style={{ width: `${(d.count / maxDepthCount) * 100}%`, minWidth: d.count ? '6px' : 0 }} />
                    </div>
                    <span className="w-8 text-right text-white/50 font-mono">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Orphans */}
            {ins.orphanPages.length > 0 && (
              <div className="glass-card rounded-xl p-5 mb-6">
                <h2 className="text-sm font-medium text-white/80 mb-1 flex items-center gap-2"><FileWarning className="w-4 h-4 text-amber-400" /> Orphan pages ({ins.orphanPages.length})</h2>
                <p className="text-xs text-white/30 mb-4">In your sitemap but no internal link points to them — Google may struggle to find/rank these. Add links from relevant pages.</p>
                <div className="space-y-1 max-h-64 overflow-auto">
                  {ins.orphanPages.map(u => <p key={u} className="text-xs text-white/55 font-mono truncate">{short(u)}</p>)}
                </div>
              </div>
            )}

            {/* Broken internal links */}
            {ins.brokenInternalLinks.length > 0 && (
              <div className="glass-card rounded-xl p-5 mb-6">
                <h2 className="text-sm font-medium text-white/80 mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400" /> Broken internal links ({ins.brokenInternalLinks.length})</h2>
                <p className="text-xs text-white/30 mb-4">Internal links that return an error — they waste crawl budget and hurt UX.</p>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {ins.brokenInternalLinks.map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-red-400/80 bg-red-500/10 px-1.5 py-0.5 rounded flex-shrink-0">{b.status || 'ERR'}</span>
                      <span className="text-white/55 font-mono truncate">{short(b.url)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top linked pages */}
            {ins.topLinkedPages.length > 0 && (
              <div className="glass-card rounded-xl p-5 mb-6">
                <h2 className="text-sm font-medium text-white/80 mb-1 flex items-center gap-2"><Link2 className="w-4 h-4 text-accent-400" /> Most internally-linked pages</h2>
                <p className="text-xs text-white/30 mb-4">Where your internal link equity flows. These pages get the most authority.</p>
                <div className="space-y-1.5">
                  {ins.topLinkedPages.map(p => (
                    <div key={p.url} className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-white/55 font-mono truncate">{short(p.url)}</span>
                      <span className="text-white/40 font-mono flex-shrink-0">{p.inlinks} links</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Sample page scores */}
        {crawl.analyses.length > 0 && (
          <div className="glass-card rounded-xl p-5 mb-6">
            <h2 className="text-sm font-medium text-white/80 mb-4">Sampled page scores</h2>
            <div className="space-y-2">
              {crawl.analyses.map(a => (
                <Link key={a.id} href={`/analyze/${a.id}`} className="flex items-center gap-3 text-sm hover:bg-white/[0.02] rounded-lg px-2 py-1.5 transition">
                  <span className={`font-mono font-bold ${a.score >= 75 ? 'text-emerald-400' : a.score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{a.score}</span>
                  <span className="text-white/55 font-mono truncate">{short(a.url)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Cross-page issues */}
        {crawl.siteHealth?.crossPageIssues?.length > 0 && (
          <div className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-accent-400" /> Issues across sampled pages</h2>
            <div className="space-y-2">
              {crawl.siteHealth.crossPageIssues.map((issue, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-1.5 border-b border-white/[0.04] last:border-0 text-sm">
                  <span className="text-white/65 truncate">{issue.problem}</span>
                  <span className="text-xs font-mono text-amber-400/80 flex-shrink-0">{issue.count}×</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
