'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Zap, Lock, Sparkles, ArrowRight, X } from 'lucide-react';
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from '@/lib/tools-catalog';

type Filter = 'all' | ToolCategory;

export default function ToolsExplorer() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    return TOOLS.filter((t) => {
      if (filter !== 'all' && t.category !== filter) return false;
      if (!q) return true;
      return (t.title + ' ' + t.short + ' ' + t.keywords).toLowerCase().includes(q);
    });
  }, [q, filter]);

  const grouped = filter === 'all' && !q;

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-[11px] font-medium mb-5">
          <Sparkles className="w-3 h-3" /> {TOOLS.length} free tools · no signup
        </div>
        <h1 className="text-3xl sm:text-[2.75rem] font-semibold tracking-tight leading-[1.05] text-balance">
          Free SEO tools that hand you<br className="hidden sm:block" /> the <span className="gradient-text">fix</span>, not just the flag
        </h1>
        <p className="text-white/55 text-[15px] mt-5 leading-relaxed max-w-xl mx-auto">
          Generators, checkers, and previews for the whole on-page stack — meta tags, schema, headers, Core Web Vitals. Fast, precise, and completely free.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-6 text-xs text-white/50">
          <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent-400" /> Runs in your browser</span>
          <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-accent-400" /> Nothing uploaded</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent-400" /> No signup, ever</span>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mt-12 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools — “schema”, “redirect”, “utm”…"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/40 focus:bg-white/[0.05] transition"
            aria-label="Search tools"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70" aria-label="Clear search"><X className="w-3.5 h-3.5" /></button>
          )}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {(['all', ...TOOL_CATEGORIES.map((c) => c.key)] as Filter[]).map((f) => {
            const label = f === 'all' ? 'All' : TOOL_CATEGORIES.find((c) => c.key === f)!.label;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition border ${filter === f ? 'bg-accent-500/20 text-accent-200 border-accent-500/30' : 'bg-white/[0.03] text-white/55 border-white/[0.06] hover:text-white/80 hover:border-white/[0.12]'}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-16 text-white/40 text-sm">
          No tools match “{query}”. Try a broader term, or{' '}
          <button onClick={() => { setQuery(''); setFilter('all'); }} className="text-accent-400 hover:text-accent-300">clear the search</button>.
        </div>
      ) : grouped ? (
        <div className="space-y-12">
          {TOOL_CATEGORIES.map((cat) => (
            <section key={cat.key}>
              <div className="mb-4">
                <h2 className="text-lg font-medium tracking-tight text-white/90">{cat.label}</h2>
                <p className="text-white/45 text-[13px] mt-0.5">{cat.blurb}</p>
              </div>
              <Grid tools={TOOLS.filter((t) => t.category === cat.key)} />
            </section>
          ))}
        </div>
      ) : (
        <Grid tools={results} />
      )}

      {/* Bottom CTA */}
      <div className="mt-16 glass-card rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.08] to-transparent pointer-events-none" />
        <div className="relative">
          <h2 className="text-xl font-medium tracking-tight mb-2">Want all of it at once?</h2>
          <p className="text-white/55 text-sm mb-5 max-w-md mx-auto">Skip the one-off tools and scan a live URL against 100 on-page checks — with the exact code to fix each issue.</p>
          <Link href="/" className="btn-primary text-sm inline-flex items-center gap-2">Analyze any URL free <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
}

function Grid({ tools }: { tools: typeof TOOLS }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group glass-card rounded-xl p-4 flex items-start gap-3.5 hover:border-accent-500/30 hover:bg-white/[0.04] transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-500/15 transition-colors">
              <Icon className="w-[18px] h-[18px] text-accent-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[14.5px] font-medium text-white/90 group-hover:text-accent-200 transition-colors">{tool.title}</h3>
                {tool.backend && <span className="text-[9px] uppercase tracking-wide text-emerald-300/80 bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5">live</span>}
              </div>
              <p className="text-[13px] text-white/50 leading-relaxed mt-1">{tool.short}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-accent-400 group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
