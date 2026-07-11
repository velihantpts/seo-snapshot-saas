'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

const field = 'w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

// Google truncates snippets by pixel width, not character count. We measure the
// real rendered width with a canvas so the preview matches what Google shows.
let ctx: CanvasRenderingContext2D | null = null;
function measure(text: string, font: string): number {
  if (typeof document === 'undefined') return text.length * 8;
  if (!ctx) ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return text.length * 8;
  ctx.font = font;
  return ctx.measureText(text).width;
}
function truncateToWidth(text: string, font: string, maxPx: number): { text: string; truncated: boolean } {
  if (measure(text, font) <= maxPx) return { text, truncated: false };
  let lo = 0, hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (measure(text.slice(0, mid) + '…', font) <= maxPx) lo = mid; else hi = mid - 1;
  }
  return { text: text.slice(0, lo).trimEnd() + '…', truncated: true };
}

function breadcrumb(url: string) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    return [u.hostname.replace(/^www\./, ''), ...parts].join(' › ');
  } catch { return url || 'example.com'; }
}

export default function SerpSnippetPreviewClient() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const limits = device === 'desktop'
    ? { titleFont: '20px Arial', titlePx: 600, descFont: '14px Arial', descPx: 920 }
    : { titleFont: '18px Arial', titlePx: 460, descFont: '14px Arial', descPx: 1180 };

  const t = title || 'Your title tag — this is the clickable blue link on Google';
  const d = description || 'Your meta description appears here. Google shows roughly two lines and truncates the rest based on pixel width, so front-load your most important words and keyword.';

  const titleRes = useMemo(() => truncateToWidth(t, limits.titleFont, limits.titlePx), [t, limits.titleFont, limits.titlePx]);
  const descRes = useMemo(() => truncateToWidth(d, limits.descFont, limits.descPx), [d, limits.descFont, limits.descPx]);
  const titleW = Math.round(measure(t, limits.titleFont));
  const descW = Math.round(measure(d, limits.descFont));

  const pill = (ok: boolean) => `text-xs ${ok ? 'text-emerald-400' : 'text-amber-400'}`;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Page URL</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" className={field} />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs text-white/60 mb-1.5">
            <span>Title tag</span>
            <span className={pill(!titleRes.truncated)}>{titleW}px {titleRes.truncated ? '· truncated' : '· fits'}</span>
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Your Page Title | Brand" className={field} />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs text-white/60 mb-1.5">
            <span>Meta description</span>
            <span className={pill(!descRes.truncated)}>{descW}px {descRes.truncated ? '· truncated' : '· fits'}</span>
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A compelling summary with your primary keyword near the start." rows={4} className={field} />
        </div>
        <div className="inline-flex rounded-lg border border-white/[0.08] p-0.5 bg-white/[0.02]">
          {(['desktop', 'mobile'] as const).map(dv => (
            <button key={dv} onClick={() => setDevice(dv)}
              className={`px-4 py-1.5 rounded-md text-xs capitalize transition ${device === dv ? 'bg-accent-500/20 text-accent-300' : 'text-white/60 hover:text-white/70'}`}>
              {dv}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-white/60 mb-2">Google preview ({device})</p>
        <div className={`bg-white rounded-lg p-4 ${device === 'mobile' ? 'max-w-sm' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">S</div>
            <div className="leading-tight">
              <p className="text-[13px] text-gray-800">{breadcrumb(url).split(' › ')[0]}</p>
              <p className="text-[12px] text-gray-500">{breadcrumb(url)}</p>
            </div>
          </div>
          <p className="text-[#1a0dab] text-xl leading-snug hover:underline cursor-pointer" style={{ fontFamily: 'Arial, sans-serif' }}>{titleRes.text}</p>
          <p className="text-[#4d5156] text-sm mt-1 leading-snug" style={{ fontFamily: 'Arial, sans-serif' }}>{descRes.text}</p>
        </div>

        <div className="mt-4 glass-card rounded-lg p-4 text-center">
          <p className="text-white/50 text-sm mb-2">See how your live title &amp; description actually render?</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
