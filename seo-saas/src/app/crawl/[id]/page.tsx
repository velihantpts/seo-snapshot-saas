'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, ArrowLeft, Globe } from 'lucide-react';
import { ScrollProgress } from '@/components/ScrollProgress';

interface CrawlData {
  id: string; domain: string; status: string; totalUrls: number;
  completedUrls: number; urls: string[];
  analyses: { id: string; url: string; score: number }[];
  siteHealth: {
    avgScore: number | null; minScore: number | null; maxScore: number | null;
    totalPages: number; analyzedPages: number;
    crossPageIssues: { problem: string; count: number; pages: string[] }[];
  };
}

type UrlStatus = 'pending' | 'running' | 'done' | 'error';

export default function CrawlPage() {
  const params = useParams();
  const [crawl, setCrawl] = useState<CrawlData | null>(null);
  const [urlStatuses, setUrlStatuses] = useState<Map<string, UrlStatus>>(new Map());
  const [urlScores, setUrlScores] = useState<Map<string, number>>(new Map());
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const startedRef = useRef(false);

  // Load crawl job
  useEffect(() => {
    fetch(`/api/crawl/${params.id}`).then(r => r.json()).then(data => {
      if (data.error) { setError(data.error); return; }
      setCrawl(data);

      // If already completed, show results
      if (data.status === 'completed' && data.analyses.length > 0) {
        const statuses = new Map<string, UrlStatus>();
        const scores = new Map<string, number>();
        data.analyses.forEach((a: any) => { statuses.set(a.url, 'done'); scores.set(a.url, a.score); });
        data.urls.forEach((u: string) => { if (!statuses.has(u)) statuses.set(u, 'pending'); });
        setUrlStatuses(statuses);
        setUrlScores(scores);
      }
    }).catch(() => setError('Failed to load crawl job'));
  }, [params.id]);

  // Start crawling URLs sequentially
  useEffect(() => {
    if (!crawl || crawl.status === 'completed' || crawl.analyses.length > 0 || startedRef.current) return;
    startedRef.current = true;
    setRunning(true);

    const urls = crawl.urls;
    const statuses = new Map<string, UrlStatus>();
    urls.forEach(u => statuses.set(u, 'pending'));
    setUrlStatuses(new Map(statuses));

    (async () => {
      let completed = 0;
      let totalScore = 0;

      for (const url of urls) {
        statuses.set(url, 'running');
        setUrlStatuses(new Map(statuses));

        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          });
          const data = await res.json();

          if (res.ok && data.id) {
            // Link analysis to crawl job
            await fetch(`/api/crawl/${params.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ completedUrls: completed + 1 }),
            });

            statuses.set(url, 'done');
            setUrlScores(prev => new Map(prev).set(url, data.score));
            totalScore += data.score;
            completed++;
          } else {
            statuses.set(url, 'error');
          }
        } catch {
          statuses.set(url, 'error');
        }
        setUrlStatuses(new Map(statuses));
      }

      // Mark crawl as completed
      const avg = completed > 0 ? Math.round(totalScore / completed) : 0;
      await fetch(`/api/crawl/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', completedUrls: completed, avgScore: avg }),
      });

      setRunning(false);
      // Reload to get cross-page issues
      const final = await fetch(`/api/crawl/${params.id}`).then(r => r.json());
      setCrawl(final);
    })();
  }, [crawl, params.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">{error}</p>
          <Link href="/dashboard" className="btn-primary text-sm">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (!crawl) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const completedCount = Array.from(urlStatuses.values()).filter(s => s === 'done').length;
  const progress = crawl.totalUrls > 0 ? (completedCount / crawl.totalUrls) * 100 : 0;
  const scores = Array.from(urlScores.values());
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : crawl.siteHealth?.avgScore || 0;
  const avgColor = avgScore >= 75 ? 'text-emerald-400' : avgScore >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="min-h-screen bg-surface relative">
      <ScrollProgress />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="relative z-40 max-w-5xl mx-auto px-4 sm:px-6 pt-4 print:hidden">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition text-sm">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent-500/15 flex items-center justify-center">
            <Globe className="w-6 h-6 text-accent-400" />
          </div>
          <div>
            <h1 className="text-xl font-medium tracking-tight">{crawl.domain}</h1>
            <p className="text-white/40 text-sm">{crawl.totalUrls} pages · Site Crawl</p>
          </div>
          {avgScore > 0 && (
            <div className={`ml-auto text-3xl font-bold ${avgColor}`}>{avgScore}<span className="text-lg text-white/30">/100</span></div>
          )}
        </div>

        {/* Progress */}
        {running && (
          <div className="glass-card rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60">Crawling... {completedCount}/{crawl.totalUrls}</span>
              <span className="text-sm font-mono text-accent-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-600 via-accent-400 to-violet-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* URL list */}
        <div className="space-y-2 mb-8">
          {crawl.urls.map(url => {
            const status = urlStatuses.get(url) || 'pending';
            const score = urlScores.get(url);
            const shortUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

            return (
              <div key={url} className="flex items-center gap-3 p-3 glass-card rounded-xl">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
                  {status === 'done' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  {status === 'running' && <div className="w-4 h-4 border-2 border-accent-400/40 border-t-accent-400 rounded-full animate-spin" />}
                  {status === 'pending' && <Clock className="w-4 h-4 text-white/20" />}
                  {status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                </div>
                <span className="text-sm text-white/60 truncate flex-1 font-mono">{shortUrl}</span>
                {score !== undefined && (
                  <Link href={`/analyze/${crawl.analyses.find(a => a.url === url)?.id || ''}`}
                    className={`text-sm font-mono font-bold ${score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'} hover:underline`}>
                    {score}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Cross-page issues (after crawl completed) */}
        {crawl.siteHealth?.crossPageIssues?.length > 0 && (
          <div className="glass-card rounded-xl p-5">
            <h2 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent-400" /> Site-Wide Issues
            </h2>
            <p className="text-xs text-white/30 mb-4">Issues found across multiple pages</p>
            <div className="space-y-3">
              {crawl.siteHealth.crossPageIssues.map((issue, i) => (
                <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-white/[0.04] last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm text-white/70">{issue.problem}</p>
                    <p className="text-xs text-white/30 mt-0.5">Found on {issue.count} page{issue.count > 1 ? 's' : ''}</p>
                  </div>
                  <span className="text-xs font-mono text-red-400/70 bg-red-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    {issue.count}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
