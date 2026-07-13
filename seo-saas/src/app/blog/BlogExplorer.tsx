'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight, X, BookOpen } from 'lucide-react';
import type { BlogListItem } from '@/lib/blog';

const catColor = (c: string) =>
  c === 'Fixes' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' :
  c === 'Comparison' ? 'text-amber-300 bg-amber-500/10 border-amber-500/20' :
  'text-accent-300 bg-accent-500/10 border-accent-500/20';

function fmtDate(d: string) {
  if (!d) return '';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

export default function BlogExplorer({ posts }: { posts: BlogListItem[] }) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');

  const cats = useMemo(() => ['All', ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => posts.filter((p) => {
    if (cat !== 'All' && p.category !== cat) return false;
    if (!q) return true;
    return (p.title + ' ' + p.excerpt).toLowerCase().includes(q);
  }), [posts, cat, q]);

  const featureMode = cat === 'All' && !q && filtered.length > 0;
  const featured = featureMode ? filtered[0] : null;
  const rest = featureMode ? filtered.slice(1) : filtered;

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      {/* Hero */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-[11px] font-medium mb-5">
          <BookOpen className="w-3 h-3" /> {posts.length} practical guides
        </div>
        <h1 className="text-3xl sm:text-[2.5rem] font-semibold tracking-tight leading-[1.06] text-balance">
          SEO guides that give you the <span className="gradient-text">fix</span>
        </h1>
        <p className="text-white/55 text-[15px] mt-4 leading-relaxed">
          Meta tags, Core Web Vitals, security headers, structured data — explained plainly, with the exact code to fix each one. No fluff.
        </p>
      </div>

      {/* Search + categories */}
      <div className="mt-10 mb-8 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search guides…"
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/40 transition" aria-label="Search articles" />
          {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70" aria-label="Clear"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition border ${cat === c ? 'bg-accent-500/20 text-accent-200 border-accent-500/30' : 'bg-white/[0.03] text-white/55 border-white/[0.06] hover:text-white/80 hover:border-white/[0.12]'}`}>{c}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/40 text-sm">
          No guides match “{query}”. <button onClick={() => { setQuery(''); setCat('All'); }} className="text-accent-400 hover:text-accent-300">Clear</button>.
        </div>
      ) : (
        <>
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group block glass-card rounded-2xl p-6 sm:p-8 mb-8 hover:border-accent-500/30 transition-all duration-200 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.07] to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${catColor(featured.category)}`}>{featured.category}</span>
                  <span className="text-[11px] text-white/35 uppercase tracking-wide">Latest</span>
                  <span className="text-xs text-white/35 flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white/95 group-hover:text-accent-200 transition-colors leading-snug text-balance">{featured.title}</h2>
                <p className="text-sm text-white/55 leading-relaxed mt-2 max-w-2xl">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-accent-400 mt-4">Read guide <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></span>
              </div>
            </Link>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group glass-card rounded-xl p-5 flex flex-col hover:border-accent-500/30 hover:bg-white/[0.04] transition-all duration-200">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${catColor(post.category)}`}>{post.category}</span>
                  <span className="text-[11px] text-white/30">{fmtDate(post.date)}</span>
                  <span className="text-[11px] text-white/30 flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
                <h3 className="text-[15px] font-medium text-white/90 group-hover:text-accent-200 transition-colors leading-snug">{post.title}</h3>
                <p className="text-[13px] text-white/50 leading-relaxed mt-1.5 line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
