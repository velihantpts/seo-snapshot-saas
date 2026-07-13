'use client';
import { useState, useMemo } from 'react';

const field = 'w-full px-3 py-3 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30 leading-relaxed resize-y';

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return word.length ? 1 : 0;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = word.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

function grade(fk: number): string {
  if (fk <= 5) return '5th grade';
  if (fk <= 8) return `${Math.round(fk)}th grade`;
  if (fk <= 12) return `${Math.round(fk)}th grade (high school)`;
  if (fk <= 15) return 'College';
  return 'College graduate';
}

function easeLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Very easy', color: 'text-emerald-400' };
  if (score >= 60) return { label: 'Plain English', color: 'text-emerald-400' };
  if (score >= 50) return { label: 'Fairly difficult', color: 'text-amber-400' };
  if (score >= 30) return { label: 'Difficult', color: 'text-amber-400' };
  return { label: 'Very difficult', color: 'text-red-400' };
}

export default function ReadabilityClient() {
  const [text, setText] = useState('');

  const r = useMemo(() => {
    const words = (text.match(/[A-Za-z0-9']+/g) || []);
    const sentences = Math.max(1, (text.match(/[.!?]+(?:\s|$)/g) || []).length);
    const wordCount = words.length;
    if (wordCount === 0) return null;
    const syllables = words.reduce((s, w) => s + countSyllables(w), 0);
    const complex = words.filter((w) => countSyllables(w) >= 3).length;
    const wps = wordCount / sentences;
    const spw = syllables / wordCount;
    const ease = Math.max(0, Math.min(100, 206.835 - 1.015 * wps - 84.6 * spw));
    const fk = Math.max(0, 0.39 * wps - 15.59 + 11.8 * spw);
    return { wordCount, sentences, wps, ease, fk, complex };
  }, [text]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} placeholder="Paste your article or copy here to score its readability…" className={field} />

      <div>
        {!r ? (
          <div className="glass-card rounded-xl p-8 text-center text-white/40 text-sm min-h-[300px] flex items-center justify-center">Paste text to score its readability…</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-4">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Reading ease</div>
                <div className={`text-2xl font-semibold tabular-nums ${easeLabel(r.ease).color}`}>{Math.round(r.ease)}</div>
                <div className={`text-xs mt-0.5 ${easeLabel(r.ease).color}`}>{easeLabel(r.ease).label}</div>
              </div>
              <div className="glass-card rounded-xl p-4">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Grade level</div>
                <div className="text-2xl font-semibold text-white/90 tabular-nums">{r.fk.toFixed(1)}</div>
                <div className="text-xs text-white/50 mt-0.5">{grade(r.fk)}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Words', value: r.wordCount.toLocaleString() },
                { label: 'Avg words/sentence', value: r.wps.toFixed(1) },
                { label: 'Complex words', value: `${Math.round((r.complex / r.wordCount) * 100)}%` },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-lg p-3 text-center">
                  <div className="text-base font-semibold text-white/90 tabular-nums">{s.value}</div>
                  <div className="text-[9px] text-white/50 uppercase tracking-wider mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-white/50 mt-3 leading-relaxed">
          Aim for a Reading Ease of 60+ (roughly 8th–9th grade) for most web content — it&apos;s the range most readers scan comfortably. To lift the score: shorten sentences and swap long words for short ones. The two biggest levers are words-per-sentence and syllables-per-word.
        </p>
      </div>
    </div>
  );
}
