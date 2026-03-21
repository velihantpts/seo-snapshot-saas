'use client';
import { useState } from 'react';
import { ArrowLeftRight, Loader2, Search } from 'lucide-react';
import { ScoreRing } from '@/components/ScoreRing';

interface CompareResult {
  url: string;
  score: number;
  issues: { severity: string; problem: string }[];
  meta: { title: { text: string; length: number } | null; description: { text: string; length: number } | null };
  security: { grade: string; score: number };
  performance: { responseTime: number; htmlSize: number; totalScripts: number };
  techStack: { name: string; icon: string }[];
  wordCount: number;
  links: { total: number; internal: number; external: number };
  images: { total: number; missingAlt: number };
}

export default function ComparePage() {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [result1, setResult1] = useState<CompareResult | null>(null);
  const [result2, setResult2] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!url1.trim() || !url2.trim()) { setError('Enter both URLs'); return; }
    setLoading(true); setError('');
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url1 }) }).then(r => r.json()),
        fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: url2 }) }).then(r => r.json()),
      ]);
      if (r1.error) { setError(r1.error); setLoading(false); return; }
      if (r2.error) { setError(r2.error); setLoading(false); return; }
      setResult1(r1); setResult2(r2);
    } catch { setError('Analysis failed. Please try again.'); }
    setLoading(false);
  };

  const CompareRow = ({ label, v1, v2, higher = 'better' }: { label: string; v1: string | number; v2: string | number; higher?: 'better' | 'worse' | 'neutral' }) => {
    const n1 = typeof v1 === 'number' ? v1 : parseFloat(v1);
    const n2 = typeof v2 === 'number' ? v2 : parseFloat(v2);
    const diff = !isNaN(n1) && !isNaN(n2);
    const winner = diff ? (higher === 'better' ? (n1 > n2 ? 1 : n1 < n2 ? 2 : 0) : (n1 < n2 ? 1 : n1 > n2 ? 2 : 0)) : 0;
    return (
      <div className="grid grid-cols-3 gap-4 py-2.5 border-b border-white/[0.04] last:border-0 text-sm">
        <span className={`font-mono ${winner === 1 ? 'text-emerald-400' : 'text-white/70'}`}>{v1}</span>
        <span className="text-white/40 text-center text-xs">{label}</span>
        <span className={`font-mono text-right ${winner === 2 ? 'text-emerald-400' : 'text-white/70'}`}>{v2}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-medium tracking-tight mb-2">Compare Two URLs</h1>
          <p className="text-white/40 text-sm">Side-by-side SEO comparison. See who wins.</p>
        </div>

        {/* Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input type="text" value={url1} onChange={e => setUrl1(e.target.value)} placeholder="https://site-a.com"
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 outline-none focus:border-accent-500/30" />
          <div className="flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-white/20" />
          </div>
          <input type="text" value={url2} onChange={e => setUrl2(e.target.value)} placeholder="https://site-b.com"
            className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 outline-none focus:border-accent-500/30" />
        </div>

        <button onClick={analyze} disabled={loading} className="btn-primary w-full py-3 text-sm mb-8 disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Analyzing both sites...</> : <><Search className="w-4 h-4 inline mr-2" /> Compare</>}
        </button>

        {error && <p className="text-red-400 text-sm text-center mb-6">{error}</p>}

        {/* Results */}
        {result1 && result2 && (
          <div className="space-y-6 animate-fade-in">
            {/* Score comparison */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6 text-center">
                <ScoreRing score={result1.score} size={100} label="" />
                <p className="text-sm text-white/60 mt-3 truncate">{result1.url}</p>
              </div>
              <div className="glass-card rounded-xl p-6 text-center">
                <ScoreRing score={result2.score} size={100} label="" />
                <p className="text-sm text-white/60 mt-3 truncate">{result2.url}</p>
              </div>
            </div>

            {/* Winner banner */}
            <div className="glass-card rounded-xl p-4 text-center">
              {result1.score === result2.score ? (
                <span className="text-white/60 text-sm">Both sites scored equally!</span>
              ) : (
                <span className="text-sm">
                  <span className="text-emerald-400 font-medium">{result1.score > result2.score ? result1.url : result2.url}</span>
                  <span className="text-white/40"> wins by </span>
                  <span className="text-emerald-400 font-medium">{Math.abs(result1.score - result2.score)} points</span>
                </span>
              )}
            </div>

            {/* Detail comparison */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Detailed Comparison</h3>
              <CompareRow label="SEO Score" v1={result1.score} v2={result2.score} />
              <CompareRow label="Security Grade" v1={result1.security?.grade || 'F'} v2={result2.security?.grade || 'F'} higher="neutral" />
              <CompareRow label="Security Score" v1={result1.security?.score || 0} v2={result2.security?.score || 0} />
              <CompareRow label="Response Time" v1={`${result1.performance?.responseTime || 0}ms`} v2={`${result2.performance?.responseTime || 0}ms`} higher="worse" />
              <CompareRow label="HTML Size" v1={`${result1.performance?.htmlSize || 0}KB`} v2={`${result2.performance?.htmlSize || 0}KB`} higher="worse" />
              <CompareRow label="Word Count" v1={result1.wordCount || 0} v2={result2.wordCount || 0} />
              <CompareRow label="Total Issues" v1={result1.issues?.length || 0} v2={result2.issues?.length || 0} higher="worse" />
              <CompareRow label="Total Links" v1={result1.links?.total || 0} v2={result2.links?.total || 0} />
              <CompareRow label="Images" v1={result1.images?.total || 0} v2={result2.images?.total || 0} />
              <CompareRow label="Missing Alt" v1={result1.images?.missingAlt || 0} v2={result2.images?.missingAlt || 0} higher="worse" />
              <CompareRow label="Scripts" v1={result1.performance?.totalScripts || 0} v2={result2.performance?.totalScripts || 0} higher="worse" />
            </div>

            {/* Issue comparison */}
            <div className="grid grid-cols-2 gap-4">
              {[result1, result2].map((r, idx) => (
                <div key={idx} className="glass-card rounded-xl p-4">
                  <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
                    Issues ({r.issues?.length || 0})
                  </h4>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto scrollbar-thin">
                    {r.issues?.slice(0, 10).map((issue, i) => (
                      <div key={i} className={`text-xs px-2 py-1.5 rounded ${issue.severity === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {issue.problem}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
