'use client';
import { useState } from 'react';
import { Link2, CheckCircle } from 'lucide-react';
import { buildShareUrl } from '@/lib/share-state';

// Copies a shareable URL that reproduces the current tool inputs. Pass the
// fields you want encoded; empty values are dropped.
export function ShareButton({ params, label = 'Share link', className = '' }: { params: Record<string, string | undefined>; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const share = () => {
    const url = buildShareUrl(params);
    if (!url) return;
    navigator.clipboard?.writeText(url);
    try { window.history.replaceState(null, '', url); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={share} className={`flex items-center gap-1.5 text-xs text-accent-400 hover:text-accent-300 transition ${className}`}>
      {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Link copied</> : <><Link2 className="w-3.5 h-3.5" /> {label}</>}
    </button>
  );
}
