'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCw } from 'lucide-react';
import { SEOReport } from '@/components/SEOReport';
import { ScrollProgress } from '@/components/ScrollProgress';
import { AnalysisSkeleton } from '@/components/Skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function AnalyzeByIdPage() {
  const params = useParams();
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/analyze/${params.id}`);
        if (!res.ok) { setError('Analysis not found'); setLoading(false); return; }
        setResult(await res.json());
      } catch { setError('Failed to load analysis'); }
      setLoading(false);
    }
    if (params.id) load();
  }, [params.id]);

  const handleReanalyze = async () => {
    if (!result?.url || reanalyzing) return;
    setReanalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: result.url }),
      });
      const data = await res.json();
      if (res.ok && data.id) router.push(`/analyze/${data.id}`);
    } catch {}
    setReanalyzing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface relative">
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <AnalysisSkeleton />
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-4">
        <p className="text-white/50">{error || 'Analysis not found'}</p>
        <Link href="/" className="text-accent-400 hover:text-accent-300 transition-colors duration-150 text-sm">← Go back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface relative">
      <ScrollProgress />
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative z-50 border-b border-white/[0.06] print:hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-150 text-sm">
            <ArrowLeft className="w-4 h-4" /> New analysis
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReanalyze}
              disabled={reanalyzing}
              className="flex items-center gap-1.5 text-sm text-white/40 hover:text-accent-400 transition-colors duration-150 disabled:opacity-30"
            >
              <RotateCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin' : ''}`} />
              Re-analyze
            </button>
            <Link href="/dashboard" className="text-sm text-white/40 hover:text-white/70 transition-colors duration-150">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ErrorBoundary>
          <SEOReport result={result} />
        </ErrorBoundary>
      </div>
    </div>
  );
}
