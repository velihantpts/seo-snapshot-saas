'use client';
import { useState, useEffect } from 'react';
import { Search, Copy, CheckCircle, ExternalLink, Image, Lock } from 'lucide-react';

interface QuickResult {
  id: string;
  url: string;
  score: number;
  issues: { severity: string; problem: string; impact?: number }[];
  security: { grade: string };
  techStack: { name: string }[];
  wordCount: number;
}

// Clipboard fallback for HTTP sites
function copyToClipboard(text: string): boolean {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text);
    return true;
  }
  // Fallback: textarea method
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch { return false; }
  document.body.removeChild(ta);
  return true;
}

// Admin auth handled server-side via /api/admin

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [url, setUrl] = useState('');
  const [results, setResults] = useState<QuickResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');
  const [showText, setShowText] = useState<string | null>(null);

  // Blog composer
  const [bTitle, setBTitle] = useState('');
  const [bSlug, setBSlug] = useState('');
  const [bExcerpt, setBExcerpt] = useState('');
  const [bCategory, setBCategory] = useState('Guide');
  const [bContent, setBContent] = useState('');
  const [bMsg, setBMsg] = useState('');
  const [bLoading, setBLoading] = useState(false);
  const [bPosts, setBPosts] = useState<{ id: string; slug: string; title: string; published: boolean }[]>([]);
  const [stats, setStats] = useState<any>(null);

  const loadPosts = () => {
    fetch('/api/admin/blog').then((r) => r.json()).then((d) => { if (d.posts) setBPosts(d.posts); }).catch(() => {});
  };
  const loadStats = () => {
    fetch('/api/admin/analytics').then((r) => r.json()).then((d) => { if (!d.error) setStats(d); }).catch(() => {});
  };

  // Restore admin session from the httpOnly cookie (verified server-side).
  useEffect(() => {
    fetch('/api/admin')
      .then((r) => r.json())
      .then((d) => { if (d.authed) { setAuthed(true); loadPosts(); loadStats(); } })
      .catch(() => {});
  }, []);

  const publishPost = async () => {
    if (!bTitle.trim() || !bContent.trim()) { setBMsg('Title and content are required'); return; }
    setBLoading(true); setBMsg('');
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: bTitle, slug: bSlug, excerpt: bExcerpt, category: bCategory, content: bContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setBMsg(`✓ Published: ${data.url}`);
        setBTitle(''); setBSlug(''); setBExcerpt(''); setBContent('');
        loadPosts();
      } else {
        setBMsg(data.error || 'Publish failed');
      }
    } catch { setBMsg('Connection error'); }
    setBLoading(false);
  };

  const deletePost = async (slug: string) => {
    await fetch(`/api/admin/blog?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
    loadPosts();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
        try {
      const res = await fetch('/api/admin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (data.ok) { setAuthed(true); setAuthError(''); }
      else { setAuthError('Invalid credentials'); }
    } catch { setAuthError('Connection error'); }
  };

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
            <h1 className="text-xl font-medium">Admin Access</h1>
            <p className="text-white/40 text-sm mt-1">Restricted area</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/20 outline-none focus:border-accent-500/30" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/20 outline-none focus:border-accent-500/30" required />
            {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
            <button type="submit" className="w-full btn-primary py-3 text-sm">Sign in</button>
          </form>
        </div>
      </div>
    );
  }

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.score !== undefined) {
        setResults(prev => [data, ...prev]);
        setUrl('');
      }
    } catch (e) { if (typeof console !== "undefined") console.error(e); }
    setLoading(false);
  };

  const getRedditPost = (r: QuickResult) => {
    const domain = (() => { try { return new URL(r.url).hostname; } catch { return r.url; } })();
    const criticals = r.issues.filter(i => i.severity === 'critical').length;
    const topIssues = r.issues.slice(0, 3).map(i => `- ${i.problem}${i.impact ? ` (+${i.impact} pts fix)` : ''}`).join('\n');

    return `I analyzed **${domain}** with SEO Snapshot (free tool, 100 checks):

**Score: ${r.score}/100** ${r.score >= 80 ? '✅' : r.score >= 60 ? '⚠️' : '🔴'}
Security Grade: **${r.security?.grade || '?'}**
${r.techStack?.length ? `Tech: ${r.techStack.map(t => t.name).join(', ')}\n` : ''}
**Top issues found:**
${topIssues}
${r.issues.length > 3 ? `...and ${r.issues.length - 3} more\n` : ''}
Full report: https://seosnapshot.dev/report/${r.id}

---
Tool: https://seosnapshot.dev (free, no signup needed)`;
  };

  const handleCopy = (text: string, key: string) => {
    const ok = copyToClipboard(text);
    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    } else {
      // Show text in modal for manual copy
      setShowText(text);
    }
  };

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Analytics — first-party, real humans (bots filtered) */}
        {stats && (
          <div className="mb-10">
            <h1 className="text-2xl font-medium tracking-tight mb-4">Analytics <span className="text-white/30 text-sm font-normal">· last 30 days</span></h1>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Visitors (30d)', value: stats.visitors?.d30 ?? 0 },
                { label: 'Pageviews (30d)', value: stats.pageviews?.d30 ?? 0 },
                { label: 'Visitors (7d)', value: stats.visitors?.d7 ?? 0 },
                { label: 'Pageviews (7d)', value: stats.pageviews?.d7 ?? 0 },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-xl p-4">
                  <div className="text-2xl font-semibold text-white/90">{s.value}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="glass-card rounded-xl p-4 mb-4">
              <p className="text-xs text-white/40 mb-2">Funnel (30d)</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/70">{stats.visitors?.d30 ?? 0} visitors</span>
                <span className="text-white/25">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/70">{stats.funnel?.analyses30 ?? 0} analyses</span>
                <span className="text-white/25">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-white/70">{stats.funnel?.users ?? 0} signups</span>
                <span className="text-white/25">→</span>
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">{stats.funnel?.paid ?? 0} paid</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-white/40 mb-2">Top pages</p>
                {(stats.topPages || []).length === 0 && <p className="text-xs text-white/25">No data yet</p>}
                {(stats.topPages || []).map((p: any) => (
                  <div key={p.path} className="flex justify-between text-sm py-1"><span className="text-white/60 truncate">{p.path}</span><span className="text-white/40">{p.count}</span></div>
                ))}
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-xs text-white/40 mb-2">Top referrers</p>
                {(stats.topReferrers || []).length === 0 && <p className="text-xs text-white/25">No external referrers yet</p>}
                {(stats.topReferrers || []).map((r: any) => (
                  <div key={r.referrer} className="flex justify-between text-sm py-1"><span className="text-white/60 truncate">{r.referrer}</span><span className="text-white/40">{r.count}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blog publisher — paste markdown, publish instantly (auto sitemap + IndexNow) */}
        <h1 className="text-2xl font-medium tracking-tight mb-2">Blog Publisher</h1>
        <p className="text-white/40 text-sm mb-6">Paste a Markdown article and publish. Auto-added to the sitemap + pinged to IndexNow. Keep each post genuinely useful — Google penalizes mass low-value content.</p>

        <div className="glass-card rounded-xl p-5 mb-6 space-y-3">
          <input value={bTitle} onChange={e => setBTitle(e.target.value)} placeholder="Title"
            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30" />
          <div className="flex gap-3">
            <input value={bSlug} onChange={e => setBSlug(e.target.value)} placeholder="slug (optional — auto from title)"
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30" />
            <input value={bCategory} onChange={e => setBCategory(e.target.value)} placeholder="Category"
              className="w-40 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30" />
          </div>
          <input value={bExcerpt} onChange={e => setBExcerpt(e.target.value)} placeholder="Excerpt (meta description — 150-160 chars)"
            className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30" />
          <textarea value={bContent} onChange={e => setBContent(e.target.value)} placeholder="Paste Markdown content here…" rows={12}
            className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30 font-mono resize-y" />
          <div className="flex items-center justify-between gap-3">
            <span className={`text-xs ${bMsg.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>{bMsg}</span>
            <button onClick={publishPost} disabled={bLoading} className="btn-primary !py-2 text-sm disabled:opacity-50">
              {bLoading ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </div>

        {bPosts.length > 0 && (
          <div className="glass-card rounded-xl p-4 mb-10">
            <p className="text-xs text-white/40 mb-3">Published posts ({bPosts.length})</p>
            <div className="space-y-1.5">
              {bPosts.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-3 text-sm py-1">
                  <a href={`/blog/${p.slug}`} target="_blank" className="text-white/60 hover:text-accent-400 truncate">{p.title}</a>
                  <button onClick={() => deletePost(p.slug)} className="text-white/25 hover:text-red-400 text-xs flex-shrink-0">delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-white/[0.06] pt-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Admin — Reddit Marketing</h1>
        <p className="text-white/40 text-sm mb-8">Analyze sites, get ready-to-post Reddit content + shareable report cards.</p>

        {/* Quick analyze */}
        <div className="glass-card rounded-xl p-4 mb-8 flex gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="Enter URL to analyze for Reddit post..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
            onKeyDown={e => e.key === 'Enter' && analyze()}
          />
          <button onClick={analyze} disabled={loading} className="btn-primary !py-2 text-sm flex items-center gap-1.5 disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.map(r => {
            const domain = (() => { try { return new URL(r.url).hostname; } catch { return r.url; } })();
            const scoreColor = r.score >= 80 ? 'text-emerald-400' : r.score >= 60 ? 'text-amber-400' : 'text-red-400';
            const redditPost = getRedditPost(r);
            const cardUrl = `https://seosnapshot.dev/card/${r.id}`;
            const reportUrl = `https://seosnapshot.dev/report/${r.id}`;

            return (
              <div key={r.id} className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold font-mono ${scoreColor}`}>{r.score}</span>
                    <div>
                      <p className="text-sm font-medium text-white/80">{domain}</p>
                      <p className="text-xs text-white/30">{r.issues.length} issues · Security: {r.security?.grade || '?'}</p>
                    </div>
                  </div>
                </div>

                {/* Top issues preview */}
                <div className="space-y-1 mb-4">
                  {r.issues.slice(0, 3).map((issue, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${issue.severity === 'critical' ? 'bg-red-400' : 'bg-amber-400'}`} />
                      <span className="text-white/50 truncate">{issue.problem}</span>
                      {issue.impact && <span className="text-emerald-400/50 flex-shrink-0">+{issue.impact}</span>}
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
                  <button onClick={() => handleCopy(redditPost, `reddit-${r.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition">
                    {copied === `reddit-${r.id}` ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Reddit Post</>}
                  </button>
                  <button onClick={() => handleCopy(cardUrl, `card-${r.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-500/10 text-accent-400 text-xs font-medium hover:bg-accent-500/20 transition">
                    {copied === `card-${r.id}` ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Image className="w-3.5 h-3.5" /> Card Link</>}
                  </button>
                  <button onClick={() => handleCopy(reportUrl, `report-${r.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/50 text-xs font-medium hover:bg-white/[0.1] transition">
                    {copied === `report-${r.id}` ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><ExternalLink className="w-3.5 h-3.5" /> Report Link</>}
                  </button>
                  <a href={`/card/${r.id}`} target="_blank"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/50 text-xs font-medium hover:bg-white/[0.1] transition">
                    <ExternalLink className="w-3.5 h-3.5" /> View Card
                  </a>
                </div>

                {/* Reddit post preview — always show */}
                <details className="mt-3">
                  <summary className="text-[10px] text-white/25 cursor-pointer hover:text-white/40 transition">Show Reddit post text</summary>
                  <pre className="mt-2 p-3 rounded-lg bg-white/[0.03] text-xs text-white/50 whitespace-pre-wrap break-words font-mono leading-relaxed select-all">{redditPost}</pre>
                </details>
              </div>
            );
          })}
        </div>

        {results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm mb-2">Analyze a site to generate Reddit-ready content</p>
            <p className="text-white/15 text-xs">Each analysis generates: Reddit post text + visual report card + shareable link</p>
          </div>
        )}
        </div>
      </div>

      {/* Manual copy modal (fallback for HTTP) */}
      {showText && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowText(null)}>
          <div className="bg-surface rounded-xl border border-white/[0.08] p-5 max-w-lg w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Copy this text (Ctrl+A, Ctrl+C)</span>
              <button onClick={() => setShowText(null)} className="text-white/30 hover:text-white/60 text-lg">&times;</button>
            </div>
            <textarea readOnly value={showText} className="w-full h-64 bg-white/[0.04] rounded-lg p-3 text-xs text-white/70 font-mono resize-none outline-none select-all" onFocus={e => e.target.select()} />
          </div>
        </div>
      )}
    </div>
  );
}
