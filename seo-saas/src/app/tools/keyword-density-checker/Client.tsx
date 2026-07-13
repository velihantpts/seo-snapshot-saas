'use client';
import { useState, useMemo } from 'react';

const STOP = new Set('a an and are as at be but by for from has have he her his i in is it its of on or that the to was were will with you your our we they this these those not no can if do does about into over after before then than'.split(' '));

type Gram = 1 | 2 | 3;

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || []).filter((w) => w.length > 1);
}

function ngrams(words: string[], n: number): Map<string, number> {
  const m = new Map<string, number>();
  for (let i = 0; i <= words.length - n; i++) {
    const gram = words.slice(i, i + n);
    if (n === 1 && STOP.has(gram[0])) continue;
    const key = gram.join(' ');
    m.set(key, (m.get(key) || 0) + 1);
  }
  return m;
}

export default function KeywordDensityClient() {
  const [text, setText] = useState('');
  const [gram, setGram] = useState<Gram>(1);

  const stats = useMemo(() => {
    const words = tokenize(text);
    const total = words.length;
    const chars = text.length;
    const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length || (total ? 1 : 0);
    const readMin = total / 200;
    const grams = ngrams(words, gram);
    const denom = Math.max(1, total - gram + 1);
    const rows = Array.from(grams.entries())
      .map(([phrase, count]) => ({ phrase, count, density: (count / denom) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    return { total, chars, sentences, readMin, rows };
  }, [text, gram]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your content here — an article, a page's copy, a draft…"
          rows={16}
          className="w-full px-3 py-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30 leading-relaxed resize-y"
        />
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Words', value: stats.total.toLocaleString() },
            { label: 'Characters', value: stats.chars.toLocaleString() },
            { label: 'Sentences', value: stats.sentences.toLocaleString() },
            { label: 'Read time', value: `${Math.max(1, Math.round(stats.readMin))} min` },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-white/90 tabular-nums">{s.value}</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-white/[0.02]">
            {([1, 2, 3] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGram(g)}
                className={`px-3 py-1.5 rounded-md text-xs transition ${gram === g ? 'bg-accent-500/20 text-accent-300' : 'text-white/60 hover:text-white/70'}`}
              >
                {g === 1 ? '1 word' : `${g} words`}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-white/40">Top {stats.rows.length} · {gram === 1 ? 'stop-words removed' : 'phrases'}</span>
        </div>

        <div className="glass-card rounded-lg overflow-hidden min-h-[300px]">
          {stats.rows.length === 0 ? (
            <div className="p-6 text-sm text-white/40 text-center">Paste text to see keyword density…</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/[0.06]">
                  <th className="text-left font-medium px-4 py-2.5">Keyword</th>
                  <th className="text-right font-medium px-3 py-2.5">Count</th>
                  <th className="text-right font-medium px-4 py-2.5">Density</th>
                </tr>
              </thead>
              <tbody>
                {stats.rows.map((r) => (
                  <tr key={r.phrase} className="border-b border-white/[0.03] last:border-0">
                    <td className="px-4 py-2 text-white/80 font-mono text-[13px]">{r.phrase}</td>
                    <td className="px-3 py-2 text-right text-white/60 tabular-nums">{r.count}</td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      <span className={r.density > 5 ? 'text-amber-400' : 'text-accent-300'}>{r.density.toFixed(1)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-white/50 mt-3 leading-relaxed">
          Density above ~5% for a single word often reads as keyword stuffing. Aim for natural language — write for people, and the keywords fall into place.
        </p>
      </div>
    </div>
  );
}
