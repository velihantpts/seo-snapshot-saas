'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle, AlertTriangle } from 'lucide-react';

const field = 'w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

function hostFrom(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url || 'example.com'; }
}

export default function OpenGraphPreviewClient() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [siteName, setSiteName] = useState('');
  const [copied, setCopied] = useState(false);

  const host = hostFrom(url);
  const t = title || 'Your page title goes here';
  const d = description || 'Your meta description preview — this is roughly what people see when your link is shared on social platforms.';

  const esc = (s: string) => s.replace(/"/g, '&quot;');
  const tags = [
    '<!-- Open Graph -->',
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    url && `<meta property="og:url" content="${esc(url)}">`,
    siteName && `<meta property="og:site_name" content="${esc(siteName)}">`,
    '<meta property="og:type" content="website">',
    '',
    '<!-- Twitter / X -->',
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    `<meta name="twitter:image" content="${esc(image)}">`,
  ].filter(Boolean).join('\n');

  const copy = () => {
    navigator.clipboard?.writeText(tags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const warnings: string[] = [];
  if (!image) warnings.push('No og:image — shared links will look bare and get far fewer clicks. Add a 1200×630 image.');
  if (title && title.length > 60) warnings.push(`Title is ${title.length} chars — most platforms truncate around 60.`);
  if (description && description.length > 200) warnings.push(`Description is ${description.length} chars — keep it under ~200 to avoid truncation.`);

  const ImgBox = ({ h }: { h: string }) => (
    image
      ? <img src={image} alt="" className={`w-full ${h} object-cover bg-white/[0.03]`} onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
      : <div className={`w-full ${h} bg-white/[0.04] flex items-center justify-center text-white/25 text-xs`}>1200 × 630 og:image</div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Page URL</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" className={field} />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs text-white/60 mb-1.5">
            <span>og:title</span><span className={title.length > 60 ? 'text-amber-400' : 'text-white/30'}>{title.length}/60</span>
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Your Page Title" className={field} />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs text-white/60 mb-1.5">
            <span>og:description</span><span className={description.length > 200 ? 'text-amber-400' : 'text-white/30'}>{description.length}</span>
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A short, compelling summary of the page." rows={3} className={field} />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">og:image URL (1200×630)</label>
          <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/og.png" className={field} />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">og:site_name</label>
          <input value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="Brand" className={field} />
        </div>

        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map(w => (
              <div key={w} className="flex items-start gap-2 text-xs text-amber-400/90 bg-amber-500/[0.06] border border-amber-500/15 rounded-lg p-2.5">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/60">Generated tags</span>
            <button onClick={copy} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
              {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words overflow-auto">{tags}</pre>
        </div>
      </div>

      {/* Live previews */}
      <div className="space-y-6">
        <div>
          <p className="text-xs text-white/60 mb-2">Facebook / LinkedIn</p>
          <div className="rounded-lg overflow-hidden border border-white/[0.08] bg-white/[0.02] max-w-md">
            <ImgBox h="h-52" />
            <div className="p-3 bg-white/[0.03]">
              <p className="text-[11px] uppercase tracking-wide text-white/55">{host}</p>
              <p className="text-sm text-white/90 font-medium leading-snug line-clamp-2 mt-0.5">{t}</p>
              <p className="text-xs text-white/65 line-clamp-2 mt-1">{d}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/60 mb-2">X / Twitter (summary_large_image)</p>
          <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02] max-w-md">
            <ImgBox h="h-52" />
            <div className="p-3">
              <p className="text-sm text-white/90 leading-snug line-clamp-1">{t}</p>
              <p className="text-xs text-white/65 line-clamp-2 mt-0.5">{d}</p>
              <p className="text-xs text-white/55 mt-1">{host}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/60 mb-2">Discord / Slack</p>
          <div className="rounded-lg border-l-4 border-accent-500/50 bg-white/[0.03] p-3 max-w-md">
            {siteName && <p className="text-[11px] text-white/60 mb-0.5">{siteName}</p>}
            <p className="text-sm text-accent-300 font-medium leading-snug line-clamp-2">{t}</p>
            <p className="text-xs text-white/50 line-clamp-3 mt-1">{d}</p>
            {image && <img src={image} alt="" className="mt-2 rounded max-h-40 object-cover w-full" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
          </div>
        </div>

        <div className="glass-card rounded-lg p-4 text-center">
          <p className="text-white/50 text-sm mb-2">Want to see the real tags on a live page?</p>
          <Link href="/" className="btn-primary text-sm">Check any URL free</Link>
        </div>
      </div>
    </div>
  );
}
