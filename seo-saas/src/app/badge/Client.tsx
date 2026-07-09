'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Copy, CheckCircle } from 'lucide-react';

export default function BadgeClient() {
  const [score, setScore] = useState(85);
  const [copied, setCopied] = useState('');

  const badgeUrl = `https://seosnapshot.dev/api/badge?score=${score}`;
  const html = `<a href="https://seosnapshot.dev" title="SEO analyzed by SEO Snapshot">\n  <img src="${badgeUrl}" alt="SEO Score: ${score}/100 by SEO Snapshot" width="108" height="20">\n</a>`;
  const markdown = `[![SEO Score: ${score}/100](${badgeUrl})](https://seosnapshot.dev)`;

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-xl p-6">
        <label className="block text-xs text-white/40 mb-3">Preview your score</label>
        <div className="flex items-center gap-4 mb-4">
          <input type="range" min={0} max={100} value={score} onChange={e => setScore(parseInt(e.target.value))} className="flex-1 accent-accent-500" />
          <span className="text-lg font-mono w-12 text-right text-white/80">{score}</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/api/badge?score=${score}`} alt={`SEO Score ${score}/100`} width={108} height={20} />
      </div>

      {[
        { key: 'html', label: 'HTML', code: html },
        { key: 'md', label: 'Markdown', code: markdown },
      ].map(block => (
        <div key={block.key}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/40">{block.label}</span>
            <button onClick={() => copy(block.code, block.key)} className="flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition">
              {copied === block.key ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
          <pre className="glass-card rounded-lg p-4 text-xs text-white/70 font-mono whitespace-pre-wrap break-words">{block.code}</pre>
        </div>
      ))}

      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-white/60 text-sm mb-3">Don&apos;t know your score yet?</p>
        <Link href="/" className="btn-primary text-sm">Analyze your site free</Link>
      </div>
    </div>
  );
}
