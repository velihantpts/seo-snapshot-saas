'use client';
import { Zap, ArrowUp } from 'lucide-react';

export function ActionSummary({ result }: { result: any }) {
  const issues = result.issues || [];
  const criticals = issues.filter((i: any) => i.severity === 'critical');
  const topFixes = issues.slice(0, 3);
  const potential = result.potentialScore || result.score;
  const gain = potential - result.score;

  if (issues.length === 0) {
    return (
      <div className="glass-card rounded-xl p-5 mb-8 border-emerald-500/20 opacity-0 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-400">Excellent! No issues found.</p>
            <p className="text-xs text-white/40 mt-0.5">This page passes all SEO checks.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 mb-8 opacity-0 animate-fade-in-up">
      {/* Summary line */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Zap className="w-5 h-5 text-accent-400" />
        </div>
        <div>
          <p className="text-sm text-white/80 leading-relaxed">
            Your site scores <span className="font-semibold text-white">{result.score}/100</span>.
            {criticals.length > 0 && (
              <> <span className="text-red-400 font-semibold">{criticals.length} critical issue{criticals.length > 1 ? 's' : ''}</span> need immediate attention.</>
            )}
            {gain > 0 && (
              <> Fix them to reach <span className="text-emerald-400 font-semibold">~{potential}</span>.</>
            )}
          </p>
        </div>
      </div>

      {/* Top fixes */}
      {topFixes.length > 0 && (
        <div className="space-y-2 pl-[52px]">
          <p className="text-[10px] uppercase tracking-wider text-white/30 font-medium">Top priorities</p>
          {topFixes.map((fix: any, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                fix.severity === 'critical' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
              }`}>{i + 1}</span>
              <span className="text-white/70 flex-1 truncate">{fix.problem}</span>
              {fix.impact && (
                <span className="flex items-center gap-0.5 text-xs text-emerald-400/70 flex-shrink-0">
                  <ArrowUp className="w-3 h-3" />+{fix.impact}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
