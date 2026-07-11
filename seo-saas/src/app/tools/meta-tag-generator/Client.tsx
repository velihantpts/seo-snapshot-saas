'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle } from 'lucide-react';

export default function MetaTagGeneratorClient() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [siteName, setSiteName] = useState('');
  const [twitter, setTwitter] = useState('');
  const [copied, setCopied] = useState(false);

  const esc = (s: string) => s.replace(/"/g, '&quot;');
  const lines: string[] = [];
  if (title) lines.push(`<title>${esc(title)}</title>`);
  if (description) lines.push(`<meta name="description" content="${esc(description)}">`);
  if (url) lines.push(`<link rel="canonical" href="${esc(url)}">`);
  lines.push('');
  lines.push('<!-- Open Graph -->');
  if (title) lines.push(`<meta property="og:title" content="${esc(title)}">`);
  if (description) lines.push(`<meta property="og:description" content="${esc(description)}">`);
  if (url) lines.push(`<meta property="og:url" content="${esc(url)}">`);
  if (image) lines.push(`<meta property="og:image" content="${esc(image)}">`);
  if (siteName) lines.push(`<meta property="og:site_name" content="${esc(siteName)}">`);
  lines.push('<meta property="og:type" content="website">');
  lines.push('');
  lines.push('<!-- Twitter -->');
  lines.push(`<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`);
  if (title) lines.push(`<meta name="twitter:title" content="${esc(title)}">`);
  if (description) lines.push(`<meta name="twitter:description" content="${esc(description)}">`);
  if (image) lines.push(`<meta name="twitter:image" content="${esc(image)}">`);
  if (twitter) lines.push(`<meta name="twitter:site" content="${esc(twitter.startsWith('@') ? twitter : '@' + twitter)}">`);
  const output = lines.join('\n');

  const copy = () => {
    navigator.clipboard?.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const titleColor = title.length === 0 ? 'text-white/30' : title.length <= 60 ? 'text-emerald-400' : 'text-amber-400';
  const descColor = description.length === 0 ? 'text-white/30' : description.length <= 160 ? 'text-emerald-400' : 'text-amber-400';

  const field = 'w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder:text-white/30 outline-none focus:border-accent-500/30';

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="flex items-center justify-between text-xs text-white/60 mb-1.5">
            <span>Title tag</span><span className={titleColor}>{title.length}/60</span>
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Your Page Title | Brand" className={field} />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs text-white/60 mb-1.5">
            <span>Meta description</span><span className={descColor}>{description.length}/160</span>
          </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="A compelling 150-160 character summary with your keyword." rows={3} className={field} />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">Canonical URL</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/page" className={field} />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1.5">OG image URL</label>
          <input value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/og.png (1200x630)" className={field} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Site name</label>
            <input value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="Brand" className={field} />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Twitter handle</label>
            <input value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="@brand" className={field} />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-white/60">Generated tags</span>
          <button onClick={copy} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
            {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
        </div>
        <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words min-h-[300px] overflow-auto">{output || 'Fill the fields to generate meta tags…'}</pre>
        <div className="mt-4 glass-card rounded-lg p-4 text-center">
          <p className="text-white/50 text-sm mb-2">Want to check tags on a live page?</p>
          <Link href="/" className="btn-primary text-sm">Analyze any URL free</Link>
        </div>
      </div>
    </div>
  );
}
