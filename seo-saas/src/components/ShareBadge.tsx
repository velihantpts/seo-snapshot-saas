'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Award, Copy, CheckCircle, Share2 } from 'lucide-react';

// Compact "Share your grade" card shown under the score summary. Surfaces a
// one-click embeddable badge so users can broadcast their score — every embed
// links back to seosnapshot.dev and builds backlinks / word-of-mouth.
export function ShareBadge({ score, reportId }: { score: number; reportId?: string }) {
  const [copied, setCopied] = useState(false);

  const linkUrl = reportId
    ? `https://seosnapshot.dev/report/${reportId}`
    : 'https://seosnapshot.dev';
  const embedCode = `<a href="${linkUrl}"><img src="https://seosnapshot.dev/api/badge?score=${score}" alt="SEO Score ${score}/100 by SEO Snapshot"></a>`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!reportId) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: `My SEO Score: ${score}/100`, url: linkUrl });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard?.writeText(linkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 mb-8 print:hidden opacity-0 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-4 h-4 text-accent-400" />
        <h3 className="text-sm font-medium text-white/90">Share your grade</h3>
      </div>
      <p className="text-xs text-white/60 leading-relaxed mb-4">
        Proud of your score? Drop this live badge in your footer, GitHub README, or docs.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Live badge preview */}
        <div className="flex-shrink-0 rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/badge?score=${score}`}
            alt={`SEO Score ${score}/100 by SEO Snapshot`}
            width={108}
            height={20}
          />
        </div>

        {/* Embed code */}
        <div className="flex-1 min-w-0 rounded-lg overflow-hidden border border-white/[0.06]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/[0.04]">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Embed code</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[10px] text-white/60 hover:text-white/80 transition-colors duration-150"
              aria-label="Copy badge embed code"
            >
              {copied ? <><CheckCircle className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy embed code</>}
            </button>
          </div>
          <pre className="p-3 text-xs font-mono overflow-x-auto scrollbar-thin bg-white/[0.02] leading-relaxed whitespace-pre-wrap break-all text-accent-300/70">
            {embedCode}
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4">
        {reportId && (
          <button
            onClick={handleShare}
            className="btn-ghost flex items-center gap-1.5 !px-3 !py-1.5 text-sm"
            aria-label="Share report link"
          >
            <Share2 className="w-3.5 h-3.5 text-white/50" /> Share report
          </button>
        )}
        <Link href="/badge" className="text-sm text-accent-400 hover:text-accent-300 transition-colors duration-150">
          Get your badge →
        </Link>
      </div>
    </div>
  );
}
