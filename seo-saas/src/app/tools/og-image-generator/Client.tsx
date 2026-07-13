'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Download } from 'lucide-react';
import Link from 'next/link';

const field = 'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';
const W = 1200, H = 630;

const THEMES: Record<string, { bg: string; bg2: string; text: string; muted: string }> = {
  Midnight: { bg: '#0b0f17', bg2: '#15213b', text: '#ffffff', muted: '#93a0b3' },
  Slate: { bg: '#1e293b', bg2: '#0f172a', text: '#ffffff', muted: '#94a3b8' },
  Plum: { bg: '#1a1024', bg2: '#3b1d52', text: '#ffffff', muted: '#c4b5d4' },
  Forest: { bg: '#0c1a14', bg2: '#123528', text: '#ffffff', muted: '#8fbfa9' },
  Light: { bg: '#f8fafc', bg2: '#e2e8f0', text: '#0f172a', muted: '#475569' },
};

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

export default function OgImageClient() {
  const [title, setTitle] = useState('How to Fix Core Web Vitals');
  const [subtitle, setSubtitle] = useState('A practical guide for developers');
  const [site, setSite] = useState('seosnapshot.dev');
  const [theme, setTheme] = useState('Midnight');
  const [accent, setAccent] = useState('#5b9dff');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const t = THEMES[theme];

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, t.bg2);
    g.addColorStop(1, t.bg);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Accent glow blob (top-right)
    const glow = ctx.createRadialGradient(W - 120, 80, 40, W - 120, 80, 520);
    glow.addColorStop(0, accent + '33');
    glow.addColorStop(1, accent + '00');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const padX = 90;
    // Accent bar
    ctx.fillStyle = accent;
    ctx.fillRect(padX, 150, 64, 6);

    // Title
    ctx.fillStyle = t.text;
    ctx.font = '700 68px system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
    ctx.textBaseline = 'top';
    const lines = wrap(ctx, title || ' ', W - padX * 2);
    let y = 196;
    for (const ln of lines) { ctx.fillText(ln, padX, y); y += 84; }

    // Subtitle
    if (subtitle) {
      ctx.fillStyle = t.muted;
      ctx.font = '400 34px system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
      const subLines = wrap(ctx, subtitle, W - padX * 2).slice(0, 2);
      y += 12;
      for (const ln of subLines) { ctx.fillText(ln, padX, y); y += 46; }
    }

    // Site label (bottom-left)
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(padX + 10, H - 76, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = t.muted;
    ctx.font = '600 26px system-ui, -apple-system, "Segoe UI", Arial, sans-serif';
    ctx.fillText(site, padX + 32, H - 90);
  }, [title, subtitle, site, theme, accent]);

  useEffect(() => { draw(); }, [draw]);

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'og-image.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Subtitle</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={field} />
        </div>
        <div>
          <label className="block text-xs text-white/50 mb-1.5">Site / handle</label>
          <input value={site} onChange={(e) => setSite(e.target.value)} className={field} />
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <div>
            <div className="text-xs text-white/50 mb-1.5">Theme</div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(THEMES).map((name) => (
                <button key={name} onClick={() => setTheme(name)} className={`text-xs px-2.5 py-1 rounded-lg border transition ${theme === name ? 'bg-accent-500/20 text-accent-300 border-accent-500/30' : 'bg-white/[0.03] text-white/60 border-white/[0.06] hover:text-white/70'}`}>{name}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1.5">Accent</div>
            <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-10 h-8 rounded cursor-pointer bg-transparent border border-white/[0.08]" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Preview · 1200 × 630</div>
        <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-lg border border-white/[0.08]" />
        <button onClick={download} className="btn-primary text-sm flex items-center gap-2 mt-3 w-full justify-center">
          <Download className="w-4 h-4" /> Download PNG
        </button>
        <p className="text-xs text-white/50 mt-3 leading-relaxed">
          1200 × 630 is the standard Open Graph size for Facebook, LinkedIn, and X large cards. Download the PNG, host it on your site, then reference it with <span className="font-mono text-white/60">og:image</span> — the <Link href="/tools/meta-tag-generator" className="text-accent-400 hover:text-accent-300">meta tag generator</Link> writes the tags for you.
        </p>
      </div>
    </div>
  );
}
