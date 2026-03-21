'use client';
import { useState } from 'react';
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

const ADMIN_EMAIL = 'velihantpts@gmail.com';
const ADMIN_PASS = 'adminvelihan123';

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials');
    }
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
    } catch {}
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
Full report: http://204.168.173.85/report/${r.id}

---
Tool: http://204.168.173.85 (free, no signup needed)`;
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
            const cardUrl = `http://204.168.173.85/card/${r.id}`;
            const reportUrl = `http://204.168.173.85/report/${r.id}`;

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
