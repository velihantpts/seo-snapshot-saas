import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const user = session.user as any;
  const analyses = await prisma.analysis.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const isPro = user.plan === 'pro_monthly' || user.plan === 'pro_lifetime' || user.plan === 'pro';
  const planLabel = user.plan === 'pro_lifetime' ? 'Lifetime' : user.plan === 'pro_monthly' ? 'Pro' : user.plan === 'pro' ? 'Pro' : 'Free';

  // Dashboard stats
  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0 ? Math.round(analyses.reduce((s, a) => s + a.score, 0) / totalAnalyses) : 0;
  const bestScore = totalAnalyses > 0 ? Math.max(...analyses.map(a => a.score)) : 0;
  const uniqueUrls = new Set(analyses.map(a => a.url)).size;

  return (
    <div className="min-h-screen bg-surface relative">
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />


      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium tracking-tight">Dashboard</h1>
            <p className="text-white/30 text-sm mt-1">Your SEO analysis history</p>
          </div>
          <div className="flex gap-2">
            {!isPro && (
              <Link href="/pricing" className="btn-ghost !py-2 text-sm text-accent-400">Upgrade</Link>
            )}
            <Link href="/" className="btn-primary !py-2 text-sm">+ New Analysis</Link>
          </div>
        </div>

        {/* Stats cards */}
        {totalAnalyses > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Analyses', value: totalAnalyses, color: 'text-accent-400' },
              { label: 'Avg Score', value: avgScore, color: avgScore >= 75 ? 'text-emerald-400' : avgScore >= 50 ? 'text-amber-400' : 'text-red-400' },
              { label: 'Best Score', value: bestScore, color: 'text-emerald-400' },
              { label: 'Unique Sites', value: uniqueUrls, color: 'text-accent-400' },
            ].map(stat => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <div className={`text-2xl font-semibold font-mono tracking-tight ${stat.color}`}>{stat.value}</div>
                <div className="text-[11px] text-white/40 mt-1 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {totalAnalyses === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-lg mb-4">No analyses yet</p>
            <Link href="/" className="text-accent-400 hover:text-accent-300 transition-colors duration-150 text-sm">
              Run your first SEO analysis →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {analyses.map(a => {
              const scoreColor = a.score >= 75 ? 'text-emerald-400' : a.score >= 50 ? 'text-amber-400' : 'text-red-400';
              const scoreBg = a.score >= 75 ? 'rgba(52,211,153,0.08)' : a.score >= 50 ? 'rgba(251,191,36,0.08)' : 'rgba(248,113,113,0.08)';
              const issueCount = JSON.parse(a.issues || '[]').length;
              return (
                <div key={a.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-card rounded-xl group">
                  <Link href={`/analyze/${a.id}`} className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-semibold font-mono text-sm ${scoreColor}`}
                      style={{ background: scoreBg }}>
                      {a.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-white/80 group-hover:text-accent-400 transition-colors duration-150">{a.url}</p>
                      <p className="text-xs text-white/25 mt-0.5">
                        {issueCount} issues · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                  <a href={`/?url=${encodeURIComponent(a.url)}`}
                    className="text-xs text-white/20 hover:text-accent-400 transition-colors duration-150 px-2 py-1 rounded-lg hover:bg-white/[0.04] flex-shrink-0"
                    title="Re-analyze">
                    ↻
                  </a>
                  <Link href={`/analyze/${a.id}`}
                    className="text-white/15 group-hover:text-white/40 transition-colors duration-150 text-sm flex-shrink-0">
                    →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
