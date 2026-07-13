'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Zap, Lock, Sparkles, Server } from 'lucide-react';
import { toolBySlug } from '@/lib/tools-catalog';

// Elite shared header for every tool page: breadcrumb + gradient icon tile +
// H1 + trust chips. Derives the tool from the URL, so no per-page props.
export function ToolHeader() {
  const pathname = usePathname();
  const slug = pathname?.split('/tools/')[1]?.replace(/\/$/, '') || '';
  const tool = toolBySlug.get(slug);

  if (!tool) {
    return (
      <Link href="/tools" className="text-white/60 hover:text-white/80 transition text-sm mb-6 inline-block">← All tools</Link>
    );
  }
  const Icon = tool.icon;

  return (
    <div className="mb-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/40 mb-5">
        <Link href="/tools" className="hover:text-white/70 transition">Tools</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-white/60">{tool.title}</span>
      </nav>

      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500/25 to-accent-500/[0.04] border border-accent-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-accent-300" />
        </div>
        <h1 className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight text-white/95 leading-tight text-balance">{tool.title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-4 text-[11px] text-white/45">
        <span className="inline-flex items-center gap-1.5">
          {tool.backend ? <Server className="w-3.5 h-3.5 text-accent-400" /> : <Zap className="w-3.5 h-3.5 text-accent-400" />}
          {tool.backend ? 'Live URL check' : 'Runs in your browser'}
        </span>
        <span className="inline-flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-accent-400" /> Nothing stored</span>
        <span className="inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-accent-400" /> Free, no signup</span>
      </div>
    </div>
  );
}
