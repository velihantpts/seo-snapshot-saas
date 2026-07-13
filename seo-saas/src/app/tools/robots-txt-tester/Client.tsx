'use client';
import { useState, useMemo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

interface Rule { allow: boolean; path: string; }
interface Group { agents: string[]; rules: Rule[]; }

function parse(txt: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let expectingAgent = false;
  for (const raw of txt.split('\n')) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const val = line.slice(idx + 1).trim();
    if (key === 'user-agent') {
      if (!current || !expectingAgent) { current = { agents: [], rules: [] }; groups.push(current); }
      current.agents.push(val.toLowerCase());
      expectingAgent = true;
    } else if (key === 'allow' || key === 'disallow') {
      if (!current) { current = { agents: ['*'], rules: [] }; groups.push(current); }
      expectingAgent = false;
      current.rules.push({ allow: key === 'allow', path: val });
    }
  }
  return groups;
}

// Google-style path match: * is a wildcard, trailing $ anchors the end.
function pathMatches(pattern: string, path: string): boolean {
  if (pattern === '') return false; // empty Disallow = allow all, handled by caller
  let p = pattern, anchored = false;
  if (p.endsWith('$')) { anchored = true; p = p.slice(0, -1); }
  const reStr = '^' + p.split('*').map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + (anchored ? '$' : '');
  try { return new RegExp(reStr).test(path); } catch { return false; }
}

function evaluate(groups: Group[], ua: string, path: string) {
  if (!groups.length) return { allowed: true, reason: 'No rules — everything is allowed by default.', rule: '' };
  const uaLower = ua.toLowerCase();
  // Pick the most specific matching group (exact/substring beats *).
  let best: Group | null = null, bestScore = -1;
  for (const g of groups) {
    for (const a of g.agents) {
      let score = -1;
      if (a === '*') score = 0;
      else if (uaLower.includes(a)) score = a.length;
      if (score > bestScore) { bestScore = score; best = g; }
    }
  }
  if (!best) return { allowed: true, reason: 'No matching user-agent group — allowed by default.', rule: '' };
  // Find the longest matching rule; Allow wins ties.
  let winner: Rule | null = null, winLen = -1;
  for (const r of best.rules) {
    if (r.path === '' ) { // empty Disallow = allow all; empty Allow = no-op
      continue;
    }
    if (pathMatches(r.path, path)) {
      const len = r.path.length;
      if (len > winLen || (len === winLen && r.allow)) { winLen = len; winner = r; }
    }
  }
  if (!winner) return { allowed: true, reason: `No rule in the matched group blocks this path.`, rule: '', agents: best.agents };
  return {
    allowed: winner.allow,
    reason: winner.allow ? 'An Allow rule explicitly permits this path.' : 'A Disallow rule blocks this path.',
    rule: `${winner.allow ? 'Allow' : 'Disallow'}: ${winner.path}`,
    agents: best.agents,
  };
}

const SAMPLE = `User-agent: *
Disallow: /admin/
Disallow: /cart/
Allow: /admin/public/
Disallow: /*?sort=

Sitemap: https://example.com/sitemap.xml`;

export default function RobotsTxtTesterClient() {
  const [txt, setTxt] = useState(SAMPLE);
  const [path, setPath] = useState('/admin/public/report');
  const [ua, setUa] = useState('Googlebot');

  const result = useMemo(() => {
    let p = path.trim();
    try { if (/^https?:\/\//.test(p)) { const u = new URL(p); p = u.pathname + u.search; } } catch { /* keep raw */ }
    if (!p.startsWith('/')) p = '/' + p;
    return evaluate(parse(txt), ua.trim() || '*', p);
  }, [txt, path, ua]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Your robots.txt</label>
        <textarea value={txt} onChange={(e) => setTxt(e.target.value)} rows={14} spellCheck={false} className={`${field} font-mono text-[13px] leading-relaxed resize-y`} />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-white/50 mb-1.5">URL or path to test</label>
          <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/admin/public/report" className={`${field} font-mono`} />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">User-agent</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {['Googlebot', 'Googlebot-Image', 'Bingbot', '*'].map((a) => (
              <button key={a} onClick={() => setUa(a === '*' ? '*' : a)} className={`text-xs px-2.5 py-1 rounded-lg border transition ${ua === a ? 'bg-accent-500/20 text-accent-300 border-accent-500/30' : 'bg-white/[0.03] text-white/60 border-white/[0.06] hover:text-white/70'}`}>{a}</button>
            ))}
          </div>
          <input value={ua} onChange={(e) => setUa(e.target.value)} className={`${field} font-mono`} />
        </div>

        <div className={`glass-card rounded-xl p-5 border ${result.allowed ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
          <div className="flex items-center gap-2.5">
            {result.allowed
              ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              : <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
            <span className={`text-base font-medium ${result.allowed ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.allowed ? 'Allowed' : 'Blocked'}
            </span>
          </div>
          <p className="text-sm text-white/60 mt-2 leading-relaxed">{result.reason}</p>
          {result.rule && <p className="text-[13px] font-mono text-white/50 mt-2">Matched rule → <span className="text-accent-300">{result.rule}</span></p>}
        </div>
        <p className="text-xs text-white/50 leading-relaxed">
          Follows Google&apos;s matching rules: the most specific (longest) path wins, <span className="font-mono text-white/60">*</span> is a wildcard, a trailing <span className="font-mono text-white/60">$</span> anchors the end, and an Allow beats a Disallow of equal length. Remember: robots.txt controls crawling, not indexing — to keep a page out of results use a noindex tag instead.
        </p>
      </div>
    </div>
  );
}
