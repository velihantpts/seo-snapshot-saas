'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { readShareParams } from '@/lib/share-state';
import { ShareButton } from '../_components/ShareButton';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

// Google truncates by pixel width, not characters. These are the widely-cited
// desktop limits: ~600px for the title, ~920px for the description.
const TITLE_PX = 600;
const DESC_PX = 920;

interface Measured { chars: number; px: number; over: boolean; ratio: number; }

export default function TitleMetaLengthClient() {
  const [title, setTitle] = useState('Free SEO Analyzer with Copy-Paste Fix Code | SEO Snapshot');
  const [desc, setDesc] = useState('Scan any URL against 100 on-page checks and get the exact code to fix every issue — meta tags, security headers, Core Web Vitals. Free, no signup.');
  const canvasRef = useRef<CanvasRenderingContext2D | null>(null);
  const [t, setT] = useState<Measured>({ chars: 0, px: 0, over: false, ratio: 0 });
  const [d, setD] = useState<Measured>({ chars: 0, px: 0, over: false, ratio: 0 });

  const measure = useCallback((text: string, font: string, limit: number): Measured => {
    const ctx = canvasRef.current;
    const px = ctx ? (() => { ctx.font = font; return Math.round(ctx.measureText(text).width); })() : 0;
    return { chars: text.length, px, over: px > limit, ratio: Math.min(1, px / limit) };
  }, []);

  useEffect(() => {
    const c = document.createElement('canvas');
    canvasRef.current = c.getContext('2d');
    const p = readShareParams();
    if (p.t) setTitle(p.t);
    if (p.d) setDesc(p.d);
    setT(measure(p.t || title, '400 20px Arial, sans-serif', TITLE_PX));
    setD(measure(p.d || desc, '400 14px Arial, sans-serif', DESC_PX));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setT(measure(title, '400 20px Arial, sans-serif', TITLE_PX)); }, [title, measure]);
  useEffect(() => { setD(measure(desc, '400 14px Arial, sans-serif', DESC_PX)); }, [desc, measure]);

  const bar = (m: Measured) => (
    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all ${m.over ? 'bg-amber-400' : 'bg-accent-400'}`}
        style={{ width: `${Math.max(3, m.ratio * 100)}%` }}
      />
    </div>
  );

  const readout = (m: Measured, limit: number) => (
    <div className="flex items-center justify-between text-[11px] mt-1.5 tabular-nums">
      <span className="text-white/45">{m.chars} chars</span>
      <span className={m.over ? 'text-amber-400' : 'text-white/60'}>{m.px} / {limit} px {m.over ? '· will truncate' : '· fits'}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-xs text-white/50 mb-1.5">Title tag</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your page title…" className={field} />
        {bar(t)}
        {readout(t, TITLE_PX)}
      </div>

      <div>
        <label className="block text-xs text-white/50 mb-1.5">Meta description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Your meta description…" className={`${field} resize-y leading-relaxed`} />
        {bar(d)}
        {readout(d, DESC_PX)}
      </div>

      {/* Live Google-style preview */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50 uppercase tracking-wider">Google preview</span>
          <ShareButton params={{ t: title, d: desc }} label="Share preview" />
        </div>
        <div className="glass-card rounded-lg p-4">
          <div className="text-[13px] text-white/40 truncate">seosnapshot.dev</div>
          <div className="text-[18px] text-[#8ab4f8] leading-snug mt-0.5" style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {title || 'Your title tag'}
          </div>
          <div className="text-[13px] text-white/60 leading-snug mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {desc || 'Your meta description will appear here…'}
          </div>
        </div>
        <p className="text-xs text-white/50 mt-3 leading-relaxed">
          The bars turn amber when you cross Google&apos;s desktop pixel limits (~{TITLE_PX}px title, ~{DESC_PX}px description). Because it measures pixels, a title full of wide letters (W, M) truncates sooner than one with narrow ones — which character counts miss. Front-load your key phrase so it survives truncation.
        </p>
      </div>
    </div>
  );
}
