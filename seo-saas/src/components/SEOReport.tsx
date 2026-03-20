'use client';
import { useState, useEffect, useRef } from 'react';
import { ScoreRing } from './ScoreRing';
import { ScrollProgress } from './ScrollProgress';
import { IssueDonut, ScoreRadar, CategoryBars, BenchmarkBadge, MiniProgress, SecurityGrade, TechStackBadges } from './Charts';
import { FixSnippet, generateFixCode } from './FixSnippet';
import { ActionSummary } from './ActionSummary';
import { ProGate } from './ProGate';
import { ErrorBoundary } from './ErrorBoundary';
import { SerpPreview } from './SerpPreview';
import {
  AlertTriangle, XCircle, ChevronDown, ChevronUp, Lightbulb, Copy, CheckCircle,
  Download, Share2, FileText, BarChart3, Search, Link2, Image, Hash, Globe,
  Code, Bot, Zap, Shield, Smartphone, Languages, ArrowRightLeft
} from 'lucide-react';

// ===== Sub-components =====

function Section({ title, icon: Icon, children, defaultOpen = false, badge, badgeColor = 'default', id }: {
  title: string; icon: any; children: React.ReactNode; defaultOpen?: boolean;
  badge?: string | number; badgeColor?: string; id?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const colors: Record<string, string> = {
    default: 'bg-white/[0.06] text-white/60',
    green: 'bg-emerald-500/10 text-emerald-400',
    red: 'bg-red-500/10 text-red-400',
    yellow: 'bg-amber-500/10 text-amber-400',
  };
  const sectionId = id || title.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 sm:px-5 py-4 flex items-center justify-between transition-colors duration-150"
        aria-expanded={open}
        aria-controls={`panel-${sectionId}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 text-white/40" />
          <span className="font-medium text-sm text-white/90">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {badge !== undefined && (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[badgeColor] || colors.default}`}>
              {badge}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div id={`panel-${sectionId}`} role="region" aria-label={title}
            className={`px-4 sm:px-5 pb-5 border-t border-white/[0.04] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, status }: { label: string; value: any; status?: string }) {
  const statusColor = status === 'good' ? 'text-emerald-400' : status === 'bad' ? 'text-red-400' : status === 'warn' ? 'text-amber-400' : 'text-white/80';
  const dotColor = status === 'good' ? 'bg-emerald-400' : status === 'bad' ? 'bg-red-400' : status === 'warn' ? 'bg-amber-400' : '';
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0 gap-4">
      <span className="text-white/50 text-sm flex-shrink-0 flex items-center gap-2">
        {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0`} />}
        {label}
      </span>
      <span className={`text-sm font-mono text-right break-words min-w-0 ${statusColor}`}>{value}</span>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  const isNumber = typeof value === 'number';
  const [display, setDisplay] = useState(isNumber ? 0 : value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNumber) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const dur = 800;
        const start = performance.now();
        const animate = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(eased * (value as number)));
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, isNumber]);

  return (
    <div ref={ref} className="glass-card rounded-xl p-4 text-center hover:scale-[1.02] transition-transform duration-200">
      <div className={`text-2xl font-semibold font-mono tracking-tight ${color || 'text-accent-400'}`}>{display}</div>
      <div className="text-[11px] text-white/40 mt-1.5 uppercase tracking-wide">{label}</div>
    </div>
  );
}

// ===== Tab types =====
type TabKey = 'overview' | 'issues' | 'technical' | 'content' | 'social';

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'issues', label: 'Issues', icon: AlertTriangle },
  { key: 'technical', label: 'Technical', icon: Code },
  { key: 'content', label: 'Content', icon: FileText },
  { key: 'social', label: 'Social', icon: Globe },
];

// ===== Main Component =====
export function SEOReport({ result, showActions = true, isPublic = false }: {
  result: any; showActions?: boolean; isPublic?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [copied, setCopied] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning'>('all');

  const d = result;
  const issues = d.issues || [];
  const criticalCount = issues.filter((i: any) => i.severity === 'critical').length;
  const warningCount = issues.filter((i: any) => i.severity === 'warning').length;
  const filteredIssues = severityFilter === 'all' ? issues : issues.filter((i: any) => i.severity === severityFilter);

  const handleCopy = () => {
    const summary = `SEO Report: ${d.url}\nScore: ${d.score}/100\nIssues: ${issues.length} (${criticalCount} critical)\n\n${issues.map((i: any) => `[${i.severity.toUpperCase()}] ${i.problem}\n  Fix: ${i.fix}`).join('\n\n')}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `seo-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleCSV = () => {
    const rows = [['Severity', 'Category', 'Problem', 'Fix', 'Impact']];
    issues.forEach((i: any) => rows.push([i.severity, i.category || '', i.problem, i.fix, i.impact || '']));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `seo-issues-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: `SEO Report: ${d.url}`, text: `SEO Score: ${d.score}/100`, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const quickWins = [...issues].sort((a: any, b: any) => {
    if (a.severity === 'warning' && b.severity === 'critical') return -1;
    return 0;
  }).slice(0, 3);

  return (
    <div className="print-report">
      {/* Action bar */}
      {showActions && (
        <div className="flex flex-wrap items-center gap-2 mb-8 print:hidden opacity-0 animate-fade-in">
          <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 !px-3 !py-1.5 text-sm">
            {copied ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5 text-white/50" /> Copy</>}
          </button>
          <button onClick={handleDownload} className="btn-ghost flex items-center gap-1.5 !px-3 !py-1.5 text-sm">
            <Download className="w-3.5 h-3.5 text-white/50" /> JSON
          </button>
          <button onClick={handleCSV} className="btn-ghost flex items-center gap-1.5 !px-3 !py-1.5 text-sm">
            <Download className="w-3.5 h-3.5 text-white/50" /> CSV
          </button>
          <button onClick={() => window.print()} className="btn-primary flex items-center gap-1.5 !px-3 !py-1.5 text-sm">
            <FileText className="w-3.5 h-3.5" /> PDF
          </button>
          <button onClick={handleShare} className="btn-ghost flex items-center gap-1.5 !px-3 !py-1.5 text-sm">
            <Share2 className="w-3.5 h-3.5 text-white/50" /> Share
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 mb-8 opacity-0 animate-scale-in">
        <ScoreRing score={d.score} potentialScore={d.potentialScore} size={140} label="Overall SEO" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-medium tracking-tight mb-1.5 break-all text-white/90">{d.url}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/40">
            <span>Status <span className="text-white/60 font-mono">{d.statusCode}</span></span>
            <span>Response <span className="text-white/60 font-mono">{d.fetchTime}ms</span></span>
            <span>Size <span className="text-white/60 font-mono">{d.performance?.htmlSize} KB</span></span>
            <span>Words <span className="text-white/60 font-mono">{d.wordCount}</span></span>
          </div>
          {/* Benchmark */}
          <div className="mt-3">
            <BenchmarkBadge score={d.score} average={d.score > 70 ? 55 : 62} />
          </div>
          {isPublic && (
            <p className="text-xs text-white/30 mt-3">
              Analyzed with <a href="/" className="text-accent-400 hover:text-accent-300 transition">SEO Snapshot</a>
            </p>
          )}
        </div>
      </div>

      {/* Action Summary */}
      <ActionSummary result={d} />

      {/* Tabs */}
      <div className="relative mb-8 print:hidden">
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-surface to-transparent pointer-events-none z-10 sm:hidden" />
      <div role="tablist" aria-label="Report sections" className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin opacity-0 animate-fade-in-up">
        {TABS.map(tab => {
          const isActive = activeTab === tab.key;
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.key}
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap
                ${isActive
                  ? 'bg-white/[0.08] text-white border border-white/[0.1] shadow-glow-sm'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'}`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
              {tab.key === 'issues' && issues.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${criticalCount > 0 ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'}`}>
                  {issues.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview"
        className={`transition-opacity duration-200 ${activeTab === 'overview' ? 'opacity-100' : 'hidden print:block opacity-0'}`}>
        {/* Bento score cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 opacity-0 animate-fade-in-up-delay-1">
          <StatCard label="SEO Score" value={d.score} color={d.score >= 75 ? 'text-emerald-400' : d.score >= 50 ? 'text-amber-400' : 'text-red-400'} />
          <StatCard label="Security" value={d.security?.score || 0} color={d.security?.score >= 80 ? 'text-emerald-400' : 'text-amber-400'} />
          <StatCard label="Accessibility" value={d.accessibility?.score || 0} color={d.accessibility?.score >= 80 ? 'text-emerald-400' : 'text-amber-400'} />
          <StatCard label="Mobile" value={d.mobile?.score || 0} color={d.mobile?.score >= 80 ? 'text-emerald-400' : 'text-amber-400'} />
        </div>

        {/* Tech Stack + Security Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 opacity-0 animate-fade-in-up-delay-1">
          {/* Tech Stack */}
          {d.techStack?.length > 0 && (
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Detected Technology</h3>
              <TechStackBadges stack={d.techStack} />
            </div>
          )}
          {/* Security Grade */}
          <SecurityGrade grade={d.security?.grade || 'F'} score={d.security?.score || 0} />
        </div>

        {/* Charts row: Radar + Issue distribution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 opacity-0 animate-fade-in-up-delay-1">
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Score Breakdown</h3>
            <ScoreRadar scores={d.categoryScores ? [
              { label: 'Meta', value: d.categoryScores.meta },
              { label: 'Technical', value: d.categoryScores.technical },
              { label: 'Perf', value: d.categoryScores.performance },
              { label: 'Security', value: d.categoryScores.security },
              { label: 'Content', value: d.categoryScores.content },
              { label: 'Social', value: d.categoryScores.social },
            ] : [
              { label: 'Meta', value: d.score },
              { label: 'Security', value: d.security?.score || 0 },
              { label: 'Perf', value: 50 },
              { label: 'Content', value: 50 },
              { label: 'Mobile', value: d.mobile?.score || 0 },
              { label: 'A11y', value: d.accessibility?.score || 0 },
            ]} />
          </div>
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Issue Distribution</h3>
            <IssueDonut critical={criticalCount} warning={warningCount} />
            <div className="mt-4">
              <CategoryBars categories={(() => {
                const cats: Record<string, number> = {};
                issues.forEach((i: any) => { cats[i.category || 'Other'] = (cats[i.category || 'Other'] || 0) + 1; });
                const colors: Record<string, string> = { Meta: '#818cf8', Security: '#f87171', Performance: '#fbbf24', Content: '#34d399', Mobile: '#22d3ee', Social: '#a78bfa', Technical: '#fb923c', Other: '#71717a' };
                return Object.entries(cats).map(([label, count]) => ({ label, count, color: colors[label] || '#71717a' }));
              })()} />
            </div>
          </div>
        </div>

        {/* Redirect chain warning */}
        {d.redirectChain?.length > 1 && (
          <div className="glass-card rounded-xl p-4 mb-4 border-amber-500/20 opacity-0 animate-fade-in-up-delay-1">
            <div className="flex items-center gap-2 mb-2">
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/80">Redirect Chain ({d.redirectChain.length} hops)</span>
            </div>
            <div className="flex flex-wrap items-center gap-1 text-xs font-mono text-white/50">
              {d.redirectChain.map((r: any, i: number) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-white/20">→</span>}
                  <span className={r.status >= 300 ? 'text-amber-400' : 'text-emerald-400'}>{r.status}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Noindex alert */}
        {d.meta?.isNoindex && (
          <div className="glass-card rounded-xl p-4 mb-4 border-red-500/20 bg-red-500/[0.04] opacity-0 animate-fade-in">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">This page is marked as noindex — it will NOT appear in search results</span>
            </div>
          </div>
        )}

        {/* PageSpeed if available */}
        {d.pageSpeed?.available && (
          <div className="mb-8 opacity-0 animate-fade-in-up-delay-2">
            <Section title="Core Web Vitals" icon={Zap} defaultOpen={true}
              badge={`${d.pageSpeed.performanceScore}/100`}
              badgeColor={d.pageSpeed.performanceScore >= 90 ? 'green' : d.pageSpeed.performanceScore >= 50 ? 'yellow' : 'red'}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
                <StatCard label="FCP" value={`${Math.round(d.pageSpeed.fcp)}ms`} color={d.pageSpeed.fcp < 1800 ? 'text-emerald-400' : 'text-amber-400'} />
                <StatCard label="LCP" value={`${Math.round(d.pageSpeed.lcp)}ms`} color={d.pageSpeed.lcp < 2500 ? 'text-emerald-400' : 'text-amber-400'} />
                <StatCard label="CLS" value={d.pageSpeed.cls.toFixed(3)} color={d.pageSpeed.cls < 0.1 ? 'text-emerald-400' : 'text-amber-400'} />
                <StatCard label="TBT" value={`${Math.round(d.pageSpeed.tbt)}ms`} color={d.pageSpeed.tbt < 200 ? 'text-emerald-400' : 'text-amber-400'} />
                <StatCard label="Speed Index" value={`${Math.round(d.pageSpeed.si)}ms`} color={d.pageSpeed.si < 3400 ? 'text-emerald-400' : 'text-amber-400'} />
                <StatCard label="TTI" value={`${Math.round(d.pageSpeed.tti)}ms`} color={d.pageSpeed.tti < 3800 ? 'text-emerald-400' : 'text-amber-400'} />
              </div>
            </Section>
          </div>
        )}

        {/* Summary bento grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8 opacity-0 animate-fade-in-up-delay-2">
          <StatCard label="Words" value={d.wordCount} />
          <StatCard label="H1" value={d.headings?.h1?.count || 0} />
          <StatCard label="Images" value={d.images?.total || 0} />
          <StatCard label="Links" value={d.links?.total || 0} />
          <StatCard label="Scripts" value={d.performance?.totalScripts || 0} />
          <StatCard label="Issues" value={issues.length} color={issues.length === 0 ? 'text-emerald-400' : 'text-amber-400'} />
        </div>

        {/* Quick Wins */}
        {quickWins.length > 0 && (
          <div className="opacity-0 animate-fade-in-up-delay-3">
            <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-accent-400" /> Quick Wins
            </h3>
            <div className="space-y-3">
              {quickWins.map((issue: any, i: number) => (
                <div key={i} className="glass-card rounded-xl p-4">
                  <p className="text-sm font-medium text-white/90 mb-2">{issue.problem}</p>
                  <div className="flex items-start gap-2 text-xs text-white/50 leading-relaxed bg-white/[0.03] rounded-lg p-3">
                    <Lightbulb className="w-3.5 h-3.5 text-accent-400 mt-0.5 flex-shrink-0" />
                    <span>{issue.fix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== ISSUES TAB ===== */}
      <div role="tabpanel" id="panel-issues" aria-labelledby="tab-issues" className={activeTab === 'issues' ? 'animate-fade-in' : 'hidden print:block'}>
        {issues.length === 0 ? (
          <div className="text-center py-16">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3 opacity-60" />
            <p className="text-emerald-400 font-medium">No issues found!</p>
            <p className="text-white/40 text-sm mt-1">This page passes all SEO checks.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-5 print:hidden">
              {(['all', 'critical', 'warning'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setSeverityFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                    ${severityFilter === filter
                      ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                      : 'text-white/40 hover:text-white/60 hover:bg-white/[0.03]'}`}
                >
                  {filter === 'all' ? `All (${issues.length})` : filter === 'critical' ? `Critical (${criticalCount})` : `Warning (${warningCount})`}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredIssues.map((issue: any, i: number) => (
                <div key={i} className={`rounded-xl border p-4 transition-all duration-150 ${
                  issue.severity === 'critical'
                    ? 'border-red-500/15 bg-red-500/[0.04] hover:border-red-500/25'
                    : 'border-amber-500/15 bg-amber-500/[0.04] hover:border-amber-500/25'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {issue.severity === 'critical'
                      ? <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      : <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-white/90">{issue.problem}</p>
                        {issue.impact && (
                          <span className="flex items-center gap-0.5 text-xs text-emerald-400/70 flex-shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            +{issue.impact} pts
                          </span>
                        )}
                      </div>
                      {issue.fix && (
                        <div className="mt-2 flex items-start gap-2 text-xs text-white/50 leading-relaxed bg-white/[0.03] rounded-lg p-3">
                          <Lightbulb className="w-3.5 h-3.5 text-accent-400 mt-0.5 flex-shrink-0" />
                          <span>{issue.fix}</span>
                        </div>
                      )}
                      {(() => { const code = generateFixCode(issue, d); return code ? <FixSnippet code={code} /> : null; })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ===== TECHNICAL TAB ===== */}
      <div role="tabpanel" id="panel-technical" aria-labelledby="tab-technical" className={activeTab === 'technical' ? 'animate-fade-in' : 'hidden print:block'}>
        <div className="grid gap-4">
          {/* Meta Tags always visible, rest gated for free users */}
          <Section title="Meta Tags" icon={Hash}
            badge={d.meta?.title?.status === 'good' && d.meta?.description?.status === 'good' ? 'Good' : 'Check'}
            badgeColor={d.meta?.title?.status === 'good' ? 'green' : 'yellow'}>
            <div className="pt-2">
              <Row label="Title" value={`${d.meta?.title?.text || 'MISSING'} (${d.meta?.title?.length || 0} chars)`}
                status={d.meta?.title?.status === 'good' ? 'good' : d.meta?.title?.status === 'missing' ? 'bad' : 'warn'} />
              <Row label="Title width" value={`~${d.meta?.titlePixelWidth || 0}px (max 580px)`}
                status={(d.meta?.titlePixelWidth || 0) <= 580 ? 'good' : 'warn'} />
              <Row label="Description" value={`${d.meta?.description?.length || 0} chars`}
                status={d.meta?.description?.status === 'good' ? 'good' : d.meta?.description?.status === 'missing' ? 'bad' : 'warn'} />
              <Row label="Canonical" value={d.meta?.canonical || 'Not set'} status={d.meta?.canonical ? 'good' : 'warn'} />
              <Row label="Language" value={d.meta?.lang || 'Not set'} status={d.meta?.lang ? 'good' : 'bad'} />
              <Row label="HTTPS" value={d.security?.https ? '✓ Secure' : '✗ Not secure'} status={d.security?.https ? 'good' : 'bad'} />
              <Row label="Viewport" value={d.meta?.viewport ? '✓ Set' : '✗ Missing'} status={d.meta?.viewport ? 'good' : 'bad'} />
              <Row label="Favicon" value={d.meta?.hasFavicon ? '✓ Found' : '✗ Missing'} status={d.meta?.hasFavicon ? 'good' : 'warn'} />
              <Row label="DOCTYPE" value={d.meta?.hasDoctype ? '✓ Present' : '✗ Missing'} status={d.meta?.hasDoctype ? 'good' : 'warn'} />
              <Row label="Text/HTML ratio" value={`${d.meta?.textToHtmlRatio || 0}%`}
                status={(d.meta?.textToHtmlRatio || 0) >= 10 ? 'good' : 'warn'} />
            </div>
            {/* SERP Preview */}
            <div className="mt-4">
              <SerpPreview
                title={d.meta?.title?.text || ''}
                description={d.meta?.description?.text || ''}
                url={d.url}
              />
            </div>
          </Section>

          <Section title="Security Headers" icon={Shield}
            badge={`${d.security?.score || 0}/100`}
            badgeColor={d.security?.score >= 80 ? 'green' : d.security?.score >= 50 ? 'yellow' : 'red'}>
            <div className="pt-2">
              <Row label="HTTPS" value={d.security?.https ? '✓ Secure' : '✗ Not secure'} status={d.security?.https ? 'good' : 'bad'} />
              {d.security?.headers && Object.entries(d.security.headers).map(([k, v]) =>
                <Row key={k} label={k} value={v ? '✓ Set' : '✗ Missing'} status={v ? 'good' : 'warn'} />
              )}
            </div>
          </Section>

          <Section title="Performance" icon={Zap}
            badge={`${d.performance?.responseTime || d.fetchTime}ms`}
            badgeColor={(d.performance?.responseTime || d.fetchTime) < 1000 ? 'green' : 'yellow'}>
            <div className="pt-2">
              <Row label="Response time" value={`${d.performance?.responseTime || d.fetchTime}ms`}
                status={(d.performance?.responseTime || d.fetchTime) < 1000 ? 'good' : 'warn'} />
              <Row label="HTML size" value={`${d.performance?.htmlSize} KB`} />
              <Row label="Scripts" value={`${d.performance?.totalScripts} (${d.performance?.deferScripts} defer, ${d.performance?.asyncScripts} async)`} />
              <Row label="Render-blocking" value={d.performance?.renderBlocking} status={d.performance?.renderBlocking > 3 ? 'bad' : undefined} />
              <Row label="Stylesheets" value={d.performance?.totalStylesheets} />
              <Row label="Inline JS size" value={`${d.performance?.inlineScriptSize || 0} KB`} status={d.performance?.inlineScriptSize > 50 ? 'warn' : undefined} />
            </div>
          </Section>

          <Section title="Mobile" icon={Smartphone}
            badge={`${d.mobile?.score || 0}/100`}
            badgeColor={d.mobile?.score >= 80 ? 'green' : 'yellow'}>
            <div className="pt-2">
              <Row label="Viewport" value={d.mobile?.viewport ? '✓ Set' : '✗ Missing'} status={d.mobile?.viewport ? 'good' : 'bad'} />
              <Row label="Zoom" value={d.mobile?.scalable ? '✓ Enabled' : '✗ Disabled'} status={d.mobile?.scalable ? 'good' : 'bad'} />
              {d.mobile?.issues?.map((issue: string, i: number) => (
                <div key={i} className="flex items-center gap-2 py-2 text-sm text-amber-400"><AlertTriangle className="w-3.5 h-3.5" /> {issue}</div>
              ))}
            </div>
          </Section>

          <Section title="Accessibility" icon={Search}
            badge={`${d.accessibility?.score || 0}/100`}
            badgeColor={d.accessibility?.score >= 80 ? 'green' : d.accessibility?.score >= 50 ? 'yellow' : 'red'}>
            <div className="pt-2">
              {d.accessibility?.issues?.length > 0 ? d.accessibility.issues.map((issue: string, i: number) => (
                <div key={i} className="flex items-center gap-2 py-2 border-b border-white/[0.04] last:border-0 text-sm text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {issue}
                </div>
              )) : <p className="text-sm text-emerald-400 py-2">✓ No accessibility issues found</p>}
            </div>
          </Section>

          {/* Hreflang */}
          {d.hreflang?.tags?.length > 0 && (
            <Section title="Hreflang Tags" icon={Languages}
              badge={`${d.hreflang.tags.length} langs`}
              badgeColor={d.hreflang.hasXDefault ? 'green' : 'yellow'}>
              <div className="pt-2">
                <Row label="x-default" value={d.hreflang.hasXDefault ? '✓ Set' : '✗ Missing'} status={d.hreflang.hasXDefault ? 'good' : 'warn'} />
                {d.hreflang.tags.slice(0, 10).map((h: any, i: number) => (
                  <Row key={i} label={h.lang} value={h.url} />
                ))}
                {d.hreflang.issues?.map((issue: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 py-2 text-sm text-amber-400"><AlertTriangle className="w-3.5 h-3.5" /> {issue}</div>
                ))}
              </div>
            </Section>
          )}

          {/* Render-blocking resources */}
          {d.performance?.renderBlockingList?.length > 0 && (
            <Section title="Render-Blocking Resources" icon={Zap}
              badge={`${d.performance.renderBlockingList.length}`} badgeColor="yellow">
              <div className="pt-2 space-y-1">
                {d.performance.renderBlockingList.map((src: string, i: number) => (
                  <div key={i} className="text-xs font-mono text-white/50 py-1.5 border-b border-white/[0.04] last:border-0 break-all">
                    {src}
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title="Robots & Sitemap" icon={Bot}
            badge={d.robots?.exists && d.sitemap?.exists ? 'Good' : 'Issues'}
            badgeColor={d.robots?.exists && d.sitemap?.exists ? 'green' : 'yellow'}>
            <div className="pt-2">
              <Row label="robots.txt" value={d.robots?.exists ? '✓ Found' : '✗ Not found'} status={d.robots?.exists ? 'good' : 'bad'} />
              {d.robots?.exists && <>
                <Row label="Sitemap ref" value={d.robots?.hasSitemapRef ? '✓ Yes' : '✗ No'} status={d.robots?.hasSitemapRef ? 'good' : 'warn'} />
                <Row label="Disallow rules" value={d.robots?.disallowCount} />
              </>}
              <Row label="sitemap.xml" value={d.sitemap?.exists ? '✓ Found' : '✗ Not found'} status={d.sitemap?.exists ? 'good' : 'bad'} />
              {d.sitemap?.urls?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <div className="text-xs font-medium text-white/50 mb-2">Sitemap URLs ({d.sitemap.urls.length}{d.sitemap.urls.length >= 50 ? '+' : ''})</div>
                  <div className="max-h-40 overflow-y-auto scrollbar-thin space-y-1">
                    {d.sitemap.urls.slice(0, 20).map((url: string, i: number) => (
                      <div key={i} className="text-xs font-mono text-white/40 py-0.5 truncate">{url}</div>
                    ))}
                    {d.sitemap.urls.length > 20 && <div className="text-xs text-white/25 py-1">...and {d.sitemap.urls.length - 20} more</div>}
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* ===== CONTENT TAB ===== */}
      <div role="tabpanel" id="panel-content" aria-labelledby="tab-content" className={activeTab === 'content' ? 'animate-fade-in' : 'hidden print:block'}>
        <div className="grid gap-4">
          <Section title="Headings" icon={Hash} badge={`H1: ${d.headings?.h1?.count || 0}`}
            badgeColor={d.headings?.h1?.count === 1 ? 'green' : 'yellow'}>
            <div className="pt-2">
              {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(h => (
                <Row key={h} label={h.toUpperCase()} value={d.headings?.[h]?.count || 0} />
              ))}
              {d.headings?.h1?.texts?.[0] && <Row label="H1 Content" value={d.headings.h1.texts[0]} />}
            </div>
          </Section>

          {d.topKeywords?.length > 0 && (
            <Section title="Top Keywords" icon={Search} badge={`${d.topKeywords.length}`} badgeColor="default">
              <div className="pt-2">
                {d.topKeywords.slice(0, 10).map((kw: any, i: number) => (
                  <Row key={i} label={`${i + 1}. ${kw.word}`} value={`${kw.count}x (${kw.density}%)`} />
                ))}
              </div>
            </Section>
          )}

          <Section title="Content Quality" icon={FileText}
            badge={d.contentQuality?.readabilityGrade}
            badgeColor={d.contentQuality?.readabilityScore >= 60 ? 'green' : 'yellow'}>
            <div className="pt-2">
              <Row label="Flesch score" value={`${d.contentQuality?.readabilityScore}/100 (${d.contentQuality?.readabilityGrade})`} />
              <Row label="Avg sentence" value={`${d.contentQuality?.avgSentenceLength} words`} />
              <Row label="Total sentences" value={d.contentQuality?.totalSentences} />
              <Row label="Long sentences" value={d.contentQuality?.longSentences} status={d.contentQuality?.longSentences > 5 ? 'warn' : undefined} />
            </div>
          </Section>

          <Section title="Images" icon={Image}
            badge={d.images?.missingAlt > 0 ? `${d.images.missingAlt} no alt` : 'Good'}
            badgeColor={d.images?.missingAlt > 0 ? 'yellow' : 'green'}>
            <div className="pt-2">
              <Row label="Total" value={d.images?.total} />
              <Row label="Missing alt" value={d.images?.missingAlt} status={d.images?.missingAlt > 0 ? 'bad' : 'good'} />
              <Row label="No dimensions" value={d.images?.withoutDimensions} status={d.images?.withoutDimensions > 0 ? 'warn' : undefined} />
              <Row label="Not lazy-loaded" value={d.images?.notLazy || 0} status={d.images?.notLazy > 3 ? 'warn' : undefined} />
              <Row label="Not WebP/AVIF" value={d.images?.noWebP || 0} status={d.images?.noWebP > 3 ? 'warn' : undefined} />
            </div>
          </Section>

          <Section title="Links" icon={Link2} badge={d.links?.total}
            badgeColor={d.links?.brokenLinks?.length > 0 ? 'red' : 'default'}>
            <div className="pt-2">
              <Row label="Internal" value={`${d.links?.internal} (${d.links?.uniqueInternal} unique)`} status="good" />
              <Row label="External" value={`${d.links?.external} (${d.links?.uniqueExternal} unique)`} />
              <Row label="Nofollow" value={d.links?.nofollow} />
              <Row label="Empty anchor" value={d.links?.emptyAnchor} status={d.links?.emptyAnchor > 0 ? 'warn' : 'good'} />
              <Row label="Generic anchor" value={d.links?.genericAnchor} status={d.links?.genericAnchor > 3 ? 'warn' : undefined} />
              {d.links?.brokenLinks?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <div className="text-xs font-medium text-red-400 mb-2">Broken Links ({d.links.brokenLinks.length})</div>
                  {d.links.brokenLinks.map((link: string, i: number) => (
                    <div key={i} className="text-xs font-mono text-red-400/70 py-1 break-all">{link}</div>
                  ))}
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* ===== SOCIAL TAB ===== */}
      <div role="tabpanel" id="panel-social" aria-labelledby="tab-social" className={activeTab === 'social' ? 'animate-fade-in' : 'hidden print:block'}>
        <div className="grid gap-4">
          <Section title="Open Graph" icon={Globe}
            badge={`${Object.values(d.og || {}).filter(Boolean).length}/6`}
            badgeColor={Object.values(d.og || {}).filter(Boolean).length >= 4 ? 'green' : 'yellow'}>
            <div className="pt-2">
              {d.og && Object.entries(d.og).map(([k, v]) =>
                <Row key={k} label={`og:${k}`} value={(v as string) || '— Missing'} status={v ? 'good' : 'bad'} />
              )}
            </div>
          </Section>

          <Section title="Twitter Card" icon={Globe}
            badge={d.twitter?.card || 'Not set'}
            badgeColor={d.twitter?.card ? 'green' : 'yellow'}>
            <div className="pt-2">
              {d.twitter && Object.entries(d.twitter).map(([k, v]) =>
                <Row key={k} label={`twitter:${k}`} value={(v as string) || '— Missing'} status={v ? 'good' : 'bad'} />
              )}
            </div>
          </Section>

          <Section title="Structured Data" icon={Code}
            badge={d.schemas?.length > 0 ? `${d.schemas.length} found` : 'None'}
            badgeColor={d.schemas?.length > 0 ? 'green' : 'yellow'}>
            <div className="pt-2">
              {d.schemas?.length > 0 ? d.schemas.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-sm font-mono text-white/70">{s.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.valid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {s.valid ? '✓ Valid' : '✗ Issues'}
                  </span>
                </div>
              )) : <p className="text-sm text-white/40 py-2">No JSON-LD structured data found.</p>}
            </div>
          </Section>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      {showActions && (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden print:hidden border-t border-white/[0.06] bg-surface/90 backdrop-blur-xl px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 !px-3 !py-2 text-xs flex-1 justify-center">
              {copied ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
            <button onClick={() => window.print()} className="btn-primary flex items-center gap-1.5 !px-3 !py-2 text-xs flex-1 justify-center">
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
            <button onClick={handleShare} className="btn-ghost flex items-center gap-1.5 !px-3 !py-2 text-xs flex-1 justify-center">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      )}

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-16 sm:hidden print:hidden" />

      {/* Print footer */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        Generated by SEO Snapshot · {new Date().toLocaleDateString()} · seosnapshot.dev
      </div>
    </div>
  );
}
