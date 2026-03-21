'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ReportCard() {
  const params = useParams();
  const [d, setD] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/analyze/${params.id}?public=true`)
      .then(r => r.json())
      .then(setD)
      .catch(() => {});
  }, [params.id]);

  if (!d) return <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center"><div className="w-6 h-6 border-2 border-accent-400/30 border-t-accent-400 rounded-full animate-spin" /></div>;

  const issues = d.issues || [];
  const criticals = issues.filter((i: any) => i.severity === 'critical');
  const warnings = issues.filter((i: any) => i.severity === 'warning');
  const scoreColor = d.score >= 80 ? '#34d399' : d.score >= 60 ? '#fbbf24' : d.score >= 40 ? '#fb923c' : '#f87171';
  const scoreLabel = d.score >= 80 ? 'GOOD' : d.score >= 60 ? 'NEEDS WORK' : d.score >= 40 ? 'POOR' : 'CRITICAL';
  const grade = d.security?.grade || 'F';
  const topIssues = issues.slice(0, 5);
  const domain = (() => { try { return new URL(d.url).hostname; } catch { return d.url; } })();

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      {/* The card — optimized for screenshots (16:9 aspect ratio) */}
      <div id="report-card" className="w-[720px] bg-gradient-to-br from-[#0f1320] to-[#0a0e1a] rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="px-8 pt-7 pb-5 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#818cf8] to-[#6366f1] flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-semibold text-white/90 text-[15px] tracking-tight">SEO Snapshot</span>
          </div>
          <span className="text-xs text-white/25 font-mono">seosnapshot.dev</span>
        </div>

        {/* Score + URL */}
        <div className="px-8 py-6 flex items-center gap-8">
          {/* Score circle */}
          <div className="relative flex-shrink-0">
            <svg width={100} height={100} className="-rotate-90">
              <circle cx={50} cy={50} r={42} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
              <circle cx={50} cy={50} r={42} fill="none" stroke={scoreColor} strokeWidth="6"
                strokeDasharray={`${(d.score / 100) * 264} 264`} strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${scoreColor}40)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white" style={{ color: scoreColor }}>{d.score}</span>
              <span className="text-[8px] text-white/40 uppercase tracking-widest">{scoreLabel}</span>
            </div>
          </div>

          {/* URL + stats */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium text-white/90 truncate mb-1">{domain}</h1>
            <div className="flex gap-4 text-xs text-white/35 mb-3">
              <span>Status <span className="text-white/60 font-mono">{d.statusCode}</span></span>
              <span>TTFB <span className="text-white/60 font-mono">{d.fetchTime}ms</span></span>
              <span>Size <span className="text-white/60 font-mono">{d.performance?.htmlSize}KB</span></span>
              <span>Words <span className="text-white/60 font-mono">{d.wordCount}</span></span>
            </div>
            {/* Mini stat bars */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Security', value: d.security?.score || 0, grade },
                { label: 'Mobile', value: d.mobile?.score || 0 },
                { label: 'A11y', value: d.accessibility?.score || 0 },
                { label: 'Issues', value: issues.length, isCount: true },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className={`text-sm font-semibold font-mono ${
                    (s as any).isCount ? (issues.length === 0 ? 'text-emerald-400' : 'text-amber-400') :
                    s.value >= 80 ? 'text-emerald-400' : s.value >= 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {(s as any).grade ? `${(s as any).grade}` : s.value}
                  </div>
                  <div className="text-[9px] text-white/30 uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        {d.techStack?.length > 0 && (
          <div className="px-8 pb-3 flex gap-2">
            {d.techStack.slice(0, 4).map((t: any) => (
              <span key={t.name} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/50 border border-white/[0.06]">
                {t.name}
              </span>
            ))}
          </div>
        )}

        {/* Top Issues */}
        <div className="px-8 py-4 border-t border-white/[0.06]">
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3">
            Top Issues ({criticals.length} critical, {warnings.length} warning)
          </div>
          <div className="space-y-1.5">
            {topIssues.map((issue: any, i: number) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${issue.severity === 'critical' ? 'bg-red-400' : 'bg-amber-400'}`} />
                <span className="text-xs text-white/60 flex-1 truncate">{issue.problem}</span>
                {issue.impact && (
                  <span className="text-[10px] text-emerald-400/60 flex-shrink-0">+{issue.impact}</span>
                )}
              </div>
            ))}
            {issues.length > 5 && (
              <div className="text-[10px] text-white/25 pl-4">...and {issues.length - 5} more issues</div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-white/30">100 SEO checks · Free · No signup</span>
          <span className="text-xs font-medium text-[#818cf8]">Analyze yours → seosnapshot.dev</span>
        </div>
      </div>
    </div>
  );
}
