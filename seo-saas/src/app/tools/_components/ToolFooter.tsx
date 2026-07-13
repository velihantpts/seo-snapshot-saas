'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { relatedTools } from '@/lib/tools-catalog';

// Drop-in replacement for <ToolCta />. Derives the current tool slug from the
// URL and renders a "Related tools" strip (discovery + keeps users on-site)
// above the funnel CTA — no per-page slug prop needed.
export function ToolFooter() {
  const pathname = usePathname();
  const slug = pathname?.split('/tools/')[1]?.replace(/\/$/, '') || '';
  const related = relatedTools(slug, 4);

  return (
    <>
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Related tools</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((t) => {
              const Icon = t.icon;
              return (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="group glass-card rounded-xl p-4 flex items-start gap-3 hover:border-accent-500/30 hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent-500/10 border border-accent-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-500/15 transition-colors">
                    <Icon className="w-4 h-4 text-accent-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium text-white/90 group-hover:text-accent-200 transition-colors">{t.title}</h3>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{t.short}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-12 glass-card rounded-2xl p-7 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-500/[0.08] to-transparent pointer-events-none" />
        <div className="relative">
          <p className="text-white/70 text-sm mb-1.5">This tool solves one thing.</p>
          <p className="text-white/50 text-sm mb-5">Scan a live URL against 100 on-page checks — with the code to fix each issue.</p>
          <Link href="/" className="btn-primary text-sm inline-flex items-center gap-2">Analyze any URL free <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </>
  );
}
